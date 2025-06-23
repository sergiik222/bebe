'use client'
import { usePathname, useRouter } from 'next/navigation'
import { Link as ScrollLink } from 'react-scroll'
import NextLink from 'next/link'

const NavLink = ({ href, children, onClick, isAnker }) => {
    const pathname = usePathname()
    const router = useRouter()

    const handleClick = () => {
        if (onClick) onClick()

        if (pathname !== '/' && isAnker) {
            router.push(`/#${href}`)
        }
    }

    if (isAnker && pathname === '/') {
        return (
            <ScrollLink
                className="btn text-xl cursor-pointer"
                to={href}
                onClick={onClick}
                smooth={true}
                duration={600}
                offset={-50}
            >
                {children}
            </ScrollLink>
        )
    }
    return (
        <NextLink href={isAnker ? `/#${href}` : href}>
            <span className="btn text-xl cursor-pointer" onClick={handleClick}>
                {children}
             </span>
        </NextLink>
    )
}

export default NavLink
