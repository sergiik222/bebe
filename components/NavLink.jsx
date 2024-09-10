"use client";
import Link from "next/link";

const NavLink = ({ href, children }) => {
  return (
    <Link className='btn'
      href={href}
    >
      {children}
    </Link>
  );
};

export default NavLink;
