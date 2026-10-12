import React, { useState } from 'react'
import { Link } from 'react-router-dom'

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="w-full">

      {/* Top bar  */}
      <div className="bg-[#073b25] text-white text-[11px]">

        <div className="max-w-7xl mx-auto px-4 sm:px-5 py-2 flex items-center justify-between">

          <p className="truncate">
            Bringing Authentic Products from India to the World
          </p>

          <div className="hidden md:flex items-center gap-3 whitespace-nowrap">
                      
           <Link to = '/export-inquiry' className="cursor-pointer hover:text-[#dfe8b5]">
            Export Inquiry
            </Link>

            <span>|</span>

            <Link to = '/track-order' className="cursor-pointer hover:text-[#dfe8b5]">
              Track Order
            </Link>

            <span>|</span>

           <Link to = '/support' className="cursor-pointer hover:text-[#dfe8b5]">
              Support
            </Link>

            <span>|</span>

            <select
              className="bg-transparent text-white outline-none cursor-pointer"
              defaultValue="INR"
            >
              <option value="INR" className="text-black">
                INR
              </option>
              <option value="USD" className="text-black">
                USD
              </option>
              <option value="EUR" className="text-black">
                EUR
              </option>
              <option value="CAD" className="text-black">
                CAD
              </option>
            </select>

          </div>

        </div>

      </div>

      <nav className="bg-white border-b border-gray-200">

        <div className="max-w-8xl mx-auto px-4 sm:px-5 h-16 flex items-center justify-between gap-4">

          {/*  LOGO */}
          <Link
            // to="/"
            onClick={() => setIsMenuOpen(false)}
            className="shrink-0"
          >

            <div className="flex items-center gap-2">

              <div>

                <h1 className="font-serif text-lg sm:text-xl font-bold tracking-wide text-gray-800">
                  LOGO
                </h1>

                <p className="hidden sm:block text-[7px] tracking-widest text-gray-500">
                  ROOTED IN INDIA. FOR A BETTER WORLD.
                </p>

              </div>

            </div>

          </Link>

          <div className="hidden lg:flex items-center gap-5 xl:gap-7 text-sm font-medium">

            <Link
              to="/"
              className="py-2"
            >
              Home
            </Link>

            {/* Products */}
            <div className="relative group">

              <Link
                to="/product"
                className="flex items-center gap-1 hover:text-[#073b25] py-2"
              >
                Products
              </Link>

            </div>

            {/* Categories */}
            <div className="relative group">

              <Link
                to="/categories"
                className="flex items-center gap-1 hover:text-[#073b25] py-2"
              >
                Categories
              </Link>

            </div>


            {/* Regions */}
            <div className="relative group">

              <Link
                to="/regions"
                className="flex items-center gap-1 hover:text-[#073b25] py-2"
              >
                Regions
              </Link>

            </div>


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


          {/*  RIGHT SIDE  */}
          <div className="flex items-center gap-3 sm:gap-4">

            {/* Search */}
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


            {/* Login */}
            <Link
              to="/account"
              className="text-xl hover:text-[#073b25] transition"
              title="Account"
            >
              ♙
            </Link>


            {/* Wishlist */}
            <Link to='wishlist'
              type="button"
              className="text-xl hover:text-[#073b25] transition"
              title="Wishlist"
            >
              ♡
            </Link>


            {/* Cart */}
            <Link
              to="/cart"
              className="relative text-xl hover:text-[#073b25] transition"
              title="Cart"
            >

              🛒

              {/* <span className="absolute -top-2 -right-2 bg-[#073b25] text-white text-[8px] w-4 h-4 rounded-full flex items-center justify-center">
                0
              </span> */}

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

              {/* Mobile Search */}
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


              {/* Home */}
              <Link
                to="/"
                onClick={() => setIsMenuOpen(false)}
                className="block py-3 border-b border-gray-100 font-medium text-[#073b25]"
              >
                Home
              </Link>


              {/* Products */}
              <Link
                to="/product"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center justify-between py-3 border-b border-gray-100 font-medium hover:text-[#073b25]"
              >
                <span>Products</span>
                <span>→</span>
              </Link>


              {/* Categories */}
              <Link
                to="/categories"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center justify-between py-3 border-b border-gray-100 font-medium hover:text-[#073b25]"
              >
                <span>Categories</span>
                <span>→</span>
              </Link>


              {/* Regions */}
              <Link
                to="/regions"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center justify-between py-3 border-b border-gray-100 font-medium hover:text-[#073b25]"
              >
                <span>Regions</span>
                <span>→</span>
              </Link>


              {/* Our Story */}
              <Link
                to="/our-story"
                onClick={() => setIsMenuOpen(false)}
                className="block py-3 border-b border-gray-100 font-medium hover:text-[#073b25]"
              >
                Our Story
              </Link>

              {/* Blog */}
              <Link
                to="/blog"
                onClick={() => setIsMenuOpen(false)}
                className="block py-3 border-b border-gray-100 font-medium hover:text-[#073b25]"
              >
                Blog
              </Link>


              {/* Contact */}
              <Link
                to="/contact"
                onClick={() => setIsMenuOpen(false)}
                className="block py-3 border-b border-gray-100 font-medium hover:text-[#073b25]"
              >
                Contact
              </Link>

              <div className="pt-4 flex flex-wrap gap-4 text-xs text-gray-500">
              
              <Link to = '/export-inquiry' className="cursor-pointer hover:text-[#f11d1d]">
               Export Inquiry
               </Link>

              <span>|</span>

              <Link to = '/track-order' className="cursor-pointer hover:text-[#f11d1d]">
               Track Order
              </Link>

              <span>|</span>

              <Link to = '/support' className="cursor-pointer hover:text-[#f11d1d]">
               Support
              </Link>

              </div>


              {/* Currency */}
              <div className="pt-4">

                <label className="text-xs text-gray-500 mr-2">
                  Currency:
                </label>

                <select
                  className="border border-gray-300 rounded px-2 py-1 text-sm outline-none"
                  defaultValue="INR"
                >
                  <option value="INR">
                    INR
                  </option>

                  <option value="USD">
                    USD
                  </option>

                  <option value="EUR">
                    EUR
                  </option>

                  <option value="CAD">
                    CAD
                  </option>

                </select>

              </div>

            </div>

          </div>

        )}

      </nav>

    </header>
  )
}

export default Navbar