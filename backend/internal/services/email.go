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

// Email translations for different languages
type emailTranslations struct {
	confirmSubject    string
	confirmTitle      string
	confirmDear       string
	confirmBody       string
	confirmDate       string
	confirmTime       string
	confirmLookingFwd string
	confirmQuestions  string
	confirmRegards    string
	cancelSubject     string
	cancelTitle       string
	cancelDear        string
	cancelBody        string
	cancelDate        string
	cancelTime        string
	cancelApology     string
	cancelRegards     string
}

var translations = map[string]emailTranslations{
	"en": {
		confirmSubject:    "Your Booking is Confirmed!",
		confirmTitle:      "Booking Confirmed!",
		confirmDear:       "Dear",
		confirmBody:       "Your booking has been confirmed:",
		confirmDate:       "Date",
		confirmTime:       "Time",
		confirmLookingFwd: "We look forward to seeing you!",
		confirmQuestions:  "If you have any questions, please don't hesitate to contact us.",
		confirmRegards:    "Best regards",
		cancelSubject:     "Booking Update",
		cancelTitle:       "Booking Update",
		cancelDear:        "Dear",
		cancelBody:        "Unfortunately, we are unable to confirm your booking for:",
		cancelDate:        "Date",
		cancelTime:        "Time",
		cancelApology:     "We apologize for any inconvenience. We will contact you shortly to discuss alternative options.",
		cancelRegards:     "Best regards",
	},
	"de": {
		confirmSubject:    "Ihre Buchung ist bestätigt!",
		confirmTitle:      "Buchung bestätigt!",
		confirmDear:       "Liebe/r",
		confirmBody:       "Ihre Buchung wurde bestätigt:",
		confirmDate:       "Datum",
		confirmTime:       "Uhrzeit",
		confirmLookingFwd: "Wir freuen uns auf Sie!",
		confirmQuestions:  "Bei Fragen können Sie uns jederzeit kontaktieren.",
		confirmRegards:    "Mit freundlichen Grüßen",
		cancelSubject:     "Buchungs-Update",
		cancelTitle:       "Buchungs-Update",
		cancelDear:        "Liebe/r",
		cancelBody:        "Leider können wir Ihre Buchung nicht bestätigen für:",
		cancelDate:        "Datum",
		cancelTime:        "Uhrzeit",
		cancelApology:     "Wir entschuldigen uns für die Unannehmlichkeiten. Wir werden uns in Kürze bei Ihnen melden, um alternative Optionen zu besprechen.",
		cancelRegards:     "Mit freundlichen Grüßen",
	},
	"ru": {
		confirmSubject:    "Ваша запись подтверждена!",
		confirmTitle:      "Запись подтверждена!",
		confirmDear:       "Уважаемый(ая)",
		confirmBody:       "Ваша запись подтверждена:",
		confirmDate:       "Дата",
		confirmTime:       "Время",
		confirmLookingFwd: "Ждём вас!",
		confirmQuestions:  "Если у вас есть вопросы, пожалуйста, свяжитесь с нами.",
		confirmRegards:    "С уважением",
		cancelSubject:     "Обновление записи",
		cancelTitle:       "Обновление записи",
		cancelDear:        "Уважаемый(ая)",
		cancelBody:        "К сожалению, мы не можем подтвердить вашу запись на:",
		cancelDate:        "Дата",
		cancelTime:        "Время",
		cancelApology:     "Приносим извинения за неудобства. Мы свяжемся с вами в ближайшее время, чтобы обсудить альтернативные варианты.",
		cancelRegards:     "С уважением",
	},
}

func getTranslation(lang string) emailTranslations {
	if t, ok := translations[lang]; ok {
		return t
	}
	return translations["en"] // Default to English
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
		<p><strong>Language:</strong> %s</p>
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
	`, booking.Name, booking.Email, booking.Phone, booking.Date, booking.StartTime, booking.EndTime, booking.Language,
		func() string {
			if booking.Message != "" {
				return fmt.Sprintf("<p><strong>Message:</strong> %s</p>", booking.Message)
			}
			return ""
		}(),
		confirmURL, cancelURL)

	return es.sendEmail(es.ownerEmail, "New Booking Request: "+booking.Name, html)
}

// SendConfirmationToUser sends confirmation email to the user in their preferred language
func (es *EmailService) SendConfirmationToUser(booking *models.Booking) error {
	t := getTranslation(booking.Language)

	html := fmt.Sprintf(`
		<h2>%s</h2>
		<p>%s %s,</p>
		<p>%s</p>
		<p><strong>%s:</strong> %s</p>
		<p><strong>%s:</strong> %s - %s</p>
		<p>%s</p>
		<p>%s</p>
		<p>%s,<br>Bebe</p>
	`, t.confirmTitle, t.confirmDear, booking.Name, t.confirmBody,
		t.confirmDate, booking.Date, t.confirmTime, booking.StartTime, booking.EndTime,
		t.confirmLookingFwd, t.confirmQuestions, t.confirmRegards)

	return es.sendEmail(booking.Email, t.confirmSubject, html)
}

// SendCancellationToUser sends cancellation email to the user in their preferred language
func (es *EmailService) SendCancellationToUser(booking *models.Booking) error {
	t := getTranslation(booking.Language)

	html := fmt.Sprintf(`
		<h2>%s</h2>
		<p>%s %s,</p>
		<p>%s</p>
		<p><strong>%s:</strong> %s</p>
		<p><strong>%s:</strong> %s - %s</p>
		<p>%s</p>
		<p>%s,<br>Bebe</p>
	`, t.cancelTitle, t.cancelDear, booking.Name, t.cancelBody,
		t.cancelDate, booking.Date, t.cancelTime, booking.StartTime, booking.EndTime,
		t.cancelApology, t.cancelRegards)

	return es.sendEmail(booking.Email, t.cancelSubject, html)
}

// SendContactMessage sends a contact form message to the owner
func (es *EmailService) SendContactMessage(name, email, phone, subject, message string) error {
	phoneInfo := ""
	if phone != "" {
		phoneInfo = fmt.Sprintf("<p><strong>Phone:</strong> %s</p>", phone)
	}

	html := fmt.Sprintf(`
		<h2>New Contact Message</h2>
		<p><strong>From:</strong> %s</p>
		<p><strong>Email:</strong> <a href="mailto:%s">%s</a></p>
		%s
		<p><strong>Subject:</strong> %s</p>
		<hr>
		<h3>Message:</h3>
		<p style="white-space: pre-wrap;">%s</p>
		<hr>
		<p style="color: #666; font-size: 12px;">Reply directly to this email to respond to %s</p>
	`, name, email, email, phoneInfo, subject, message, name)

	return es.sendEmail(es.ownerEmail, "Contact: "+subject, html)
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
