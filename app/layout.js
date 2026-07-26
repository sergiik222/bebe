// app/layout.js
import './globals.css'
import { Montserrat } from 'next/font/google';
import Navigation from '@/components/navigation/Navigation'
import Providers from '@/utils/providers'
import ScrollToTopButton from '@/components/navigation/scrollToTheTop'
import CookieBanner from '@/components/CookieBanner'
import BackgroundSurface from '@/components/BackgroundSurface'

export const metadata = {
    title: 'My Portfolio',
    description: 'Portfolio site',
}

/* ========================================
   FONT CONFIGURATION
   To change the font:
   1. Import a different font from 'next/font/google'
   2. Update the font configuration below

   Examples:
   - import { Inter } from 'next/font/google';
   - import { Roboto } from 'next/font/google';
   - import { Montserrat } from 'next/font/google';
   - import { Exo_2 } from 'next/font/google';
   ======================================== */
const primaryFont = Montserrat({
    subsets: ['latin'],
    weight: ['400', '500', '600', '700'],
    variable: '--font-primary',
});

export default function RootLayout({ children }) {
    return (
        // suppressHydrationWarning: the inline script below sets data-theme on
        // <html> before React hydrates, so the server markup legitimately lacks
        // an attribute the client has.
        <html lang="en" className={primaryFont.variable} suppressHydrationWarning>
        <body className="scroll-smooth bg-page text-primary-text">
        {/* Applies a stored theme choice before anything paints. Without this a
            visitor whose saved choice differs from their OS setting would see
            the other theme flash first. */}
        <script
            dangerouslySetInnerHTML={{
                __html: `(function(){try{var t=localStorage.getItem('bebe_theme');if(t==='light'||t==='dark'){document.documentElement.setAttribute('data-theme',t);}}catch(e){}})();`
            }}
        />
        <BackgroundSurface />
        <Providers>
            <div className="relative z-10">
                <Navigation />
                {children}
                <footer className="py-8 border-t border-line/50">
                    <p className="text-center text-sm text-muted-text font_regular">&copy; 2025 Bebe Media</p>
                </footer>
                <CookieBanner />
            </div>
        </Providers>
        <ScrollToTopButton />
        </body>
        </html>
    )
}
