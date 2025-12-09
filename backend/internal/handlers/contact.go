package handlers

import (
	"net/http"

	"bebe-backend/internal/services"

	"github.com/gin-gonic/gin"
)

type ContactHandler struct {
	emailService *services.EmailService
}

type ContactRequest struct {
	Name    string `json:"name" binding:"required"`
	Email   string `json:"email" binding:"required,email"`
	Phone   string `json:"phone"`
	Subject string `json:"subject" binding:"required"`
	Message string `json:"message" binding:"required"`
}

func NewContactHandler(es *services.EmailService) *ContactHandler {
	return &ContactHandler{
		emailService: es,
	}
}

// SendContactMessage handles contact form submissions
func (h *ContactHandler) SendContactMessage(c *gin.Context) {
	var req ContactRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := h.emailService.SendContactMessage(req.Name, req.Email, req.Phone, req.Subject, req.Message)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to send message"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Message sent successfully"})
}
