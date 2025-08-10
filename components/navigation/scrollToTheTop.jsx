'use client';

import {useState, useEffect} from 'react';

const ScrollToTopButton = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 300) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleClick = () => {
        window.scrollTo({top: 0, behavior: 'smooth'});
    };

    return (
        isVisible && (
            <div
                className="fixed bottom-6 right-8 p-2 rounded-full cursor-pointer text-gray-300 items-center w-8  hover:text-gray-400"
                onClick={handleClick}
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 1024 1024" fill="none"
                     strokeWidth="2" stroke="currentColor" className="w-8 h-8">
                    <path fill="currentColor"
                          d="M572.235 205.282v600.365a30.118 30.118 0 1 1-60.235 0V205.282L292.382 438.633a28.913 28.913 0 0 1-42.646 0a33.43 33.43 0 0 1 0-45.236l271.058-288.045a28.913 28.913 0 0 1 42.647 0L834.5 393.397a33.43 33.43 0 0 1 0 45.176a28.913 28.913 0 0 1-42.647 0l-219.618-233.23z"/>
                </svg>


            </div>
        )
    );
};

export default ScrollToTopButton;
