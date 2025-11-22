'use client'

import Link from "next/link";

const Header = () => {
  return (
      <div className='flex items-center justify-center mt-3'>
          <Link className='btn text-2xl' href="/portfolio">
              Portfolio
          </Link>
      </div>
  )
}

export default Header;