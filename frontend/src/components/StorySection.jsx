import React from 'react'
import { Link } from 'react-router-dom'

const StorySection = () => {
  return (
    <section className="w-full">

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 min-h-65">

        <div className="relative h-65 sm:h-75 lg:h-auto overflow-hidden rounded-2xl">
          <img
            src="/images/story.jpg"
            alt="Indian Artisan"
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover hover:scale-105 transition-transform duration-700"
          />
        </div>

        <div className="flex items-center bg-[#fafaf7] px-6 sm:px-8 lg:px-8 py-10 sm:py-12">

          <div className="max-w-lg">

            <p className="text-[10px] sm:text-xs tracking-[0.2em] text-[#a77c32] font-semibold">
              PEOPLE • CULTURE • SUSTAINABILITY
            </p>

            <h2 className="font-serif text-2xl sm:text-3xl lg:text-3xl font-bold mt-3 leading-tight text-gray-900">
              Stories Behind
              <br />
              Every Product
            </h2>

            <p className="text-sm sm:text-base text-gray-500 mt-3 leading-6">
              Meet the artisans, explore the traditions,
              and discover the rich culture behind our products.
            </p>

            <Link
              to="/our-story"
              className="inline-flex items-center justify-center bg-[#075631] hover:bg-[#064524] text-white px-5 sm:px-6 py-2.5 sm:py-3 rounded-md text-sm mt-5 transition duration-200"
            >
              Read Our Stories
              <span className="ml-2">→</span>
            </Link>

          </div>

        </div>

        <div className="relative h-70 sm:h-75 lg:h-auto overflow-hidden rounded-2xl">

          <img
            src="/images/impact.jpg"
            alt="Local Communities"
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover hover:scale-105 transition-transform duration-700"
          />

          <div className="absolute inset-0 bg-black/35"></div>

          <div className="relative z-10 h-full flex items-center text-white px-6 sm:px-8 py-8">

            <div className="max-w-md">

              <h2 className="font-serif text-2xl sm:text-3xl font-bold leading-tight">
                Empowering
                <br />
                Local Communities
              </h2>

              <p className="text-sm sm:text-base mt-3 text-gray-100 leading-6 max-w-sm">
                We work directly with artisans and producers
                to create sustainable livelihoods.
              </p>

              <Link
                to="/impact"
                className="inline-flex items-center bg-white hover:bg-gray-100 text-[#073b25] px-5 py-2.5 rounded-md text-sm mt-5 font-medium transition"
              >
                Our Impact
                <span className="ml-2">→</span>
              </Link>

            </div>

          </div>

        </div>

      </div>

    </section>
  )
}

export default StorySection