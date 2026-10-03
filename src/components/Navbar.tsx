import { Link } from "react-router-dom"

import ccisLogo from "../assets/ccis-logo.png"

const Navbar = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-200/70 bg-white/95 backdrop-blur-xl">

      <div className="mx-auto flex h-16 max-w-7xl items-center px-5 sm:px-8 lg:px-10">

        <Link
          to="/"
          className="group flex items-center gap-3"
        >

          <img
            src={ccisLogo}
            alt="CCIS Logo"
            className="h-9 w-9 object-contain transition-transform duration-200 group-hover:scale-[1.03] sm:h-10 sm:w-10"
          />

          <div className="leading-none">

            <p className="text-[15px] font-semibold tracking-[-0.02em] text-zinc-950">
              CJC | CCIS
            </p>

            <p className="mt-1 text-[11px] text-zinc-500 sm:text-xs">
              Teachers&apos; Day 2026
            </p>

          </div>

        </Link>

      </div>

    </header>
  )
}

export default Navbar