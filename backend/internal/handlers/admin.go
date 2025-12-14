package handlers

import (
	"net/http"
	"strings"

	"bebe-backend/internal/models"
	"bebe-backend/internal/services"

	"github.com/gin-gonic/gin"
)

type AdminHandler struct {
	adminService *services.AdminService
}

func NewAdminHandler(adminService *services.AdminService) *AdminHandler {
	return &AdminHandler{
		adminService: adminService,
	}
}

// Login handles admin login requests
func (h *AdminHandler) Login(c *gin.Context) {
	var req models.AdminLoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
		return
	}

	token, err := h.adminService.Login(req.Username, req.Password)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, models.AdminLoginResponse{
		Token:   token,
		Message: "Login successful",
	})
}

// Setup creates the initial admin user (only works if no admin exists)
func (h *AdminHandler) Setup(c *gin.Context) {
	// Check if admin already exists
	exists, err := h.adminService.AdminExists()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
		return
	}

	if exists {
		c.JSON(http.StatusForbidden, gin.H{"error": "Admin already exists. Setup is disabled."})
		return
	}

	var req models.AdminLoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
		return
	}

	if err := h.adminService.CreateAdmin(req.Username, req.Password); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "Admin created successfully"})
}

// AuthMiddleware validates the JWT token for protected routes
func (h *AdminHandler) AuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Authorization header required"})
			c.Abort()
			return
		}

		// Extract token from "Bearer <token>"
		parts := strings.Split(authHeader, " ")
		if len(parts) != 2 || parts[0] != "Bearer" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid authorization header format"})
			c.Abort()
			return
		}

		claims, err := h.adminService.ValidateToken(parts[1])
		if err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid or expired token"})
			c.Abort()
			return
		}

		// Set claims in context for use in handlers
		c.Set("admin_id", claims["admin_id"])
		c.Set("username", claims["username"])
		c.Next()
	}
}

// Me returns the current admin info
func (h *AdminHandler) Me(c *gin.Context) {
	username, _ := c.Get("username")
	adminID, _ := c.Get("admin_id")

	c.JSON(http.StatusOK, gin.H{
		"admin_id": adminID,
		"username": username,
	})
}
