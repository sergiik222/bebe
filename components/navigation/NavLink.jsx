'use client'

import NextLink from 'next/link'

const NavLink = ({ href, children, onClick }) => {

    return (
        <NextLink href={href}>
            <span className="btn text-xl cursor-pointer" onClick={onClick}>
                {children}
             </span>
        </NextLink>
    )
}

export default NavLink
