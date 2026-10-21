import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getCategories } from '../services/categoryService.js';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  useEffect(() => {
    let active = true;
    getCategories().then((data) => { if (active) setCategories(data.categories || []); }).catch(() => {});
    return () => { active = false; };
  }, []);
  return (
    <section className="w-full bg-white">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-5">
        <div className="mb-5 flex items-end justify-between gap-4 sm:mb-6">
          <div>
            <h2 className="font-serif text-2xl font-bold text-gray-900 sm:text-3xl">
              Shop by Category
            </h2>
            <p className="mt-1 text-xs text-gray-500 sm:text-sm">
              Explore authentic products from across India.
            </p>
          </div>

          <Link
            to="/categories"
            className="hidden shrink-0 items-center gap-1 text-sm font-semibold text-[#073b25] transition hover:text-[#a77c32] sm:flex"
          >
            View All Categories <span>→</span>
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-6">
          {categories.map((category) => (
            <Link
              to={`/categories/${category.slug}`}
              key={category._id}
              className="group overflow-hidden rounded-lg border border-gray-200 bg-white transition duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="h-32 overflow-hidden bg-gray-100 sm:h-40 lg:h-44">
                <img
                  src={category.image}
                  alt={category.name}
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>

              <div className="flex min-h-14 items-center justify-center px-2 py-3">
                <p className="text-center font-serif text-xs font-semibold leading-snug text-gray-800 transition group-hover:text-[#073b25] sm:text-sm">
                  {category.name}
                </p>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-6 flex justify-center sm:hidden">
          <Link
            to="/categories"
            className="inline-flex items-center gap-2 rounded-md border border-[#073b25] px-5 py-2.5 text-sm font-semibold text-[#073b25] transition hover:bg-[#073b25] hover:text-white"
          >
            View All Categories →
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Categories;
