'use client';

import { useLanguage } from '../../lib/LanguageContext';

const impressumContent = {
    en: {
        title: 'Imprint',
        infoTitle: 'Information according to § 5 ECG',
        company: 'Company Name',
        companyValue: 'Bebe Media',
        owner: 'Owner',
        ownerValue: '[OWNER NAME]',
        address: 'Address',
        addressValue: '[STREET ADDRESS]\n[POSTAL CODE] [CITY]\nAustria',
        contact: 'Contact',
        email: 'Email',
        phone: 'Phone',
        website: 'Website',
        uid: 'VAT ID',
        uidValue: '[ATU NUMBER]',
        businessRegister: 'Business Register',
        businessRegisterValue: '[FN NUMBER], [COURT]',
        chamber: 'Chamber Membership',
        chamberValue: 'Austrian Economic Chamber (WKO)',
        profession: 'Professional Regulations',
        professionValue: 'Trade regulations: www.ris.bka.gv.at',
        disputeResolution: 'EU Dispute Resolution',
        disputeResolutionText: 'According to the regulation on online dispute resolution in consumer matters (ODR Regulation), we inform you about the online dispute resolution platform (OS platform). Consumers have the opportunity to submit complaints to the online dispute resolution platform of the European Commission at',
        disputeResolutionLink: 'https://ec.europa.eu/consumers/odr/',
        liability: 'Liability for Content',
        liabilityText: 'The content of our website has been created with the greatest care. However, we cannot guarantee the accuracy, completeness, and timeliness of the content. As a service provider, we are responsible for our own content on these pages according to general laws. However, we are not obligated to monitor transmitted or stored third-party information or to investigate circumstances that indicate illegal activity.',
        copyright: 'Copyright',
        copyrightText: 'The content and works created by the site operators on these pages are subject to Austrian copyright law. Duplication, processing, distribution, and any kind of exploitation outside the limits of copyright require the written consent of the respective author or creator.',
    },
    de: {
        title: 'Impressum',
        infoTitle: 'Angaben gemäß § 5 ECG',
        company: 'Unternehmensname',
        companyValue: 'Bebe Media',
        owner: 'Inhaber',
        ownerValue: '[INHABERNAME]',
        address: 'Adresse',
        addressValue: '[STRASSE]\n[PLZ] [ORT]\nÖsterreich',
        contact: 'Kontakt',
        email: 'E-Mail',
        phone: 'Telefon',
        website: 'Webseite',
        uid: 'UID-Nummer',
        uidValue: '[ATU NUMMER]',
        businessRegister: 'Firmenbuchnummer',
        businessRegisterValue: '[FN NUMMER], [GERICHT]',
        chamber: 'Kammerzugehörigkeit',
        chamberValue: 'Wirtschaftskammer Österreich (WKO)',
        profession: 'Berufsrecht',
        professionValue: 'Gewerbeordnung: www.ris.bka.gv.at',
        disputeResolution: 'EU-Streitschlichtung',
        disputeResolutionText: 'Gemäß Verordnung über Online-Streitbeilegung in Verbraucherangelegenheiten (ODR-Verordnung) möchten wir Sie über die Online-Streitbeilegungsplattform (OS-Plattform) informieren. Verbraucher haben die Möglichkeit, Beschwerden an die Online-Streitbeilegungsplattform der Europäischen Kommission unter',
        disputeResolutionLink: 'https://ec.europa.eu/consumers/odr/',
        liability: 'Haftung für Inhalte',
        liabilityText: 'Die Inhalte unserer Seiten wurden mit größter Sorgfalt erstellt. Für die Richtigkeit, Vollständigkeit und Aktualität der Inhalte können wir jedoch keine Gewähr übernehmen. Als Diensteanbieter sind wir für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Wir sind jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen.',
        copyright: 'Urheberrecht',
        copyrightText: 'Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem österreichischen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers.',
    },
    ru: {
        title: 'Импрессум',
        infoTitle: 'Информация согласно § 5 ECG',
        company: 'Название компании',
        companyValue: 'Bebe Media',
        owner: 'Владелец',
        ownerValue: '[ИМЯ ВЛАДЕЛЬЦА]',
        address: 'Адрес',
        addressValue: '[УЛИЦА]\n[ИНДЕКС] [ГОРОД]\nАвстрия',
        contact: 'Контакт',
        email: 'Email',
        phone: 'Телефон',
        website: 'Вебсайт',
        uid: 'UID номер',
        uidValue: '[ATU НОМЕР]',
        businessRegister: 'Торговый реестр',
        businessRegisterValue: '[FN НОМЕР], [СУД]',
        chamber: 'Членство в палате',
        chamberValue: 'Австрийская экономическая палата (WKO)',
        profession: 'Профессиональные правила',
        professionValue: 'Торговые правила: www.ris.bka.gv.at',
        disputeResolution: 'Разрешение споров ЕС',
        disputeResolutionText: 'В соответствии с регламентом об онлайн-разрешении потребительских споров (ODR Regulation) мы информируем вас о платформе онлайн-разрешения споров (OS платформа). Потребители могут подавать жалобы на платформу онлайн-разрешения споров Европейской комиссии по адресу',
        disputeResolutionLink: 'https://ec.europa.eu/consumers/odr/',
        liability: 'Ответственность за контент',
        liabilityText: 'Содержание нашего сайта было создано с максимальной тщательностью. Однако мы не можем гарантировать точность, полноту и актуальность контента. Как поставщик услуг, мы несем ответственность за собственный контент на этих страницах в соответствии с общими законами. Однако мы не обязаны отслеживать переданную или сохраненную информацию третьих лиц.',
        copyright: 'Авторское право',
        copyrightText: 'Содержимое и работы, созданные операторами сайта на этих страницах, защищены австрийским авторским правом. Копирование, обработка, распространение и любое использование за пределами авторского права требуют письменного согласия соответствующего автора или создателя.',
    },
};

