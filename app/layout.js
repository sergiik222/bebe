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
        <body className="scroll-smooth">
        <Providers>
            <Navigation />
            {children}
            <footer className="py-8 border-t border-zinc-800/50">
                <p className="text-center text-sm text-gray-500 font_regular">&copy; 2025 Bebe Media</p>
            </footer>
            <CookieBanner />
        </Providers>
        <ScrollToTopButton />
        </body>
        </html>
    )
}
