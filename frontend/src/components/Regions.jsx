import React from "react";
import { Link } from "react-router-dom";

const regions = [
  ["Uttar Pradesh", "/images/region-1.webp"],
  ["Rajasthan", "/images/region-2.webp"],
  ["Gujarat", "/images/region-3.webp"],
  ["Kerala", "/images/region-4.webp"],
  ["Assam", "/images/region-5.webp"],
  ["Kashmir", "/images/region-6.webp"],
];

const Regions = () => {
  return (
    <section className="w-full bg-white">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-5">
        <div className="mb-5 flex flex-col gap-3 sm:mb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="font-serif text-2xl font-bold text-gray-900 sm:text-3xl">
              Explore by Region
            </h2>

            <p className="mt-1 text-xs text-gray-500 sm:text-sm">
              Discover unique products from different regions of India
            </p>
          </div>

          <Link
            to="/regions"
            className="hidden shrink-0 items-center gap-1 text-sm font-semibold text-[#073b25] transition hover:text-[#a77c32] sm:flex"
          >
            View All Regions <span>→</span>
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-6">
          {regions.slice(0, 6).map(([name, image]) => (
            <Link
              to="/regions"
              key={name}
              className="group relative h-32 overflow-hidden rounded-lg sm:h-40 lg:h-44"
            >
              <img
                src={image}
                alt={`${name} regional products`}
                loading="lazy"
                decoding="async"
                width="400"
                height="300"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = "/images/region-placeholder.webp";
                }}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
              />

              <div className="absolute inset-0 bg-black/35 transition duration-300 group-hover:bg-black/45" />

              <div className="relative z-10 flex h-full items-end justify-between gap-2 p-2 text-white sm:p-3">
                <span className="text-xs font-semibold leading-tight sm:text-sm">
                  {name}
                </span>

                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#073b25] text-xs transition group-hover:bg-[#a77c32]">
                  →
                </span>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-6 flex justify-center sm:hidden">
          <Link
            to="/regions"
            className="inline-flex items-center gap-2 rounded-md border border-[#073b25] px-5 py-2.5 text-sm font-semibold text-[#073b25] transition hover:bg-[#073b25] hover:text-white"
          >
            View All Regions →
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Regions;
