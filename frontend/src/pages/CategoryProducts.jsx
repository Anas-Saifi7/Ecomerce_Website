import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { addToCart as addProductToCart } from "../utils/cart.js";
import { getCategories } from "../services/categoryService.js";
import { getProducts } from "../services/productService.js";
import { mapApiProducts } from "../utils/productMapper.js";
import { useCurrency } from "../context/CurrencyContext.jsx";

const CategoryProducts = () => {
  const { slug } = useParams();
  const { currency, formatPrice, formatMoney, getOldPrice } = useCurrency();
  const [sortBy, setSortBy] = useState("featured");
  const [message, setMessage] = useState("");
  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  useEffect(() => {
    let active = true;
    setLoading(true);
    Promise.all([
      getCategories(),
      getProducts({
        category: slug,
        currency,
        sort:
          sortBy === "price-low"
            ? "price_asc"
            : sortBy === "price-high"
              ? "price_desc"
              : "featured",
        limit: 50,
      }),
    ])
      .then(([cats, result]) => {
        if (!active) return;
        setCategory(
          (cats.categories || []).find((item) => item.slug === slug) || null,
        );
        setProducts(mapApiProducts(result.products || [], currency));
      })
      .catch((error) => {
        if (active)
          setLoadError(error.message || "Could not load this category.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [slug, sortBy, currency]);

  const handleAddToCart = (product) => {
    try {
      addProductToCart(product, 1, "Standard", currency);
      setMessage(`${product.name} added to your cart.`);

      window.setTimeout(() => setMessage(""), 2500);
    } catch (error) {
      console.error("Add to cart failed:", error);
      setMessage(error.message || "Unable to update the cart.");

      window.setTimeout(() => setMessage(""), 2500);
    }
  };

  if (!loading && !category) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />

        <main className="mx-auto max-w-3xl px-5 py-20 text-center">
          <h1 className="font-serif text-3xl font-bold">Category Not Found</h1>

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

  if (loading && !category) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <main className="mx-auto max-w-7xl px-5 py-16 text-center text-sm text-gray-500">
          Loading category…
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Navbar />

      {loadError && (
        <p
          role="alert"
          className="mx-auto max-w-7xl px-5 py-4 text-sm text-red-700"
        >
          {loadError}
        </p>
      )}

      {message && (
        <div
          role="status"
          className="fixed right-4 top-20 z-50 max-w-[calc(100%-2rem)] rounded-lg bg-[#073b25] px-5 py-3 text-sm text-white shadow-lg"
        >
          {message}
        </div>
      )}

      <section className="relative flex min-h-63 items-center overflow-hidden sm:min-h-80">
        <img
          src={category.image}
          alt={category.name}
          onError={(event) => {
            event.currentTarget.style.display = "none";
          }}
          className="absolute inset-0 h-full w-full object-cover"
        />

        <div className="absolute inset-0 bg-black/40" />

        <div className="relative z-10 mx-auto w-full max-w-7xl px-5 py-10 sm:px-8 lg:px-5">
          <p className="text-sm text-green-100">{category.name}</p>

          <h1 className="mt-4 max-w-3xl font-serif text-4xl font-bold text-white sm:text-5xl">
            {category.name}
          </h1>

          <p className="mt-3 max-w-xl text-sm leading-6 text-gray-100 sm:text-base">
            {category.description}
          </p>

          <p className="mt-4 text-sm text-green-100">
            {products.length} {products.length === 1 ? "product" : "products"}
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
              onChange={(event) => setSortBy(event.target.value)}
              className="rounded-md border border-gray-300 bg-white px-3 py-2.5 outline-none focus:border-[#073b25]"
            >
              <option value="featured">Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </label>
        </div>

        {loading ? (
          <p className="py-12 text-center text-sm text-gray-500">
            Loading products…
          </p>
        ) : products.length > 0 ? (
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
                      onError={(event) => {
                        event.currentTarget.style.display = "none";
                      }}
                      className="h-full w-full object-cover transition duration-500 hover:scale-105"
                    />
                  </div>

                  <div className="p-3 sm:p-4">
                    <h3 className="line-clamp-2 min-h-10 text-sm font-semibold sm:text-base">
                      {product.name}
                    </h3>

                    <p className="mt-2 text-xs leading-5 text-gray-500">
                      {product.subtitle || product.description || ""}
                    </p>

                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <span className="text-lg font-bold text-[#073b25]">
                        {formatPrice(product)}
                      </span>

                      {product.oldPrice != null && (
                        <span className="text-sm text-gray-400 line-through">
                          {formatMoney(getOldPrice(product))}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>

                <div className="px-3 pb-3 sm:px-4 sm:pb-4">
                  <button
                    type="button"
                    disabled={product.inStock === false}
                    onClick={() => handleAddToCart(product)}
                    className="w-full rounded-md bg-[#073b25] px-3 py-3 text-xs font-semibold text-white transition hover:bg-[#0b5435] disabled:cursor-not-allowed disabled:bg-gray-400 sm:text-sm"
                  >
                    {product.inStock === false ? "Out of Stock" : "Add to Cart"}
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
              There are no products in this category yet.
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
