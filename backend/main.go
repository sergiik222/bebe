package main

import (
	"log"
	"os"
	"strings"
	"time"

	"bebe-backend/internal/database"
	"bebe-backend/internal/handlers"
	"bebe-backend/internal/middleware"
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

	// CORS configuration — explicit allowlist, no wildcard.
	// CORS_ALLOWED_ORIGINS is a comma-separated list of origins (e.g.
	// "https://bebemedia.at,https://www.bebemedia.at"). Local dev origins
	// are always allowed.
	allowedOrigins := []string{
		"http://localhost:3000",
		"http://127.0.0.1:3000",
	}
	if raw := os.Getenv("CORS_ALLOWED_ORIGINS"); raw != "" {
		for _, o := range strings.Split(raw, ",") {
			if o = strings.TrimSpace(o); o != "" {
				allowedOrigins = append(allowedOrigins, o)
			}
		}
	}
	config := cors.DefaultConfig()
	config.AllowOrigins = allowedOrigins
	config.AllowHeaders = []string{"Content-Type", "Authorization"}
	config.AllowMethods = []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"}
	config.AllowCredentials = true
	router.Use(cors.New(config))
	log.Printf("CORS allowed origins: %v", allowedOrigins)

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

		// Contact route — rate-limited to deter spam relay.
		api.POST("/contact", middleware.RateLimit(5, time.Minute), contactHandler.SendContactMessage)

		// Admin authentication routes — rate-limited to slow brute-force.
		loginLimiter := middleware.RateLimit(10, time.Minute)
		api.POST("/admin/login", loginLimiter, adminHandler.Login)
		api.POST("/admin/setup", loginLimiter, adminHandler.Setup) // Only works if no admin exists

		// Protected admin routes
		admin := api.Group("/admin")
		admin.Use(adminHandler.AuthMiddleware())
		{
			admin.GET("/me", adminHandler.Me)
			admin.POST("/logout", adminHandler.Logout)
			admin.GET("/galleries", galleryHandler.ListGalleries)
			admin.POST("/galleries", galleryHandler.CreateGallery)
			admin.DELETE("/galleries/:id", galleryHandler.DeleteGallery)
			admin.POST("/galleries/:id/resend", galleryHandler.ResendEmail)
		}

		// Public gallery routes (for clients). Rate-limited to make token
		// enumeration impractical and to cap ZIP-download abuse.
		galleryLimiter := middleware.RateLimit(60, time.Minute)
		api.GET("/gallery/:token", galleryLimiter, galleryHandler.GetGalleryByToken)
		api.POST("/gallery/:token/download", galleryLimiter, galleryHandler.TrackDownload)
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
