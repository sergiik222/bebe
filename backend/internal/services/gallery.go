package services

import (
	"crypto/rand"
	"database/sql"
	"encoding/hex"
	"errors"
	"fmt"
	"os"
	"time"

	"bebe-backend/internal/database"
	"bebe-backend/internal/models"
)

type GalleryService struct {
	emailService *EmailService
	frontendURL  string
}

func getFrontendURL() string {
	url := os.Getenv("FRONTEND_URL")
	if url == "" {
		return "https://bebemedia.at"
	}
	return url
}

// NewGalleryService creates a new gallery service
func NewGalleryService(emailService *EmailService) *GalleryService {
	return &GalleryService{
		emailService: emailService,
		frontendURL:  getFrontendURL(),
	}
}

// generateGalleryToken creates a secure random token for gallery links
func generateGalleryToken() (string, error) {
	bytes := make([]byte, 32)
	if _, err := rand.Read(bytes); err != nil {
		return "", err
	}
	return hex.EncodeToString(bytes), nil
}

// CreateGallery creates a new gallery and sends email to client
func (s *GalleryService) CreateGallery(req models.CreateGalleryRequest) (*models.GalleryResponse, error) {
	token, err := generateGalleryToken()
	if err != nil {
		return nil, fmt.Errorf("failed to generate token: %w", err)
	}

	var expiresAt sql.NullTime
	if req.ExpiresIn > 0 {
		expiresAt = sql.NullTime{
			Time:  time.Now().AddDate(0, 0, req.ExpiresIn),
			Valid: true,
		}
	}

	var title, message sql.NullString
	if req.Title != "" {
		title = sql.NullString{String: req.Title, Valid: true}
	}
	if req.Message != "" {
		message = sql.NullString{String: req.Message, Valid: true}
	}

	var id int
	var createdAt time.Time
	err = database.DB.QueryRow(`
		INSERT INTO galleries (token, client_email, folder_name, title, message, expires_at)
		VALUES ($1, $2, $3, $4, $5, $6)
		RETURNING id, created_at
	`, token, req.ClientEmail, req.FolderName, title, message, expiresAt).Scan(&id, &createdAt)

	if err != nil {
		return nil, fmt.Errorf("failed to create gallery: %w", err)
	}

	// Send email to client
	language := req.Language
	if language == "" {
		language = "en"
	}
	if err := s.sendGalleryEmail(req.ClientEmail, token, req.Title, req.Message, language, req.ExpiresIn); err != nil {
		// Log error but don't fail - gallery is created
		fmt.Printf("Failed to send gallery email: %v\n", err)
	}

	response := &models.GalleryResponse{
		ID:          id,
		Token:       token,
		ClientEmail: req.ClientEmail,
		FolderName:  req.FolderName,
		Title:       req.Title,
		Message:     req.Message,
		CreatedAt:   createdAt.Format(time.RFC3339),
	}

	if expiresAt.Valid {
		response.ExpiresAt = expiresAt.Time.Format(time.RFC3339)
	}

	return response, nil
}

// GetGalleryByToken retrieves a gallery by its token (for clients)
func (s *GalleryService) GetGalleryByToken(token string) (*models.Gallery, error) {
	var gallery models.Gallery
	err := database.DB.QueryRow(`
		SELECT id, token, client_email, folder_name, title, message, expires_at, created_at, viewed_at, download_count
		FROM galleries
		WHERE token = $1
	`, token).Scan(
		&gallery.ID, &gallery.Token, &gallery.ClientEmail, &gallery.FolderName,
		&gallery.Title, &gallery.Message, &gallery.ExpiresAt, &gallery.CreatedAt,
		&gallery.ViewedAt, &gallery.DownloadCount,
	)

	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, fmt.Errorf("gallery not found")
		}
		return nil, fmt.Errorf("database error: %w", err)
	}

	// Check if expired
	if gallery.ExpiresAt.Valid && gallery.ExpiresAt.Time.Before(time.Now()) {
		return nil, fmt.Errorf("gallery has expired")
	}

	// Update viewed_at if first view
	if !gallery.ViewedAt.Valid {
		database.DB.Exec("UPDATE galleries SET viewed_at = $1 WHERE id = $2", time.Now(), gallery.ID)
	}

	return &gallery, nil
}

