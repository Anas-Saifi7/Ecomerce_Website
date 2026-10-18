import React from 'react'
import { Link } from 'react-router-dom'

import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const About = () => {
  return (
    <div className="min-h-screen bg-white text-gray-900">

      <Navbar />

      <section className="relative min-h-98 sm:min-h-105 lg:h-88 overflow-hidden">

        <img
          src="/images/about-hero.jpg"
          alt="Halla Bol"
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-black/50" />

        <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 lg:px-5 h-full flex items-center">

          <div className="max-w-2xl text-white py-16 lg:py-0">

            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
              About Halla Bol
            </h1>

            <p className="text-lg sm:text-xl mt-3 font-medium">
              Rooted in India. For a Better World.
            </p>

            <p className="text-sm sm:text-base lg:text-lg text-gray-100 leading-6 sm:leading-7 mt-3 max-w-xl">
              At Halla bol, we bring the purity, heritage, and richness of
              India's natural products to homes around the world — while
              empowering farmers, supporting communities, and promoting
              a healthier, more sustainable future.
            </p>

          </div>

        </div>

      </section>

      <section className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-5 py-8 sm:py-10 lg:py-12">

        <div className="grid lg:grid-cols-[1.05fr_1fr_0.7fr] gap-6 lg:gap-8 items-center">

          <div className="relative rounded-lg overflow-hidden h-70 sm:h-88 lg:h-73">

            <img
              src="/images/about-story.jpg"
              alt="Indian Farmer"
               loading="lazy"
              className="w-full h-full object-cover"
            />

            <div className="absolute bottom-5 left-5 bg-[#f4ead0] px-5 py-4 rounded-sm shadow">

              <p className="font-serif text-lg sm:text-xl italic leading-tight">
                From
                <br />
                Our Farms
                <br />
                to the World
              </p>

            </div>

          </div>

          <div>

            <p className="uppercase tracking-[0.2em] text-[#075631] text-xs sm:text-sm font-semibold">
              Our Story
            </p>

            <h2 className="font-serif text-3xl sm:text-4xl font-bold leading-tight mt-3">
              A Journey from Our Roots
              <br className="hidden sm:block" />
              to the Global Table
            </h2>

            <p className="text-sm sm:text-base text-gray-600 leading-6 mt-4">
              Halla Bol was founded with a simple yet powerful mission —
              to share the authentic, natural goodness of India with
              the world. What started as a small initiative to support
              local farmers has grown into a global brand, trusted by
              customers in 100+ countries.
            </p>

            <p className="text-sm sm:text-base text-gray-600 leading-6 mt-3">
              We work directly with farming communities across India
              to source high-quality spices, herbs, wellness products,
              and traditional goods, ensuring fair trade, sustainable
              practices, and long-term impact.
            </p>

          </div>

          <div className="relative bg-[#faf9f4] rounded-lg p-7 sm:p-8 overflow-hidden">

            <div className="absolute -right-5 -bottom-8 text-[#dfe8dc] text-[130px]">
              ❝
            </div>

            <div className="relative z-10">

              <span className="text-[#075631] text-5xl leading-none">
                “
              </span>

              <p className="font-serif italic text-xl sm:text-2xl leading-8 mt-2">
                We believe in a world where nature,
                farmers, and people thrive together.
              </p>

              <p className="text-sm text-gray-500 mt-5">
                — Team Halla Bol
              </p>

            </div>

          </div>

        </div>

      </section>

      <section className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-5 pb-8 sm:pb-10">

        <div className="bg-[#fafaf7] border border-gray-100 rounded-lg">

          <div className="grid md:grid-cols-3">

            <div className="p-6 sm:p-8 flex gap-5 border-b md:border-b-0 md:border-r border-gray-200">

              <div className="shrink-0 w-14 h-14 rounded-full bg-[#075631] text-white flex items-center justify-center text-2xl">
                ◉
              </div>

              <div>

                <h3 className="font-serif text-xl sm:text-2xl font-bold">
                  Our Mission
                </h3>

                <p className="text-sm text-gray-600 leading-6 mt-2">
                  To deliver authentic, high-quality natural products
                  from India to the world while creating positive
                  impact for farmers and communities.
                </p>

              </div>

            </div>

            <div className="p-6 sm:p-8 flex gap-5 border-b md:border-b-0 md:border-r border-gray-200">

              <div className="shrink-0 w-14 h-14 rounded-full bg-[#075631] text-white flex items-center justify-center text-2xl">
                ◉
              </div>

              <div>

                <h3 className="font-serif text-xl sm:text-2xl font-bold">
                  Our Vision
                </h3>

                <p className="text-sm text-gray-600 leading-6 mt-2">
                  To be a global leader in natural and sustainable
                  products, known for quality, trust, and meaningful
                  change.
                </p>

              </div>

            </div>

            <div className="p-6 sm:p-8">

              <div className="flex items-center gap-4 mb-5">

                <div className="shrink-0 w-14 h-14 rounded-full bg-[#075631] text-white flex items-center justify-center text-2xl">
                  ♡
                </div>

                <h3 className="font-serif text-xl sm:text-2xl font-bold">
                  Our Values
                </h3>

              </div>

              <div className="grid grid-cols-2 gap-4">

                <div className="text-center border-l border-gray-200 pl-3">
                  <div className="text-[#075631] text-xl">
                    ♧
                  </div>
                  <p className="text-xs mt-1">
                    Authenticity
                  </p>
                </div>

                <div className="text-center border-l border-gray-200 pl-3">
                  <div className="text-[#075631] text-xl">
                    ♧
                  </div>
                  <p className="text-xs mt-1">
                    Community First
                  </p>
                </div>

                <div className="text-center border-l border-gray-200 pl-3">
                  <div className="text-[#075631] text-xl">
                    ♧
                  </div>
                  <p className="text-xs mt-1">
                    Sustainability
                  </p>
                </div>

                <div className="text-center border-l border-gray-200 pl-3">
                  <div className="text-[#075631] text-xl">
                    ♢
                  </div>
                  <p className="text-xs mt-1">
                    Quality & Trust
                  </p>
                </div>

              </div>

            </div>

          </div>

        </div>

      </section>

      <section className="relative overflow-hidden bg-[#063b26] text-white">

        <img
          src="/images/about-impact.jpg"
          alt="Sustainable farming"
           loading="lazy"
          className="absolute inset-0 w-full h-full object-cover opacity-45"
        />

        <div className="absolute inset-0 bg-[#063b26]/75" />

        <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 lg:px-5 py-8 sm:py-10">

          <div className="grid grid-cols-2 lg:grid-cols-4">

            <div className="text-center px-4 py-4 border-r border-white/20">

              <div className="text-3xl sm:text-4xl mb-2">
                ♧
              </div>

              <h3 className="font-serif text-3xl sm:text-4xl font-bold">
                10,000+
              </h3>

              <p className="text-sm text-gray-200 mt-1">
                Farmers Supported
              </p>

            </div>

            <div className="text-center px-4 py-4 lg:border-r border-white/20">

              <div className="text-3xl sm:text-4xl mb-2">
                ◎
              </div>

              <h3 className="font-serif text-3xl sm:text-4xl font-bold">
                100+
              </h3>

              <p className="text-sm text-gray-200 mt-1">
                Countries Served
              </p>

            </div>

            <div className="text-center px-4 py-4 border-r border-white/20">

              <div className="text-3xl sm:text-4xl mb-2">
                ♧
              </div>

              <h3 className="font-serif text-3xl sm:text-4xl font-bold">
                500+
              </h3>

              <p className="text-sm text-gray-200 mt-1">
                Natural Products
              </p>

            </div>

            <div className="text-center px-4 py-4">

              <div className="text-3xl sm:text-4xl mb-2">
                ♥
              </div>

              <h3 className="font-serif text-3xl sm:text-4xl font-bold">
                1M+
              </h3>

              <p className="text-sm text-gray-200 mt-1">
                Happy Customers
              </p>

            </div>

          </div>

        </div>

      </section>

      <section className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-5 py-9 sm:py-12">

        <div className="grid lg:grid-cols-2 gap-7 lg:gap-10 items-center">

          <div>

            <h2 className="font-serif text-3xl sm:text-4xl font-bold">
              Our Global Presence
            </h2>

            <p className="text-sm sm:text-base text-gray-600 leading-6 mt-4 max-w-lg">
              From the fertile fields of India to homes across the
              globe, our products are loved and trusted in 100+
              countries. We continue to expand our reach while
              staying true to our roots.
            </p>

            <Link
              to="/product"
              className="inline-flex items-center gap-2 bg-[#075631] hover:bg-[#064524] text-white px-5 py-3 rounded-md text-sm font-medium mt-5 transition"
            >
              Explore Our Products
              <span>→</span>
            </Link>

          </div>

          <div className="relative">

            <img
              src="/images/global-map.jpg"
              alt="Halla Bol Global Presence"
               loading="lazy"
              className="w-full h-auto object-contain"
            />

          </div>

        </div>

      </section>

      <section className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-5 pb-10">

        <div className="relative rounded-lg overflow-hidden min-h-75 sm:min-h-90">

          <img
            src="/images/farmers-community.jpg"
            alt="Farmers and Communities"
             loading="lazy"
            className="absolute inset-0 w-full h-full object-cover"
          />

          <div className="absolute inset-0 bg-black/20" />

          <div className="relative z-10 min-h-75 sm:min-h-90 flex items-end">

            <div className="m-5 sm:m-8 max-w-md bg-white/95 rounded-md p-5 sm:p-6">

              <h2 className="font-serif text-2xl sm:text-3xl font-bold">
                Empowering
                <br />
                Farmers & Communities
              </h2>

              <p className="text-sm text-gray-600 leading-5 mt-2">
                We ensure fair trade, better livelihoods, and
                sustainable growth for farming families across India.
              </p>

            </div>

          </div>

        </div>

      </section>

      <section className="border-t border-gray-100">

        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-5 py-7 sm:py-8">

          <div className="grid lg:grid-cols-[1.2fr_2fr] gap-6 items-center">

            <div>

              <h2 className="font-serif text-xl sm:text-2xl font-bold">
                Our Certifications & Standards
              </h2>

              <p className="text-xs sm:text-sm text-gray-500 mt-2">
                We follow global quality and safety standards to ensure
                you get the best, always.
              </p>

            </div>


            <div className="grid grid-cols-3 sm:grid-cols-6 gap-5">

              {[
                ['USDA', 'Organic'],
                ['India', 'Vapanie'],
                ['FSSAI', 'Certified'],
                ['ISO', 'ISO 22000'],
                ['♧', 'Fair Trade'],
                ['♧', 'Non-GMO'],
              ].map(([logo, label]) => (

                <div
                  key={label}
                  className="text-center"
                >

                  <div className="h-12 flex items-center justify-center text-xl sm:text-2xl font-bold text-[#075631]">
                    {logo}
                  </div>

                  <p className="text-[10px] sm:text-xs font-medium">
                    {label}
                  </p>

                </div>

              ))}

            </div>

          </div>

        </div>

      </section>

      <Footer />

    </div>
  )
}

export default About