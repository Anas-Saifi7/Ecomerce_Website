import React, { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const navClass = ({ isActive }) =>
    `relative py-2 transition-colors duration-200
    after:absolute after:bottom-0 after:left-0 after:h-[2px]
    after:bg-[#073b25] after:transition-all after:duration-300
    ${
      isActive
        ? 'text-[#073b25] after:w-full'
        : 'text-gray-700 after:w-0 hover:text-[#073b25] hover:after:w-full'
    }`

  const mobileNavClass = ({ isActive }) =>
    `block border-b border-gray-100 py-3 font-medium transition-colors duration-200 ${
      isActive
        ? 'text-[#073b25] border-l-4 border-l-[#073b25] pl-3 bg-green-50'
        : 'text-gray-700 hover:text-[#073b25] hover:bg-gray-50'
    }`

  return (
    <header className="w-full">

      <div className="bg-[#073b25] text-white text-[11px]">
        <div className="max-w-7xl mx-auto px-4 sm:px-5 py-2 flex items-center justify-between gap-3">

          <p className="truncate">
            Bringing Authentic Products from India to the World
          </p>

          <div className="hidden md:flex items-center gap-3 whitespace-nowrap">

            <Link to="/export-inquiry" className="hover:text-[#dfe8b5] transition">
              Export Inquiry
            </Link>

            <span>|</span>

            <Link to="/track-order" className="hover:text-[#dfe8b5] transition">
              Track Order
            </Link>

            <span>|</span>

            <Link to="/support" className="hover:text-[#dfe8b5] transition">
              Support
            </Link>

          </div>
        </div>
      </div>
 
      <nav className="bg-white border-b border-gray-200">

        <div className="max-w-7xl mx-auto px-4 sm:px-5 h-16 flex items-center justify-between gap-4">
          <Link 
          // to="/" 
          className="shrink-0" onClick={() => setIsMenuOpen(false)}>
            <h1 className="font-serif text-lg sm:text-xl font-bold text-gray-800">
              Halla Bol
            </h1>

            <p className="hidden sm:block text-[7px] tracking-widest text-gray-500">
              ROOTED IN INDIA. FOR A BETTER WORLD.
            </p>
          </Link>

          <div className="hidden lg:flex items-center gap-5 xl:gap-7 text-sm font-medium">

            <NavLink to="/" end className={navClass}>
              Home
            </NavLink>

            <NavLink to="/product" className={navClass}>
              Products
            </NavLink>

            <NavLink to="/categories" className={navClass}>
              Categories
            </NavLink>

            <NavLink to="/regions" className={navClass}>
              Regions
            </NavLink>

            <NavLink to="/our-story" className={navClass}>
              Our Story
            </NavLink>

            <NavLink to="/blog" className={navClass}>
              Blog
            </NavLink>

            <NavLink to="/contact" className={navClass}>
              Contact
            </NavLink>

          </div>

          <div className="flex items-center gap-3 sm:gap-4">

            <div className="hidden xl:flex items-center border border-gray-300 rounded-md px-3 py-2 w-56">
              <input
                type="text"
                placeholder="Search products..."
                className="w-full text-xs outline-none"
              />

              <span className="text-gray-500">🔍</span>
            </div>

            <Link
              to="/account"
              title="Account"
              className="text-xl hover:text-[#073b25] transition"
            >
              👤
            </Link>

            <Link
              to="/wishlist"
              title="Wishlist"
              className="text-xl hover:text-[#073b25] transition"
            >
              ♡
            </Link>

      
            <Link
              to="/cart"
              title="Cart"
              className="text-xl hover:text-[#073b25] transition"
            >
              🛒
            </Link>

            <button
              type="button"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden text-2xl text-gray-800 ml-1"
              aria-label="Toggle menu"
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? '✕' : '☰'}
            </button>

          </div>
        </div>

        {isMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 bg-white">

            <div className="px-5 py-5">

              <div className="flex items-center border border-gray-300 rounded-md px-3 py-2 mb-4">
                <input
                  type="text"
                  placeholder="Search products..."
                  className="w-full text-sm outline-none"
                />

                <span className="text-gray-500">🔍</span>
              </div>

              <NavLink
                to="/"
                end
                onClick={() => setIsMenuOpen(false)}
                className={mobileNavClass}
              >
                Home
              </NavLink>

              <NavLink
                to="/product"
                onClick={() => setIsMenuOpen(false)}
                className={mobileNavClass}
              >
                Products
              </NavLink>

              <NavLink
                to="/categories"
                onClick={() => setIsMenuOpen(false)}
                className={mobileNavClass}
              >
                Categories
              </NavLink>

              <NavLink
                to="/regions"
                onClick={() => setIsMenuOpen(false)}
                className={mobileNavClass}
              >
                Regions
              </NavLink>

              <NavLink
                to="/our-story"
                onClick={() => setIsMenuOpen(false)}
                className={mobileNavClass}
              >
                Our Story
              </NavLink>

              <NavLink
                to="/blog"
                onClick={() => setIsMenuOpen(false)}
                className={mobileNavClass}
              >
                Blog
              </NavLink>

              <NavLink
                to="/contact"
                onClick={() => setIsMenuOpen(false)}
                className={mobileNavClass}
              >
                Contact
              </NavLink>

              <div className="pt-5 flex flex-wrap gap-4 text-xs text-gray-500">

                <Link
                  to="/export-inquiry"
                  onClick={() => setIsMenuOpen(false)}
                  className="hover:text-[#073b25]"
                >
                  Export Inquiry
                </Link>

                <Link
                  to="/track-order"
                  onClick={() => setIsMenuOpen(false)}
                  className="hover:text-[#073b25]"
                >
                  Track Order
                </Link>

                <Link
                  to="/support"
                  onClick={() => setIsMenuOpen(false)}
                  className="hover:text-[#073b25]"
                >
                  Support
                </Link>

              </div>
            </div>
          </div>
        )}

      </nav>
    </header>
  )
}

export default Navbar
