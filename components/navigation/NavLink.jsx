'use client'

import NextLink from 'next/link'
import { usePathname } from 'next/navigation'

const NavLink = ({ href, children, onClick, className = "", activeClassName = "" }) => {
    const pathname = usePathname()
    const isActive = pathname === href

    return (
        <NextLink href={href}>
            <span
                className={`cursor-pointer ${className} ${isActive ? activeClassName : ''}`}
                onClick={onClick}
            >
                {children}
            </span>
        </NextLink>
    )
}

export default NavLink
