import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import { addToCart } from "../utils/cart";
import { useWishlist } from "../context/WishlistContext.jsx";
import { useCurrency } from "../context/CurrencyContext.jsx";
import { getProducts } from "../services/productService.js";
import { mapApiProducts } from "../utils/productMapper.js";

const recommendations = [
  {
    name: "Traditional Spice Collection",
    image: "/images/product-2.jpg",
  },
  {
    name: "Handcrafted Brass Decor",
    image: "/images/product-5.jpg",
  },
  {
    name: "Organic Wellness",
    image: "/images/product-6.jpg",
  },
  {
    name: "Textiles & Fashion",
    image: "/images/product-4.jpg",
  },
  {
    name: "Home & Lifestyle",
    image: "/images/product-5.jpg",
  },
];

const Wishlist = () => {
  const { ids: wishlistIds, toggle } = useWishlist();
  const { currency } = useCurrency();
  const [catalog, setCatalog] = useState([]);
  const [loadError, setLoadError] = useState("");
  const [selected, setSelected] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [message, setMessage] = useState("");

  useEffect(() => {
    let active = true;
    getProducts({ limit: 100 })
      .then((response) => {
        if (active)
          setCatalog(
            mapApiProducts(response.products || response.data || [], currency),
          );
      })
      .catch((error) => {
        if (active)
          setLoadError(error.message || "Unable to load saved products.");
      });
    return () => {
      active = false;
    };
  }, [currency]);

  useEffect(() => {
    setSelected((current) => current.filter((id) => wishlistIds.includes(id)));
    setQuantities((current) =>
      Object.fromEntries(wishlistIds.map((id) => [id, current[id] || 1])),
    );
  }, [wishlistIds]);

  const wishlistProducts = useMemo(() => {
    return wishlistIds
      .map((id) => catalog.find((product) => String(product.id) === String(id)))
      .filter(Boolean);
  }, [wishlistIds, catalog]);

  const allSelected =
    wishlistProducts.length > 0 && selected.length === wishlistProducts.length;

  const toggleSelect = (id) => {
    setSelected((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    );
  };

  const toggleSelectAll = () => {
    if (allSelected) {
      setSelected([]);
    } else {
      setSelected(wishlistProducts.map((product) => String(product.id)));
    }
  };

  const changeQuantity = (id, amount) => {
    setQuantities((current) => ({
      ...current,

      [id]: Math.max(1, (current[id] || 1) + amount),
    }));
  };

  const removeProduct = async (id) => {
    try {
      await toggle(id);

      setSelected((current) =>
        current.filter((item) => String(item) !== String(id)),
      );

      setMessage("Product removed from wishlist.");

      setTimeout(() => setMessage(""), 2000);
    } catch (error) {
      setMessage(error.message || "Unable to update your wishlist.");
    }
  };

  const removeSelected = async () => {
    if (selected.length === 0) return;

    await Promise.all(selected.map((id) => toggle(id)));

    setSelected([]);

    setMessage(`${selected.length} product(s) removed from wishlist.`);

    setTimeout(() => setMessage(""), 2000);
  };

  const handleAddToCart = (product) => {
    if (!product.inStock) {
      setMessage(`${product.name} is currently out of stock.`);

      setTimeout(() => setMessage(""), 2500);

      return;
    }

    const quantity = quantities[product.id] || 1;

    addToCart(product, quantity, "Standard");

    setMessage(`${quantity} × ${product.name} added to cart.`);

    setTimeout(() => setMessage(""), 2500);
  };

  const moveSelectedToCart = () => {
    if (selected.length === 0) return;

    let addedCount = 0;

    wishlistProducts.forEach((product) => {
      if (selected.includes(product.id) && product.inStock) {
        const quantity = quantities[product.id] || 1;

        addToCart(product, quantity, "Standard");

        addedCount++;
      }
    });

    if (addedCount === 0) {
      setMessage("Selected products are out of stock.");
    } else {
      setMessage(`${addedCount} product(s) added to cart.`);
    }

    setTimeout(() => setMessage(""), 2500);
  };

  const moveAllToCart = () => {
    if (wishlistProducts.length === 0) return;

    let addedCount = 0;

    wishlistProducts.forEach((product) => {
      if (!product.inStock) return;

      const quantity = quantities[product.id] || 1;

      addToCart(product, quantity, "Standard");

      addedCount++;
    });

    if (addedCount === 0) {
      setMessage("All wishlist products are out of stock.");
    } else {
      setMessage(`${addedCount} product(s) moved to cart.`);
    }

    setTimeout(() => setMessage(""), 2500);
  };

  const wishlistTotal = useMemo(() => {
    return wishlistProducts.reduce((total, product) => {
      const quantity = quantities[product.id] || 1;

      return total + Number(product.price || 0) * quantity;
    }, 0);
  }, [wishlistProducts, quantities]);

  return (
    <div className="min-h-screen bg-white text-gray-900 overflow-x-hidden">
      <Navbar />

      <section className="relative min-h-70 sm:min-h-83 lg:h-88 overflow-hidden">
        <img
          src="/images/wishlist-hero.jpg"
          alt="My Wishlist"
          className="absolute inset-0 w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-black/55" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
          <div className="text-white mt-20">
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold">
              My Wishlist
            </h1>

            <p className="text-sm sm:text-base lg:text-lg mt-3 text-gray-100">
              Your favorite products, saved for later.
            </p>
          </div>

          <div className="hidden lg:block absolute right-10 top-16 text-white font-serif italic text-3xl leading-tight rotate-[-5deg]">
            Good
            <br />
            Things
            <br />
            Always
            <br />
            Stay <span className="text-yellow-300">♡</span>
          </div>
        </div>
      </section>

      {message && (
        <div className="fixed top-24 right-4 sm:right-6 z-100 max-w-[calc(100vw-2rem)]">
          <div className="bg-[#073b25] text-white px-5 py-3 rounded-lg shadow-xl text-sm">
            ✓ {message}
          </div>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-7">
        {loadError && (
          <p
            role="alert"
            className="mb-4 rounded bg-red-50 p-3 text-sm text-red-700"
          >
            {loadError}
          </p>
        )}

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
          <div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold">
              {wishlistProducts.length} Saved Product
              {wishlistProducts.length !== 1 ? "s" : ""}
            </h2>

            {wishlistProducts.length > 0 && (
              <p className="text-sm text-gray-500 mt-1">
                Wishlist value: ₹
                {wishlistTotal.toLocaleString(
                  currency === "INR" ? "en-IN" : "en-US",
                )}
              </p>
            )}
          </div>

          {wishlistProducts.length > 0 && (
            <div className="flex flex-col sm:flex-row gap-2">
              <label className="flex items-center justify-center gap-2 border border-gray-200 rounded-md px-4 py-2.5 text-sm cursor-pointer hover:bg-gray-50">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={toggleSelectAll}
                  className="accent-[#073b25]"
                />
                Select All
              </label>

              <button
                type="button"
                onClick={removeSelected}
                disabled={selected.length === 0}
                className="border border-gray-200 text-[#073b25] rounded-md px-5 py-2.5 text-sm font-medium disabled:opacity-40 hover:bg-gray-50"
              >
                🗑 Remove Selected
              </button>

              <button
                type="button"
                onClick={moveSelectedToCart}
                disabled={selected.length === 0}
                className="border border-[#073b25] text-[#073b25] rounded-md px-5 py-2.5 text-sm font-medium disabled:opacity-40 hover:bg-green-50"
              >
                🛒 Add Selected
              </button>

              <button
                type="button"
                onClick={moveAllToCart}
                className="bg-[#073b25] text-white rounded-md px-5 py-2.5 text-sm font-medium hover:bg-[#052d1c] transition"
              >
                🛒 Move All to Cart
              </button>
            </div>
          )}
        </div>

        {wishlistProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
            {wishlistProducts.map((product) => (
              <article
                key={product.id}
                className="group border border-gray-200 rounded-xl bg-white overflow-hidden hover:shadow-lg transition duration-300"
              >
                <div className="relative aspect-square overflow-hidden bg-gray-100">
                  <Link to={`/product/${product.id}`}>
                    <img
                      src={product.image}
                      alt={product.name}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </Link>

                  {product.tags?.[0] && (
                    <span className="absolute top-2 left-2 bg-[#dff3e5] text-[#073b25] text-[9px] sm:text-[10px] px-2 py-1 rounded-full font-medium">
                      {product.tags[0]}
                    </span>
                  )}

                  <label className="absolute top-2 left-2 mt-8 w-7 h-7 bg-white rounded-full shadow flex items-center justify-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selected.includes(product.id)}
                      onChange={() => toggleSelect(product.id)}
                      className="accent-[#073b25]"
                    />
                  </label>

                  <button
                    type="button"
                    onClick={() => removeProduct(product.id)}
                    className="absolute top-2 right-2 w-8 h-8 bg-white rounded-full shadow flex items-center justify-center text-red-500 text-lg hover:bg-red-50 transition"
                    aria-label={`Remove ${product.name} from wishlist`}
                  >
                    ♥
                  </button>

                  {!product.inStock && (
                    <div className="absolute inset-0 bg-black/35 flex items-center justify-center">
                      <span className="bg-white text-red-500 text-xs font-semibold px-3 py-2 rounded-full">
                        Out of Stock
                      </span>
                    </div>
                  )}
                </div>

                <div className="p-3">
                  <Link to={`/product/${product.id}`}>
                    <h3 className="font-serif font-bold text-sm leading-5 min-h-10 hover:text-[#073b25] transition">
                      {product.name}
                    </h3>
                  </Link>

                  {product.subtitle && (
                    <p className="text-[10px] text-gray-500 mt-1">
                      {product.subtitle}
                    </p>
                  )}

                  <div className="flex items-center gap-1 mt-2">
                    <span className="text-[#f4a300] text-xs">★★★★★</span>

                    <span className="text-[10px] text-gray-500">
                      {product.rating || 0} ({product.reviews || 0})
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 mt-2">
                    <span className="font-bold text-lg text-[#073b25]">
                      {currency === "INR" ? "₹" : "$"}
                      {Number(product.price || 0).toLocaleString(
                        currency === "INR" ? "en-IN" : "en-US",
                      )}
                    </span>

                    {product.oldPrice && (
                      <span className="text-xs text-gray-400 line-through">
                        ₹{/* $ */}
                        {Number(product.oldPrice).toLocaleString("en-IN")}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center w-fit border border-gray-200 rounded-md mt-3 overflow-hidden">
                    <button
                      type="button"
                      onClick={() => changeQuantity(product.id, -1)}
                      className="w-8 h-8 hover:bg-gray-50"
                    >
                      −
                    </button>

                    <span className="w-9 h-8 flex items-center justify-center text-xs border-x border-gray-200">
                      {quantities[product.id] || 1}
                    </span>

                    <button
                      type="button"
                      onClick={() => changeQuantity(product.id, 1)}
                      className="w-8 h-8 hover:bg-gray-50"
                    >
                      +
                    </button>
                  </div>

                  <button
                    type="button"
                    disabled={!product.inStock}
                    onClick={() => handleAddToCart(product)}
                    className="w-full bg-[#073b25] hover:bg-[#052d1c] disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-md py-2.5 mt-3 text-xs sm:text-sm font-medium transition"
                  >
                    🛒 Add to Cart
                  </button>

                  <Link
                    to={`/product/${product.id}`}
                    className="block text-center text-xs text-[#073b25] font-medium mt-3 hover:underline"
                  >
                    View Details →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="border border-gray-200 rounded-xl py-20 px-5 text-center">
            <div className="text-6xl mb-5">♡</div>

            <h2 className="font-serif text-2xl sm:text-3xl font-bold">
              Your Wishlist is Empty
            </h2>

            <p className="text-sm text-gray-500 mt-2 max-w-md mx-auto">
              Save your favorite products here and come back later.
            </p>

            <Link
              to="/product"
              className="inline-flex bg-[#073b25] hover:bg-[#052d1c] text-white px-6 py-3 rounded-md mt-6 text-sm font-medium transition"
            >
              Explore Products →
            </Link>
          </div>
        )}
      </main>

      <section className="relative overflow-hidden bg-[#f4f0df]">
        <div className="absolute inset-0">
          <img
            src="/images/discover-products.jpg"
            alt=""
            className="w-full h-full object-cover opacity-50"
          />

          <div className="absolute inset-0 bg-[#f4f0df]/40" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-6 py-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-7">
            <div className="max-w-md">
              <h2 className="font-serif text-2xl sm:text-3xl font-bold leading-tight">
                Discover More
                <br />
                Products You'll Love
              </h2>

              <p className="text-sm text-gray-700 mt-2">
                Explore authentic Indian products, handpicked for you.
              </p>

              <Link
                to="/product"
                className="inline-flex bg-[#073b25] hover:bg-[#052d1c] text-white px-5 py-2.5 rounded-md mt-4 text-sm font-medium transition"
              >
                Explore All Products →
              </Link>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-5 gap-4 sm:gap-7">
              {recommendations.map((item) => (
                <Link
                  key={item.name}
                  to="/product"
                  className="text-center group"
                >
                  <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-full overflow-hidden mx-auto border-2 border-white shadow">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                    />
                  </div>

                  <p className="text-[10px] sm:text-xs font-medium mt-2 max-w-25 mx-auto">
                    {item.name}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-y bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-5">
            <TrustItem
              icon="◉"
              title="Store catalog"
              text="Products listed by the store"
            />

            <TrustItem
              icon="▤"
              title="Checkout"
              text="Totals validated by the server"
            />

            <TrustItem
              icon="▣"
              title="Shipping options"
              text="Shown at checkout"
            />

            <TrustItem icon="⟳" title="Returns" text="See the return policy" />

            <TrustItem
              icon="◉"
              title="Dedicated Support"
              text="Here to help you"
              extraClass="col-span-2 md:col-span-1"
            />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

const TrustItem = ({ icon, title, text, extraClass = "" }) => {
  return (
    <div className={`flex items-center justify-center gap-3 ${extraClass}`}>
      <span className="text-3xl text-[#073b25]">{icon}</span>

      <div>
        <strong className="block text-xs sm:text-sm">{title}</strong>

        <span className="text-[10px] text-gray-500">{text}</span>
      </div>
    </div>
  );
};

export default Wishlist;
