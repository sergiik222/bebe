'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useMenu } from '@/lib/MenuContext';
import { useLanguage } from '@/lib/LanguageContext';

const PortfolioButton = () => {
    const pathname = usePathname();
    const { isMenuOpen } = useMenu();
    const { t } = useLanguage();

    // Don't show on portfolio pages
    if (pathname?.startsWith('/portfolio')) {
        return null;
    }

    return (
        <div className={`fixed top-6 right-16 md:right-20 z-40 transition-opacity duration-300 ${isMenuOpen ? 'opacity-0 pointer-events-none md:opacity-100 md:pointer-events-auto' : 'opacity-100'}`}>
            <Link
                href="/portfolio"
                className="flex items-center justify-center px-3 md:px-4 h-10 bg-surface/80 backdrop-blur-sm border border-line-strong rounded-lg text-secondary-text hover:border-[var(--accent-color)] hover:text-[var(--accent-color)] transition-colors text-xs md:text-sm font-medium"
            >
                {t.nav.portfolio}
            </Link>
        </div>
    );
};

export default PortfolioButton;
