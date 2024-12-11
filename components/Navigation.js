'use client'
import {useState} from "react";
import Burger from "@/components/Burger-svg";
import Cross from "@/components/Cross-svg";

export default function Navigation() {
    const [isOpen, setIsOpen] = useState(false);
    const toggleIsOpened = () => {
        setIsOpen(!isOpen);
    }
    return (
        <div className="">
            <nav
                className={`h-full bg-bottom-grad z-50 absolute transition-transform duration-700 ease-in-out w-full md:w-1/4  ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <ul className="p-4 mt-12">
                    <li className="link p-2">Home</li>
                    <li className="link p-2">About</li>
                    <li className="link p-2">Portfolio</li>
                    <li className="link p-2">Cost estimator</li>
                    <li className="link p-2">Book</li>
                    <li className="link p-2">Contact</li>
                </ul>
            </nav>
            <div className="absolute top-4 left-4 z-50 flex flex-col space-y-2">
                <Burger show={isOpen} onClick={toggleIsOpened}/>
                <Cross show={isOpen} onClick={toggleIsOpened}/>
            </div>
        </div>
    );
}