export default function ImpressumPage() {
    const { language } = useLanguage();
    const t = impressumContent[language] || impressumContent.de;

    return (
        <div className="min-h-screen py-20 px-4">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-4xl font-light mb-12 text-center text-[var(--accent-color)]">{t.title}</h1>

                <div className="space-y-8 text-gray-300">
                    {/* Basic Info */}
                    <section className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
                        <h2 className="text-xl font-medium text-white mb-4">{t.infoTitle}</h2>
                        <div className="space-y-3">
                            <div>
                                <span className="text-gray-500">{t.company}:</span>
                                <span className="ml-2 text-white">{t.companyValue}</span>
                            </div>
                            <div>
                                <span className="text-gray-500">{t.owner}:</span>
                                <span className="ml-2 text-white">{t.ownerValue}</span>
                            </div>
                            <div>
                                <span className="text-gray-500">{t.address}:</span>
                                <pre className="ml-2 text-white whitespace-pre-line inline">{t.addressValue}</pre>
                            </div>
                        </div>
                    </section>

                    {/* Contact */}
                    <section className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
                        <h2 className="text-xl font-medium text-white mb-4">{t.contact}</h2>
                        <div className="space-y-3">
                            <div>
                                <span className="text-gray-500">{t.email}:</span>
                                <a href="mailto:info@bebemedia.at" className="ml-2 text-[var(--accent-color)] hover:underline">info@bebemedia.at</a>
                            </div>
                            <div>
                                <span className="text-gray-500">{t.phone}:</span>
                                <span className="ml-2 text-white">[+43 XXX XXXXXXX]</span>
                            </div>
                            <div>
                                <span className="text-gray-500">{t.website}:</span>
                                <a href="https://bebemedia.at" className="ml-2 text-[var(--accent-color)] hover:underline">bebemedia.at</a>
                            </div>
                        </div>
                    </section>

                    {/* Business Info */}
                    <section className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
                        <h2 className="text-xl font-medium text-white mb-4">{t.uid}</h2>
                        <div className="space-y-3">
                            <div>
                                <span className="text-gray-500">{t.uid}:</span>
                                <span className="ml-2 text-white">{t.uidValue}</span>
                            </div>
                            <div>
                                <span className="text-gray-500">{t.businessRegister}:</span>
                                <span className="ml-2 text-white">{t.businessRegisterValue}</span>
                            </div>
                            <div>
                                <span className="text-gray-500">{t.chamber}:</span>
                                <span className="ml-2 text-white">{t.chamberValue}</span>
                            </div>
                        </div>
                    </section>

                    {/* EU Dispute Resolution */}
                    <section className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
                        <h2 className="text-xl font-medium text-white mb-4">{t.disputeResolution}</h2>
                        <p className="text-gray-400 leading-relaxed">
                            {t.disputeResolutionText}{' '}
                            <a href={t.disputeResolutionLink} target="_blank" rel="noopener noreferrer" className="text-[var(--accent-color)] hover:underline break-all">
                                {t.disputeResolutionLink}
                            </a>
                        </p>
                    </section>

                    {/* Liability */}
                    <section className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
                        <h2 className="text-xl font-medium text-white mb-4">{t.liability}</h2>
                        <p className="text-gray-400 leading-relaxed">{t.liabilityText}</p>
                    </section>

                    {/* Copyright */}
                    <section className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
                        <h2 className="text-xl font-medium text-white mb-4">{t.copyright}</h2>
                        <p className="text-gray-400 leading-relaxed">{t.copyrightText}</p>
                    </section>
                </div>
            </div>
        </div>
    );
}
