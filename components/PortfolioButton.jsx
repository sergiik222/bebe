'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const PortfolioButton = () => {
    const pathname = usePathname();

    // Don't show on portfolio pages
    if (pathname?.startsWith('/portfolio')) {
        return null;
    }

    return (
        <div className="fixed top-6 right-20 z-50">
            <Link
                href="/portfolio"
                className="flex items-center justify-center px-4 h-10 bg-zinc-900/80 backdrop-blur-sm border border-zinc-700 rounded-lg text-gray-300 hover:border-[var(--accent-color)] hover:text-[var(--accent-color)] transition-colors text-sm font-medium"
            >
                Portfolio
            </Link>
        </div>
    );
};

export default PortfolioButton;
