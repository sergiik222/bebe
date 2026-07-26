export const metadata = {
    title: 'Admin Panel - Bebe Media',
    description: 'Admin panel for managing client galleries',
}

export default function AdminLayout({ children }) {
    return (
        <div className="min-h-screen bg-page text-primary-text">
            {children}
        </div>
    )
}
