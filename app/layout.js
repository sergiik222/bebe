// app/layout.js
import './globals.css'
import Navigation from '@/components/navigation/Navigation'
import Providers from '@/utils/providers'
import ScrollToTopButton from '@/components/navigation/scrollToTheTop'

export const metadata = {
    title: 'My Portfolio',
    description: 'Portfolio site',
}

export default function RootLayout({ children }) {
    return (
        <html lang="en">
        <body className="scroll-smooth">
        <Providers>
            <Navigation />
            {children}
            <footer className="py-16 bg-bottom-grad">
                <p className="text-center text-secondary-text">&copy; 2024 My Portfolio</p>
            </footer>
        </Providers>
        <ScrollToTopButton />
        </body>
        </html>
    )
}
