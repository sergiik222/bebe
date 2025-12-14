package handlers

import (
	"net/http"
	"strconv"

	"bebe-backend/internal/models"
	"bebe-backend/internal/services"

	"github.com/gin-gonic/gin"
)

type GalleryHandler struct {
	galleryService *services.GalleryService
}

func NewGalleryHandler(galleryService *services.GalleryService) *GalleryHandler {
	return &GalleryHandler{
		galleryService: galleryService,
	}
}

// CreateGallery creates a new gallery (admin only)
func (h *GalleryHandler) CreateGallery(c *gin.Context) {
	var req models.CreateGalleryRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body: " + err.Error()})
		return
	}

	gallery, err := h.galleryService.CreateGallery(req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gallery)
}

// ListGalleries lists all galleries (admin only)
func (h *GalleryHandler) ListGalleries(c *gin.Context) {
	galleries, err := h.galleryService.ListGalleries()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"galleries": galleries})
}

// DeleteGallery deletes a gallery (admin only)
func (h *GalleryHandler) DeleteGallery(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid gallery ID"})
		return
	}

	if err := h.galleryService.DeleteGallery(id); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Gallery deleted"})
}

// ResendEmail resends the gallery email (admin only)
func (h *GalleryHandler) ResendEmail(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid gallery ID"})
		return
	}

	if err := h.galleryService.ResendEmail(id); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Email sent"})
}

// GetGalleryByToken retrieves a gallery for client viewing (public)
func (h *GalleryHandler) GetGalleryByToken(c *gin.Context) {
	token := c.Param("token")
	if token == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Token required"})
		return
	}

	gallery, err := h.galleryService.GetGalleryByToken(token)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}

	// Return gallery info (folder name will be used to fetch media from Bunny CDN)
	response := gin.H{
		"folder_name": gallery.FolderName,
	}

	if gallery.Title.Valid {
		response["title"] = gallery.Title.String
	}
	if gallery.Message.Valid {
		response["message"] = gallery.Message.String
	}

	c.JSON(http.StatusOK, response)
}

// TrackDownload increments the download counter (public)
func (h *GalleryHandler) TrackDownload(c *gin.Context) {
	token := c.Param("token")
	if token == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Token required"})
		return
	}

	if err := h.galleryService.IncrementDownloadCount(token); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Download tracked"})
}
