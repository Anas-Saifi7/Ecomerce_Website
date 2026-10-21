import React from 'react'
import { Link } from 'react-router-dom'

const TrustSection = () => {
  return (
    <>
      <section className="w-full border-y border-none bg-white">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-5 py-6 sm:py-8">

          <div className="grid grid-cols-2 md:grid-cols-4 gap-y-6 sm:gap-y-8 md:gap-6">

            <div className="flex items-center justify-center gap-3 sm:gap-4">
              <span className="text-2xl sm:text-3xl text-[#073b25]">
                ♧
              </span>

              <div>
                <h3 className="font-bold text-base sm:text-lg">
                  Authentic
                </h3>

                <p className="text-[10px] sm:text-xs text-gray-500">
                  Indian products
                </p>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3 sm:gap-4">
              <span className="text-2xl sm:text-3xl text-[#073b25]">
                ◎
              </span>

              <div>
                <h3 className="font-bold text-base sm:text-lg">
                  INR & USD
                </h3>

                <p className="text-[10px] sm:text-xs text-gray-500">
                  Independent prices
                </p>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3 sm:gap-4">
              <span className="text-2xl sm:text-3xl text-[#073b25]">
                ♧
              </span>

              <div>
                <h3 className="font-bold text-base sm:text-lg">
                  Live
                </h3>

                <p className="text-[10px] sm:text-xs text-gray-500">
                  Stock checks
                </p>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3 sm:gap-4">
              <span className="text-2xl sm:text-3xl text-[#073b25]">
                ♧
              </span>

              <div>
                <h3 className="font-bold text-base sm:text-lg">
                  Customer
                </h3>

                <p className="text-[10px] sm:text-xs text-gray-500">
                  Support
                </p>
              </div>
            </div>

          </div>

        </div>

      </section>

      <section className="w-full py-6 sm:py-8 border-b bg-white">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-5">

          <div className="flex flex-col sm:flex-row flex-wrap justify-center items-center gap-5 sm:gap-8 lg:gap-10">

            <span className="font-serif font-bold text-sm sm:text-base text-gray-800 text-center">
              Explore the collection
            </span>
            <p className="text-sm text-gray-600 text-center">Browse products by category and region.</p>
            <Link to="/categories" className="rounded border border-[#073b25] px-4 py-2 text-sm font-semibold text-[#073b25] hover:bg-green-50">Browse categories</Link>

          </div>

        </div>

      </section>
    </>
  )
}

export default TrustSection
