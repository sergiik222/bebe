package services

import (
	"bebe-backend/internal/database"
	"context"
	"encoding/json"
	"fmt"
	"log"
	"os"
	"time"

	"golang.org/x/oauth2"
	"golang.org/x/oauth2/google"
	"google.golang.org/api/calendar/v3"
	"google.golang.org/api/option"
)

const googleCalendarTokenKey = "google_calendar"

type CalendarService struct {
	service     *calendar.Service
	config      *oauth2.Config
	calendarID  string
	tokenSource oauth2.TokenSource
}

// persistingTokenSource wraps a TokenSource and saves tokens when refreshed
type persistingTokenSource struct {
	base      oauth2.TokenSource
	lastToken *oauth2.Token
	cs        *CalendarService
}

// Token implements oauth2.TokenSource and persists refreshed tokens
func (pts *persistingTokenSource) Token() (*oauth2.Token, error) {
	token, err := pts.base.Token()
	if err != nil {
		return nil, err
	}

	// Check if token was refreshed (different access token)
	if pts.lastToken == nil || token.AccessToken != pts.lastToken.AccessToken {
		log.Println("Token was refreshed, persisting new token...")
		pts.cs.saveToken(token)
		pts.lastToken = token
	}

	return token, nil
}

// NewCalendarService creates a new calendar service
func NewCalendarService() (*CalendarService, error) {
	clientID := os.Getenv("GOOGLE_CLIENT_ID")
	clientSecret := os.Getenv("GOOGLE_CLIENT_SECRET")
	redirectURI := os.Getenv("GOOGLE_REDIRECT_URI")

	// Debug logging for env vars (mask sensitive data)
	log.Printf("Calendar Service Init - ClientID set: %v, ClientSecret set: %v, RedirectURI: %s",
		clientID != "", clientSecret != "", redirectURI)

	config := &oauth2.Config{
		ClientID:     clientID,
		ClientSecret: clientSecret,
		RedirectURL:  redirectURI,
		Scopes: []string{
			calendar.CalendarReadonlyScope,
			calendar.CalendarEventsScope,
		},
		Endpoint: google.Endpoint,
	}

	calendarID := os.Getenv("GOOGLE_CALENDAR_ID")
	if calendarID == "" {
		calendarID = "primary"
	}

	cs := &CalendarService{
		config:     config,
		calendarID: calendarID,
	}

	// Try to load existing token
	token, err := cs.loadToken()
	if err != nil {
		log.Println("No valid token found. Authorization required.")
		return cs, nil // Return service without calendar.Service - needs auth
	}

	// Create calendar service with persisting token source
	ctx := context.Background()

	// Create a token source that will auto-refresh and persist new tokens
	baseTokenSource := config.TokenSource(ctx, token)
	pts := &persistingTokenSource{
		base:      baseTokenSource,
		lastToken: token,
		cs:        cs,
	}
	cs.tokenSource = pts

	// Create HTTP client with our persisting token source
	client := oauth2.NewClient(ctx, pts)
	service, err := calendar.NewService(ctx, option.WithHTTPClient(client))
	if err != nil {
		return nil, fmt.Errorf("failed to create calendar service: %v", err)
	}

	cs.service = service
	return cs, nil
}

// GetAuthURL returns the URL to authorize the application
func (cs *CalendarService) GetAuthURL() string {
	return cs.config.AuthCodeURL("state-token", oauth2.AccessTypeOffline, oauth2.ApprovalForce)
}

// ExchangeCode exchanges the authorization code for a token
func (cs *CalendarService) ExchangeCode(code string) error {
	ctx := context.Background()
	token, err := cs.config.Exchange(ctx, code)
	if err != nil {
		return fmt.Errorf("failed to exchange code: %v", err)
	}

	// Save token
	if err := cs.saveToken(token); err != nil {
		return fmt.Errorf("failed to save token: %v", err)
	}

	// Create calendar service with persisting token source
	baseTokenSource := cs.config.TokenSource(ctx, token)
	pts := &persistingTokenSource{
		base:      baseTokenSource,
		lastToken: token,
		cs:        cs,
	}
	cs.tokenSource = pts

	client := oauth2.NewClient(ctx, pts)
	service, err := calendar.NewService(ctx, option.WithHTTPClient(client))
	if err != nil {
		return fmt.Errorf("failed to create calendar service: %v", err)
	}

	cs.service = service
	return nil
}

// IsAuthorized returns true if the service has a valid token
func (cs *CalendarService) IsAuthorized() bool {
	return cs.service != nil
}

