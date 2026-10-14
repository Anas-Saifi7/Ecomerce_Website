import React, { useState } from 'react'
import { Link } from 'react-router-dom'


const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState("");

  return (

    <header className="w-full">

      <div className="bg-[#073b25] text-white text-[11px]">

        <div className="max-w-7xl max-auto px-4 sm:px-5 py-2 flex items-center justify-between">

          <p className="truncate" >
            Bringing Authentic Products from India to the World
          </p>

          <div className="hidden md:flex items-center gap-3 whitespace-nowrap ">

            <Link to="/export-inquiry" className="cursor-pointer hover:text-[#dfe8b5]">
              Export Inquiry
            </Link>

            <span>|</span>

            <Link to="/track-order" className="cursor-pointer hover:text-[#dfe8b5]">
              Track Order
            </Link>

            <span>|</span>

            <Link to="/support" className="cursor-pointer hover:text-[#dfe8b5]">
              Support
            </Link>

          </div>

        </div>
      </div>

      <nav className="bg-white border-b border-gray-200">

        <div className="max-w-8xl mx-auto px-4 sm:px-5 h-16 flex items-center justify-between gap-4 ">

          <div className="flex items-center gap-2">

            <div>
              <h1 className="font-serif text-lg sm:text-xl font-bold text-gray-800 ">
                Halla Bol
              </h1>

              <p className="hidden sm:block text-[7px] tracking-widest text-gray-500">
                ROOTED IN INDIA. FOR A BETTER WORLD.
              </p>
            </div>

          </div>

          <div className="hidden lg:flex items-center gap-5 xl:gap-7 text-sm font-medium">

            <Link to="/" className="py-2">
              Home
            </Link>

            <Link to="/product"
              className="flex items-center gap-1 hover:text-[#073b25] py-2">
              Products
            </Link>

            <Link to="/categories"
              className="flex items-center gap-1 hover:text-[#073b25] py-2">
              Categories
            </Link>

            <Link
              to="/regions"
              className="flex items-center gap-1 hover:text-[#073b25] py-2"
            >
              Regions
            </Link>

            <Link
              to="/our-story"
              className="hover:text-[#073b25]"
            >
              Our Story
            </Link>

            <Link
              to="/blog"
              className="hover:text-[#073b25]"
            >
              Blog
            </Link>

            <Link
              to="/contact"
              className="hover:text-[#073b25]"
            >
              Contact
            </Link>

          </div>

         {/* Right Side  */}
          <div className="flex items-center gap-3 sm:gap-4">

            <div className="hidden xl:flex items-center border border-gray-300 rounded-md px-3 py-2 w-64">

              {/* Update this part  */}
              <input
                type="text"
                placeholder="Search products, categories..."
                className="w-full text-xs outline-none"
              />

              <span className="text-gray-500">
                🔍
              </span>

            </div>

            <Link
              to="/account"
              className="text-xl hover:text-[#073b25] transition"
              title="Account"
            >
              {/* ♙ */}
              👨🏻
              
            </Link>

            <Link to='wishlist'
              type="button"
              className="text-xl hover:text-[#073b25] transition"
              title="Wishlist"
            >
              ♡
            </Link>

            <Link
              to="/cart"
              className="relative text-xl hover:text-[#073b25] transition"
              title="Cart"
            >
              🛒
            </Link>


            <button
              type="button"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden text-2xl text-gray-800 ml-1"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? '✕' : '☰'}
            </button>

          </div>
        </div>

        {isMenuOpen && (

          <div className="lg:hidden border-t border-gray-200 bg-white">

            <div className="px-5 py-5 space-y-1">

              <div className="flex items-center border border-gray-300 rounded-md px-3 py-2 mb-4">

                <input
                  type="text"
                  placeholder="Search products, categories..."
                  className="w-full text-sm outline-none"
                />

                <span className="text-gray-500">
                  🔍
                </span>

              </div>

              <Link
                to="/"
                onClick={() => setIsMenuOpen(false)}
                className="block py-3 border-b border-gray-100 font-medium text-[#073b25]"
              >
                Home
              </Link>

              <Link
                to="/product"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center justify-between py-3 border-b border-gray-100 font-medium hover:text-[#073b25]"
              >
                <span>Products</span>
                <span>→</span>
              </Link>

              <Link
                to="/categories"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center justify-between py-3 border-b border-gray-100 font-medium hover:text-[#073b25]"
              >
                <span>Categories</span>
                <span>→</span>
              </Link>

              <Link
                to="/regions"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center justify-between py-3 border-b border-gray-100 font-medium hover:text-[#073b25]"
              >
                <span>Regions</span>
                <span>→</span>
              </Link>

              <Link
                to="/our-story"
                onClick={() => setIsMenuOpen(false)}
                className="block py-3 border-b border-gray-100 font-medium hover:text-[#073b25]"
              >
                Our Story
              </Link>

              <Link
                to="/blog"
                onClick={() => setIsMenuOpen(false)}
                className="block py-3 border-b border-gray-100 font-medium hover:text-[#073b25]"
              >
                Blog
              </Link>

              <Link
                to="/contact"
                onClick={() => setIsMenuOpen(false)}
                className="block py-3 border-b border-gray-100 font-medium hover:text-[#073b25]"
              >
                Contact
              </Link>

              <div className="pt-4 flex flex-wrap gap-4 text-xs text-gray-500">

                <Link to='/export-inquiry' className="cursor-pointer hover:text-[#f11d1d]">
                  Export Inquiry
                </Link>

                <span>|</span>

                <Link to='/track-order' className="cursor-pointer hover:text-[#f11d1d]">
                  Track Order
                </Link>

                <span>|</span>

                <Link to='/support' className="cursor-pointer hover:text-[#f11d1d]">
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