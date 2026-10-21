import React, { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { getProducts as fetchProducts } from "../services/productService.js";
import { mapApiProducts } from "../utils/productMapper.js";
import { useCurrency } from "../context/CurrencyContext.jsx";
import { useWishlist } from "../context/WishlistContext.jsx";
import { addToCart, getCartCount } from "../utils/cart";

const countOptions = (values) => {
  const counts = new Map();
  values
    .flat()
    .filter(Boolean)
    .forEach((value) => counts.set(value, (counts.get(value) || 0) + 1));
  return [...counts.entries()].sort(([a], [b]) => a.localeCompare(b));
};

const ProductCard = ({ product, onCart, onWishlist, isWishlisted }) => {
  const { formatPrice, getOldPrice, formatMoney } = useCurrency();
  return (
    <div className="group bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-xl transition duration-300">
      <div className="relative aspect-[1.35/1] bg-gray-100 overflow-hidden">
        <Link to={`/product/${product.id}`} className="block w-full h-full">
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
          />
        </Link>

        {product.tags?.length > 0 && (
          <div className="absolute top-3 left-3 flex flex-wrap gap-1 pointer-events-none">
            {product.tags.slice(0, 1).map((tag) => (
              <span
                key={tag}
                className="bg-white/95 text-[#075631] text-[10px] font-semibold px-2 py-1 rounded-full shadow"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <button
          type="button"
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            onWishlist(product);
          }}
          className={`absolute top-3 right-3 w-9 h-9 rounded-full bg-white/95 flex items-center justify-center text-lg shadow transition ${
            isWishlisted ? "text-red-500" : "text-gray-700 hover:text-red-500"
          }`}
          aria-label={`Add ${product.name} to wishlist`}
        >
          {isWishlisted ? "♥" : "♡"}
        </button>

        {!product.inStock && (
          <div className="absolute inset-0 bg-black/35 flex items-center justify-center pointer-events-none">
            <span className="bg-white text-red-600 font-semibold text-xs px-3 py-2 rounded-full">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      <div className="p-4">
        <Link to={`/product/${product.id}`}>
          <p className="text-xs text-gray-500 mb-1">{product.category}</p>

          <h3 className="font-semibold text-sm sm:text-base text-gray-900 line-clamp-2 min-h-10 hover:text-[#075631] transition">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-center gap-2 mt-2">
          <span className="text-yellow-500 text-sm">★</span>

          <span className="text-sm font-medium">{product.rating || 0}</span>

          <span className="text-xs text-gray-500">
            ({product.reviews || 0})
          </span>
        </div>

        <div className="flex items-center gap-2 mt-3">
          <span className="text-lg font-bold text-[#075631]">
            {formatPrice(product)}
          </span>

          {product.oldPrice && (
            <span className="text-xs text-gray-400 line-through">
              {formatMoney(getOldPrice(product))}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between gap-2 mt-4">
          <span
            className={`text-xs font-medium ${
              product.inStock ? "text-green-600" : "text-red-500"
            }`}
          >
            {product.inStock ? "In Stock" : "Out of Stock"}
          </span>

          <button
            type="button"
            disabled={!product.inStock}
            onClick={() => onCart(product)}
            className="bg-[#075631] hover:bg-[#064526] disabled:bg-gray-300 disabled:cursor-not-allowed text-white text-xs sm:text-sm px-3 py-2 rounded-lg transition"
          >
            🛒 Add
          </button>
        </div>
      </div>
    </div>
  );
};

const FilterSection = ({
  title,
  items,
  selected,
  onChange,
  showMore = false,
}) => {
  const [expanded, setExpanded] = useState(false);

  const visibleItems = showMore && !expanded ? items.slice(0, 5) : items;

  return (
    <div className="border-t border-gray-200 py-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-sm">{title}</h3>

        <span className="text-gray-400 text-xs">⌃</span>
      </div>

      <div className="space-y-2">
        {visibleItems.map(([name, count]) => (
          <label
            key={name}
            className="flex items-center gap-2 text-xs cursor-pointer"
          >
            <input
              type="checkbox"
              checked={selected.includes(name)}
              onChange={() => onChange(name)}
              className="accent-[#073b25]"
            />

            <span className="flex-1">{name}</span>

            <span className="text-gray-400">({count})</span>
          </label>
        ))}
      </div>

      {showMore && items.length > 5 && (
        <button
          type="button"
          onClick={() => setExpanded((value) => !value)}
          className="text-[#073b25] text-xs font-medium mt-3 hover:underline"
        >
          {expanded ? "− Show Less" : "+ Show More"}
        </button>
      )}
    </div>
  );
};

const Products = () => {
  const { currency, formatMoney } = useCurrency();
  const { ids: wishlist, toggle: toggleWishlist } = useWishlist();
  const [searchParams] = useSearchParams();

  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [productsError, setProductsError] = useState("");

  const [search, setSearch] = useState(() => searchParams.get("search") || "");
  const [sort, setSort] = useState("Featured");

  const [mobileFilters, setMobileFilters] = useState(false);

  const [selectedCategories, setSelectedCategories] = useState([]);

  const [selectedRegions, setSelectedRegions] = useState([]);

  const [selectedCertifications, setSelectedCertifications] = useState([]);

  const [selectedTypes, setSelectedTypes] = useState([]);

  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(500);

  const [inStock, setInStock] = useState(true);
  const [outOfStock, setOutOfStock] = useState(false);

  const [cartCount, setCartCount] = useState(0);

  const [page, setPage] = useState(1);

  const categories = useMemo(
    () => countOptions(products.map((product) => product.category)),
    [products],
  );
  const regions = useMemo(
    () => countOptions(products.map((product) => product.region)),
    [products],
  );
  const certifications = useMemo(
    () => countOptions(products.map((product) => product.certifications || [])),
    [products],
  );
  const productTypes = useMemo(
    () => countOptions(products.map((product) => product.productType)),
    [products],
  );

  const productsPerPage = 12;

  useEffect(() => {
    setSearch(searchParams.get("search") || "");
    setPage(1);
  }, [searchParams]);

  useEffect(() => {
    let active = true;
    setProductsLoading(true);
    fetchProducts({ limit: 50, currency })
      .then((data) => {
        if (active) setProducts(mapApiProducts(data.products || [], currency));
      })
      .catch((error) => {
        if (active)
          setProductsError(error.message || "Unable to load products.");
      })
      .finally(() => {
        if (active) setProductsLoading(false);
      });
    return () => {
      active = false;
    };
  }, [currency]);

  useEffect(() => {
    const updateCart = () => {
      setCartCount(getCartCount());
    };

    updateCart();

    window.addEventListener("cartUpdated", updateCart);

    return () => {
      window.removeEventListener("cartUpdated", updateCart);
    };
  }, []);

  const toggleValue = (value, setter) => {
    setter((current) =>
      current.includes(value)
        ? current.filter((item) => item !== value)
        : [...current, value],
    );

    setPage(1);
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedRegions([]);
    setSelectedCertifications([]);
    setSelectedTypes([]);

    setMinPrice(0);
    setMaxPrice(500);

    setInStock(true);
    setOutOfStock(false);

    setSearch("");
    setSort("Featured");

    setPage(1);
  };

  const handleWishlist = async (product) => {
    try {
      await toggleWishlist(product.id);
    } catch (error) {
      setProductsError(error.message || "Unable to update wishlist.");
    }
  };

  const handleAddToCart = (product) => {
    if (!product.inStock) return;

    addToCart(product, 1, "Standard", currency);

    setCartCount(getCartCount());
  };

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (search.trim()) {
      const query = search.trim().toLowerCase();

      result = result.filter((product) => {
        const searchableText = [
          product.name,
          product.category,
          product.categoryType,
          product.region,
          product.productType,
          ...(product.tags || []),
          ...(product.certifications || []),
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        return searchableText.includes(query);
      });
    }

    if (selectedCategories.length > 0) {
      result = result.filter((product) =>
        selectedCategories.includes(product.categoryType),
      );
    }

    if (selectedRegions.length > 0) {
      result = result.filter((product) =>
        selectedRegions.includes(product.region),
      );
    }

    if (selectedCertifications.length > 0) {
      result = result.filter((product) =>
        selectedCertifications.some((certification) =>
          product.certifications?.includes(certification),
        ),
      );
    }

    if (selectedTypes.length > 0) {
      result = result.filter((product) =>
        selectedTypes.includes(product.productType),
      );
    }

    result = result.filter((product) => {
      const price = Number(product.price) || 0;

      return price >= minPrice && price <= maxPrice;
    });

    if (inStock && !outOfStock) {
      result = result.filter((product) => product.inStock);
    } else if (!inStock && outOfStock) {
      result = result.filter((product) => !product.inStock);
    } else if (!inStock && !outOfStock) {
      result = [];
    }

    if (sort === "Price: Low to High") {
      result.sort((a, b) => Number(a.price) - Number(b.price));
    }

    if (sort === "Price: High to Low") {
      result.sort((a, b) => Number(b.price) - Number(a.price));
    }

    if (sort === "Rating") {
      result.sort((a, b) => Number(b.rating || 0) - Number(a.rating || 0));
    }

    if (sort === "Featured") {
      result.sort((a, b) => Number(b.rating || 0) - Number(a.rating || 0));
    }

    return result;
  }, [
    search,
    sort,
    selectedCategories,
    selectedRegions,
    selectedCertifications,
    selectedTypes,
    products,
    minPrice,
    maxPrice,
    inStock,
    outOfStock,
  ]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredProducts.length / productsPerPage),
  );

  const safePage = Math.min(page, totalPages);

  const startIndex = (safePage - 1) * productsPerPage;

  const currentProducts = filteredProducts.slice(
    startIndex,
    startIndex + productsPerPage,
  );

  return (
    <div className="min-h-screen bg-white text-gray-900 overflow-x-hidden">
      <Navbar />

      <section className="relative min-h-80 sm:min-h-90 lg:h-95 overflow-hidden">
        <img
          src="/images/products-hero.jpg"
          alt="Indian Products"
          className="absolute inset-0 w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-black/50" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
          <div className="text-white w-full py-10">
            <h1 className="font-serif text-4xl sm:text-5xl font-bold">
              All Products
            </h1>

            <p className="text-sm sm:text-base mt-4 max-w-2xl text-gray-100 leading-7">
              Explore our wide range of authentic Indian products crafted with
              tradition, quality and care.
            </p>

            <div className="flex flex-wrap gap-4 sm:gap-8 mt-6">
              <div className="flex items-center gap-2 text-xs sm:text-sm">
                <span className="text-[#e7c85f] text-xl">◉</span>
                Indian products
              </div>

              <div className="flex items-center gap-2 text-xs sm:text-sm">
                <span className="text-[#e7c85f] text-xl">♧</span>
                Shipping options
              </div>

              <div className="flex items-center gap-2 text-xs sm:text-sm">
                <span className="text-[#e7c85f] text-xl">♙</span>
                Store-managed catalog
              </div>

              <div className="flex items-center gap-2 text-xs sm:text-sm">
                <span className="text-[#e7c85f] text-xl">◇</span>
                INR & USD pricing
              </div>
            </div>
          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
        <div className="lg:hidden flex gap-2 mb-4">
          <button
            type="button"
            onClick={() => setMobileFilters(!mobileFilters)}
            className="flex-1 border border-gray-300 rounded-md py-2.5 text-sm font-medium hover:bg-gray-50"
          >
            ☰ Filters
          </button>

          <select
            value={sort}
            onChange={(event) => {
              setSort(event.target.value);
              setPage(1);
            }}
            className="flex-1 border border-gray-300 rounded-md px-3 text-sm outline-none bg-white"
          >
            <option>Featured</option>
            <option>Price: Low to High</option>
            <option>Price: High to Low</option>
            <option>Rating</option>
          </select>
        </div>

        <div className="grid lg:grid-cols-[250px_minmax(0,1fr)] gap-6">
          <aside
            className={`border border-gray-200 rounded-xl p-4 h-fit bg-white ${
              mobileFilters ? "block" : "hidden lg:block"
            }`}
          >
            <div className="flex items-center border border-gray-200 rounded-md px-3 h-10 mb-4">
              <span className="text-gray-400">🔍</span>

              <input
                type="text"
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value);
                  setPage(1);
                }}
                placeholder="Search products..."
                className="w-full outline-none text-xs px-2"
              />
            </div>

            <FilterSection
              title="Categories"
              items={categories}
              selected={selectedCategories}
              onChange={(value) => toggleValue(value, setSelectedCategories)}
              showMore
            />

            <FilterSection
              title="Region"
              items={regions}
              selected={selectedRegions}
              onChange={(value) => toggleValue(value, setSelectedRegions)}
              showMore
            />

            <div className="border-t border-gray-200 py-4">
              <div className="flex justify-between">
                <h3 className="font-semibold text-sm">Price Range</h3>

                <span className="text-gray-400 text-xs">⌃</span>
              </div>

              <div className="mt-4">
                <div className="flex justify-between text-[11px] text-gray-500 mb-2">
                  <span>{formatMoney(minPrice)}</span>

                  <span>{formatMoney(maxPrice)}</span>
                </div>

                <input
                  type="range"
                  min="0"
                  max="500"
                  value={minPrice}
                  onChange={(event) => {
                    const value = Number(event.target.value);

                    if (value <= maxPrice) {
                      setMinPrice(value);
                      setPage(1);
                    }
                  }}
                  className="w-full accent-[#073b25]"
                />

                <input
                  type="range"
                  min="0"
                  max="500"
                  value={maxPrice}
                  onChange={(event) => {
                    const value = Number(event.target.value);

                    if (value >= minPrice) {
                      setMaxPrice(value);
                      setPage(1);
                    }
                  }}
                  className="w-full accent-[#073b25] mt-2"
                />
              </div>

              <div className="grid grid-cols-2 gap-2 mt-3">
                <input
                  type="number"
                  value={minPrice}
                  min="0"
                  max={maxPrice}
                  onChange={(event) => {
                    const value = Math.max(
                      0,
                      Math.min(Number(event.target.value) || 0, maxPrice),
                    );

                    setMinPrice(value);
                    setPage(1);
                  }}
                  className="border border-gray-200 rounded-md px-2 py-2 text-xs outline-none"
                  placeholder="Min"
                />

                <input
                  type="number"
                  value={maxPrice}
                  min={minPrice}
                  max="500"
                  onChange={(event) => {
                    const value = Math.min(
                      500,
                      Math.max(Number(event.target.value) || 0, minPrice),
                    );

                    setMaxPrice(value);
                    setPage(1);
                  }}
                  className="border border-gray-200 rounded-md px-2 py-2 text-xs outline-none"
                  placeholder="Max"
                />
              </div>
            </div>

            <div className="border-t border-gray-200 py-4">
              <div className="flex justify-between mb-3">
                <h3 className="font-semibold text-sm">Availability</h3>

                <span className="text-gray-400 text-xs">⌃</span>
              </div>

              <label className="flex items-center gap-2 text-xs mb-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={inStock}
                  onChange={(event) => {
                    setInStock(event.target.checked);
                    setPage(1);
                  }}
                  className="accent-[#073b25]"
                />
                In Stock
              </label>

              <label className="flex items-center gap-2 text-xs cursor-pointer">
                <input
                  type="checkbox"
                  checked={outOfStock}
                  onChange={(event) => {
                    setOutOfStock(event.target.checked);
                    setPage(1);
                  }}
                  className="accent-[#073b25]"
                />
                Out of Stock
              </label>
            </div>

            <FilterSection
              title="Certifications"
              items={certifications}
              selected={selectedCertifications}
              onChange={(value) =>
                toggleValue(value, setSelectedCertifications)
              }
            />

            <FilterSection
              title="Product Type"
              items={productTypes}
              selected={selectedTypes}
              onChange={(value) => toggleValue(value, setSelectedTypes)}
            />

            <div className="grid grid-cols-2 gap-2 mt-3">
              <button
                type="button"
                onClick={() => setMobileFilters(false)}
                className="bg-[#073b25] hover:bg-[#052d1c] text-white rounded-md py-2.5 text-xs font-semibold"
              >
                Apply
              </button>

              <button
                type="button"
                onClick={clearFilters}
                className="border border-[#073b25] text-[#073b25] rounded-md py-2.5 text-xs font-semibold hover:bg-green-50"
              >
                Clear All
              </button>
            </div>
          </aside>

          <section className="min-w-0">
            <div className="flex items-center justify-between gap-3 mb-4">
              <p className="text-xs sm:text-sm text-gray-600">
                Showing{" "}
                <strong>
                  {filteredProducts.length === 0 ? 0 : startIndex + 1}
                </strong>
                {" - "}
                <strong>
                  {Math.min(
                    startIndex + productsPerPage,
                    filteredProducts.length,
                  )}
                </strong>
                {" of "}
                <strong>{filteredProducts.length}</strong> products
              </p>

              <div className="hidden lg:flex items-center gap-2">
                <span className="text-xs">Sort by:</span>

                <select
                  value={sort}
                  onChange={(event) => {
                    setSort(event.target.value);
                    setPage(1);
                  }}
                  className="border border-gray-200 rounded-md px-3 py-2 text-xs outline-none bg-white"
                >
                  <option>Featured</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                  <option>Rating</option>
                </select>
              </div>
            </div>

            {(search ||
              selectedCategories.length > 0 ||
              selectedRegions.length > 0 ||
              selectedCertifications.length > 0 ||
              selectedTypes.length > 0 ||
              minPrice > 0 ||
              maxPrice < 500 ||
              !inStock ||
              outOfStock) && (
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span className="text-xs text-gray-500">Active filters:</span>

                {search && (
                  <span className="bg-gray-100 px-2.5 py-1 rounded-full text-xs">
                    Search: {search}
                  </span>
                )}

                {selectedCategories.map((item) => (
                  <span
                    key={`category-${item}`}
                    className="bg-green-50 text-[#075631] px-2.5 py-1 rounded-full text-xs"
                  >
                    {item}
                  </span>
                ))}

                {selectedRegions.map((item) => (
                  <span
                    key={`region-${item}`}
                    className="bg-green-50 text-[#075631] px-2.5 py-1 rounded-full text-xs"
                  >
                    {item}
                  </span>
                ))}

                <button
                  type="button"
                  onClick={clearFilters}
                  className="text-xs text-red-500 hover:underline"
                >
                  Clear
                </button>
              </div>
            )}

            {productsLoading ? (
              <div className="py-16 text-center text-sm text-gray-500">
                Loading products…
              </div>
            ) : productsError ? (
              <div
                role="alert"
                className="py-16 text-center text-sm text-red-700"
              >
                {productsError}
              </div>
            ) : currentProducts.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
                {currentProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onCart={handleAddToCart}
                    onWishlist={handleWishlist}
                    isWishlisted={wishlist.includes(String(product.id))}
                  />
                ))}
              </div>
            ) : (
              <div className="border border-gray-200 rounded-xl py-16 px-4 text-center">
                <div className="text-5xl mb-4">🔍</div>

                <p className="font-semibold text-lg">No products found</p>

                <p className="text-sm text-gray-500 mt-2">
                  Try changing your search or filters.
                </p>

                <button
                  type="button"
                  onClick={clearFilters}
                  className="mt-5 bg-[#073b25] hover:bg-[#052d1c] text-white px-5 py-2.5 rounded-md text-sm"
                >
                  Clear Filters
                </button>
              </div>
            )}

            {filteredProducts.length > 0 && (
              <div className="flex items-center justify-center gap-1.5 mt-7 flex-wrap">
                <button
                  type="button"
                  disabled={safePage === 1}
                  onClick={() => setPage((current) => Math.max(1, current - 1))}
                  className="w-9 h-9 border border-gray-200 rounded-md disabled:opacity-40 hover:bg-gray-50"
                >
                  ‹
                </button>

                {Array.from({ length: totalPages }, (_, index) => index + 1)
                  .slice(0, 5)
                  .map((number) => (
                    <button
                      key={number}
                      type="button"
                      onClick={() => setPage(number)}
                      className={`w-9 h-9 rounded-md text-xs ${
                        safePage === number
                          ? "bg-[#073b25] text-white"
                          : "border border-gray-200 hover:bg-gray-50"
                      }`}
                    >
                      {number}
                    </button>
                  ))}

                {totalPages > 5 && (
                  <>
                    <span className="px-1 text-gray-400">...</span>

                    <button
                      type="button"
                      onClick={() => setPage(totalPages)}
                      className={`w-9 h-9 rounded-md text-xs ${
                        safePage === totalPages
                          ? "bg-[#073b25] text-white"
                          : "border border-gray-200 hover:bg-gray-50"
                      }`}
                    >
                      {totalPages}
                    </button>
                  </>
                )}

                <button
                  type="button"
                  disabled={safePage === totalPages}
                  onClick={() =>
                    setPage((current) => Math.min(totalPages, current + 1))
                  }
                  className="w-9 h-9 border border-gray-200 rounded-md disabled:opacity-40 hover:bg-gray-50"
                >
                  ›
                </button>
              </div>
            )}
          </section>
        </div>
      </main>

      {cartCount > 0 && (
        <div className="fixed bottom-5 right-4 sm:right-6 z-50">
          <Link
            to="/cart"
            className="bg-[#073b25] hover:bg-[#052d1c] text-white rounded-full shadow-xl px-5 py-3 flex items-center gap-2 text-sm font-medium transition"
          >
            🛒
            <span>Cart</span>
            <span className="bg-white text-[#073b25] rounded-full min-w-5 h-5 px-1 flex items-center justify-center text-xs font-bold">
              {cartCount}
            </span>
          </Link>
        </div>
      )}

      <section className="border-y bg-white mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-5">
            <TrustItem
              icon="▣"
              title="Shipping options"
              text="Availability depends on destination"
            />

            <TrustItem
              icon="▤"
              title="Payment options"
              text="Shown at checkout"
            />

            <TrustItem
              icon="◇"
              title="Live catalog"
              text="Products managed by the store"
            />

            <TrustItem icon="⟳" title="Returns" text="See the return policy" />

            <TrustItem
              icon="◉"
              title="Customer Support"
              text="Send a support request"
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

export default Products;
