package main

import (
	"log"
	"os"

	"bebe-backend/internal/handlers"
	"bebe-backend/internal/services"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {
	// Load .env file (ignore error in production where env vars are set directly)
	_ = godotenv.Load()

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

	// Initialize handlers
	bookingHandler := handlers.NewBookingHandler(bookingService, calendarService)
	authHandler := handlers.NewAuthHandler()

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
	}

	// Start server
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("Server starting on port %s", port)
	log.Println("If not authorized yet, visit: http://localhost:" + port + "/api/auth/url")
	router.Run(":" + port)
}
