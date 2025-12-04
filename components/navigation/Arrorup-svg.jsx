const Burger = (props) => {

    const { onClick } = props;
    return (
        <div
            className="cursor-pointer text-gray-300 items-center w-8 hover:scale-110 transition-all duration-300"
            onClick={onClick}
        >
            <svg
                fill="var(--accent-color)"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6 transition-all duration-300 ease-in-out transform rotate-45"
                style={{
                    filter: 'drop-shadow(0 0 6px var(--accent-glow))'
                }}
            >
                <path
                    d="M6 4h12v2H6zm.707 11.707L11 11.414V20h2v-8.586l4.293 4.293 1.414-1.414L12 7.586l-6.707 6.707z"/>
            </svg>

        </div>
    );
};

export default Burger;
