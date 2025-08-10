const Burger = (props) => {

  const { show, onClick } = props;
  return (
    <div
      className={`cursor-pointer text-gray-300  items-center w-8 hover:scale-110 hover:text-accent ${
        show ? "hidden" : "block"
      } `}
      onClick={onClick}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="2"
        stroke="currentColor"
        className="mt-1  w-8 h-8"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
        />
      </svg>
    </div>
  );
};

export default Burger;