// ListGalleries lists all galleries (for admin)
func (s *GalleryService) ListGalleries() ([]models.GalleryResponse, error) {
	rows, err := database.DB.Query(`
		SELECT id, token, client_email, folder_name, title, message, expires_at, created_at, viewed_at, download_count
		FROM galleries
		ORDER BY created_at DESC
	`)
	if err != nil {
		return nil, fmt.Errorf("failed to query galleries: %w", err)
	}
	defer rows.Close()

	galleries := make([]models.GalleryResponse, 0)
	for rows.Next() {
		var g models.Gallery
		err := rows.Scan(
			&g.ID, &g.Token, &g.ClientEmail, &g.FolderName,
			&g.Title, &g.Message, &g.ExpiresAt, &g.CreatedAt,
			&g.ViewedAt, &g.DownloadCount,
		)
		if err != nil {
			return nil, fmt.Errorf("failed to scan gallery: %w", err)
		}

		response := models.GalleryResponse{
			ID:            g.ID,
			Token:         g.Token,
			ClientEmail:   g.ClientEmail,
			FolderName:    g.FolderName,
			DownloadCount: g.DownloadCount,
			CreatedAt:     g.CreatedAt.Format(time.RFC3339),
		}

		if g.Title.Valid {
			response.Title = g.Title.String
		}
		if g.Message.Valid {
			response.Message = g.Message.String
		}
		if g.ExpiresAt.Valid {
			response.ExpiresAt = g.ExpiresAt.Time.Format(time.RFC3339)
		}
		if g.ViewedAt.Valid {
			response.ViewedAt = g.ViewedAt.Time.Format(time.RFC3339)
		}

		galleries = append(galleries, response)
	}

	return galleries, nil
}

// DeleteGallery deletes a gallery by ID
func (s *GalleryService) DeleteGallery(id int) error {
	result, err := database.DB.Exec("DELETE FROM galleries WHERE id = $1", id)
	if err != nil {
		return fmt.Errorf("failed to delete gallery: %w", err)
	}

	rows, _ := result.RowsAffected()
	if rows == 0 {
		return fmt.Errorf("gallery not found")
	}

	return nil
}

// IncrementDownloadCount increments the download counter for a gallery
func (s *GalleryService) IncrementDownloadCount(token string) error {
	_, err := database.DB.Exec(`
		UPDATE galleries SET download_count = download_count + 1 WHERE token = $1
	`, token)
	return err
}

// ResendEmail resends the gallery email to the client
func (s *GalleryService) ResendEmail(id int) error {
	var gallery models.Gallery
	err := database.DB.QueryRow(`
		SELECT token, client_email, title, message, expires_at FROM galleries WHERE id = $1
	`, id).Scan(&gallery.Token, &gallery.ClientEmail, &gallery.Title, &gallery.Message, &gallery.ExpiresAt)

	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return fmt.Errorf("gallery not found")
		}
		return fmt.Errorf("database error: %w", err)
	}

	title := ""
	message := ""
	if gallery.Title.Valid {
		title = gallery.Title.String
	}
	if gallery.Message.Valid {
		message = gallery.Message.String
	}

	// Calculate remaining days if expiration is set
	expiresIn := 0
	if gallery.ExpiresAt.Valid {
		remaining := time.Until(gallery.ExpiresAt.Time)
		expiresIn = int(remaining.Hours() / 24)
		if expiresIn < 0 {
			expiresIn = 0
		}
	}

	return s.sendGalleryEmail(gallery.ClientEmail, gallery.Token, title, message, "en", expiresIn)
}

// Gallery email translations
type galleryEmailTranslations struct {
	subject          string
	subjectWithTitle string
	greeting         string
	viewGallery      string
	fallbackLink     string
	thankYou         string
	availableFor     string
	availableDays    string
	availableDay     string
	noExpiration     string
}

var galleryTranslations = map[string]galleryEmailTranslations{
	"en": {
		subject:          "Your Photos & Videos are Ready!",
		subjectWithTitle: "Your %s are Ready!",
		greeting:         "Click the button below to view and download your photos and videos at full quality.",
		viewGallery:      "VIEW GALLERY",
		fallbackLink:     "If the button doesn't work, copy and paste this link into your browser:",
		thankYou:         "Thank you for choosing Bebe Media!",
		availableFor:     "This gallery will be available for",
		availableDays:    "days",
		availableDay:     "day",
		noExpiration:     "",
	},
	"de": {
		subject:          "Ihre Fotos & Videos sind fertig!",
		subjectWithTitle: "Ihre %s sind fertig!",
		greeting:         "Klicken Sie auf die Schaltfläche unten, um Ihre Fotos und Videos in voller Qualität anzusehen und herunterzuladen.",
		viewGallery:      "GALERIE ANSEHEN",
		fallbackLink:     "Wenn die Schaltfläche nicht funktioniert, kopieren Sie diesen Link in Ihren Browser:",
		thankYou:         "Vielen Dank, dass Sie sich für Bebe Media entschieden haben!",
		availableFor:     "Diese Galerie ist verfügbar für",
		availableDays:    "Tage",
		availableDay:     "Tag",
		noExpiration:     "",
	},
	"ru": {
		subject:          "Ваши фото и видео готовы!",
		subjectWithTitle: "Ваши %s готовы!",
		greeting:         "Нажмите кнопку ниже, чтобы просмотреть и скачать ваши фото и видео в полном качестве.",
		viewGallery:      "ОТКРЫТЬ ГАЛЕРЕЮ",
		fallbackLink:     "Если кнопка не работает, скопируйте эту ссылку в браузер:",
		thankYou:         "Спасибо, что выбрали Bebe Media!",
		availableFor:     "Эта галерея будет доступна в течение",
		availableDays:    "дней",
		availableDay:     "дня",
		noExpiration:     "",
	},
}

