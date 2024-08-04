export default function Hero() {
    return (
        <section className="h-screen bg-cover bg-center" style={{ backgroundImage: "url('/path/to/your/image.jpg')" }}>
            <div className="flex items-center justify-center h-full bg-black bg-opacity-50">
                <h1 className="text-white text-5xl font-playfair">Welcome to My Portfolio</h1>
            </div>
        </section>
    );
}