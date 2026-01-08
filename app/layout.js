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
        <body className="scroll-smooth bg-[#101216] text-gray-200">
        {/* Global camera lens pattern background */}
        <div
            className="fixed inset-0 w-full h-full z-0 pointer-events-none"
            style={{
                backgroundImage: `
                    radial-gradient(circle at 30% 40%, rgba(6, 182, 212, 0.08) 0%, transparent 40%),
                    radial-gradient(circle at 70% 60%, rgba(139, 92, 246, 0.06) 0%, transparent 40%),
                    linear-gradient(135deg, rgba(20, 24, 30, 0.8) 0%, rgba(16, 18, 22, 0.9) 25%, rgba(18, 20, 24, 0.8) 50%, rgba(14, 16, 20, 0.9) 75%, rgba(16, 18, 22, 0.8) 100%),
                    url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Cg fill='none' stroke='%2306b6d4' stroke-opacity='0.15'%3E%3Ccircle cx='50' cy='50' r='45' stroke-width='1'/%3E%3Ccircle cx='50' cy='50' r='35' stroke-width='1'/%3E%3Ccircle cx='50' cy='50' r='25' stroke-width='1'/%3E%3Ccircle cx='50' cy='50' r='15' stroke-width='1'/%3E%3Ccircle cx='50' cy='50' r='5' stroke-width='1'/%3E%3Cline x1='50' y1='5' x2='50' y2='95' stroke-width='0.5' stroke-opacity='0.1'/%3E%3Cline x1='5' y1='50' x2='95' y2='50' stroke-width='0.5' stroke-opacity='0.1'/%3E%3Cline x1='14.6' y1='14.6' x2='85.4' y2='85.4' stroke-width='0.5' stroke-opacity='0.1'/%3E%3Cline x1='85.4' y1='14.6' x2='14.6' y2='85.4' stroke-width='0.5' stroke-opacity='0.1'/%3E%3C/g%3E%3C/svg%3E")
                `,
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
