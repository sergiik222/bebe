package services

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"

	"bebe-backend/internal/models"
)

type EmailService struct {
	apiKey     string
	ownerEmail string
	fromEmail  string
}

type resendRequest struct {
	From    string   `json:"from"`
	To      []string `json:"to"`
	Subject string   `json:"subject"`
	HTML    string   `json:"html"`
}

// NewEmailService creates a new email service
func NewEmailService(apiKey, ownerEmail string) *EmailService {
	return &EmailService{
		apiKey:     apiKey,
		ownerEmail: ownerEmail,
		fromEmail:  "Bebe Booking <onboarding@resend.dev>", // Default Resend sender
	}
}

// SendBookingRequestToOwner sends booking request email to the owner
func (es *EmailService) SendBookingRequestToOwner(booking *models.Booking, baseURL string) error {
	confirmURL := fmt.Sprintf("%s/api/booking/confirm/%s", baseURL, booking.Token)
	cancelURL := fmt.Sprintf("%s/api/booking/cancel/%s", baseURL, booking.Token)

	html := fmt.Sprintf(`
		<h2>New Booking Request</h2>
		<p><strong>From:</strong> %s</p>
		<p><strong>Email:</strong> %s</p>
		<p><strong>Phone:</strong> %s</p>
		<p><strong>Date:</strong> %s</p>
		<p><strong>Time:</strong> %s - %s</p>
		%s
		<hr>
		<table cellpadding="0" cellspacing="0" border="0" style="margin-top: 20px;">
			<tr>
				<td style="padding-bottom: 12px;">
					<a href="%s" style="display: block; background-color: #10b981; color: white; padding: 14px 32px; text-decoration: none; border-radius: 6px; text-align: center; font-weight: bold;">Confirm Booking</a>
				</td>
			</tr>
			<tr>
				<td>
					<a href="%s" style="display: block; background-color: #ef4444; color: white; padding: 14px 32px; text-decoration: none; border-radius: 6px; text-align: center; font-weight: bold;">Cancel Booking</a>
				</td>
			</tr>
		</table>
	`, booking.Name, booking.Email, booking.Phone, booking.Date, booking.StartTime, booking.EndTime,
		func() string {
			if booking.Message != "" {
				return fmt.Sprintf("<p><strong>Message:</strong> %s</p>", booking.Message)
			}
			return ""
		}(),
		confirmURL, cancelURL)

	return es.sendEmail(es.ownerEmail, "New Booking Request: "+booking.Name, html)
}

// SendConfirmationToUser sends confirmation email to the user
func (es *EmailService) SendConfirmationToUser(booking *models.Booking) error {
	html := fmt.Sprintf(`
		<h2>Booking Confirmed!</h2>
		<p>Dear %s,</p>
		<p>Your booking has been confirmed:</p>
		<p><strong>Date:</strong> %s</p>
		<p><strong>Time:</strong> %s - %s</p>
		<p>We look forward to seeing you!</p>
		<p>If you have any questions, please don't hesitate to contact us.</p>
		<p>Best regards,<br>Bebe</p>
	`, booking.Name, booking.Date, booking.StartTime, booking.EndTime)

	return es.sendEmail(booking.Email, "Your Booking is Confirmed!", html)
}

// SendCancellationToUser sends cancellation email to the user
func (es *EmailService) SendCancellationToUser(booking *models.Booking) error {
	html := fmt.Sprintf(`
		<h2>Booking Update</h2>
		<p>Dear %s,</p>
		<p>Unfortunately, we are unable to confirm your booking for:</p>
		<p><strong>Date:</strong> %s</p>
		<p><strong>Time:</strong> %s - %s</p>
		<p>We apologize for any inconvenience. We will contact you shortly to discuss alternative options.</p>
		<p>Best regards,<br>Bebe</p>
	`, booking.Name, booking.Date, booking.StartTime, booking.EndTime)

	return es.sendEmail(booking.Email, "Booking Update", html)
}

// sendEmail sends an email via Resend API
func (es *EmailService) sendEmail(to, subject, html string) error {
	reqBody := resendRequest{
		From:    es.fromEmail,
		To:      []string{to},
		Subject: subject,
		HTML:    html,
	}

	jsonBody, err := json.Marshal(reqBody)
	if err != nil {
		return err
	}

	req, err := http.NewRequest("POST", "https://api.resend.com/emails", bytes.NewBuffer(jsonBody))
	if err != nil {
		return err
	}

	req.Header.Set("Authorization", "Bearer "+es.apiKey)
	req.Header.Set("Content-Type", "application/json")

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	if resp.StatusCode >= 400 {
		body, _ := io.ReadAll(resp.Body)
		return fmt.Errorf("resend API error: status %d, body: %s", resp.StatusCode, string(body))
	}

	return nil
}
