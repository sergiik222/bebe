// app/layout.js
import './globals.css'
import { Montserrat } from 'next/font/google';
import Navigation from '@/components/navigation/Navigation'
import Providers from '@/utils/providers'
import ScrollToTopButton from '@/components/navigation/scrollToTheTop'
import CookieBanner from '@/components/CookieBanner'

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
        <html lang="en" className={primaryFont.variable}>
        <body className="scroll-smooth bg-background text-primary-text">
        {/* Apothecary: warm bone surface with a faint brass radial bleed
            at the top-left. Forest-green type, brass accent. Aesop /
            herbarium mood. */}
        <div
            className="fixed inset-0 w-full h-full z-0 pointer-events-none"
            style={{
                backgroundImage:
                    'radial-gradient(circle at 25% 0%, rgba(138, 106, 58, 0.05) 0%, transparent 55%), linear-gradient(180deg, rgba(247,242,233,0.6) 0%, rgba(244,239,229,0.85) 50%, rgba(237,231,216,0.95) 100%)',
                backgroundAttachment: 'fixed'
            }}
        />
        <Providers>
            <div className="relative z-10">
                <Navigation />
                {children}
                <footer className="py-8 border-t border-zinc-800/50">
                    <p className="text-center text-sm text-gray-500 font_regular">&copy; 2025 Bebe Media</p>
                </footer>
                <CookieBanner />
            </div>
        </Providers>
        <ScrollToTopButton />
        </body>
        </html>
    )
}
