import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import categories from "../data/categories.js";

const Categories = () => {
  const [search, setSearch] = useState("");

  const filteredCategories = useMemo(() => {
    const query = search.trim().toLowerCase();

    return categories.filter(
      (category) =>
        category.name.toLowerCase().includes(query) ||
        category.description.toLowerCase().includes(query)
    );
  }, [search]);

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Navbar />

      <section className="relative flex min-h-75 items-center overflow-hidden sm:min-h-90">
        <img
          src="/images/categories-hero.jpg"
          alt="Explore Indian products"
          onError={(e) => {
            e.currentTarget.style.display = "none";
          }}
          className="absolute inset-0 h-full w-full bg-[#073b25] object-cover"
        />

        <div className="absolute inset-0 bg-black/60" />

        <div className="relative z-10 mx-auto w-full max-w-7xl px-5 py-12 sm:px-8 lg:px-5">
          <p className="text-xs font-semibold uppercase tracking-widest text-green-200">
            Discover Halla Boll
          </p>

          <h1 className="mt-3 max-w-2xl font-serif text-4xl font-bold text-white sm:text-5xl lg:text-6xl">
            Explore Our Categories
          </h1>

          <p className="mt-4 max-w-xl text-sm leading-7 text-gray-100 sm:text-base">
            Explore authentic products, traditional crafts and the rich
            diversity of Indian culture.
          </p>

          <p className="mt-5 text-sm text-green-100">
          
          </p>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-5">
        {/* Heading and Search */}
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <h2 className="font-serif text-2xl font-bold sm:text-3xl">
              Shop All Categories
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              Select a category to explore and shop its products.
            </p>
          </div>

          <div className="w-full sm:max-w-xs">
            <label htmlFor="category-search" className="sr-only">
              Search categories
            </label>
            <input
              id="category-search"
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search categories..."
              className="w-full rounded-md border border-gray-300 px-4 py-3 text-sm outline-none focus:border-[#073b25] focus:ring-1 focus:ring-[#073b25]"
            />
          </div>
        </div>

        {filteredCategories.length > 0 ? (
          <div className="mt-7 grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {filteredCategories.map((category) => (
              <Link
                key={category.id}
                to={`/categories/${category.slug}`}
                className="group overflow-hidden rounded-xl border border-gray-200 bg-white transition duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="h-52 overflow-hidden bg-gray-100">
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

                <div className="p-5">
                  <h3 className="font-serif text-xl font-bold transition group-hover:text-[#073b25]">
                    {category.name}
                  </h3>

                  <p className="mt-2 min-h-12 text-sm leading-6 text-gray-500">
                    {category.description}
                  </p>

                  <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4">
                    <span className="text-sm font-semibold text-[#073b25]">
                      Explore Products
                    </span>
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f4df8d] text-[#073b25] transition group-hover:bg-[#073b25] group-hover:text-white">
                      →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="mt-8 rounded-xl border border-gray-200 py-16 text-center">
            <h3 className="font-serif text-xl font-bold">
              No categories found
            </h3>
            <p className="mt-2 text-sm text-gray-500">
              Try another category name.
            </p>
            <button
              type="button"
              onClick={() => setSearch("")}
              className="mt-4 text-sm font-semibold text-[#073b25] underline"
            >
              Clear Search
            </button>
          </div>
        )}

        <div className="mt-10 rounded-xl bg-[#eff7e9] p-6 sm:p-8">
          <h2 className="font-serif text-2xl font-bold">
            India's Goodness, Delivered to You
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-600">
            Discover products inspired by India's farmers, artisans and
            traditions. Select a category to browse the available collection.
          </p>
          <Link
            to="/product"
            className="mt-5 inline-flex rounded-md bg-[#073b25] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#0b5435]"
          >
            Browse All Products →
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Categories;