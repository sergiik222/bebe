package handlers

import (
	"fmt"
	"html"
	"net/http"
	"os"
	"strconv"
	"time"

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

	// Check for month/year query parameters
	monthStr := c.Query("month")
	yearStr := c.Query("year")

	var availability *models.AvailabilityResponse
	var err error

	if monthStr != "" && yearStr != "" {
		month, errM := strconv.Atoi(monthStr)
		year, errY := strconv.Atoi(yearStr)
		if errM != nil || errY != nil || month < 1 || month > 12 {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid month or year"})
			return
		}
		availability, err = h.bookingService.GetAvailabilityForMonth(year, time.Month(month))
	} else {
		// Default: get availability for current month
		now := time.Now()
		availability, err = h.bookingService.GetAvailabilityForMonth(now.Year(), now.Month())
	}

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
		errorHTML := fmt.Sprintf(`
			<!DOCTYPE html>
			<html>
			<head><title>Error</title></head>
			<body style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
				<h1 style="color: #ef4444;">Error</h1>
				<p>%s</p>
			</body>
			</html>
		`, html.EscapeString(err.Error()))
		c.Data(http.StatusBadRequest, "text/html; charset=utf-8", []byte(errorHTML))
		return
	}

	body := fmt.Sprintf(`
		<!DOCTYPE html>
		<html>
		<head><title>Booking Confirmed</title></head>
		<body style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
			<h1 style="color: #10b981;">✓ Booking Confirmed!</h1>
			<p>The booking for <strong>%s</strong> has been confirmed.</p>
			<p>Date: %s</p>
			<p>Time: %s - %s</p>
			<p>A confirmation email has been sent to the customer.</p>
		</body>
		</html>
	`,
		html.EscapeString(booking.Name),
		html.EscapeString(booking.Date),
		html.EscapeString(booking.StartTime),
		html.EscapeString(booking.EndTime),
	)
	c.Data(http.StatusOK, "text/html; charset=utf-8", []byte(body))
}

// CancelBooking cancels a booking (called by owner via email link)
func (h *BookingHandler) CancelBooking(c *gin.Context) {
	token := c.Param("token")

	booking, err := h.bookingService.CancelBooking(token)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	body := fmt.Sprintf(`
		<!DOCTYPE html>
		<html>
		<head><title>Booking Cancelled</title></head>
		<body style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
			<h1 style="color: #ef4444;">✗ Booking Cancelled</h1>
			<p>The booking for <strong>%s</strong> has been cancelled.</p>
			<p>An email has been sent to the customer.</p>
		</body>
		</html>
	`, html.EscapeString(booking.Name))
	c.Data(http.StatusOK, "text/html; charset=utf-8", []byte(body))
}
