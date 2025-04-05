"use client";
import Link from "next/link";

const NavLink = ({ href, children, onClick }) => {
  return (
    <Link className='btn text-xl'
      href={href}
      onClick={onClick}
    >
      {children}
    </Link>
  );
};

export default NavLink;
