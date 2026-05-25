package services

import (
	"database/sql"
	"errors"
	"fmt"
	"os"
	"time"

	"bebe-backend/internal/database"
	"bebe-backend/internal/models"

	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
)

type AdminService struct {
	jwtSecret []byte
}

// NewAdminService creates a new admin service.
// TODO(prod): tighten this to fail-fast on missing/short JWT_SECRET once
// Koyeb env vars are set. Keeping the fallback for dev convenience.
func NewAdminService() *AdminService {
	secret := os.Getenv("JWT_SECRET")
	if secret == "" {
		secret = "default-secret-change-me" // Fallback, should be set in production
	}
	return &AdminService{
		jwtSecret: []byte(secret),
	}
}

// Login authenticates an admin and returns a JWT token
func (s *AdminService) Login(username, password string) (string, error) {
	var admin models.Admin
	err := database.DB.QueryRow(
		"SELECT id, username, password_hash FROM admins WHERE username = $1",
		username,
	).Scan(&admin.ID, &admin.Username, &admin.PasswordHash)

	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return "", fmt.Errorf("invalid username or password")
		}
		return "", fmt.Errorf("database error: %w", err)
	}

	// Compare password
	if err := bcrypt.CompareHashAndPassword([]byte(admin.PasswordHash), []byte(password)); err != nil {
		return "", fmt.Errorf("invalid username or password")
	}

	// Generate JWT token
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"admin_id": admin.ID,
		"username": admin.Username,
		"exp":      time.Now().Add(24 * time.Hour).Unix(), // Token valid for 24 hours
		"iat":      time.Now().Unix(),
	})

	tokenString, err := token.SignedString(s.jwtSecret)
	if err != nil {
		return "", fmt.Errorf("failed to sign token: %w", err)
	}

	return tokenString, nil
}

// ValidateToken validates a JWT token and returns the claims
func (s *AdminService) ValidateToken(tokenString string) (jwt.MapClaims, error) {
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}
		return s.jwtSecret, nil
	})

	if err != nil {
		return nil, err
	}

	if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
		return claims, nil
	}

	return nil, fmt.Errorf("invalid token")
}

// CreateAdmin creates a new admin user (for initial setup)
func (s *AdminService) CreateAdmin(username, password string) error {
	// Hash password
	hash, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return fmt.Errorf("failed to hash password: %w", err)
	}

	_, err = database.DB.Exec(
		"INSERT INTO admins (username, password_hash) VALUES ($1, $2)",
		username, string(hash),
	)
	if err != nil {
		return fmt.Errorf("failed to create admin: %w", err)
	}

	return nil
}

// AdminExists checks if any admin exists in the database
func (s *AdminService) AdminExists() (bool, error) {
	var count int
	err := database.DB.QueryRow("SELECT COUNT(*) FROM admins").Scan(&count)
	if err != nil {
		return false, err
	}
	return count > 0, nil
}
