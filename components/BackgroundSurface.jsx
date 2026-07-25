'use client'

// Placeholder surface. Each bg/* branch replaces this file with one of the
// four candidate treatments; this base keeps the app runnable on its own.
export default function BackgroundSurface() {
    return (
        <div
            className="fixed inset-0 z-0 pointer-events-none overflow-hidden"
            style={{ backgroundColor: '#101216' }}
        />
    );
}
