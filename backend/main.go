package main

import (
	"log"
	"os"

	"bebe-backend/internal/database"
	"bebe-backend/internal/handlers"
	"bebe-backend/internal/services"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {
	// Load .env file (ignore error in production where env vars are set directly)
	_ = godotenv.Load()

	// Initialize database connection
	if err := database.Connect(); err != nil {
		log.Printf("Warning: Database connection failed: %v", err)
		log.Println("Admin panel and gallery features will not be available")
	} else {
		// Initialize database schema
		if err := database.InitSchema(); err != nil {
			log.Printf("Warning: Failed to initialize database schema: %v", err)
		}
		defer database.Close()
	}

	// Initialize services
	calendarService, err := services.NewCalendarService()
	if err != nil {
		log.Printf("Warning: Calendar service not initialized: %v", err)
		log.Println("Visit /api/auth/url to authorize Google Calendar access")
	}

	emailService := services.NewEmailService(
		os.Getenv("RESEND_API_KEY"),
		os.Getenv("OWNER_EMAIL"),
	)

	bookingService := services.NewBookingService(calendarService, emailService)
	adminService := services.NewAdminService()
	galleryService := services.NewGalleryService(emailService)

	// Initialize handlers
	bookingHandler := handlers.NewBookingHandler(bookingService, calendarService)
	authHandler := handlers.NewAuthHandler()
	contactHandler := handlers.NewContactHandler(emailService)
	adminHandler := handlers.NewAdminHandler(adminService)
	galleryHandler := handlers.NewGalleryHandler(galleryService)

	// Setup router
	router := gin.Default()

	// CORS configuration
	config := cors.DefaultConfig()
	config.AllowAllOrigins = true
	config.AllowHeaders = []string{"Content-Type", "Authorization"}
	config.AllowMethods = []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"}
	router.Use(cors.New(config))

	// API routes
	api := router.Group("/api")
	{
		// Health check
		api.GET("/health", func(c *gin.Context) {
			c.JSON(200, gin.H{"status": "ok"})
		})

		// Auth routes (for Google OAuth setup)
		api.GET("/auth/url", authHandler.GetAuthURL)
		api.GET("/auth/callback", authHandler.HandleCallback)
		api.GET("/auth/status", authHandler.GetAuthStatus)

		// Booking routes
		api.GET("/availability", bookingHandler.GetAvailability)
		api.POST("/booking", bookingHandler.CreateBooking)
		api.GET("/booking/confirm/:token", bookingHandler.ConfirmBooking)
		api.GET("/booking/cancel/:token", bookingHandler.CancelBooking)

		// Contact route
		api.POST("/contact", contactHandler.SendContactMessage)

		// Admin authentication routes
		api.POST("/admin/login", adminHandler.Login)
		api.POST("/admin/setup", adminHandler.Setup) // Only works if no admin exists

		// Protected admin routes
		admin := api.Group("/admin")
		admin.Use(adminHandler.AuthMiddleware())
		{
			admin.GET("/me", adminHandler.Me)
			admin.GET("/galleries", galleryHandler.ListGalleries)
			admin.POST("/galleries", galleryHandler.CreateGallery)
			admin.DELETE("/galleries/:id", galleryHandler.DeleteGallery)
			admin.POST("/galleries/:id/resend", galleryHandler.ResendEmail)
		}

		// Public gallery routes (for clients)
		api.GET("/gallery/:token", galleryHandler.GetGalleryByToken)
		api.POST("/gallery/:token/download", galleryHandler.TrackDownload)
	}

	// Start server
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	// Log configuration
	backendURL := os.Getenv("BACKEND_URL")
	log.Printf("Server starting on port %s", port)
	log.Printf("BACKEND_URL: %s (used for email links)", backendURL)
	if backendURL == "" {
		log.Println("Warning: BACKEND_URL not set, email links will use localhost")
	}
	router.Run(":" + port)
}
