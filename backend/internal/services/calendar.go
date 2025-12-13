package services

import (
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

type CalendarService struct {
	service    *calendar.Service
	config     *oauth2.Config
	calendarID string
	tokenFile  string
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

	// Token file path - use /tmp for container environments
	tokenFile := os.Getenv("TOKEN_FILE_PATH")
	if tokenFile == "" {
		tokenFile = "/tmp/token.json"
	}

	cs := &CalendarService{
		config:     config,
		calendarID: calendarID,
		tokenFile:  tokenFile,
	}

	// Try to load existing token
	token, err := cs.loadToken()
	if err != nil {
		log.Println("No valid token found. Authorization required.")
		return cs, nil // Return service without calendar.Service - needs auth
	}

	// Create calendar service with token
	ctx := context.Background()
	client := config.Client(ctx, token)
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

	// Create calendar service
	client := cs.config.Client(ctx, token)
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

// loadToken reads the token from environment variable or file
func (cs *CalendarService) loadToken() (*oauth2.Token, error) {
	// First try to load from environment variable (for container deployments)
	tokenJSON := os.Getenv("GOOGLE_OAUTH_TOKEN")
	if tokenJSON != "" {
		token := &oauth2.Token{}
		if err := json.Unmarshal([]byte(tokenJSON), token); err != nil {
			log.Printf("Failed to parse GOOGLE_OAUTH_TOKEN: %v", err)
		} else {
			log.Println("Loaded token from GOOGLE_OAUTH_TOKEN environment variable")
			return token, nil
		}
	}

	// Fall back to file
	file, err := os.Open(cs.tokenFile)
	if err != nil {
		return nil, err
	}
	defer file.Close()

	token := &oauth2.Token{}
	err = json.NewDecoder(file).Decode(token)
	if err == nil {
		log.Printf("Loaded token from file: %s", cs.tokenFile)
	}
	return token, err
}

// saveToken saves the token to file and logs it for env var setup
func (cs *CalendarService) saveToken(token *oauth2.Token) error {
	// Always log the token JSON so it can be set as env var
	tokenJSON, _ := json.Marshal(token)
	log.Printf("=== OAUTH TOKEN (save this as GOOGLE_OAUTH_TOKEN env var) ===")
	log.Printf("%s", string(tokenJSON))
	log.Printf("=== END OAUTH TOKEN ===")

	// Try to save to file
	file, err := os.Create(cs.tokenFile)
	if err != nil {
		log.Printf("Could not save token to file (this is OK for container deployments): %v", err)
		log.Println("Set the GOOGLE_OAUTH_TOKEN environment variable with the token JSON above")
		return nil // Don't return error - token is still valid in memory
	}
	defer file.Close()

	return json.NewEncoder(file).Encode(token)
}
