'use client'
import {useState} from "react";
import Burger from "@/components/navigation/Burger-svg";
import Cross from "@/components/navigation/Cross-svg";
import NavLink from "@/components/navigation/NavLink";

export default function Navigation() {
    const [isOpen, setIsOpen] = useState(false);
    const toggleIsOpened = () => {
        setIsOpen(!isOpen);
    }
    return (
        <div className="">
            <nav
                className={`h-full bg-bottom-grad z-50 fixed transition-transform duration-700 ease-in-out w-full md:w-1/4  ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <ul className="p-4 mt-12">
                    <li className="link p-2"><NavLink onClick={toggleIsOpened} className="text-lg" href="home">Home</NavLink></li>
                    <li className="link p-2"><NavLink onClick={toggleIsOpened} href="about">About</NavLink></li>
                    <li className="link p-2"><NavLink onClick={toggleIsOpened} href="portfolio">Portfolio</NavLink></li>
                    <li className="link p-2"><NavLink onClick={toggleIsOpened} href="cost">Cost estimator</NavLink></li>
                    <li className="link p-2"><NavLink onClick={toggleIsOpened} href="book">Book</NavLink></li>
                    <li className="link p-2"><NavLink onClick={toggleIsOpened} href="contact">Contact</NavLink></li>
                </ul>
            </nav>
            <div className="fixed top-4 left-4 z-50 flex flex-col space-y-2">
                <Burger show={isOpen} onClick={toggleIsOpened}/>
                <Cross show={isOpen} onClick={toggleIsOpened}/>
            </div>
        </div>
    );
}