// GetBusySlots returns busy time slots for a date range
func (cs *CalendarService) GetBusySlots(startDate, endDate time.Time) ([]struct{ Start, End time.Time }, error) {
	if cs.service == nil {
		return nil, fmt.Errorf("calendar service not authorized")
	}

	events, err := cs.service.Events.List(cs.calendarID).
		TimeMin(startDate.Format(time.RFC3339)).
		TimeMax(endDate.Format(time.RFC3339)).
		SingleEvents(true).
		OrderBy("startTime").
		Do()

	if err != nil {
		return nil, fmt.Errorf("failed to fetch events: %v", err)
	}

	var busySlots []struct{ Start, End time.Time }
	for _, event := range events.Items {
		if event.Start.DateTime == "" {
			continue // Skip all-day events
		}

		start, _ := time.Parse(time.RFC3339, event.Start.DateTime)
		end, _ := time.Parse(time.RFC3339, event.End.DateTime)

		busySlots = append(busySlots, struct{ Start, End time.Time }{
			Start: start,
			End:   end,
		})
	}

	return busySlots, nil
}

// CreateEvent creates a new calendar event
func (cs *CalendarService) CreateEvent(summary, description string, start, end time.Time) (string, error) {
	if cs.service == nil {
		return "", fmt.Errorf("calendar service not authorized")
	}

	event := &calendar.Event{
		Summary:     summary,
		Description: description,
		Start: &calendar.EventDateTime{
			DateTime: start.Format(time.RFC3339),
			TimeZone: "Europe/Berlin",
		},
		End: &calendar.EventDateTime{
			DateTime: end.Format(time.RFC3339),
			TimeZone: "Europe/Berlin",
		},
	}

	createdEvent, err := cs.service.Events.Insert(cs.calendarID, event).Do()
	if err != nil {
		return "", fmt.Errorf("failed to create event: %v", err)
	}

	return createdEvent.Id, nil
}

// DeleteEvent deletes a calendar event
func (cs *CalendarService) DeleteEvent(eventID string) error {
	if cs.service == nil {
		return fmt.Errorf("calendar service not authorized")
	}

	return cs.service.Events.Delete(cs.calendarID, eventID).Do()
}

// loadToken reads the token from database first, then falls back to env var
func (cs *CalendarService) loadToken() (*oauth2.Token, error) {
	var dbToken, envToken *oauth2.Token

	// Try to load from database first (contains auto-refreshed tokens)
	if tokenJSON, err := database.GetOAuthToken(googleCalendarTokenKey); err == nil && tokenJSON != "" {
		dbToken = &oauth2.Token{}
		if err := json.Unmarshal([]byte(tokenJSON), dbToken); err != nil {
			log.Printf("Failed to parse token from database: %v", err)
			dbToken = nil
		}
	}

	// Try to load from environment variable (initial token)
	tokenJSON := os.Getenv("GOOGLE_OAUTH_TOKEN")
	if tokenJSON != "" {
		envToken = &oauth2.Token{}
		if err := json.Unmarshal([]byte(tokenJSON), envToken); err != nil {
			log.Printf("Failed to parse GOOGLE_OAUTH_TOKEN: %v", err)
			envToken = nil
		}
	}

	// Prefer the token with the later expiry (database likely has refreshed token)
	var token *oauth2.Token
	if dbToken != nil && envToken != nil {
		if dbToken.Expiry.After(envToken.Expiry) {
			log.Printf("Using token from database (expires: %v, newer than env var: %v)", dbToken.Expiry, envToken.Expiry)
			token = dbToken
		} else {
			log.Printf("Using token from env var (expires: %v)", envToken.Expiry)
			token = envToken
		}
	} else if dbToken != nil {
		log.Printf("Loaded token from database (expires: %v)", dbToken.Expiry)
		token = dbToken
	} else if envToken != nil {
		log.Printf("Loaded token from GOOGLE_OAUTH_TOKEN env var (expires: %v)", envToken.Expiry)
		token = envToken
	}

	if token == nil {
		return nil, fmt.Errorf("no token found")
	}

	return token, nil
}

// saveToken saves the token to the database
func (cs *CalendarService) saveToken(token *oauth2.Token) error {
	tokenJSON, err := json.Marshal(token)
	if err != nil {
		return fmt.Errorf("failed to marshal token: %v", err)
	}

	// Save to database
	if err := database.SaveOAuthToken(googleCalendarTokenKey, string(tokenJSON)); err != nil {
		log.Printf("Failed to save token to database: %v", err)
		return err
	}

	log.Printf("Token saved to database (expires: %v)", token.Expiry)
	return nil
}
