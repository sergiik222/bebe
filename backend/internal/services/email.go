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
                            <h2 style="color: #84cc16; margin: 0 0 25px; font-weight: 400; font-size: 24px;">New Booking Request</h2>
                            <table style="margin: 0 0 25px; background-color: #27272a; border-radius: 8px; width: 100%%;">
                                <tr>
                                    <td style="padding: 15px 20px; border-bottom: 1px solid #3f3f46;">
                                        <p style="color: #71717a; margin: 0; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Client</p>
                                        <p style="color: #fafafa; margin: 5px 0 0; font-size: 16px; font-weight: 500;">%s</p>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding: 15px 20px; border-bottom: 1px solid #3f3f46;">
                                        <p style="color: #71717a; margin: 0; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Email</p>
                                        <p style="color: #84cc16; margin: 5px 0 0; font-size: 16px;">%s</p>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding: 15px 20px; border-bottom: 1px solid #3f3f46;">
                                        <p style="color: #71717a; margin: 0; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Phone</p>
                                        <p style="color: #fafafa; margin: 5px 0 0; font-size: 16px;">%s</p>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding: 15px 20px; border-bottom: 1px solid #3f3f46;">
                                        <p style="color: #71717a; margin: 0; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Date</p>
                                        <p style="color: #fafafa; margin: 5px 0 0; font-size: 18px; font-weight: 500;">%s</p>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding: 15px 20px; border-bottom: 1px solid #3f3f46;">
                                        <p style="color: #71717a; margin: 0; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Time</p>
                                        <p style="color: #fafafa; margin: 5px 0 0; font-size: 18px; font-weight: 500;">%s - %s</p>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding: 15px 20px;">
                                        <p style="color: #71717a; margin: 0; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Language</p>
                                        <p style="color: #a1a1aa; margin: 5px 0 0; font-size: 14px;">%s</p>
                                    </td>
                                </tr>
                            </table>
                            %s
                            <table width="100%%" cellpadding="0" cellspacing="0" style="margin-top: 30px;">
                                <tr>
                                    <td align="center" style="padding-bottom: 12px;">
                                        <a href="%s" style="display: inline-block; background-color: #84cc16; color: #0a0a0a; text-decoration: none; padding: 16px 40px; border-radius: 8px; font-weight: 600; letter-spacing: 1px; font-size: 14px;">CONFIRM BOOKING</a>
                                    </td>
                                </tr>
                                <tr>
                                    <td align="center">
                                        <a href="%s" style="display: inline-block; background-color: #ef4444; color: #ffffff; text-decoration: none; padding: 16px 40px; border-radius: 8px; font-weight: 600; letter-spacing: 1px; font-size: 14px;">CANCEL BOOKING</a>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #0a0a0a; padding: 25px 30px; text-align: center; border-top: 1px solid #27272a;">
                            <p style="color: #71717a; font-size: 13px; margin: 0;">
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
	`, booking.Name, booking.Email, booking.Phone, booking.Date, booking.StartTime, booking.EndTime, booking.Language,
		func() string {
			if booking.Message != "" {
				return fmt.Sprintf(`<div style="margin-bottom: 25px; padding: 20px; background-color: #27272a; border-radius: 8px; border-left: 4px solid #84cc16;">
                    <p style="color: #71717a; margin: 0 0 8px; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Message</p>
                    <p style="color: #d4d4d8; margin: 0; font-size: 15px; line-height: 1.6;">%s</p>
                </div>`, booking.Message)
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
                            <!-- Success Icon -->
                            <div style="text-align: center; margin-bottom: 30px;">
                                <div style="display: inline-block; width: 60px; height: 60px; background-color: rgba(132, 204, 22, 0.15); border-radius: 50%%; line-height: 60px; font-size: 28px;">&#10003;</div>
                            </div>
                            <h2 style="color: #84cc16; margin: 0 0 25px; font-weight: 400; font-size: 24px; text-align: center;">%s</h2>
                            <p style="color: #a1a1aa; line-height: 1.8; font-size: 16px;">%s %s,</p>
                            <p style="color: #d4d4d8; line-height: 1.8; font-size: 16px;">%s</p>
                            <table style="margin: 25px 0; background-color: #27272a; border-radius: 8px; width: 100%%;">
                                <tr>
                                    <td style="padding: 15px 20px; border-bottom: 1px solid #3f3f46;">
                                        <p style="color: #71717a; margin: 0; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">%s</p>
                                        <p style="color: #fafafa; margin: 5px 0 0; font-size: 18px; font-weight: 500;">%s</p>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding: 15px 20px;">
                                        <p style="color: #71717a; margin: 0; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">%s</p>
                                        <p style="color: #fafafa; margin: 5px 0 0; font-size: 18px; font-weight: 500;">%s - %s</p>
                                    </td>
                                </tr>
                            </table>
                            <p style="color: #84cc16; line-height: 1.8; font-size: 16px; font-weight: 500;">%s</p>
                            <p style="color: #a1a1aa; line-height: 1.8; font-size: 14px;">%s</p>
                            <p style="color: #a1a1aa; line-height: 1.8; font-size: 16px; margin-top: 30px;">%s,<br><span style="color: #84cc16; font-weight: 500;">Bebe</span></p>
                        </td>
                    </tr>
                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #0a0a0a; padding: 25px 30px; text-align: center; border-top: 1px solid #27272a;">
                            <p style="color: #71717a; font-size: 13px; margin: 0;">
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
	`, t.confirmTitle, t.confirmDear, booking.Name, t.confirmBody,
		t.confirmDate, booking.Date, t.confirmTime, booking.StartTime, booking.EndTime,
		t.confirmLookingFwd, t.confirmQuestions, t.confirmRegards)

	return es.sendEmail(booking.Email, t.confirmSubject, html)
}

