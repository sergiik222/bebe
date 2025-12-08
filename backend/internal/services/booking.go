package services

import (
	"crypto/rand"
	"encoding/hex"
	"fmt"
	"sync"
	"time"

	"bebe-backend/internal/models"
)

type BookingService struct {
	calendar *CalendarService
	email    *EmailService
	bookings map[string]*models.Booking // In-memory storage (use DB in production)
	mu       sync.RWMutex
}

// NewBookingService creates a new booking service
func NewBookingService(calendar *CalendarService, email *EmailService) *BookingService {
	return &BookingService{
		calendar: calendar,
		email:    email,
		bookings: make(map[string]*models.Booking),
	}
}

// GetAvailability returns available time slots for the next N days
func (bs *BookingService) GetAvailability(days int) (*models.AvailabilityResponse, error) {
	if bs.calendar == nil || !bs.calendar.IsAuthorized() {
		return nil, fmt.Errorf("calendar not authorized")
	}

	now := time.Now()
	startDate := time.Date(now.Year(), now.Month(), now.Day(), 0, 0, 0, 0, now.Location())
	endDate := startDate.AddDate(0, 0, days)

	busySlots, err := bs.calendar.GetBusySlots(startDate, endDate)
	if err != nil {
		return nil, err
	}

	response := &models.AvailabilityResponse{
		Days: make([]models.DayAvailability, 0),
	}

	// 24/7 availability
	workStart := 0
	workEnd := 24
	slotDuration := 1 * time.Hour

	for d := 0; d < days; d++ {
		date := startDate.AddDate(0, 0, d)

		// No weekend restrictions - available 24/7

		dayAvail := models.DayAvailability{
			Date:  date.Format("2006-01-02"),
			Slots: make([]models.TimeSlot, 0),
		}

		// Generate time slots for the day (24 hours)
		for hour := workStart; hour < workEnd; hour++ {
			slotStart := time.Date(date.Year(), date.Month(), date.Day(), hour, 0, 0, 0, date.Location())
			slotEnd := slotStart.Add(slotDuration)

			// Skip past slots
			if slotStart.Before(now) {
				continue
			}

			// Check if slot conflicts with busy times
			isAvailable := true
			for _, busy := range busySlots {
				if slotStart.Before(busy.End) && slotEnd.After(busy.Start) {
					isAvailable = false
					break
				}
			}

			if isAvailable {
				dayAvail.Slots = append(dayAvail.Slots, models.TimeSlot{
					Start: slotStart,
					End:   slotEnd,
				})
			}
		}

		if len(dayAvail.Slots) > 0 {
			response.Days = append(response.Days, dayAvail)
		}
	}

	return response, nil
}

// CreateBooking creates a new booking request
func (bs *BookingService) CreateBooking(req *models.BookingRequest, baseURL string) (*models.Booking, error) {
	// Generate unique token
	token, err := generateToken()
	if err != nil {
		return nil, err
	}

	booking := &models.Booking{
		ID:        generateID(),
		Name:      req.Name,
		Email:     req.Email,
		Phone:     req.Phone,
		Date:      req.Date,
		StartTime: req.StartTime,
		EndTime:   req.EndTime,
		Message:   req.Message,
		Token:     token,
		Status:    "pending",
		CreatedAt: time.Now(),
	}

	// Store booking
	bs.mu.Lock()
	bs.bookings[token] = booking
	bs.mu.Unlock()

	// Send email to owner
	if err := bs.email.SendBookingRequestToOwner(booking, baseURL); err != nil {
		return nil, fmt.Errorf("failed to send email: %v", err)
	}

	return booking, nil
}

// ConfirmBooking confirms a booking and creates calendar event
func (bs *BookingService) ConfirmBooking(token string) (*models.Booking, error) {
	bs.mu.Lock()
	booking, exists := bs.bookings[token]
	if !exists {
		bs.mu.Unlock()
		return nil, fmt.Errorf("booking not found")
	}

	if booking.Status != "pending" {
		bs.mu.Unlock()
		return nil, fmt.Errorf("booking already %s", booking.Status)
	}

	booking.Status = "confirmed"
	bs.mu.Unlock()

	// Parse date and times
	date, _ := time.Parse("2006-01-02", booking.Date)
	startTime, _ := time.Parse("15:04", booking.StartTime)
	endTime, _ := time.Parse("15:04", booking.EndTime)

	start := time.Date(date.Year(), date.Month(), date.Day(), startTime.Hour(), startTime.Minute(), 0, 0, time.Local)
	end := time.Date(date.Year(), date.Month(), date.Day(), endTime.Hour(), endTime.Minute(), 0, 0, time.Local)

	// Create calendar event
	if bs.calendar != nil && bs.calendar.IsAuthorized() {
		summary := fmt.Sprintf("Booking: %s", booking.Name)
		description := fmt.Sprintf("Name: %s\nPhone: %s\nEmail: %s", booking.Name, booking.Phone, booking.Email)
		if booking.Message != "" {
			description += fmt.Sprintf("\n\nMessage:\n%s", booking.Message)
		}

		eventID, err := bs.calendar.CreateEvent(summary, description, start, end)
		if err != nil {
			return nil, fmt.Errorf("failed to create calendar event: %v", err)
		}
		booking.CalendarEventID = eventID
	}

	// Send confirmation email to user
	if err := bs.email.SendConfirmationToUser(booking); err != nil {
		return nil, fmt.Errorf("failed to send confirmation email: %v", err)
	}

	return booking, nil
}

// CancelBooking cancels a booking
func (bs *BookingService) CancelBooking(token string) (*models.Booking, error) {
	bs.mu.Lock()
	booking, exists := bs.bookings[token]
	if !exists {
		bs.mu.Unlock()
		return nil, fmt.Errorf("booking not found")
	}

	if booking.Status != "pending" {
		bs.mu.Unlock()
		return nil, fmt.Errorf("booking already %s", booking.Status)
	}

	booking.Status = "cancelled"
	bs.mu.Unlock()

	// Send cancellation email to user
	if err := bs.email.SendCancellationToUser(booking); err != nil {
		return nil, fmt.Errorf("failed to send cancellation email: %v", err)
	}

	return booking, nil
}

// GetBookingByToken retrieves a booking by its token
func (bs *BookingService) GetBookingByToken(token string) (*models.Booking, error) {
	bs.mu.RLock()
	defer bs.mu.RUnlock()

	booking, exists := bs.bookings[token]
	if !exists {
		return nil, fmt.Errorf("booking not found")
	}

	return booking, nil
}

func generateToken() (string, error) {
	bytes := make([]byte, 32)
	if _, err := rand.Read(bytes); err != nil {
		return "", err
	}
	return hex.EncodeToString(bytes), nil
}

func generateID() string {
	bytes := make([]byte, 8)
	rand.Read(bytes)
	return hex.EncodeToString(bytes)
}
