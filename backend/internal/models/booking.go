package models

import "time"

// BookingRequest represents a booking request from a user
type BookingRequest struct {
	Name      string    `json:"name" binding:"required"`
	Email     string    `json:"email" binding:"required,email"`
	Phone     string    `json:"phone" binding:"required"`
	Date      string    `json:"date" binding:"required"`      // Format: 2006-01-02
	StartTime string    `json:"startTime" binding:"required"` // Format: 15:04
	EndTime   string    `json:"endTime" binding:"required"`   // Format: 15:04
	Message   string    `json:"message"`                      // Optional message
}

// Booking represents a stored booking with confirmation token
type Booking struct {
	ID           string    `json:"id"`
	Name         string    `json:"name"`
	Email        string    `json:"email"`
	Phone        string    `json:"phone"`
	Date         string    `json:"date"`
	StartTime    string    `json:"startTime"`
	EndTime      string    `json:"endTime"`
	Message      string    `json:"message"`
	Token        string    `json:"token"`
	Status       string    `json:"status"` // pending, confirmed, cancelled
	CreatedAt    time.Time `json:"createdAt"`
	CalendarEventID string `json:"calendarEventId,omitempty"`
}

// TimeSlot represents an available time slot
type TimeSlot struct {
	Start time.Time `json:"start"`
	End   time.Time `json:"end"`
}

// DayAvailability represents available slots for a single day
type DayAvailability struct {
	Date  string     `json:"date"`
	Slots []TimeSlot `json:"slots"`
}

// AvailabilityResponse is the API response for availability
type AvailabilityResponse struct {
	Days []DayAvailability `json:"days"`
}
