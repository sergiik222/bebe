package models

import (
	"database/sql"
	"time"
)

// Gallery represents a client gallery/delivery
type Gallery struct {
	ID            int            `json:"id"`
	Token         string         `json:"token"`
	ClientEmail   string         `json:"client_email"`
	FolderName    string         `json:"folder_name"`
	Title         sql.NullString `json:"title"`
	Message       sql.NullString `json:"message"`
	ExpiresAt     sql.NullTime   `json:"expires_at"`
	CreatedAt     time.Time      `json:"created_at"`
	ViewedAt      sql.NullTime   `json:"viewed_at"`
	DownloadCount int            `json:"download_count"`
}

// GalleryResponse is the JSON response for a gallery
type GalleryResponse struct {
	ID            int       `json:"id"`
	Token         string    `json:"token"`
	ClientEmail   string    `json:"client_email"`
	FolderName    string    `json:"folder_name"`
	Title         string    `json:"title,omitempty"`
	Message       string    `json:"message,omitempty"`
	ExpiresAt     string    `json:"expires_at,omitempty"`
	CreatedAt     string    `json:"created_at"`
	ViewedAt      string    `json:"viewed_at,omitempty"`
	DownloadCount int       `json:"download_count"`
}

// CreateGalleryRequest represents the request to create a new gallery
type CreateGalleryRequest struct {
	ClientEmail string `json:"client_email" binding:"required,email"`
	FolderName  string `json:"folder_name" binding:"required"`
	Title       string `json:"title"`
	Message     string `json:"message"`
	ExpiresIn   int    `json:"expires_in"` // Days until expiration, 0 = no expiration
	Language    string `json:"language"`   // "en", "de", or "ru" - default "en"
}

// GalleryMedia represents a media file in the gallery
type GalleryMedia struct {
	Name     string `json:"name"`
	URL      string `json:"url"`
	Type     string `json:"type"` // "image" or "video"
	Size     int64  `json:"size"`
}

// ClientGalleryResponse is what clients see when viewing their gallery
type ClientGalleryResponse struct {
	Title   string         `json:"title"`
	Message string         `json:"message,omitempty"`
	Media   []GalleryMedia `json:"media"`
}
