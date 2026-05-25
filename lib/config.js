// Centralized client-side configuration. Import these constants instead of
// re-deriving them from process.env in every component.

export const BACKEND_URL =
    process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080';

// Bunny CDN public hostname (e.g. "bebe-cdn.b-cdn.net"). Safe to expose.
export const CDN_HOSTNAME = process.env.NEXT_PUBLIC_BUNNY_CDN_HOSTNAME || '';
export const CDN_URL = CDN_HOSTNAME ? `https://${CDN_HOSTNAME}` : '';

// Map UI language codes to BCP-47 locales used by Intl APIs.
const LOCALE_BY_LANGUAGE = {
    en: 'en-US',
    de: 'de-DE',
    ru: 'ru-RU',
    uk: 'uk-UA',
};

export const getLocale = (language) =>
    LOCALE_BY_LANGUAGE[language] || LOCALE_BY_LANGUAGE.en;
