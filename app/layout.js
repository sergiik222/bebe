// app/layout.js
import './globals.css'
import { Exo_2 } from 'next/font/google';
import Navigation from '@/components/navigation/Navigation'
import Providers from '@/utils/providers'
import ScrollToTopButton from '@/components/navigation/scrollToTheTop'
import LanguageSelector from '@/components/LanguageSelector'
import PortfolioButton from '@/components/PortfolioButton'

export const metadata = {
    title: 'My Portfolio',
    description: 'Portfolio site',
}

const exo2 = Exo_2({
    subsets: ['latin'],
    weight: ['400', '700'], // Regular + Bold
    variable: '--font-exo2',
});

export default function RootLayout({ children }) {
    return (
        <html lang="en" className={exo2.variable}>
        <body className="scroll-smooth">
        <Providers>
            <Navigation />
            <PortfolioButton />
            <LanguageSelector />
            {children}
            <footer className="py-8 border-t border-zinc-800/50">
                <p className="text-center text-sm text-gray-500 font_regular">&copy; 2025 Portfolio</p>
            </footer>
        </Providers>
        <ScrollToTopButton />
        </body>
        </html>
    )
}
