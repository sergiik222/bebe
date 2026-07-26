'use client';

import { useLanguage } from '../../lib/LanguageContext';

const agbContent = {
    en: {
        title: 'Terms and Conditions',
        intro: 'These General Terms and Conditions apply to all services provided by Bebe Media.',
        sections: [
            {
                title: '1. Scope of Application',
                content: `These General Terms and Conditions (GTC) apply to all contracts for photography and videography services between Bebe Media (hereinafter "Provider") and the client (hereinafter "Client").

Deviating terms of the Client are not recognized unless the Provider expressly agrees to their validity in writing.`
            },
            {
                title: '2. Services',
                content: `The scope of services is determined by the individual agreement between the Provider and the Client.

Services typically include:
- Photography and/or videography at the agreed location and time
- Professional editing of the images/videos
- Delivery of the finished materials via online gallery

The exact scope, duration, and delivery format will be specified in the individual offer or booking confirmation.`
            },
            {
                title: '3. Booking and Contract Formation',
                content: `A contract is formed upon written confirmation of the booking by the Provider (via email or booking system).

The Client receives a booking confirmation with all relevant details including:
- Date and time
- Location
- Scope of services
- Price

A booking is considered binding after receipt of the deposit payment.`
            },
            {
                title: '4. Prices and Payment',
                content: `All prices are in Euros and include the statutory VAT where applicable.

**Deposit**
A deposit of [DEPOSIT_AMOUNT]% of the total price is due upon booking to secure the date.

**Final Payment**
The remaining amount is due [PAYMENT_TERMS] before the shooting date / upon delivery of the materials.

**Payment Methods**
Payment can be made via bank transfer to the account specified in the invoice.`
            },
            {
                title: '5. Cancellation and Rescheduling',
                content: `**Cancellation by the Client**
- Up to [DAYS_1] days before the appointment: Full refund of the deposit
- [DAYS_2] to [DAYS_1] days before the appointment: 50% of the deposit will be retained
- Less than [DAYS_2] days before the appointment: The deposit will be fully retained
- No-show without cancellation: Full price is due

**Rescheduling**
Rescheduling is possible free of charge up to [DAYS_1] days before the appointment, subject to availability.

**Cancellation by the Provider**
In the event of cancellation by the Provider (e.g., due to illness), the Client will receive a full refund of all payments made or an alternative date will be offered.`
            },
            {
                title: '6. Image Rights and Usage',
                content: `**Client's Rights**
The Client receives the right to use the delivered images/videos for private purposes. Commercial use requires a separate agreement.

**Provider's Rights**
The Provider retains the copyright to all images and videos. The Provider reserves the right to use the materials for their own marketing purposes (portfolio, website, social media) unless expressly prohibited by the Client in writing.

**Image Editing**
The Client is not permitted to edit, alter, or use filters on the delivered images without the Provider's consent.`
            },
            {
                title: '7. Delivery',
                content: `The edited images/videos will be delivered via a secure online gallery within [DELIVERY_TIME] after the shooting date.

The gallery link is valid for [GALLERY_VALID] days. After this period, the files may be deleted from the server.

The Client is responsible for downloading and backing up the files within this period.`
            },
            {
                title: '8. Liability',
                content: `The Provider is liable for damages only in cases of intent or gross negligence.

Liability for slight negligence is excluded, except for damages arising from injury to life, body, or health.

The Provider is not liable for:
- Loss or damage to the Client's personal belongings during the shoot
- Events beyond the Provider's control (force majeure, weather conditions for outdoor shoots)
- Technical failures that are not within the Provider's control`
            },
            {
                title: '9. Confidentiality',
                content: `The Provider treats all personal information of the Client confidentially and in accordance with the applicable data protection regulations.

Details can be found in our Privacy Policy.`
            },
            {
                title: '10. Final Provisions',
                content: `Austrian law applies exclusively.

The place of jurisdiction is [CITY], Austria.

Should individual provisions of these GTC be or become invalid, this shall not affect the validity of the remaining provisions.

Last updated: December 2025`
            }
        ]
    },
    de: {
        title: 'Allgemeine Geschäftsbedingungen',
        intro: 'Diese Allgemeinen Geschäftsbedingungen gelten für alle von Bebe Media erbrachten Dienstleistungen.',
        sections: [
            {
                title: '1. Geltungsbereich',
                content: `Diese Allgemeinen Geschäftsbedingungen (AGB) gelten für alle Verträge über Fotografie- und Videografie-Dienstleistungen zwischen Bebe Media (nachfolgend "Anbieter") und dem Auftraggeber (nachfolgend "Kunde").

Abweichende Bedingungen des Kunden werden nicht anerkannt, es sei denn, der Anbieter stimmt ihrer Geltung ausdrücklich schriftlich zu.`
            },
            {
                title: '2. Leistungen',
                content: `Der Umfang der Leistungen ergibt sich aus der individuellen Vereinbarung zwischen Anbieter und Kunde.

Zu den Leistungen gehören in der Regel:
- Fotografie und/oder Videografie am vereinbarten Ort und zur vereinbarten Zeit
- Professionelle Bearbeitung der Bilder/Videos
- Lieferung der fertigen Materialien über eine Online-Galerie

Der genaue Umfang, die Dauer und das Lieferformat werden im individuellen Angebot oder der Buchungsbestätigung festgelegt.`
            },
            {
                title: '3. Buchung und Vertragsschluss',
                content: `Ein Vertrag kommt durch schriftliche Bestätigung der Buchung durch den Anbieter (per E-Mail oder Buchungssystem) zustande.

Der Kunde erhält eine Buchungsbestätigung mit allen relevanten Details:
- Datum und Uhrzeit
- Ort
- Leistungsumfang
- Preis

Eine Buchung gilt nach Eingang der Anzahlung als verbindlich.`
            },
            {
                title: '4. Preise und Zahlung',
                content: `Alle Preise verstehen sich in Euro und beinhalten die gesetzliche Mehrwertsteuer, sofern anwendbar.

**Anzahlung**
Bei der Buchung ist eine Anzahlung von [DEPOSIT_AMOUNT]% des Gesamtpreises zur Sicherung des Termins fällig.

**Restzahlung**
Der Restbetrag ist [PAYMENT_TERMS] vor dem Shooting-Termin / bei Lieferung der Materialien fällig.

**Zahlungsarten**
Die Zahlung kann per Banküberweisung auf das in der Rechnung angegebene Konto erfolgen.`
            },
            {
                title: '5. Stornierung und Terminverschiebung',
                content: `**Stornierung durch den Kunden**
- Bis [DAYS_1] Tage vor dem Termin: Vollständige Rückerstattung der Anzahlung
- [DAYS_2] bis [DAYS_1] Tage vor dem Termin: 50% der Anzahlung werden einbehalten
- Weniger als [DAYS_2] Tage vor dem Termin: Die Anzahlung wird vollständig einbehalten
- Nichterscheinen ohne Absage: Der volle Preis ist fällig

**Terminverschiebung**
Eine Terminverschiebung ist bis [DAYS_1] Tage vor dem Termin kostenlos möglich, vorbehaltlich der Verfügbarkeit.

**Stornierung durch den Anbieter**
Im Falle einer Stornierung durch den Anbieter (z.B. wegen Krankheit) erhält der Kunde eine vollständige Rückerstattung aller geleisteten Zahlungen oder es wird ein Alternativtermin angeboten.`
            },
            {
                title: '6. Bildrechte und Nutzung',
                content: `**Rechte des Kunden**
Der Kunde erhält das Recht, die gelieferten Bilder/Videos für private Zwecke zu nutzen. Eine kommerzielle Nutzung bedarf einer gesonderten Vereinbarung.

**Rechte des Anbieters**
Der Anbieter behält das Urheberrecht an allen Bildern und Videos. Der Anbieter behält sich das Recht vor, die Materialien für eigene Marketingzwecke zu verwenden (Portfolio, Website, Social Media), sofern dies nicht ausdrücklich schriftlich vom Kunden untersagt wird.

**Bildbearbeitung**
Der Kunde ist nicht berechtigt, die gelieferten Bilder ohne Zustimmung des Anbieters zu bearbeiten, zu verändern oder mit Filtern zu versehen.`
            },
            {
                title: '7. Lieferung',
                content: `Die bearbeiteten Bilder/Videos werden innerhalb von [DELIVERY_TIME] nach dem Shooting-Termin über eine sichere Online-Galerie geliefert.

Der Galerie-Link ist [GALLERY_VALID] Tage gültig. Nach Ablauf dieser Frist können die Dateien vom Server gelöscht werden.

Der Kunde ist dafür verantwortlich, die Dateien innerhalb dieses Zeitraums herunterzuladen und zu sichern.`
            },
            {
                title: '8. Haftung',
                content: `Der Anbieter haftet für Schäden nur bei Vorsatz oder grober Fahrlässigkeit.

Die Haftung für leichte Fahrlässigkeit ist ausgeschlossen, außer bei Schäden aus der Verletzung des Lebens, des Körpers oder der Gesundheit.

Der Anbieter haftet nicht für:
- Verlust oder Beschädigung persönlicher Gegenstände des Kunden während des Shootings
- Ereignisse außerhalb der Kontrolle des Anbieters (höhere Gewalt, Wetterbedingungen bei Outdoor-Shootings)
- Technische Ausfälle, die nicht im Einflussbereich des Anbieters liegen`
            },
            {
                title: '9. Vertraulichkeit',
                content: `Der Anbieter behandelt alle persönlichen Informationen des Kunden vertraulich und gemäß den geltenden Datenschutzbestimmungen.

Details finden Sie in unserer Datenschutzerklärung.`
            },
            {
                title: '10. Schlussbestimmungen',
                content: `Es gilt ausschließlich österreichisches Recht.

Gerichtsstand ist [CITY], Österreich.

Sollten einzelne Bestimmungen dieser AGB unwirksam sein oder werden, berührt dies die Wirksamkeit der übrigen Bestimmungen nicht.

Stand: Dezember 2025`
            }
        ]
    },
    ru: {
        title: 'Общие условия',
        intro: 'Настоящие Общие условия применяются ко всем услугам, предоставляемым Bebe Media.',
        sections: [
            {
                title: '1. Сфера применения',
                content: `Настоящие Общие условия (ОУ) применяются ко всем договорам на оказание услуг фотографии и видеосъемки между Bebe Media (далее "Исполнитель") и заказчиком (далее "Клиент").

Отклоняющиеся условия Клиента не признаются, если Исполнитель прямо не согласился с их действительностью в письменной форме.`
            },
            {
                title: '2. Услуги',
                content: `Объем услуг определяется индивидуальным соглашением между Исполнителем и Клиентом.

Услуги обычно включают:
- Фотосъемку и/или видеосъемку в согласованном месте и в согласованное время
- Профессиональную обработку изображений/видео
- Доставку готовых материалов через онлайн-галерею

Точный объем, продолжительность и формат доставки указываются в индивидуальном предложении или подтверждении бронирования.`
            },
            {
                title: '3. Бронирование и заключение договора',
                content: `Договор заключается при письменном подтверждении бронирования Исполнителем (по электронной почте или через систему бронирования).

Клиент получает подтверждение бронирования со всеми соответствующими деталями:
- Дата и время
- Место
- Объем услуг
- Цена

Бронирование считается обязательным после получения предоплаты.`
            },
            {
                title: '4. Цены и оплата',
                content: `Все цены указаны в евро и включают НДС, где это применимо.

**Предоплата**
При бронировании для закрепления даты вносится предоплата в размере [DEPOSIT_AMOUNT]% от общей стоимости.

**Окончательный платеж**
Оставшаяся сумма должна быть оплачена [PAYMENT_TERMS] до даты съемки / при доставке материалов.

**Способы оплаты**
Оплата может быть произведена банковским переводом на счет, указанный в счете.`
            },
            {
                title: '5. Отмена и перенос',
                content: `**Отмена Клиентом**
- До [DAYS_1] дней до назначенной даты: Полный возврат предоплаты
- От [DAYS_2] до [DAYS_1] дней до назначенной даты: 50% предоплаты удерживается
- Менее чем за [DAYS_2] дней до назначенной даты: Предоплата удерживается полностью
- Неявка без отмены: Оплачивается полная стоимость

**Перенос**
Перенос возможен бесплатно до [DAYS_1] дней до назначенной даты при наличии свободных дат.

**Отмена Исполнителем**
В случае отмены Исполнителем (например, по болезни) Клиент получает полный возврат всех произведенных платежей или предлагается альтернативная дата.`
            },
            {
                title: '6. Права на изображения и использование',
                content: `**Права Клиента**
Клиент получает право использовать доставленные изображения/видео в личных целях. Коммерческое использование требует отдельного соглашения.

**Права Исполнителя**
Исполнитель сохраняет авторские права на все изображения и видео. Исполнитель оставляет за собой право использовать материалы в собственных маркетинговых целях (портфолио, веб-сайт, социальные сети), если это прямо не запрещено Клиентом в письменной форме.

**Редактирование изображений**
Клиент не имеет права редактировать, изменять или применять фильтры к доставленным изображениям без согласия Исполнителя.`
            },
            {
                title: '7. Доставка',
                content: `Обработанные изображения/видео будут доставлены через защищенную онлайн-галерею в течение [DELIVERY_TIME] после даты съемки.

Ссылка на галерею действительна в течение [GALLERY_VALID] дней. По истечении этого срока файлы могут быть удалены с сервера.

Клиент несет ответственность за загрузку и резервное копирование файлов в течение этого периода.`
            },
            {
                title: '8. Ответственность',
                content: `Исполнитель несет ответственность за ущерб только в случаях умысла или грубой небрежности.

Ответственность за легкую небрежность исключается, за исключением ущерба, возникшего в результате причинения вреда жизни, здоровью.

Исполнитель не несет ответственности за:
- Потерю или повреждение личных вещей Клиента во время съемки
- События, находящиеся вне контроля Исполнителя (форс-мажор, погодные условия при съемках на открытом воздухе)
- Технические сбои, не зависящие от Исполнителя`
            },
            {
                title: '9. Конфиденциальность',
                content: `Исполнитель обрабатывает всю личную информацию Клиента конфиденциально и в соответствии с применимыми правилами защиты данных.

Подробности можно найти в нашей Политике конфиденциальности.`
            },
            {
                title: '10. Заключительные положения',
                content: `Применяется исключительно австрийское право.

Местом юрисдикции является [CITY], Австрия.

Если отдельные положения настоящих ОУ являются или станут недействительными, это не влияет на действительность остальных положений.

Последнее обновление: декабрь 2025`
            }
        ]
    }
};

export default function AGBPage() {
    const { language } = useLanguage();
    const t = agbContent[language] || agbContent.de;

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
