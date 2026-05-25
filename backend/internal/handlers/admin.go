package handlers

import (
	"net/http"
	"os"
	"strings"

	"bebe-backend/internal/models"
	"bebe-backend/internal/services"

	"github.com/gin-gonic/gin"
)

// adminCookieName is the httpOnly cookie that carries the admin JWT.
// Using a cookie alongside the Authorization header lets the frontend
// stop holding the token in JS (XSS-stealable) while keeping the API
// usable by curl / mobile clients.
const adminCookieName = "admin_token"

func adminCookieSecure() bool {
	// Send Secure flag in production; let local dev work over http.
	return os.Getenv("NODE_ENV") == "production" || os.Getenv("GIN_MODE") == "release"
}

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

	// Set the JWT as an httpOnly cookie so the frontend doesn't have to
	// hold it in JS-readable storage. The token is still returned in the
	// JSON body for clients (e.g. mobile, scripts) that don't use cookies.
	c.SetSameSite(http.SameSiteLaxMode)
	c.SetCookie(adminCookieName, token, 60*60*24, "/", "", adminCookieSecure(), true)

	c.JSON(http.StatusOK, models.AdminLoginResponse{
		Token:   token,
		Message: "Login successful",
	})
}

// Logout clears the admin session cookie. The JWT itself isn't invalidated
// (we don't keep a revocation list), but the cookie can no longer be sent.
func (h *AdminHandler) Logout(c *gin.Context) {
	c.SetSameSite(http.SameSiteLaxMode)
	c.SetCookie(adminCookieName, "", -1, "/", "", adminCookieSecure(), true)
	c.JSON(http.StatusOK, gin.H{"message": "Logged out"})
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

// AuthMiddleware validates the JWT token for protected routes. It accepts
// the token from either the Authorization Bearer header (for non-browser
// clients) or the admin_token httpOnly cookie (preferred for the web UI).
func (h *AdminHandler) AuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		var token string

		// Prefer Authorization header for explicit Bearer flows.
		if authHeader := c.GetHeader("Authorization"); authHeader != "" {
			parts := strings.Split(authHeader, " ")
			if len(parts) != 2 || parts[0] != "Bearer" {
				c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid authorization header format"})
				c.Abort()
				return
			}
			token = parts[1]
		} else if cookieToken, err := c.Cookie(adminCookieName); err == nil && cookieToken != "" {
			token = cookieToken
		}

		if token == "" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Authorization required"})
			c.Abort()
			return
		}

		claims, err := h.adminService.ValidateToken(token)
		if err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid or expired token"})
			c.Abort()
			return
		}

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
