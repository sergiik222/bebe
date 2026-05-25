package services

import (
	"crypto/rand"
	"database/sql"
	"encoding/hex"
	"errors"
	"fmt"
	"log"
	"time"

	"bebe-backend/internal/database"
	"bebe-backend/internal/models"
)

type BookingService struct {
	calendar *CalendarService
	email    *EmailService
}

// NewBookingService creates a new booking service.
// Bookings are persisted in Postgres (`bookings` table) so they survive
// restarts — previously they lived in an in-memory map.
func NewBookingService(calendar *CalendarService, email *EmailService) *BookingService {
	return &BookingService{
		calendar: calendar,
		email:    email,
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

		dayAvail := models.DayAvailability{
			Date:  date.Format("2006-01-02"),
			Slots: make([]models.TimeSlot, 0),
		}

		for hour := workStart; hour < workEnd; hour++ {
			slotStart := time.Date(date.Year(), date.Month(), date.Day(), hour, 0, 0, 0, date.Location())
			slotEnd := slotStart.Add(slotDuration)

			if slotStart.Before(now) {
				continue
			}

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

// GetAvailabilityForMonth returns available time slots for a specific month
func (bs *BookingService) GetAvailabilityForMonth(year int, month time.Month) (*models.AvailabilityResponse, error) {
	if bs.calendar == nil || !bs.calendar.IsAuthorized() {
		return nil, fmt.Errorf("calendar not authorized")
	}

	now := time.Now()
	location := now.Location()

	startDate := time.Date(year, month, 1, 0, 0, 0, 0, location)
	endDate := startDate.AddDate(0, 1, 0)

	if year == now.Year() && month == now.Month() {
		startDate = time.Date(now.Year(), now.Month(), now.Day(), 0, 0, 0, 0, location)
	}

	if endDate.Before(now) {
		return &models.AvailabilityResponse{Days: []models.DayAvailability{}}, nil
	}

	busySlots, err := bs.calendar.GetBusySlots(startDate, endDate)
	if err != nil {
		return nil, err
	}

	response := &models.AvailabilityResponse{
		Days: make([]models.DayAvailability, 0),
	}

	workStart := 0
	workEnd := 24
	slotDuration := 1 * time.Hour

	for date := startDate; date.Before(endDate); date = date.AddDate(0, 0, 1) {
		dayAvail := models.DayAvailability{
			Date:  date.Format("2006-01-02"),
			Slots: make([]models.TimeSlot, 0),
		}

		for hour := workStart; hour < workEnd; hour++ {
			slotStart := time.Date(date.Year(), date.Month(), date.Day(), hour, 0, 0, 0, location)
			slotEnd := slotStart.Add(slotDuration)

			if slotStart.Before(now) {
				continue
			}

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

// CreateBooking creates a new pending booking and persists it to the DB.
func (bs *BookingService) CreateBooking(req *models.BookingRequest, baseURL string) (*models.Booking, error) {
	token, err := generateToken()
	if err != nil {
		return nil, err
	}

	language := req.Language
	if language == "" {
		language = "en"
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
		Language:  language,
		Token:     token,
		Status:    "pending",
		CreatedAt: time.Now(),
	}

	if err := insertBooking(booking); err != nil {
		log.Println("Error in function CreateBooking", err)
		return nil, fmt.Errorf("failed to persist booking: %w", err)
	}

	if err := bs.email.SendBookingRequestToOwner(booking, baseURL); err != nil {
		// Booking is already in DB — surface the email error but don't roll back,
		// the owner can still confirm via direct DB lookup if needed.
		log.Println("Error in function CreateBooking", err)
		return nil, fmt.Errorf("failed to send email: %v", err)
	}

	return booking, nil
}

// ConfirmBooking confirms a booking and creates the calendar event.
func (bs *BookingService) ConfirmBooking(token string) (*models.Booking, error) {
	booking, err := getBookingByToken(token)
	if err != nil {
		log.Println("Error in function ConfirmBooking", err)
		return nil, err
	}

	if booking.Status != "pending" {
		return nil, fmt.Errorf("booking already %s", booking.Status)
	}

	berlinLoc, _ := time.LoadLocation("Europe/Berlin")
	date, _ := time.Parse("2006-01-02", booking.Date)
	startTime, _ := time.Parse("15:04", booking.StartTime)
	endTime, _ := time.Parse("15:04", booking.EndTime)

	start := time.Date(date.Year(), date.Month(), date.Day(), startTime.Hour(), startTime.Minute(), 0, 0, berlinLoc)
	end := time.Date(date.Year(), date.Month(), date.Day(), endTime.Hour(), endTime.Minute(), 0, 0, berlinLoc)

	if bs.calendar != nil && bs.calendar.IsAuthorized() {
		summary := fmt.Sprintf("Booking: %s", booking.Name)
		description := fmt.Sprintf("Name: %s\nPhone: %s\nEmail: %s", booking.Name, booking.Phone, booking.Email)
		if booking.Message != "" {
			description += fmt.Sprintf("\n\nMessage:\n%s", booking.Message)
		}

		eventID, err := bs.calendar.CreateEvent(summary, description, start, end)
		if err != nil {
			log.Println("Error in function ConfirmBooking", err)
			return nil, fmt.Errorf("failed to create calendar event: %v", err)
		}
		booking.CalendarEventID = eventID
	}

	if err := updateBookingStatus(token, "confirmed", booking.CalendarEventID); err != nil {
		log.Println("Error in function ConfirmBooking", err)
		return nil, err
	}
	booking.Status = "confirmed"

	if err := bs.email.SendConfirmationToUser(booking); err != nil {
		log.Println("Error in function ConfirmBooking", err)
		return nil, fmt.Errorf("failed to send confirmation email: %v", err)
	}

	return booking, nil
}

// CancelBooking cancels a pending booking.
func (bs *BookingService) CancelBooking(token string) (*models.Booking, error) {
	booking, err := getBookingByToken(token)
	if err != nil {
		log.Println("Error in function CancelBooking", err)
		return nil, err
	}

	if booking.Status != "pending" {
		return nil, fmt.Errorf("booking already %s", booking.Status)
	}

	if err := updateBookingStatus(token, "cancelled", ""); err != nil {
		log.Println("Error in function CancelBooking", err)
		return nil, err
	}
	booking.Status = "cancelled"

	if err := bs.email.SendCancellationToUser(booking); err != nil {
		log.Println("Error in function CancelBooking", err)
		return nil, fmt.Errorf("failed to send cancellation email: %v", err)
	}

	return booking, nil
}

// GetBookingByToken retrieves a booking by its token
func (bs *BookingService) GetBookingByToken(token string) (*models.Booking, error) {
	return getBookingByToken(token)
}

// ---- DB helpers ----

func insertBooking(b *models.Booking) error {
	if database.DB == nil {
		return errors.New("database not available")
	}
	_, err := database.DB.Exec(
		`INSERT INTO bookings (id, token, name, email, phone, date, start_time, end_time, message, language, status, created_at)
		 VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
		b.ID, b.Token, b.Name, b.Email, b.Phone, b.Date, b.StartTime, b.EndTime, b.Message, b.Language, b.Status, b.CreatedAt,
	)
	return err
}

func getBookingByToken(token string) (*models.Booking, error) {
	if database.DB == nil {
		return nil, errors.New("database not available")
	}
	var b models.Booking
	var message sql.NullString
	var eventID sql.NullString
	err := database.DB.QueryRow(
		`SELECT id, token, name, email, phone, date, start_time, end_time, message, language, status, calendar_event_id, created_at
		 FROM bookings WHERE token = $1`,
		token,
	).Scan(&b.ID, &b.Token, &b.Name, &b.Email, &b.Phone, &b.Date, &b.StartTime, &b.EndTime, &message, &b.Language, &b.Status, &eventID, &b.CreatedAt)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, fmt.Errorf("booking not found")
		}
		return nil, err
	}
	if message.Valid {
		b.Message = message.String
	}
	if eventID.Valid {
		b.CalendarEventID = eventID.String
	}
	return &b, nil
}

func updateBookingStatus(token, status, calendarEventID string) error {
	if database.DB == nil {
		return errors.New("database not available")
	}
	var eventID sql.NullString
	if calendarEventID != "" {
		eventID = sql.NullString{String: calendarEventID, Valid: true}
	}
	_, err := database.DB.Exec(
		`UPDATE bookings SET status = $1, calendar_event_id = $2 WHERE token = $3`,
		status, eventID, token,
	)
	return err
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
