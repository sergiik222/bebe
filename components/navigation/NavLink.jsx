"use client";
import { Link } from "react-scroll";

const NavLink = ({ href, children, onClick }) => {
  return (
    <Link className='btn text-xl'
          to={href}
          onClick={onClick}
          smooth={true}
          duration={600}
          offset={-50}
    >
      {children}
    </Link>
  );
};

export default NavLink;
