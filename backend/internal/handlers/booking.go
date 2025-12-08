package handlers

import (
	"net/http"
	"os"

	"bebe-backend/internal/models"
	"bebe-backend/internal/services"

	"github.com/gin-gonic/gin"
)

type BookingHandler struct {
	bookingService  *services.BookingService
	calendarService *services.CalendarService
}

func NewBookingHandler(bs *services.BookingService, cs *services.CalendarService) *BookingHandler {
	return &BookingHandler{
		bookingService:  bs,
		calendarService: cs,
	}
}

// GetAvailability returns available time slots
func (h *BookingHandler) GetAvailability(c *gin.Context) {
	if h.calendarService == nil || !h.calendarService.IsAuthorized() {
		c.JSON(http.StatusServiceUnavailable, gin.H{
			"error":   "Calendar not authorized",
			"message": "Please authorize Google Calendar access first via /api/auth/url",
		})
		return
	}

	// Get availability for the next 30 days
	availability, err := h.bookingService.GetAvailability(30)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, availability)
}

// CreateBooking creates a new booking request
func (h *BookingHandler) CreateBooking(c *gin.Context) {
	var req models.BookingRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Determine base URL for callback links
	baseURL := os.Getenv("BACKEND_URL")
	if baseURL == "" {
		baseURL = "http://localhost:8080"
	}

	booking, err := h.bookingService.CreateBooking(&req, baseURL)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message": "Booking request sent! You will receive a confirmation email soon.",
		"id":      booking.ID,
	})
}

// ConfirmBooking confirms a booking (called by owner via email link)
func (h *BookingHandler) ConfirmBooking(c *gin.Context) {
	token := c.Param("token")

	booking, err := h.bookingService.ConfirmBooking(token)
	if err != nil {
		c.HTML(http.StatusBadRequest, "", gin.H{"error": err.Error()})
		// Fallback to JSON if no template
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Return HTML response for better UX when clicking email link
	html := `
		<!DOCTYPE html>
		<html>
		<head><title>Booking Confirmed</title></head>
		<body style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
			<h1 style="color: #10b981;">✓ Booking Confirmed!</h1>
			<p>The booking for <strong>` + booking.Name + `</strong> has been confirmed.</p>
			<p>Date: ` + booking.Date + `</p>
			<p>Time: ` + booking.StartTime + ` - ` + booking.EndTime + `</p>
			<p>A confirmation email has been sent to the customer.</p>
		</body>
		</html>
	`
	c.Data(http.StatusOK, "text/html; charset=utf-8", []byte(html))
}

// CancelBooking cancels a booking (called by owner via email link)
func (h *BookingHandler) CancelBooking(c *gin.Context) {
	token := c.Param("token")

	booking, err := h.bookingService.CancelBooking(token)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Return HTML response for better UX when clicking email link
	html := `
		<!DOCTYPE html>
		<html>
		<head><title>Booking Cancelled</title></head>
		<body style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
			<h1 style="color: #ef4444;">✗ Booking Cancelled</h1>
			<p>The booking for <strong>` + booking.Name + `</strong> has been cancelled.</p>
			<p>An email has been sent to the customer.</p>
		</body>
		</html>
	`
	c.Data(http.StatusOK, "text/html; charset=utf-8", []byte(html))
}