func getGalleryTranslation(lang string) galleryEmailTranslations {
	if t, ok := galleryTranslations[lang]; ok {
		return t
	}
	return galleryTranslations["en"] // Default to English
}

// sendGalleryEmail sends the gallery link to the client
func (s *GalleryService) sendGalleryEmail(email, token, title, message, language string, expiresIn int) error {
	galleryURL := fmt.Sprintf("%s/gallery/%s", s.frontendURL, token)
	t := getGalleryTranslation(language)

	fmt.Printf("Sending gallery email: language=%s, frontendURL=%s, expiresIn=%d\n", language, s.frontendURL, expiresIn)

	subject := t.subject
	if title != "" {
		subject = fmt.Sprintf(t.subjectWithTitle, title)
	}

	// Build expiration text
	expirationText := ""
	if expiresIn > 0 {
		daysWord := t.availableDays
		if expiresIn == 1 {
			daysWord = t.availableDay
		}
		expirationText = fmt.Sprintf(`<p style="color: #a1a1aa; font-size: 14px; margin-top: 20px; text-align: center;">%s <strong style="color: #84cc16;">%d %s</strong></p>`, t.availableFor, expiresIn, daysWord)
	}

	htmlBody := fmt.Sprintf(`
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #0a0a0a;">
    <table width="100%%" cellpadding="0" cellspacing="0" style="background-color: #0a0a0a; padding: 40px 20px;">
        <tr>
            <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #18181b; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.3);">
                    <!-- Header -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #0a0a0a 0%%, #18181b 100%%); padding: 40px 30px; text-align: center; border-bottom: 1px solid #27272a;">
                            <h1 style="color: #84cc16; margin: 0; font-size: 32px; font-weight: 300; letter-spacing: 3px;">BEBE MEDIA</h1>
                        </td>
                    </tr>

                    <!-- Content -->
                    <tr>
                        <td style="padding: 50px 40px;">
                            <!-- Gallery Icon -->
                            <div style="text-align: center; margin-bottom: 30px;">
                                <div style="display: inline-block; width: 60px; height: 60px; background-color: rgba(132, 204, 22, 0.15); border-radius: 50%%; line-height: 60px; font-size: 28px;">&#128247;</div>
                            </div>
                            <h2 style="color: #84cc16; margin: 0 0 25px; font-weight: 400; font-size: 24px; text-align: center;">%s</h2>

                            %s

                            <p style="color: #d4d4d8; line-height: 1.8; margin-bottom: 35px; font-size: 16px; text-align: center;">
                                %s
                            </p>

                            <table width="100%%" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td align="center">
                                        <a href="%s" style="display: inline-block; background-color: #84cc16; color: #0a0a0a; text-decoration: none; padding: 18px 50px; border-radius: 8px; font-weight: 600; letter-spacing: 1px; font-size: 14px;">%s</a>
                                    </td>
                                </tr>
                            </table>

                            %s

                            <p style="color: #71717a; font-size: 13px; margin-top: 35px; text-align: center;">
                                %s<br>
                                <a href="%s" style="color: #84cc16; text-decoration: none;">%s</a>
                            </p>
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #0a0a0a; padding: 25px 30px; text-align: center; border-top: 1px solid #27272a;">
                            <p style="color: #71717a; font-size: 13px; margin: 0;">
                                %s<br>
                                <a href="https://bebemedia.at" style="color: #84cc16; text-decoration: none;">bebemedia.at</a>
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
`, subject, func() string {
		if message != "" {
			return fmt.Sprintf(`<p style="color: #d4d4d8; line-height: 1.7; margin-bottom: 25px; padding: 20px; background-color: #27272a; border-radius: 8px; border-left: 4px solid #84cc16; font-size: 15px;">%s</p>`, message)
		}
		return ""
	}(), t.greeting, galleryURL, t.viewGallery, expirationText, t.fallbackLink, galleryURL, galleryURL, t.thankYou)

	return s.emailService.SendHTML(email, subject, htmlBody)
}
