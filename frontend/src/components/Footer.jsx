import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { subscribe } from '../services/newsletterService.js'

const Footer = () => {
  const [email, setEmail] = useState('')
  const [newsletterStatus, setNewsletterStatus] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const handleNewsletter = async (event) => {
    event.preventDefault()
    if (submitting) return
    setSubmitting(true)
    setNewsletterStatus('')
    try {
      await subscribe(email)
      setEmail('')
      setNewsletterStatus('You are subscribed.')
    } catch (error) {
      setNewsletterStatus(error.message || 'Subscription could not be saved. Please try again.')
    } finally { setSubmitting(false) }
  }
  return (
    <footer className="bg-[#062d1d] text-white">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-5 py-10 sm:py-12">

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 sm:gap-10 lg:gap-8">
        
          <div className="sm:col-span-2 lg:col-span-1">

            <Link to="/" className="inline-block">
              <h2 className="font-serif text-2xl sm:text-3xl font-bold">
                Halla Bol
              </h2>

              <p className="text-[8px] sm:text-[9px] tracking-widest text-gray-300 mt-1">
                ROOTED IN INDIA. FOR A BETTER WORLD.
              </p>
            </Link>

            <p className="text-xs sm:text-sm text-gray-400 leading-5 mt-4 max-w-xs">
              Bringing authentic Indian products, traditions,
              and craftsmanship to customers around the world.
            </p>

          </div>


          <div>

            <h3 className="font-semibold mb-4 text-sm sm:text-base">
              Shop
            </h3>

            <div className="space-y-2.5 text-xs sm:text-sm text-gray-300">

              <Link
                to="/product"
                className="block hover:text-white transition"
              >
                All Products
              </Link>

              <Link
                to="/categories"
                className="block hover:text-white transition"
              >
                Categories
              </Link>

              <Link
                to="/regions"
                className="block hover:text-white transition"
              >
                Regions
              </Link>

            </div>

          </div>


          <div>

            <h3 className="font-semibold mb-4 text-sm sm:text-base">
              Company
            </h3>

            <div className="space-y-2.5 text-xs sm:text-sm text-gray-300">

             <Link to = '/'
               className="block hover:text-white transition"
               >
                Home
      
             </Link>
              <Link
                to="/about"
                className="block hover:text-white transition"
              >
                About Us
              </Link>

              <Link
                to="/our-story"
                className="block hover:text-white transition"
              >
                Our Story
              </Link>

              <Link
                to="/contact"
                className="block hover:text-white transition"
              >
                Contact Us
              </Link>

            </div>

          </div>

          <div>

            <h3 className="font-semibold mb-4 text-sm sm:text-base">
              Support
            </h3>

            <div className="space-y-2.5 text-xs sm:text-sm text-gray-300">

              <Link
                to="/faq"
                className="block hover:text-white transition"
              >
                FAQ
              </Link>

              <Link
                to="/shipping-policy"
                className="block hover:text-white transition"
              >
                Shipping Policy
              </Link>

              <Link
                to="/return-refund"
                className="block hover:text-white transition"
              >
                Return & Refund
              </Link>

              <Link
                to="/track-order"
                className="block hover:text-white transition"
              >
                Track Order
              </Link>

            </div>

          </div>


          <div className="sm:col-span-2 lg:col-span-1">

            <h3 className="font-semibold mb-4 text-sm sm:text-base">
              Stay Connected
            </h3>

            <p className="text-xs sm:text-sm text-gray-300 leading-5 mb-4 max-w-sm">
              Subscribe to our newsletter for updates
              on new products and stories.
            </p>

            <form onSubmit={handleNewsletter} className="flex flex-col sm:flex-row lg:flex-col xl:flex-row gap-2">

              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                placeholder="Enter your email"
                className="w-full min-w-0 bg-transparent border border-gray-500 rounded-md px-3 py-2.5 text-xs sm:text-sm text-white placeholder-gray-400 outline-none focus:border-[#e4e8b8] transition"
              />

              <button
                type="submit"
                disabled={submitting}
                className="shrink-0 bg-[#e4e8b8] hover:bg-[#d8dda5] text-[#073b25] px-4 py-2.5 rounded-md text-xs sm:text-sm font-semibold transition"
              >
                {submitting ? 'Submitting…' : 'Subscribe →'}
              </button>

            </form>
            {newsletterStatus && <p role="status" className="mt-2 text-xs text-gray-200">{newsletterStatus}</p>}

          </div>

        </div>

      </div>


      <div className="border-t border-gray-700">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-5 py-4">

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 text-[10px] sm:text-xs text-gray-400">

            <p className="text-center md:text-left">
              © 2026 Halla Bol. All rights reserved.
            </p>

            <div className="flex flex-wrap justify-center md:justify-end gap-x-5 gap-y-2">

              <Link
                to="/privacy-policy"
                className="hover:text-white transition"
              >
                Privacy Policy
              </Link>

              <Link
                to="/terms-and-conditions"
                className="hover:text-white transition"
              >
                Terms & Conditions
              </Link>

              <Link
                to="/sitemap"
                className="hover:text-white transition"
              >
                Sitemap
              </Link>

            </div>

          </div>

        </div>

      </div>

    </footer>
  )
}

export default Footer
