import React, { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import categories, { demoProducts } from "../data/categories.js";

const CategoryProducts = () => {
  const { slug } = useParams();
  const [sortBy, setSortBy] = useState("featured");
  const [message, setMessage] = useState("");

  const category = categories.find((item) => item.slug === slug);

  const products = useMemo(() => {
    const matched = demoProducts.filter(
      (product) => product.categorySlug === slug
    );

    if (sortBy === "price-low") {
      return [...matched].sort((a, b) => a.price - b.price);
    }

    if (sortBy === "price-high") {
      return [...matched].sort((a, b) => b.price - a.price);
    }

    return matched;
  }, [slug, sortBy]);

  const addToCart = (product) => {
    try {
      const existing = JSON.parse(
        localStorage.getItem("Halla_cart") || "[]"
      );

      if (!Array.isArray(existing)) {
        throw new Error("Invalid cart");
      }

      const updated = [...existing];
      const existingItem = updated.find(
        (item) => String(item.id) === String(product.id)
      );

      if (existingItem) {
        existingItem.quantity = (Number(existingItem.quantity) || 1) + 1;
      } else {
        updated.push({
          ...product,
          quantity: 1,
          price: product.price,
        });
      }

      localStorage.setItem("Halla Bol_cart", JSON.stringify(updated));
      window.dispatchEvent(new Event("cartUpdated"));

      setMessage(`${product.name} added to your cart.`);
      window.setTimeout(() => setMessage(""), 2500);
    } catch {
      setMessage("Unable to update the cart. Please try again.");
      window.setTimeout(() => setMessage(""), 2500);
    }
  };

  if (!category) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <main className="mx-auto max-w-3xl px-5 py-20 text-center">
          <h1 className="font-serif text-3xl font-bold">
            Category Not Found
          </h1>
          <p className="mt-3 text-sm text-gray-500">
            This category may have been removed or the link may be incorrect.
          </p>
          <Link
            to="/categories"
            className="mt-6 inline-flex rounded-md bg-[#073b25] px-5 py-3 text-sm font-semibold text-white"
          >
            Browse All Categories
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Navbar />

      {message && (
        <div
          role="status"
          className="fixed right-4 top-20 z-50 max-w-[calc(100%-2rem)] rounded-lg bg-[#073b25] px-5 py-3 text-sm text-white shadow-lg"
        >
          {message}
        </div>
      )}

      <section className="relative flex min-h-63 items-center overflow-hidden bg-[#073b25] sm:min-h-80">
        <img
          src={category.image}
          alt={category.name}
          onError={(e) => {
            e.currentTarget.style.display = "none";
          }}
          className="absolute inset-0 h-full w-full object-cover opacity-40"
        />

        <div className="absolute inset-0 bg-linear-to-r from-[#052d1c]/95 to-[#073b25]/50" />

        <div className="relative z-10 mx-auto w-full max-w-7xl px-5 py-10 sm:px-8 lg:px-5">
          <p className="text-sm text-green-100">

            {category.name}
          </p>

          <h1 className="mt-4 max-w-3xl font-serif text-4xl font-bold text-white sm:text-5xl">
            {category.name}
          </h1>

          <p className="mt-3 max-w-xl text-sm leading-6 text-gray-100 sm:text-base">
            {category.description}
          </p>

          <p className="mt-4 text-sm text-green-100">
            {products.length} demo {products.length === 1 ? "product" : "products"}
          </p>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-5">
        <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <h2 className="font-serif text-2xl font-bold sm:text-3xl">
              Shop {category.name}
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              Explore the products in this collection.
            </p>
          </div>

          <label className="flex items-center gap-3 text-sm text-gray-600">
            Sort by
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="rounded-md border border-gray-300 bg-white px-3 py-2.5 outline-none focus:border-[#073b25]"
            >
              <option value="featured">Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </label>
        </div>

        {products.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {products.map((product) => (
              <article
                key={product.id}
                className="overflow-hidden rounded-xl border border-gray-200 bg-white transition hover:-translate-y-1 hover:shadow-lg"
              >
                <Link
                  to={`/product/${product.id}`}
                  className="block"
                  aria-label={`View ${product.name}`}
                >
                  <div className="h-40 overflow-hidden bg-gray-100 sm:h-52">
                    <img
                      src={product.image}
                      alt={product.name}
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                      className="h-full w-full object-cover transition duration-500 hover:scale-105"
                    />
                  </div>

                  <div className="p-3 sm:p-4">
                    <h3 className="line-clamp-2 min-h-10 text-sm font-semibold sm:text-base">
                      {product.name}
                    </h3>
                    <p className="mt-2 text-xs leading-5 text-gray-500">
                      {product.description}
                    </p>
                    <p className="mt-3 text-lg font-bold text-[#073b25]">
                      ${product.price.toFixed(2)}
                    </p>
                  </div>
                </Link>

                <div className="px-3 pb-3 sm:px-4 sm:pb-4">
                  <button
                    type="button"
                    onClick={() => addToCart(product)}
                    className="w-full rounded-md bg-[#073b25] px-3 py-3 text-xs font-semibold text-white transition hover:bg-[#0b5435] sm:text-sm"
                  >
                    Add to Cart
                  </button>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-gray-200 px-5 py-16 text-center">
            <h3 className="font-serif text-xl font-bold">
              Products coming soon
            </h3>
            <p className="mt-2 text-sm text-gray-500">
              There are no demo products in this category yet.
            </p>
            <Link
              to="/categories"
              className="mt-5 inline-flex rounded-md bg-[#073b25] px-5 py-3 text-sm font-semibold text-white"
            >
              Explore Other Categories
            </Link>
          </div>
        )}

        <div className="mt-8">
          <Link
            to="/categories"
            className="text-sm font-semibold text-[#073b25] hover:underline"
          >
            ← Back to All Categories
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CategoryProducts;
