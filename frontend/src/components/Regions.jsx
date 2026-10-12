import React from 'react'
import { Link } from 'react-router-dom'

// import regions from '../data/regions'

const regions = [
  ['Uttar Pradesh', '/images/region-1.jpg'],
  ['Rajasthan', '/images/region-2.jpg'],
  ['Gujarat', '/images/region-3.jpg'],
  ['Kerala', '/images/region-4.jpg'],
  ['Assam', '/images/region-5.jpg'],
  ['Kashmir', '/images/region-6.jpg'],
  ['Tamil Nadu', '/images/region-7.jpg'],
  ['Maharashtra', '/images/region-8.jpg'],
]

const Regions = () => {
  return (
    <section className="w-full bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-5 py-8 sm:py-10">

        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-5 sm:mb-6">

          <div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-gray-900">
              Explore by Region
            </h2>

            <p className="mt-1 text-xs sm:text-sm text-gray-500">
              Discover unique products from different regions of India
            </p>
          </div>

         
          <Link
            to="/regions"
            className="hidden sm:inline-flex items-center gap-1 text-xs sm:text-sm font-medium text-[#073b25] hover:text-[#a77c32] transition"
          >
            View All Regions
            <span>→</span>
          </Link>

        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">

          {regions.map(([name, image]) => (
            <Link
              to="/regions"
              key={name}
              className="relative h-24 sm:h-50 lg:h-30 rounded-lg overflow-hidden group"
            >

              <img
                src={image}
                alt={name}
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />

              <div className="absolute inset-0 bg-black/35 group-hover:bg-black/45 transition duration-300"></div>

              <div className="relative z-10 h-full flex items-end justify-between gap-2 p-2 sm:p-3 text-white">

                <span className="font-semibold text-[11px] sm:text-xs leading-tight">
                  {name}
                </span>

                <span className="shrink-0 bg-[#073b25] group-hover:bg-[#a77c32] rounded-full w-6 h-6 flex items-center justify-center text-xs transition">
                  →
                </span>

              </div>

            </Link>
          ))}

        </div>

        <div className="sm:hidden flex justify-center mt-6">
          <Link
            to="/regions"
            className="inline-flex items-center gap-2 border border-[#073b25] text-[#073b25] px-5 py-2.5 rounded-md text-sm font-medium hover:bg-[#073b25] hover:text-white transition"
          >
            View All Regions
            <span>→</span>
          </Link>
        </div>

      </div>
    </section>
  )
}

export default Regions