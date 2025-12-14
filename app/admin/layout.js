export const metadata = {
    title: 'Admin Panel - Bebe Media',
    description: 'Admin panel for managing client galleries',
}

export default function AdminLayout({ children }) {
    return (
        <div className="min-h-screen bg-zinc-950 text-gray-200">
            {children}
        </div>
    )
}
