package handlers

import (
	"net/http"
	"os"

	"bebe-backend/internal/services"

	"github.com/gin-gonic/gin"
)

type AuthHandler struct {
	calendar *services.CalendarService
}

func NewAuthHandler() *AuthHandler {
	// Create a temporary calendar service just for auth
	cs, _ := services.NewCalendarService()
	return &AuthHandler{
		calendar: cs,
	}
}

// GetAuthURL returns the Google OAuth URL
func (h *AuthHandler) GetAuthURL(c *gin.Context) {
	if h.calendar == nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Calendar service not initialized"})
		return
	}

	url := h.calendar.GetAuthURL()
	c.JSON(http.StatusOK, gin.H{
		"url":     url,
		"message": "Open this URL in your browser to authorize Google Calendar access",
	})
}

// HandleCallback handles the OAuth callback
func (h *AuthHandler) HandleCallback(c *gin.Context) {
	code := c.Query("code")
	if code == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Missing authorization code"})
		return
	}

	if h.calendar == nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Calendar service not initialized"})
		return
	}

	if err := h.calendar.ExchangeCode(code); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// Redirect to success page or return JSON
	frontendURL := os.Getenv("FRONTEND_URL")
	if frontendURL != "" {
		c.Redirect(http.StatusTemporaryRedirect, frontendURL+"/auth-success")
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Successfully authorized! You can close this window.",
	})
}

// GetAuthStatus returns the current authorization status
func (h *AuthHandler) GetAuthStatus(c *gin.Context) {
	authorized := h.calendar != nil && h.calendar.IsAuthorized()

	c.JSON(http.StatusOK, gin.H{
		"authorized": authorized,
	})
}
