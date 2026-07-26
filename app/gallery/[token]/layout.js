export const metadata = {
    title: 'Your Gallery - Bebe Media',
    description: 'View and download your photos and videos',
}

export default function GalleryLayout({ children }) {
    return (
        <div className="min-h-screen bg-page text-primary-text">
            {children}
        </div>
    )
}
