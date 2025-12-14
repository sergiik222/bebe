package database

import (
	"database/sql"
	"fmt"
	"log"
	"os"
	"time"

	_ "github.com/lib/pq"
)

var DB *sql.DB

// Connect establishes a connection to the PostgreSQL database
func Connect() error {
	connStr := os.Getenv("DATABASE_URL")
	if connStr == "" {
		return fmt.Errorf("DATABASE_URL environment variable is not set")
	}

	var err error
	DB, err = sql.Open("postgres", connStr)
	if err != nil {
		return fmt.Errorf("failed to open database: %w", err)
	}

	// Configure connection pool
	DB.SetMaxOpenConns(25)
	DB.SetMaxIdleConns(5)
	DB.SetConnMaxLifetime(5 * time.Minute)

	// Test connection
	if err := DB.Ping(); err != nil {
		return fmt.Errorf("failed to ping database: %w", err)
	}

	log.Println("Connected to PostgreSQL database")
	return nil
}

// Close closes the database connection
func Close() {
	if DB != nil {
		DB.Close()
	}
}

// InitSchema creates the necessary tables if they don't exist
func InitSchema() error {
	schema := `
	-- Admins table for authentication
	CREATE TABLE IF NOT EXISTS admins (
		id SERIAL PRIMARY KEY,
		username VARCHAR(255) UNIQUE NOT NULL,
		password_hash VARCHAR(255) NOT NULL,
		created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
		updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
	);

	-- Galleries table for client media delivery
	CREATE TABLE IF NOT EXISTS galleries (
		id SERIAL PRIMARY KEY,
		token VARCHAR(64) UNIQUE NOT NULL,
		client_email VARCHAR(255) NOT NULL,
		folder_name VARCHAR(255) NOT NULL,
		title VARCHAR(255),
		message TEXT,
		expires_at TIMESTAMP,
		created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
		viewed_at TIMESTAMP,
		download_count INTEGER DEFAULT 0
	);

	-- Create index on token for fast lookups
	CREATE INDEX IF NOT EXISTS idx_galleries_token ON galleries(token);
	`

	_, err := DB.Exec(schema)
	if err != nil {
		return fmt.Errorf("failed to initialize schema: %w", err)
	}

	log.Println("Database schema initialized")
	return nil
}
