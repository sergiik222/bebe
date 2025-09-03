
'use client'

import MediaComponent from "@/components/home/MediaComponent";

export default function LandingPage() {
    return (
        <div className="relative w-full min-h-screen font-roboto text-gray-200">
            <div className="absolute inset-0 h-full w-full bg-background-gradient z-0"/>
            <div className="absolute inset-0 h-full w-full bg-lines-overlay bg-repeat opacity-80 z-0"/>
            <div className="relative z-10">
                <MediaComponent/>
            </div>
        </div>
    )
}
