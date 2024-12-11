'use client'
import MediaComponent from "@/components/MediaComponent";

export default function Home() {
    return (
        <div className="bg-background-gradient text-gray-200 font-roboto flex flex-col w-full h-screen">
            <main>
                <section>
                    <MediaComponent />
                </section>
            </main>
        </div>
    );
}

