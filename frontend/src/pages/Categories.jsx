import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { getCategories } from "../services/categoryService.js";

const CATEGORY_PLACEHOLDER = "/images/category-placeholder.webp";

const Categories = () => {
  const [search, setSearch] = useState("");
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    let active = true;

    const loadCategories = async () => {
      setLoading(true);
      setError("");

      try {
        const data = await getCategories();

        if (active) {
          setCategories(
            Array.isArray(data?.categories) ? data.categories : []
          );
        }
      } catch {
        if (active) {
          setError("Unable to load categories. Please try again.");
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    loadCategories();

    return () => {
      active = false;
    };
  }, [retryCount]);

  const filteredCategories = useMemo(() => {
    const query = search.trim().toLowerCase();

    return categories.filter((category) => {
      const name =
        typeof category?.name === "string" ? category.name : "";
      const description =
        typeof category?.description === "string"
          ? category.description
          : "";

      return (
        name.toLowerCase().includes(query) ||
        description.toLowerCase().includes(query)
      );
    });
  }, [search, categories]);

  const handleCategoryImageError = (event) => {
    const img = event.currentTarget;

    // Prevent an infinite fallback-image error loop.
    if (img.dataset.fallbackApplied === "true") {
      img.style.visibility = "hidden";
      return;
    }

    img.dataset.fallbackApplied = "true";
    img.src = CATEGORY_PLACEHOLDER;
  };

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Navbar />

      <section className="relative flex min-h-75 items-center overflow-hidden bg-[#073b25] sm:min-h-90">
        <img
          src="/images/categories-hero.webp"
          alt=""
          aria-hidden="true"
          loading="eager"
          fetchPriority="high"
          decoding="async"
          onError={(event) => {
            event.currentTarget.style.display = "none";
          }}
          className="absolute inset-0 h-full w-full object-cover"
        />


        <div className="absolute inset-0 bg-black/60" />

        <div className="relative z-10 mx-auto w-full max-w-7xl px-5 py-12 sm:px-8 lg:px-5">
          <p className="text-xs font-semibold uppercase tracking-widest text-green-200">
            Discover Halla Bol
          </p>

          <h1 className="mt-3 max-w-2xl font-serif text-4xl font-bold text-white sm:text-5xl lg:text-6xl">
            Explore Our Categories
          </h1>

          <p className="mt-4 max-w-xl text-sm leading-7 text-gray-100 sm:text-base">
            Explore authentic products, traditional crafts and the rich
            diversity of Indian culture.
          </p>
        </div>
      </section>


      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-5">
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
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search categories..."
              className="w-full rounded-md border border-gray-300 px-4 py-3 text-sm outline-none focus:border-[#073b25] focus:ring-1 focus:ring-[#073b25]"
            />
          </div>
        </div>

        {loading ? (
          <div
            className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
            aria-label="Loading categories"
            aria-busy="true"
          >
            {Array.from({ length: 8 }, (_, index) => (
              <div
                key={index}
                className="overflow-hidden rounded-xl border border-gray-200"
              >
                <div className="h-52 animate-pulse bg-gray-200" />
                <div className="space-y-3 p-5">
                  <div className="h-5 w-2/3 animate-pulse rounded bg-gray-200" />
                  <div className="h-4 w-full animate-pulse rounded bg-gray-100" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div
            className="mt-8 rounded-xl border border-red-200 p-8 text-center"
            role="alert"
          >
            <p className="text-sm text-red-700">{error}</p>

            <button
              type="button"
              onClick={() => setRetryCount((count) => count + 1)}
              className="mt-4 rounded-md bg-[#073b25] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#0b5435]"
            >
              Try Again
            </button>
          </div>
        ) : filteredCategories.length > 0 ? (
          <div className="mt-7 grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {filteredCategories.map((category) => {
              const name =
                typeof category?.name === "string" && category.name.trim()
                  ? category.name
                  : "Category";

              const rawImage =
                typeof category?.image === "string"
                  ? category.image.trim()
                  : "";

              const image = rawImage || CATEGORY_PLACEHOLDER;

              return (
                <Link
                  key={category._id || category.slug || name}
                  to={
                    category.slug
                      ? `/categories/${category.slug}`
                      : "/categories"
                  }
                  className="group overflow-hidden rounded-xl border border-gray-200 bg-white transition-shadow hover:shadow-md"
                >
                  <div className="h-52 overflow-hidden bg-gray-100">
                    <img
                      src={image}
                      alt={name}
                      loading="lazy"
                      decoding="async"
                      width="400"
                      height="208"
                      onError={handleCategoryImageError}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>

                  <div className="p-5">
                    <h3 className="font-serif text-xl font-bold">
                      {name}
                    </h3>

                    <p className="mt-2 text-sm text-gray-500">
                      {typeof category.description === "string"
                        ? category.description
                        : ""}
                    </p>
                  </div>
                </Link>
              );
            })}
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
