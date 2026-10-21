import React, { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import { addToCart } from "../utils/cart";
import {
  getOrder,
  trackOrder as fetchTrackedOrder,
} from "../services/orderService.js";
import { getProducts } from "../services/productService.js";
import { mapApiProducts } from "../utils/productMapper.js";
import { useAuth } from "../context/AuthContext.jsx";
import { useWishlist } from "../context/WishlistContext.jsx";

import { formatCurrency, normalizeOrder } from "../data/trackOrderData";

const TrackOrder = () => {
  const [searchParams] = useSearchParams();
  const { isAuthenticated, user } = useAuth();
  const { ids: wishlist, toggle: toggleWishlist } = useWishlist();
  const [orderNumber, setOrderNumber] = useState(
    searchParams.get("order") || "",
  );
  const [email, setEmail] = useState(user?.email || "");
  const [order, setOrder] = useState(() =>
    normalizeOrder({
      orderNumber: "",
      status: "Enter an order number above",
      items: [],
    }),
  );
  const [catalogProducts, setCatalogProducts] = useState([]);
  const [searched, setSearched] = useState(false);
  const [searchError, setSearchError] = useState("");
  const [copied, setCopied] = useState(false);
  const [toast, setToast] = useState("");
  const [zoom, setZoom] = useState(1);
  const money = (amount) =>
    new Intl.NumberFormat(order?.currency === "USD" ? "en-US" : "en-IN", {
      style: "currency",
      currency: order?.currency || "INR",
    }).format(Number(amount) || 0);

  useEffect(() => {
    setEmail(user?.email || "");
  }, [user?.email]);

  useEffect(() => {
    let active = true;
    getProducts({ limit: 50, currency: order?.currency || "INR" })
      .then((data) => {
        if (active)
          setCatalogProducts(
            mapApiProducts(data.products || [], order?.currency || "INR"),
          );
      })
      .catch(() => {
        if (active) setCatalogProducts([]);
      });
    return () => {
      active = false;
    };
  }, [order?.currency]);

  const showToast = (message) => {
    setToast(message);
  };

  const handleTrack = async (event) => {
    event.preventDefault();

    const query = orderNumber.trim();

    if (!query) {
      setSearchError("Please enter your order number.");
      setSearched(false);
      return;
    }

    try {
      if (!isAuthenticated && !email.trim())
        throw new Error("Enter the email address used for this order.");
      const response = isAuthenticated
        ? await getOrder(query)
        : await fetchTrackedOrder(query, email.trim());
      const raw = response.order;
      const mapped = normalizeOrder({
        ...raw,
        total: raw.pricing?.total,
        shippingCost: raw.pricing?.shipping,
        tax: raw.pricing?.tax,
        paymentMethod: raw.payment?.method,
        trackingEvents: (raw.tracking || []).map((event) => ({
          title: event.status,
          description: event.note,
          date: new Date(event.at).toLocaleDateString(),
          time: new Date(event.at).toLocaleTimeString(),
          location: "",
          completed: true,
          active: event.status === raw.status,
          icon: "◇",
        })),
        items: (raw.items || []).map((item) => {
          const product =
            item.product && typeof item.product === "object"
              ? item.product
              : null;
          return {
            ...item,
            id: product?._id || item.product,
            name: item.name || product?.name,
            image: item.image || product?.image || product?.images?.[0],
            detail: item.size,
            price: item.price,
          };
        }),
      });
      setOrder(mapped);
      setOrderNumber(mapped.orderNumber);
      setSearchError("");
      setSearched(true);
      setToast("");
    } catch (err) {
      setSearchError(err.message || "Order could not be found.");
      setSearched(false);
    }
  };

  const handleCopyTracking = async () => {
    if (!order?.trackingId) {
      showToast("A tracking ID is not available for this order yet.");
      return;
    }

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(order.trackingId);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = order.trackingId;
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.select();

        const success = document.execCommand("copy");
        textarea.remove();

        if (!success) throw new Error("Copy failed");
      }

      setCopied(true);
      showToast("Tracking ID copied.");
    } catch {
      showToast("Unable to copy tracking ID. Please copy it manually.");
    }
  };

  const getSharedProduct = (id) =>
    catalogProducts.find((product) => String(product.id) === String(id));

  const handleBuyAgain = (item) => {
    const sharedProduct = getSharedProduct(item.id);

    const productToAdd = sharedProduct ?? {
      id: item.id,
      name: item.name,
      image: item.image,
      price: item.price,
      oldPrice: null,
    };

    try {
      addToCart(
        productToAdd,
        Math.max(1, Number(item.quantity || 1)),
        item.detail || "Standard",
      );

      showToast(`${item.name} added to cart.`);
    } catch (error) {
      console.error("Unable to add product to cart:", error);
      showToast("Could not add this product to your cart.");
    }
  };

  const handleWishlist = async (product) => {
    try {
      await toggleWishlist(product.id);
      showToast(
        wishlist.includes(String(product.id))
          ? `${product.name} removed from wishlist.`
          : `${product.name} added to wishlist.`,
      );
    } catch (error) {
      showToast(error.message || "Could not update your wishlist.");
    }
  };

  const recommendations = useMemo(() => {
    const purchasedIds = new Set(
      (order?.items ?? []).map((item) => String(item.id)),
    );

    const shared = catalogProducts
      .filter((product) => !purchasedIds.has(String(product.id)))
      .slice(0, 6);

    return shared;
  }, [catalogProducts, order]);

  const orderItemCount = useMemo(
    () =>
      (order?.items ?? []).reduce(
        (total, item) => total + Number(item.quantity || 0),
        0,
      ),
    [order],
  );

  const trackingEvents = order?.trackingEvents || [];

  const handlePrintInvoice = () => {
    window.print();
  };

  const resetToLatestOrder = () => {
    setOrder(
      normalizeOrder({
        orderNumber: "",
        status: "Enter an order number above",
        items: [],
      }),
    );
    setOrderNumber("");
    setSearchError("");
    setSearched(false);
    setToast("");
  };

  if (!order) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="flex min-h-[60vh] items-center justify-center px-5">
          <div className="max-w-md text-center">
            <div className="mb-4 text-5xl">📦</div>
            <h1 className="font-serif text-3xl font-bold">Order Not Found</h1>
            <p className="mt-3 text-sm leading-6 text-gray-500">
              Try another order number or check your saved orders.
            </p>
            <button
              type="button"
              onClick={resetToLatestOrder}
              className="mt-5 rounded-lg bg-[#075631] px-5 py-3 text-sm font-semibold text-white"
            >
              Back to Latest Order
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen overflow-x-hidden bg-white text-gray-900">
      <Navbar />

      {toast && (
        <div className="fixed right-4 top-5 z-50 max-w-[calc(100vw-2rem)]">
          <div className="flex items-start gap-3 rounded-lg bg-[#075631] px-4 py-3 text-sm font-medium text-white shadow-xl">
            <span>{toast}</span>
            <button
              type="button"
              onClick={() => setToast("")}
              aria-label="Dismiss message"
              className="ml-2"
            >
              ×
            </button>
          </div>
        </div>
      )}

      <section className="relative overflow-hidden bg-[#073b25]">
        <div className="relative min-h-110 sm:min-h-120">
          <img
            src="/images/track-order-hero.jpg"
            alt="Track your Halla Bol order"
            className="absolute inset-0 h-full w-full object-cover"
            onError={(event) => {
              event.currentTarget.style.display = "none";
            }}
          />

          <div className="absolute inset-0 bg-black/55" />

          <div className="relative z-10 mx-auto flex min-h-110 max-w-7xl items-center px-4 py-12 sm:min-h-120 sm:px-6 lg:px-5">
            <div className="w-full text-white">
              <p className="text-xs uppercase tracking-[0.2em] text-white/80 sm:text-sm">
                Halla Bol Order Tracking
              </p>

              <h1 className="mt-2 font-serif text-4xl font-bold sm:text-5xl lg:text-6xl">
                Track Your Order
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-7 text-white/90 sm:text-base lg:text-lg">
                Enter your order number to check saved order details and any
                available shipment information.
              </p>

              <form
                onSubmit={handleTrack}
                className="mt-7 flex max-w-6xl flex-col gap-2 rounded-xl bg-white p-2 text-gray-900 shadow-xl lg:flex-row lg:items-center"
              >
                {!isAuthenticated && (
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="Email used for the order"
                    autoComplete="email"
                    className="rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none"
                  />
                )}
                <div className="flex min-w-0 flex-1 items-center overflow-hidden rounded-lg border border-gray-300">
                  <span className="flex h-12 w-11 shrink-0 items-center justify-center text-xl text-gray-500">
                    ▣
                  </span>

                  <label htmlFor="track-order-number" className="sr-only">
                    Order number
                  </label>

                  <input
                    id="track-order-number"
                    type="text"
                    value={orderNumber}
                    onChange={(event) => {
                      setOrderNumber(event.target.value);
                      setSearchError("");
                    }}
                    placeholder="Enter your order number"
                    autoComplete="off"
                    className="w-full min-w-0 py-3.5 pr-3 text-sm outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="rounded-lg bg-[#075631] px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-[#064524] lg:w-48"
                >
                  Track Order <span className="ml-2">→</span>
                </button>

                <Link
                  to="/login"
                  className="flex items-center justify-center gap-2 rounded-lg border border-[#075631] px-5 py-3.5 text-sm font-semibold text-[#075631] transition hover:bg-[#eff7e9] lg:w-64"
                >
                  ♙ Login to View All Orders
                </Link>
              </form>

              {searchError ? (
                <div
                  role="alert"
                  className="mt-3 max-w-2xl rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                >
                  {searchError}
                </div>
              ) : (
                <p className="mt-3 text-xs text-white/80">
                  {isAuthenticated
                    ? "Order details are loaded from your account."
                    : "Enter your order number and matching email to view its current status."}
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-5">
        {searched && (
          <div className="mt-5 rounded-lg border border-[#d7e8d3] bg-[#eff7e9] px-4 py-3 text-sm text-[#075631]">
            Showing information for <strong>{order.orderNumber}</strong>.
          </div>
        )}

        <section className="border-b py-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h2 className="font-serif text-2xl font-bold sm:text-3xl">
                  Order #{order.orderNumber}
                </h2>

                <span className="rounded-full bg-[#16834d] px-3 py-1 text-xs font-semibold text-white">
                  {order.status}
                </span>
              </div>

              <p className="mt-2 text-xs text-gray-500 sm:text-sm">
                Placed on {order.placedAt}
                <span className="mx-2">|</span>
                {orderItemCount} item{orderItemCount !== 1 ? "s" : ""}
                <span className="mx-2">|</span>
                Total:{" "}
                <strong className="text-gray-800">{money(order.total)}</strong>
              </p>
            </div>

            <button
              type="button"
              onClick={handlePrintInvoice}
              className="self-start text-xs font-medium text-[#073b25] transition hover:text-[#a77c32] sm:text-sm print:hidden"
            >
              ▣ Download Invoice
            </button>
          </div>

          <div className="mt-9">
            <div className="grid grid-cols-2 gap-7 sm:grid-cols-5 sm:gap-0">
              {trackingEvents.map((step, index) => (
                <div
                  key={`${step.title}-${index}`}
                  className="relative text-center"
                >
                  {index < trackingEvents.length - 1 && (
                    <div
                      className={`absolute left-[60%] top-6 hidden w-[80%] border-t-2 sm:block ${
                        step.completed && trackingEvents[index + 1]?.completed
                          ? "border-[#075631]"
                          : "border-gray-300"
                      }`}
                    />
                  )}

                  <div
                    className={`relative z-10 mx-auto flex h-12 w-12 items-center justify-center rounded-full border-4 border-white text-lg shadow-sm ${
                      step.active
                        ? "bg-[#075631] text-white"
                        : step.completed
                          ? "bg-[#16834d] text-white"
                          : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {step.icon || "◇"}
                  </div>

                  <h3 className="mt-3 text-xs font-semibold sm:text-sm">
                    {step.title}
                  </h3>

                  <p className="mt-1 text-[10px] text-gray-500 sm:text-xs">
                    {step.date}
                  </p>

                  {step.time && (
                    <p className="text-[10px] text-gray-500 sm:text-xs">
                      {step.time}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {!order.trackingEvents?.length && (
            <p className="mt-6 rounded-lg bg-gray-50 p-4 text-sm leading-6 text-gray-600">
              Detailed tracking events are not available for this order yet. The
              timeline above shows the steps used by the tracking interface, not
              confirmed shipment updates.
            </p>
          )}
        </section>

        <section className="py-6">
          <div className="grid gap-4 lg:grid-cols-3">
            <article className="rounded-xl border border-gray-200 p-4 sm:p-5">
              <div className="flex items-center gap-3">
                <span className="text-2xl text-[#075631]">▣</span>
                <h2 className="font-serif text-xl font-bold">
                  Shipment Details
                </h2>
              </div>

              <div className="mt-5 space-y-4 text-xs sm:text-sm">
                <DetailRow label="Tracking ID">
                  <div className="flex items-center justify-end gap-2 text-right font-medium">
                    <span className="break-all">
                      {order.trackingId || "Not assigned"}
                    </span>
                    {order.trackingId && (
                      <button
                        type="button"
                        onClick={handleCopyTracking}
                        className="shrink-0 rounded border border-gray-200 px-2 py-1 text-[10px] text-[#075631] hover:bg-[#eff7e9]"
                      >
                        {copied ? "Copied" : "Copy"}
                      </button>
                    )}
                  </div>
                </DetailRow>

                <DetailRow label="Courier Partner">
                  {order.courier || "Not assigned"}
                </DetailRow>

                <DetailRow label="Shipping Method">
                  {order.shippingMethod || "Not available"}
                </DetailRow>

                <DetailRow label="Estimated Delivery">
                  {order.estimatedDelivery || "Not available"}
                </DetailRow>

                <DetailRow label="Current Location" last>
                  {order.location || "Not available"}
                </DetailRow>
              </div>
            </article>

            <article className="rounded-xl border border-gray-200 p-4 sm:p-5">
              <div className="flex items-center gap-3">
                <span className="text-2xl text-[#075631]">↻</span>
                <h2 className="font-serif text-xl font-bold">
                  Tracking Timeline
                </h2>
              </div>

              <div className="relative ml-2 mt-6">
                <div className="absolute bottom-3 left-2.5 top-2 w-px bg-gray-300" />

                <div className="space-y-6">
                  {trackingEvents.map((event, index) => (
                    <div
                      key={`${event.title}-${index}`}
                      className="relative pl-9"
                    >
                      <span
                        className={`absolute left-0 top-0 flex h-5 w-5 items-center justify-center rounded-full text-[10px] ${
                          event.completed
                            ? "bg-[#16834d] text-white"
                            : "bg-gray-200 text-gray-500"
                        }`}
                      >
                        {event.completed ? "✓" : "◇"}
                      </span>

                      <h3 className="text-sm font-semibold">{event.title}</h3>

                      <p className="text-[10px] text-gray-500">
                        {event.date}
                        {event.time ? `, ${event.time}` : ""}
                      </p>

                      {event.location && (
                        <p className="text-[11px] text-gray-500">
                          {event.location}
                        </p>
                      )}

                      {event.description && (
                        <p className="mt-1 text-xs leading-5 text-gray-600">
                          {event.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </article>

            <article className="rounded-xl border border-gray-200 p-4 sm:p-5">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="text-2xl text-[#075631]">⌖</span>
                  <h2 className="font-serif text-xl font-bold">
                    Carrier Tracking
                  </h2>
                </div>

                <span className="rounded-full bg-gray-100 px-2 py-1 text-[10px] text-gray-600">
                  Order status
                </span>
              </div>

              <div className="hidden">
                <img
                  src="/images/tracking-map.jpg"
                  alt=""
                  className="absolute inset-0 h-full w-full object-cover"
                  style={{
                    transform: `scale(${zoom})`,
                    transition: "transform 200ms ease",
                  }}
                  onError={(event) => {
                    event.currentTarget.style.display = "none";
                  }}
                />

                <div className="absolute inset-0 bg-[#e6f0e5]/60" />

                <svg
                  className="pointer-events-none absolute inset-0 h-full w-full"
                  viewBox="0 0 500 260"
                  preserveAspectRatio="none"
                  aria-hidden="true"
                >
                  <path
                    d="M90 170 C170 150, 230 120, 315 75"
                    fill="none"
                    stroke="#075631"
                    strokeWidth="3"
                    strokeDasharray="8 7"
                  />
                </svg>

                <div className="absolute left-[12%] top-[55%]">
                  <span className="block h-4 w-4 rounded-full border-2 border-white bg-[#073b25] shadow" />
                  <span className="mt-1 block max-w-28 rounded bg-white px-2 py-1 text-[10px] font-semibold shadow">
                    {order.location || "Origin unavailable"}
                  </span>
                </div>

                <div className="absolute right-[5%] top-[20%] max-w-[65%]">
                  <span className="block h-5 w-5 rounded-full border-2 border-white bg-amber-500 shadow" />
                  <div className="mt-1 rounded-md bg-white px-3 py-2 shadow">
                    <p className="text-[10px] font-bold text-[#073b25]">
                      {order.status}
                    </p>
                    <p className="text-xs font-semibold">
                      {order.destination || "Destination unavailable"}
                    </p>
                    <p className="text-[9px] text-gray-500">
                      ETA: {order.estimatedDelivery || "Not available"}
                    </p>
                  </div>
                </div>

                <div className="absolute left-[48%] top-[35%] rotate-12 text-xl">
                  ✈
                </div>

                <div className="absolute bottom-2 right-2 overflow-hidden rounded-md bg-white shadow">
                  <button
                    type="button"
                    onClick={() =>
                      setZoom((value) => Math.min(value + 0.1, 1.4))
                    }
                    aria-label="Zoom in"
                    className="block h-9 w-9 border-b hover:bg-gray-50"
                  >
                    +
                  </button>

                  <button
                    type="button"
                    onClick={() => setZoom((value) => Math.max(value - 0.1, 1))}
                    aria-label="Zoom out"
                    className="block h-9 w-9 hover:bg-gray-50"
                  >
                    −
                  </button>
                </div>
              </div>

              <p className="mt-3 text-xs leading-5 text-gray-500">
                Live carrier location and delivery estimates are not available
                until a courier tracking provider is configured. The status
                timeline below reflects saved order updates.
              </p>

              <div className="mt-3 rounded-lg border border-gray-200 p-3">
                <p className="text-[10px] text-gray-500">Current Location</p>
                <p className="text-xs font-semibold">
                  {order.location || "Not available"}
                </p>

                <p className="mt-3 text-[10px] text-gray-500">Destination</p>
                <p className="text-xs font-semibold">
                  {order.destination || "Not available"}
                </p>
              </div>

              <div className="mt-3 flex flex-col gap-3 rounded-lg border border-gray-200 p-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-semibold">
                    Need Help with Your Order?
                  </p>
                  <p className="mt-1 text-[10px] text-gray-500">
                    Our support team is here to help.
                  </p>
                </div>

                <Link
                  to="/support"
                  className="rounded-md border border-[#075631] px-3 py-2 text-center text-xs font-semibold text-[#075631] transition hover:bg-[#075631] hover:text-white"
                >
                  Contact Support →
                </Link>
              </div>
            </article>
          </div>
        </section>

        <section className="pb-7">
          <div className="grid gap-4 lg:grid-cols-[1.6fr_0.8fr_0.8fr]">
            <article className="rounded-xl border border-gray-200 p-4 sm:p-5">
              <h2 className="mb-4 font-serif text-xl font-bold">
                Products in This Order
              </h2>

              {order.items.length ? (
                <div className="space-y-3">
                  {order.items.map((item, index) => (
                    <div
                      key={`${item.id}-${index}`}
                      className="flex items-center gap-3 border-b pb-3 last:border-b-0 last:pb-0"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        loading="lazy"
                        onError={(event) => {
                          event.currentTarget.src = "/images/product-1.jpg";
                        }}
                        className="h-14 w-14 shrink-0 rounded-md bg-gray-100 object-cover"
                      />

                      <div className="min-w-0 flex-1">
                        <h3 className="line-clamp-2 text-xs font-semibold sm:text-sm">
                          {item.name}
                        </h3>
                        <p className="mt-1 text-[10px] text-gray-500">
                          {item.detail} | Qty: {item.quantity}
                        </p>
                        <p className="mt-1 text-xs font-semibold">
                          {money(item.price * item.quantity)}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleBuyAgain(item)}
                        className="shrink-0 rounded-md border border-[#075631] px-3 py-2 text-[10px] font-semibold text-[#075631] transition hover:bg-[#075631] hover:text-white"
                      >
                        Buy Again
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm leading-6 text-gray-500">
                  Product details have not been saved for this order.
                </p>
              )}
            </article>

            <article className="rounded-xl border border-gray-200 p-4 sm:p-5">
              <div className="flex items-center gap-3">
                <span className="text-2xl text-[#075631]">⌖</span>
                <h2 className="font-serif text-xl font-bold">
                  Shipping Address
                </h2>
              </div>

              <div className="mt-5 space-y-1 text-xs leading-5 text-gray-600 sm:text-sm">
                <p className="font-semibold text-gray-900">
                  {order.customer?.name || "Customer"}
                </p>
                <p>{order.customer?.address || "Address not available"}</p>
                <p>{order.customer?.city || ""}</p>
                <p>{order.customer?.country || "Country not available"}</p>
                {order.customer?.phone && (
                  <p className="mt-1">Phone: {order.customer.phone}</p>
                )}
              </div>
            </article>

            <article className="rounded-xl border border-gray-200 p-4 sm:p-5">
              <div className="flex items-center gap-3">
                <span className="text-2xl text-[#075631]">▤</span>
                <h2 className="font-serif text-xl font-bold">
                  Billing Information
                </h2>
              </div>

              <div className="mt-5 space-y-3 text-xs sm:text-sm">
                <DetailRow label="Payment Method">
                  {order.paymentMethod || "Not available"}
                </DetailRow>

                <DetailRow label="Shipping">
                  {order.shippingCost > 0 ? money(order.shippingCost) : "Free"}
                </DetailRow>

                <DetailRow label="Tax">{money(order.tax)}</DetailRow>

                <div className="flex items-center justify-between gap-3 border-t pt-4">
                  <span className="font-serif text-lg font-bold">Total</span>
                  <span className="font-serif text-xl font-bold text-[#075631]">
                    {money(order.total)}
                  </span>
                </div>
              </div>
            </article>
          </div>
        </section>

        <section className="pb-10">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="font-serif text-2xl font-bold sm:text-3xl">
              You May Also Like
            </h2>

            <Link
              to="/product"
              className="text-xs font-medium text-[#073b25] hover:underline sm:text-sm"
            >
              View All Products →
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {recommendations.map((product) => {
              const sharedProduct = getSharedProduct(product.id);
              const productName = sharedProduct?.name ?? product.name;
              const productImage = sharedProduct?.image ?? product.image;
              const productPrice = Number(
                sharedProduct?.price ?? product.price ?? 0,
              );
              const isWishlisted = wishlist.includes(String(product.id));

              return (
                <article
                  key={product.id}
                  className="group overflow-hidden rounded-lg border border-gray-200 bg-white"
                >
                  <div className="relative h-32 overflow-hidden bg-gray-50 sm:h-36">
                    <Link to={`/product/${product.id}`}>
                      <img
                        src={productImage}
                        alt={productName}
                        loading="lazy"
                        onError={(event) => {
                          event.currentTarget.src = "/images/product-1.jpg";
                        }}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </Link>

                    <button
                      type="button"
                      onClick={() => handleWishlist(sharedProduct ?? product)}
                      aria-label={
                        isWishlisted
                          ? "Remove from wishlist"
                          : "Add to wishlist"
                      }
                      className={`absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full shadow ${
                        isWishlisted
                          ? "bg-[#075631] text-white"
                          : "bg-white text-gray-600"
                      }`}
                    >
                      {isWishlisted ? "♥" : "♡"}
                    </button>
                  </div>

                  <div className="p-2.5">
                    <Link to={`/product/${product.id}`}>
                      <h3 className="line-clamp-2 text-xs font-semibold leading-4 hover:text-[#075631]">
                        {productName}
                      </h3>
                    </Link>

                    <div className="mt-1 flex items-center gap-1">
                      <span className="text-xs text-yellow-500">★</span>
                      <span className="text-[10px]">
                        {sharedProduct?.rating ?? product.rating ?? "4.8"}
                      </span>
                      <span className="text-[10px] text-gray-400">
                        ({sharedProduct?.reviews ?? product.reviews ?? "0"})
                      </span>
                    </div>

                    <div className="mt-2 flex items-center justify-between gap-2">
                      <span className="text-sm font-bold">
                        {formatCurrency(productPrice)}
                      </span>

                      <button
                        type="button"
                        onClick={() => {
                          if (!sharedProduct) {
                            showToast("Product is currently unavailable.");
                            return;
                          }

                          try {
                            addToCart(sharedProduct, 1, "Standard");
                            showToast(`${productName} added to cart.`);
                          } catch (error) {
                            console.error(error);
                            showToast(
                              "Could not add this product to your cart.",
                            );
                          }
                        }}
                        aria-label={`Add ${productName} to cart`}
                        className="h-8 w-8 rounded-md bg-[#073b25] text-sm text-white transition hover:bg-[#075631]"
                      >
                        🛒
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      </main>

      <Footer />

      {/*  and Download Invoice */}
      <style>{`
        @media print {
          nav,
          header,
          footer,
          form,
          button,
          .print\\:hidden {
            display: none !important;
          }

          body {
            background: white !important;
          }

          main {
            max-width: 100% !important;
            padding: 0 !important;
          }

          section {
            break-inside: avoid;
          }
        }
      `}</style>
    </div>
  );
};

function DetailRow({ label, children, last = false }) {
  return (
    <div
      className={`flex items-start justify-between gap-3 ${
        last ? "" : "border-b pb-3"
      }`}
    >
      <span className="shrink-0 text-gray-500">{label}</span>
      <span className="min-w-0 text-right font-medium">{children}</span>
    </div>
  );
}

export default TrackOrder;
