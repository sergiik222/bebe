
'use client'

import MediaComponent from "@/components/home/MediaComponent";

export default function LandingPage() {
    return (
        <div className="relative w-full min-h-screen font-roboto text-gray-200">
            <div
                className="absolute inset-0 h-full w-full z-0"
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
            <div className="relative z-10">
                <MediaComponent/>
            </div>
        </div>
    )
}
