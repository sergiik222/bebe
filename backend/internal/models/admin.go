package models

import "time"

// Admin represents an admin user in the system
type Admin struct {
	ID           int       `json:"id"`
	Username     string    `json:"username"`
	PasswordHash string    `json:"-"` // Never expose password hash in JSON
	CreatedAt    time.Time `json:"created_at"`
	UpdatedAt    time.Time `json:"updated_at"`
}

// AdminLoginRequest represents the login request body
type AdminLoginRequest struct {
	Username string `json:"username" binding:"required"`
	Password string `json:"password" binding:"required"`
}

// AdminLoginResponse represents the login response
type AdminLoginResponse struct {
	Token   string `json:"token"`
	Message string `json:"message"`
}
