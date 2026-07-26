'use client';

import { useLanguage } from '../../lib/LanguageContext';

const privacyContent = {
    en: {
        title: 'Privacy Policy',
        intro: 'We take the protection of your personal data very seriously. We treat your personal data confidentially and in accordance with the statutory data protection regulations and this privacy policy.',
        sections: [
            {
                title: '1. Controller',
                content: `The controller responsible for data processing on this website is:

Bebe Media
[OWNER NAME]
[STREET ADDRESS]
[POSTAL CODE] [CITY]
Austria

Email: info@bebemedia.at
Phone: [+43 XXX XXXXXXX]`
            },
            {
                title: '2. Data Collection on Our Website',
                content: `**Server Log Files**
The website provider automatically collects and stores information in so-called server log files, which your browser automatically transmits to us. These are:
- Browser type and browser version
- Operating system used
- Referrer URL
- Host name of the accessing computer
- Time of the server request
- IP address

This data cannot be attributed to specific persons. This data is not merged with other data sources.

**Contact Form / Booking Form**
When you contact us via contact form or booking form, we collect the following data:
- Name
- Email address
- Phone number (optional)
- Message content
- Preferred language
- Booking date and time (for bookings)

This data is sent directly to us via email and is not stored on our servers. We use this data exclusively to process your inquiry or booking and will not pass it on to third parties.`
            },
            {
                title: '3. Cookies',
                content: `Our website uses cookies. Cookies are small text files that are stored on your device.

**Essential Cookies**
We use essential cookies that are necessary for the operation of the website. These include:
- Session cookies for user authentication (Admin area)
- Cookie consent preferences

**Analytics Cookies (optional)**
With your consent, we use analytics cookies to analyze website usage and improve our services. You can adjust your cookie preferences at any time via the cookie settings in the footer.

You can configure your browser to inform you about the setting of cookies and only allow cookies in individual cases, exclude the acceptance of cookies for certain cases or in general, and activate the automatic deletion of cookies when closing the browser.`
            },
            {
                title: '4. Purpose of Data Processing',
                content: `We process your data for the following purposes:
- To process your contact inquiries
- To process and manage bookings
- To deliver photos and videos via our client gallery
- To improve our website and services
- To comply with legal obligations`
            },
            {
                title: '5. Data Retention',
                content: `Contact and booking data is sent directly to us via email and is not stored on our servers.

- Gallery data: Until expiration of the gallery link or upon request
- Cookie preferences: Stored locally in your browser`
            },
            {
                title: '6. Your Rights',
                content: `Under the GDPR, you have the following rights:
- **Right of access** (Art. 15 GDPR): You can request information about your stored data.
- **Right to rectification** (Art. 16 GDPR): You can request the correction of incorrect data.
- **Right to erasure** (Art. 17 GDPR): You can request the deletion of your data.
- **Right to restriction** (Art. 18 GDPR): You can request the restriction of processing.
- **Right to data portability** (Art. 20 GDPR): You can request your data in a machine-readable format.
- **Right to object** (Art. 21 GDPR): You can object to the processing of your data.

To exercise these rights, please contact us at info@bebemedia.at.`
            },
            {
                title: '7. Data Security',
                content: `We use SSL/TLS encryption for all data transmissions. Your data is stored on secure servers and protected against unauthorized access.`
            },
            {
                title: '8. Right to Lodge a Complaint',
                content: `If you believe that the processing of your personal data violates data protection law, you have the right to lodge a complaint with the Austrian Data Protection Authority:

Österreichische Datenschutzbehörde
Barichgasse 40-42
1030 Vienna
Email: dsb@dsb.gv.at
Website: https://www.dsb.gv.at`
            },
            {
                title: '9. Changes to This Privacy Policy',
                content: `We reserve the right to update this privacy policy to reflect changes in our practices or for other operational, legal, or regulatory reasons. The current version is always available on our website.

Last updated: December 2025`
            }
        ]
    },
    de: {
        title: 'Datenschutzerklärung',
        intro: 'Wir nehmen den Schutz Ihrer persönlichen Daten sehr ernst. Wir behandeln Ihre personenbezogenen Daten vertraulich und entsprechend der gesetzlichen Datenschutzvorschriften sowie dieser Datenschutzerklärung.',
        sections: [
            {
                title: '1. Verantwortlicher',
                content: `Der Verantwortliche für die Datenverarbeitung auf dieser Website ist:

Bebe Media
[INHABERNAME]
[STRASSE]
[PLZ] [ORT]
Österreich

E-Mail: info@bebemedia.at
Telefon: [+43 XXX XXXXXXX]`
            },
            {
                title: '2. Datenerfassung auf unserer Website',
                content: `**Server-Log-Dateien**
Der Provider der Seiten erhebt und speichert automatisch Informationen in so genannten Server-Log-Dateien, die Ihr Browser automatisch an uns übermittelt. Dies sind:
- Browsertyp und Browserversion
- Verwendetes Betriebssystem
- Referrer URL
- Hostname des zugreifenden Rechners
- Uhrzeit der Serveranfrage
- IP-Adresse

Diese Daten sind nicht bestimmten Personen zuordenbar. Eine Zusammenführung dieser Daten mit anderen Datenquellen wird nicht vorgenommen.

**Kontaktformular / Buchungsformular**
Wenn Sie uns per Kontaktformular oder Buchungsformular kontaktieren, erheben wir folgende Daten:
- Name
- E-Mail-Adresse
- Telefonnummer (optional)
- Nachrichteninhalt
- Bevorzugte Sprache
- Buchungsdatum und -zeit (bei Buchungen)

Diese Daten werden direkt per E-Mail an uns gesendet und nicht auf unseren Servern gespeichert. Wir verwenden diese Daten ausschließlich zur Bearbeitung Ihrer Anfrage oder Buchung und geben sie nicht an Dritte weiter.`
            },
            {
                title: '3. Cookies',
                content: `Unsere Website verwendet Cookies. Cookies sind kleine Textdateien, die auf Ihrem Endgerät gespeichert werden.

**Essenzielle Cookies**
Wir verwenden essenzielle Cookies, die für den Betrieb der Website notwendig sind. Dazu gehören:
- Session-Cookies für die Benutzerauthentifizierung (Admin-Bereich)
- Cookie-Einstellungen

**Analyse-Cookies (optional)**
Mit Ihrer Einwilligung verwenden wir Analyse-Cookies, um die Websitenutzung zu analysieren und unsere Dienste zu verbessern. Sie können Ihre Cookie-Einstellungen jederzeit über die Cookie-Einstellungen im Footer anpassen.

Sie können Ihren Browser so einstellen, dass Sie über das Setzen von Cookies informiert werden und Cookies nur im Einzelfall erlauben, die Annahme von Cookies für bestimmte Fälle oder generell ausschließen sowie das automatische Löschen der Cookies beim Schließen des Browsers aktivieren.`
            },
            {
                title: '4. Zweck der Datenverarbeitung',
                content: `Wir verarbeiten Ihre Daten zu folgenden Zwecken:
- Zur Bearbeitung Ihrer Kontaktanfragen
- Zur Bearbeitung und Verwaltung von Buchungen
- Zur Bereitstellung von Fotos und Videos über unsere Kunden-Galerie
- Zur Verbesserung unserer Website und Dienste
- Zur Erfüllung gesetzlicher Verpflichtungen`
            },
            {
                title: '5. Datenspeicherung',
                content: `Kontakt- und Buchungsdaten werden direkt per E-Mail an uns gesendet und nicht auf unseren Servern gespeichert.

- Galerie-Daten: Bis zum Ablauf des Galerie-Links oder auf Anfrage
- Cookie-Einstellungen: Lokal in Ihrem Browser gespeichert`
            },
            {
                title: '6. Ihre Rechte',
                content: `Nach der DSGVO haben Sie folgende Rechte:
- **Auskunftsrecht** (Art. 15 DSGVO): Sie können Auskunft über Ihre gespeicherten Daten verlangen.
- **Recht auf Berichtigung** (Art. 16 DSGVO): Sie können die Berichtigung unrichtiger Daten verlangen.
- **Recht auf Löschung** (Art. 17 DSGVO): Sie können die Löschung Ihrer Daten verlangen.
- **Recht auf Einschränkung** (Art. 18 DSGVO): Sie können die Einschränkung der Verarbeitung verlangen.
- **Recht auf Datenübertragbarkeit** (Art. 20 DSGVO): Sie können Ihre Daten in einem maschinenlesbaren Format anfordern.
- **Widerspruchsrecht** (Art. 21 DSGVO): Sie können der Verarbeitung Ihrer Daten widersprechen.

Um diese Rechte auszuüben, kontaktieren Sie uns bitte unter info@bebemedia.at.`
            },
            {
                title: '7. Datensicherheit',
                content: `Wir verwenden SSL/TLS-Verschlüsselung für alle Datenübertragungen. Ihre Daten werden auf sicheren Servern gespeichert und vor unbefugtem Zugriff geschützt.`
            },
            {
                title: '8. Beschwerderecht',
                content: `Wenn Sie der Ansicht sind, dass die Verarbeitung Ihrer personenbezogenen Daten gegen das Datenschutzrecht verstößt, haben Sie das Recht, eine Beschwerde bei der österreichischen Datenschutzbehörde einzureichen:

Österreichische Datenschutzbehörde
Barichgasse 40-42
1030 Wien
E-Mail: dsb@dsb.gv.at
Website: https://www.dsb.gv.at`
            },
            {
                title: '9. Änderungen dieser Datenschutzerklärung',
                content: `Wir behalten uns das Recht vor, diese Datenschutzerklärung zu aktualisieren, um Änderungen in unseren Praktiken oder aus anderen betrieblichen, rechtlichen oder regulatorischen Gründen widerzuspiegeln. Die aktuelle Version ist immer auf unserer Website verfügbar.

Stand: Dezember 2025`
            }
        ]
    },
    ru: {
        title: 'Политика конфиденциальности',
        intro: 'Мы очень серьезно относимся к защите ваших персональных данных. Мы обрабатываем ваши персональные данные конфиденциально и в соответствии с законодательными нормами о защите данных и настоящей политикой конфиденциальности.',
        sections: [
            {
                title: '1. Ответственный',
                content: `Ответственным за обработку данных на этом сайте является:

Bebe Media
[ИМЯ ВЛАДЕЛЬЦА]
[УЛИЦА]
[ИНДЕКС] [ГОРОД]
Австрия

Email: info@bebemedia.at
Телефон: [+43 XXX XXXXXXX]`
            },
            {
                title: '2. Сбор данных на нашем сайте',
                content: `**Файлы журнала сервера**
Провайдер сайта автоматически собирает и хранит информацию в так называемых файлах журнала сервера, которые ваш браузер автоматически передает нам. Это:
- Тип и версия браузера
- Используемая операционная система
- URL-адрес реферера
- Имя хоста обращающегося компьютера
- Время запроса к серверу
- IP-адрес

Эти данные не могут быть отнесены к конкретным лицам. Эти данные не объединяются с другими источниками данных.

**Контактная форма / Форма бронирования**
Когда вы связываетесь с нами через контактную форму или форму бронирования, мы собираем следующие данные:
- Имя
- Адрес электронной почты
- Номер телефона (необязательно)
- Содержание сообщения
- Предпочтительный язык
- Дата и время бронирования (для бронирований)

Эти данные отправляются нам напрямую по электронной почте и не хранятся на наших серверах. Мы используем эти данные исключительно для обработки вашего запроса или бронирования и не передаем их третьим лицам.`
            },
            {
                title: '3. Файлы cookie',
                content: `Наш сайт использует файлы cookie. Cookie — это небольшие текстовые файлы, которые хранятся на вашем устройстве.

**Необходимые cookie**
Мы используем необходимые cookie, которые необходимы для работы сайта. К ним относятся:
- Сессионные cookie для аутентификации пользователей (область администратора)
- Настройки согласия на cookie

**Аналитические cookie (необязательно)**
С вашего согласия мы используем аналитические cookie для анализа использования сайта и улучшения наших услуг. Вы можете изменить настройки cookie в любое время через настройки cookie в нижней части страницы.

Вы можете настроить свой браузер так, чтобы получать уведомления об установке cookie и разрешать cookie только в отдельных случаях, исключать принятие cookie для определенных случаев или в целом, а также активировать автоматическое удаление cookie при закрытии браузера.`
            },
            {
                title: '4. Цели обработки данных',
                content: `Мы обрабатываем ваши данные для следующих целей:
- Для обработки ваших контактных запросов
- Для обработки и управления бронированиями
- Для предоставления фотографий и видео через нашу клиентскую галерею
- Для улучшения нашего сайта и услуг
- Для выполнения юридических обязательств`
            },
            {
                title: '5. Хранение данных',
                content: `Контактные данные и данные бронирования отправляются нам напрямую по электронной почте и не хранятся на наших серверах.

- Данные галереи: До истечения срока действия ссылки на галерею или по запросу
- Настройки cookie: Хранятся локально в вашем браузере`
            },
            {
                title: '6. Ваши права',
                content: `Согласно GDPR, у вас есть следующие права:
- **Право на доступ** (ст. 15 GDPR): Вы можете запросить информацию о ваших сохраненных данных.
- **Право на исправление** (ст. 16 GDPR): Вы можете запросить исправление неверных данных.
- **Право на удаление** (ст. 17 GDPR): Вы можете запросить удаление ваших данных.
- **Право на ограничение** (ст. 18 GDPR): Вы можете запросить ограничение обработки.
- **Право на переносимость данных** (ст. 20 GDPR): Вы можете запросить ваши данные в машиночитаемом формате.
- **Право на возражение** (ст. 21 GDPR): Вы можете возразить против обработки ваших данных.

Для реализации этих прав свяжитесь с нами по адресу info@bebemedia.at.`
            },
            {
                title: '7. Безопасность данных',
                content: `Мы используем SSL/TLS шифрование для всех передач данных. Ваши данные хранятся на защищенных серверах и защищены от несанкционированного доступа.`
            },
            {
                title: '8. Право на подачу жалобы',
                content: `Если вы считаете, что обработка ваших персональных данных нарушает законодательство о защите данных, вы имеете право подать жалобу в Австрийский орган по защите данных:

Österreichische Datenschutzbehörde
Barichgasse 40-42
1030 Vienna
Email: dsb@dsb.gv.at
Сайт: https://www.dsb.gv.at`
            },
            {
                title: '9. Изменения в политике конфиденциальности',
                content: `Мы оставляем за собой право обновлять эту политику конфиденциальности для отражения изменений в нашей практике или по другим операционным, юридическим или нормативным причинам. Актуальная версия всегда доступна на нашем сайте.

Последнее обновление: декабрь 2025`
            }
        ]
    }
};

export default function DatenschutzPage() {
    const { language } = useLanguage();
    const t = privacyContent[language] || privacyContent.de;

    return (
        <div className="min-h-screen py-20 px-4">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-4xl font-light mb-8 text-center text-[var(--accent-color)]">{t.title}</h1>

                <p className="text-secondary-text mb-12 text-center leading-relaxed">{t.intro}</p>

                <div className="space-y-8">
                    {t.sections.map((section, index) => (
                        <section key={index} className="bg-surface/50 border border-line rounded-xl p-6">
                            <h2 className="text-xl font-medium text-primary-text mb-4">{section.title}</h2>
                            <div className="text-secondary-text leading-relaxed whitespace-pre-line">
                                {section.content.split('**').map((part, i) =>
                                    i % 2 === 1 ? <strong key={i} className="text-primary-text">{part}</strong> : part
                                )}
                            </div>
                        </section>
                    ))}
                </div>
            </div>
        </div>
    );
}
