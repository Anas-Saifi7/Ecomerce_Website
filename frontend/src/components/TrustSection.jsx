import React from "react";
import { Link } from "react-router-dom";

const trustItems = [
  {
    icon: "✳",
    title: "Authentic",
    description: "Indian products",
  },
  {
    icon: "◎",
    title: "INR & USD",
    description: "Independent prices",
  },
  {
    icon: "✓",
    title: "Live Inventory",
    description: "Stock availability",
  },
  {
    icon: "♡",
    title: "Customer Care",
    description: "Here to help",
  },
];

const TrustSection = () => {
  return (
    <>
    
      <section className="w-full border-y border-gray-100 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-7 sm:px-6 sm:py-9 lg:px-5">
          <div className="grid grid-cols-2 gap-x-4 gap-y-7 md:grid-cols-4 md:gap-6">
            {trustItems.map((item) => (
              <div
                key={item.title}
                className="flex items-center justify-center gap-3 sm:gap-4"
              >
                <span
                  aria-hidden="true"
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#f2f5ef] font-serif text-2xl text-[#075631] sm:h-12 sm:w-12 sm:text-3xl"
                >
                  {item.icon}
                </span>

                <div>
                  <h3 className="font-serif text-sm font-bold text-gray-900 sm:text-base">
                    {item.title}
                  </h3>

                  <p className="mt-1 text-[10px] leading-4 text-gray-500 sm:text-xs">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="w-full border-b border-gray-100 bg-[#fafaf7]">
        <div className="mx-auto max-w-7xl px-4 py-7 sm:px-6 sm:py-9 lg:px-5">
          <div className="flex flex-col items-center justify-center gap-3 text-center sm:flex-row sm:flex-wrap sm:gap-5 lg:gap-8">
            <h2 className="font-serif text-base font-bold text-gray-900 sm:text-lg">
              Explore the Collection
            </h2>

            <p className="text-xs leading-5 text-gray-600 sm:text-sm">
              Browse products by category and region.
            </p>

            <Link
              to="/categories"
              className="inline-flex items-center justify-center gap-2 rounded-md border border-[#075631] bg-white px-5 py-2.5 text-sm font-semibold text-[#075631] transition duration-200 hover:bg-[#075631] hover:text-white focus:outline-none focus:ring-2 focus:ring-[#075631] focus:ring-offset-2"
            >
              Browse Categories <span>→</span>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default TrustSection;
