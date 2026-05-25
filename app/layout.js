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
        {/* Electric Cyan: two cyan radial bleeds over a near-pure black
            gradient. Blade-Runner neon-key-light atmosphere. */}
        <div
            className="fixed inset-0 w-full h-full z-0 pointer-events-none"
            style={{
                backgroundImage:
                    'radial-gradient(circle at 75% 10%, rgba(0, 229, 255, 0.07) 0%, transparent 50%), radial-gradient(circle at 20% 90%, rgba(0, 229, 255, 0.035) 0%, transparent 45%), linear-gradient(180deg, rgba(12,16,21,0.6) 0%, rgba(10,13,17,0.85) 50%, rgba(7,9,12,0.95) 100%)',
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
