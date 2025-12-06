package main

import (
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"net/http"
	"os"
	"time"
)

func main() {

	router := gin.Default()
	configGin := cors.DefaultConfig()
	configGin.AllowAllOrigins = true
	configGin.AllowHeaders = []string{"Content-Type", "Authorization"}
	configGin.AllowMethods = []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"}
	router.Use(cors.New(configGin))

	apiRouter := router.Group("/api")
	apiRouter.GET("/hello", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"message": "hello from gin",
			"time":    time.Now().UTC().Format(time.RFC3339),
		})
	})
	apiRouter.GET("/health", func(c *gin.Context) {
		c.String(http.StatusOK, "ok")
	})
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080" // local default
	}
	// Gin binds to 0.0.0.0 when you pass ":<port>"
	router.Run(":" + port)

}
