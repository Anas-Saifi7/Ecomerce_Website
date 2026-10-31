import React from "react";
import { Link } from "react-router-dom";

const StorySection = () => {
  return (
    <section className="w-full overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-3">
        <div className="group relative h-72 overflow-hidden sm:h-96 lg:h-90">
          <img
            src="/images/story.webp"
            alt="Indian artisan creating traditional handicrafts"
            loading="lazy"
            decoding="async"
            width="800"
            height="900"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />

          <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent" />
        </div>

        <div className="flex items-center bg-[#fafaf7] px-6 py-10 sm:px-10 sm:py-14 lg:px-9 lg:py-12">
          <div className="mx-auto w-full max-w-lg">
            <p className="text-[10px] font-semibold tracking-[0.2em] text-[#a77c32] sm:text-xs">
              PEOPLE · CULTURE · SUSTAINABILITY
            </p>

            <h2 className="mt-4 font-serif text-3xl font-bold leading-tight text-gray-900 sm:text-4xl">
              Stories Behind
              <br />
              Every Product
            </h2>

            <p className="mt-4 text-sm leading-7 text-gray-600 sm:text-base">
              Meet the artisans, explore the traditions, and discover the rich
              culture behind the products we bring to your home.
            </p>

            <Link
              to="/our-story"
              className="mt-6 inline-flex items-center justify-center gap-2 rounded-md bg-[#075631] px-6 py-3 text-sm font-semibold text-white transition duration-300 hover:bg-[#064524] focus:outline-none focus:ring-2 focus:ring-[#075631] focus:ring-offset-2"
            >
              Read Our Stories <span>→</span>
            </Link>
          </div>
        </div>

        <div className="group relative h-72 overflow-hidden sm:h-96 lg:h-90">
          <img
            src="/images/impact.webp"
            alt="Local artisans and communities in India"
            loading="lazy"
            decoding="async"
            width="800"
            height="900"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />

          <div className="absolute inset-0 bg-linear-to-r from-black/65 via-black/30 to-black/10" />

          <div className="relative z-10 flex h-full items-center px-6 py-10 text-white sm:px-10 lg:px-8">
            <div className="max-w-md">
              <p className="text-[10px] font-semibold tracking-[0.2em] text-[#f0d49b] sm:text-xs">
                OUR PURPOSE
              </p>

              <h2 className="mt-4 font-serif text-3xl font-bold leading-tight sm:text-4xl">
                Empowering
                <br />
                Local Communities
              </h2>

              <p className="mt-4 max-w-sm text-sm leading-7 text-gray-100 sm:text-base">
                We work directly with artisans and producers to support
                traditional craftsmanship and sustainable livelihoods.
              </p>

              <Link
                to="/impact"
                className="mt-6 inline-flex items-center justify-center gap-2 rounded-md bg-white px-6 py-3 text-sm font-semibold text-[#073b25] transition duration-300 hover:bg-[#f0eadc] focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#073b25]"
              >
                Our Impact <span>→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StorySection;
