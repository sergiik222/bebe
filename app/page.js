// app/page.js
'use client'
import Home from '@/app/home/page'
import About from '@/app/about/page'
import CostEstimator from '@/app/cost/page'
import Booking from '@/app/book/page'
import Contact from '@/app/contact/page'

export default function LandingPage() {
    return (
        <div className="relative w-full min-h-screen font-roboto text-gray-200">
            <div className="absolute inset-0 h-full w-full bg-background-gradient z-0"/>
            <div className="absolute inset-0 h-full w-full bg-lines-overlay bg-repeat opacity-80 z-0"/>
            <div className="relative z-10 flex flex-col">
                <section id="home" className="min-h-screen"><Home/></section>
                <section id="about" className="min-h-screen"><About/></section>
                <section id="cost" className="min-h-screen"><CostEstimator/></section>
                <section id="book" className="min-h-screen"><Booking/></section>
                <section id="contact" className="min-h-screen"><Contact/></section>
            </div>
        </div>
    )
}
