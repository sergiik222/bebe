import Navigation from '../components/Navigation';
import MediaComponent from "@/components/MediaComponent";

export default function Home() {
    return (
        <div className="bg-gray-900 text-gray-200 font-roboto flex flex-col  w-full h-screen">
            <Navigation />
                 <main>
                        <section>
                           <MediaComponent />
                        </section>
                        <footer className="py-16">
                            <p className="text-center">&copy; 2024 My Portfolio</p>
                        </footer>
                    </main>
        </div>
    );
}