const Burger = (props) => {

    const { onClick } = props;
    return (
        <div
            className="cursor-pointer text-gray-300 items-center w-8 hover:scale-110 transition-all duration-300"
            onClick={onClick}
        >
            <svg
                fill="#71717a"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6 transition-all duration-300 ease-in-out transform rotate-45 drop-shadow-[0_0_6px_rgba(113,113,122,0.5)] hover:drop-shadow-[0_0_12px_rgba(113,113,122,0.8)]"
            >
                <path
                    d="M6 4h12v2H6zm.707 11.707L11 11.414V20h2v-8.586l4.293 4.293 1.414-1.414L12 7.586l-6.707 6.707z"/>
            </svg>

        </div>
    );
};

export default Burger;