// SendCancellationToUser sends cancellation email to the user in their preferred language
func (es *EmailService) SendCancellationToUser(booking *models.Booking) error {
	t := getTranslation(booking.Language)

	html := fmt.Sprintf(`
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
                            <!-- Info Icon -->
                            <div style="text-align: center; margin-bottom: 30px;">
                                <div style="display: inline-block; width: 60px; height: 60px; background-color: rgba(161, 161, 170, 0.15); border-radius: 50%%; line-height: 60px; font-size: 28px;">&#8505;</div>
                            </div>
                            <h2 style="color: #fafafa; margin: 0 0 25px; font-weight: 400; font-size: 24px; text-align: center;">%s</h2>
                            <p style="color: #a1a1aa; line-height: 1.8; font-size: 16px;">%s %s,</p>
                            <p style="color: #d4d4d8; line-height: 1.8; font-size: 16px;">%s</p>
                            <table style="margin: 25px 0; background-color: #27272a; border-radius: 8px; width: 100%%;">
                                <tr>
                                    <td style="padding: 15px 20px; border-bottom: 1px solid #3f3f46;">
                                        <p style="color: #71717a; margin: 0; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">%s</p>
                                        <p style="color: #a1a1aa; margin: 5px 0 0; font-size: 18px; font-weight: 500; text-decoration: line-through;">%s</p>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding: 15px 20px;">
                                        <p style="color: #71717a; margin: 0; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">%s</p>
                                        <p style="color: #a1a1aa; margin: 5px 0 0; font-size: 18px; font-weight: 500; text-decoration: line-through;">%s - %s</p>
                                    </td>
                                </tr>
                            </table>
                            <p style="color: #a1a1aa; line-height: 1.8; font-size: 14px; padding: 15px; background-color: #27272a; border-radius: 8px; border-left: 4px solid #71717a;">%s</p>
                            <p style="color: #a1a1aa; line-height: 1.8; font-size: 16px; margin-top: 30px;">%s,<br><span style="color: #84cc16; font-weight: 500;">Bebe</span></p>
                        </td>
                    </tr>
                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #0a0a0a; padding: 25px 30px; text-align: center; border-top: 1px solid #27272a;">
                            <p style="color: #71717a; font-size: 13px; margin: 0;">
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

// SendHTML sends an email with custom HTML (public method for gallery service)
func (es *EmailService) SendHTML(to, subject, html string) error {
	return es.sendEmail(to, subject, html)
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
