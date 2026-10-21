import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { getCart, clearCart, saveCart } from "../utils/cart";
import { getProduct } from "../services/productService.js";
import {
  createOrder,
  verifyRazorpayPayment,
  getPaymentConfig,
} from "../services/orderService.js";
import { validateCoupon } from "../services/couponService.js";
import { getSettings } from "../services/settingsService.js";
import { addAddress, getAddresses } from "../services/authService.js";
import { useAuth } from "../context/AuthContext.jsx";
import { useCurrency } from "../context/CurrencyContext.jsx";

const formatMoney = (amount, currency) => {
  return new Intl.NumberFormat(currency === "INR" ? "en-IN" : "en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

const getProductImage = (image) => {
  if (!image) return "/images/hero.jpg";
  if (image.startsWith("/") || image.startsWith("http")) return image;
  return `/images/${image}`;
};

const initialFormData = {
  fullName: "",
  phone: "",
  email: "",
  address: "",
  apartment: "",
  city: "",
  state: "Delhi",
  pinCode: "",
  country: "India",
  billingFullName: "",
  billingAddress: "",
  billingCity: "",
  billingState: "Delhi",
  billingPinCode: "",
  billingCountry: "India",
};

const states = [
  "Delhi",
  "Haryana",
  "Uttar Pradesh",
  "Maharashtra",
  "Rajasthan",
  "Gujarat",
  "Karnataka",
  "Tamil Nadu",
  "Kerala",
  "West Bengal",
  "Punjab",
  "Bihar",
  "Madhya Pradesh",
  "Telangana",
  "Andhra Pradesh",
  "Other",
];

const countries = [
  "India",
  "United States",
  "United Kingdom",
  "Canada",
  "Australia",
  "Germany",
  "France",
  "UAE",
];

const createCheckoutKey = () =>
  globalThis.crypto?.randomUUID?.() ||
  `${Date.now()}-${Math.random().toString(36).slice(2)}`;

const Checkout = () => {
  const { user } = useAuth();
  const { currency, setCurrency } = useCurrency();
  const [cartItems, setCartItems] = useState([]);
  const [cartValidationReady, setCartValidationReady] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("upi");
  const [billingSame, setBillingSame] = useState(true);
  const [formData, setFormData] = useState(initialFormData);
  const [coupon, setCoupon] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [saveAddress, setSaveAddress] = useState(true);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");
  const [idempotencyKey] = useState(createCheckoutKey);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [couponMessage, setCouponMessage] = useState("");
  const [storeSettings, setStoreSettings] = useState(null);
  const [onlinePaymentsEnabled, setOnlinePaymentsEnabled] = useState(false);
  const [addressSaveMessage, setAddressSaveMessage] = useState("");
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState("");

  useEffect(() => {
    Promise.all([getSettings(), getPaymentConfig()])
      .then(([settingsResponse, paymentResponse]) => {
        setStoreSettings(settingsResponse.settings);
        setOnlinePaymentsEnabled(Boolean(paymentResponse.razorpayEnabled));
        if (
          !paymentResponse.razorpayEnabled &&
          settingsResponse.settings.codEnabled &&
          currency === "INR"
        )
          setPaymentMethod("cod");
      })
      .catch(() =>
        setError(
          "Checkout configuration could not be loaded. Please try again later.",
        ),
      );
  }, [currency]);

  useEffect(() => {
    let active = true;
    const currentCart = getCart();
    setCartItems(currentCart);
    if (!currentCart.length) {
      setCartValidationReady(true);
      return () => {
        active = false;
      };
    }

    Promise.all(
      currentCart.map(async (item) => {
        const { product } = await getProduct(item.id || item._id);
        return {
          ...item,
          name: product.name,
          image: product.image || item.image,
          priceINR: Number(product.priceINR),
          priceUSD: Number(product.priceUSD),
        };
      }),
    )
      .then((refreshedCart) => {
        if (!active) return;
        saveCart(refreshedCart);
        setCartItems(refreshedCart);
        setCartValidationReady(true);
      })
      .catch(() => {
        if (active)
          setError(
            "Current product prices could not be verified. Please return to your cart and try again.",
          );
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (user)
      setFormData((current) => ({
        ...current,
        fullName: current.fullName || user.name || "",
        email: current.email || user.email || "",
      }));
  }, [user]);

  useEffect(() => {
    let active = true;
    if (!user) {
      setSavedAddresses([]);
      setSelectedAddressId("");
      return () => {
        active = false;
      };
    }
    getAddresses()
      .then((result) => {
        if (!active) return;
        const addresses = result.addresses || [];
        setSavedAddresses(addresses);
        const preferred =
          addresses.find((address) => address.isDefault) || addresses[0];
        if (preferred) {
          setSelectedAddressId(preferred._id);
          setFormData((current) =>
            current.address
              ? current
              : {
                  ...current,
                  fullName: preferred.fullName || current.fullName,
                  phone: preferred.phone || "",
                  address: preferred.line1 || "",
                  apartment: preferred.line2 || "",
                  city: preferred.city || "",
                  state: preferred.state || "Delhi",
                  pinCode: preferred.postalCode || "",
                  country: preferred.country || "India",
                },
          );
        }
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, [user]);

  const subtotal = useMemo(
    () =>
      cartItems.reduce(
        (sum, item) =>
          sum +
          Number(
            currency === "USD"
              ? (item.priceUSD ?? item.price)
              : (item.priceINR ?? item.price),
          ) *
            Number(item.quantity || 0),
        0,
      ),
    [cartItems, currency],
  );

  const discount = Number(couponApplied?.discount || 0);
  const rates = storeSettings?.shipping?.[currency];
  const countryIsIndia = ["india", "in"].includes(
    String(formData.country).trim().toLowerCase(),
  );
  const codAvailable = Boolean(
    storeSettings?.codEnabled &&
    currency === "INR" &&
    storeSettings.codCountries?.some(
      (country) => country.toLowerCase() === formData.country.toLowerCase(),
    ),
  );
  const shippingCost = rates
    ? countryIsIndia
      ? Math.max(0, subtotal - discount) >= Number(rates.freeAbove)
        ? 0
        : Number(rates.domestic)
      : Number(rates.international)
    : 0;
  const taxableSubtotal = Math.max(0, subtotal - discount);
  const tax =
    Math.round(
      taxableSubtotal *
        (Number(storeSettings?.tax?.[currency] || 0) / 100) *
        100,
    ) / 100;

  const total = Math.max(0, subtotal + shippingCost + tax - discount);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
    setError("");
  };

  const handleApplyCoupon = async () => {
    const code = coupon.trim().toUpperCase();

    if (!code) {
      setCouponApplied(false);
      setCouponMessage("Please enter a coupon code.");
      return;
    }

    try {
      const result = await validateCoupon({ code, subtotal, currency });
      setCouponApplied(result.coupon);
      setCouponMessage(
        `Coupon applied. You saved ${formatMoney(result.coupon.discount, currency)}.`,
      );
      setError("");
    } catch (err) {
      setCouponApplied(false);
      setCouponMessage(
        err.message || "This coupon is not valid for your order.",
      );
    }
  };

  const validateForm = () => {
    if (!cartItems.length) {
      setError("Your cart is empty. Please add products first.");
      return false;
    }

    const requiredFields = [
      ["fullName", "Please enter your full name."],
      ["phone", "Please enter your phone number."],
      ["email", "Please enter your email address."],
      ["address", "Please enter your delivery address."],
      ["city", "Please enter your city."],
      ["state", "Please select your state."],
      ["pinCode", "Please enter your PIN code."],
      ["country", "Please select your country."],
    ];

    for (const [field, message] of requiredFields) {
      if (!String(formData[field] || "").trim()) {
        setError(message);
        return false;
      }
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(formData.email.trim())) {
      setError("Please enter a valid email address.");
      return false;
    }

    const phoneDigits = formData.phone.replace(/\D/g, "");
    if (phoneDigits.length < 10 || phoneDigits.length > 15) {
      setError("Please enter a valid phone number.");
      return false;
    }

    if (formData.pinCode.trim().length < 4) {
      setError("Please enter a valid PIN or postal code.");
      return false;
    }

    if (!billingSame) {
      const billingFields = [
        ["billingFullName", "Please enter billing full name."],
        ["billingAddress", "Please enter billing address."],
        ["billingCity", "Please enter billing city."],
        ["billingPinCode", "Please enter billing PIN code."],
        ["billingState", "Please select billing state."],
        ["billingCountry", "Please select billing country."],
      ];

      for (const [field, message] of billingFields) {
        if (!String(formData[field] || "").trim()) {
          setError(message);
          return false;
        }
      }
    }

    if (!termsAccepted) {
      setError("Please accept the Terms & Conditions and Privacy Policy.");
      return false;
    }

    return true;
  };

  const handlePlaceOrder = async () => {
    if (isSubmitting) return;
    setError("");

    if (!validateForm()) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    if (!storeSettings) {
      setError("Checkout configuration is still loading. Please retry.");
      return;
    }
    if (paymentMethod !== "cod" && !onlinePaymentsEnabled) {
      setError(
        "Online payment is not configured for this store. Select an available method or contact support.",
      );
      return;
    }
    if (paymentMethod === "cod" && !codAvailable) {
      setError("Cash on delivery is unavailable for this country or currency.");
      return;
    }

    const address = {
      fullName: formData.fullName.trim(),
      phone: formData.phone.trim(),
      line1: formData.address.trim(),
      line2: formData.apartment.trim(),
      city: formData.city.trim(),
      state: formData.state,
      postalCode: formData.pinCode.trim(),
      country: formData.country,
    };
    const billingAddress = billingSame
      ? address
      : {
          ...address,
          fullName: formData.billingFullName.trim(),
          line1: formData.billingAddress.trim(),
          city: formData.billingCity.trim(),
          state: formData.billingState,
          postalCode: formData.billingPinCode.trim(),
          country: formData.billingCountry,
        };
    setIsSubmitting(true);
    try {
      const response = await createOrder({
        items: cartItems.map((item) => ({
          product: item.id || item._id,
          quantity: Number(item.quantity),
          size: item.size || "",
        })),
        currency,
        paymentMethod,
        shippingAddress: address,
        billingAddress,
        couponCode: couponApplied?.code || undefined,
        idempotencyKey,
      });
      const order = response.order;
      const persistShippingAddress = async () => {
        if (!user || !saveAddress) return;
        const alreadySaved = savedAddresses.some(
          (saved) =>
            saved.line1?.trim().toLowerCase() ===
              address.line1.trim().toLowerCase() &&
            saved.postalCode?.trim() === address.postalCode.trim() &&
            saved.city?.trim().toLowerCase() ===
              address.city.trim().toLowerCase(),
        );
        if (alreadySaved) {
          setAddressSaveMessage(
            "This delivery address is already saved to your account.",
          );
          return;
        }
        try {
          await addAddress({
            label: "Checkout address",
            fullName: address.fullName,
            phone: address.phone,
            line1: address.line1,
            line2: address.line2,
            city: address.city,
            state: address.state,
            postalCode: address.postalCode,
            country: address.country,
          });
          setAddressSaveMessage("Delivery address saved to your account.");
        } catch {
          setAddressSaveMessage(
            "Order placed, but the address could not be saved. You can add it from your account.",
          );
        }
      };
      if (paymentMethod !== "cod") {
        if (!response.razorpay)
          throw new Error("Payment gateway did not create a payment order.");
        if (!window.Razorpay) {
          await new Promise((resolve, reject) => {
            const script = document.createElement("script");
            script.src = "https://checkout.razorpay.com/v1/checkout.js";
            script.onload = resolve;
            script.onerror = () =>
              reject(new Error("Unable to load the payment provider."));
            document.body.appendChild(script);
          });
        }
        const checkout = new window.Razorpay({
          key: response.razorpay.key,
          order_id: response.razorpay.orderId,
          amount: response.razorpay.amount,
          currency: response.razorpay.currency,
          name: "MOLOG",
          description: `Order ${order.orderNumber}`,
          prefill: {
            name: user?.name || address.fullName,
            email: user?.email || formData.email,
            contact: address.phone,
          },
          handler: async (payment) => {
            try {
              await verifyRazorpayPayment({ ...payment, orderId: order._id });
              await persistShippingAddress();
              clearCart();
              setCartItems([]);
              setOrderNumber(order.orderNumber);
              setOrderPlaced(true);
            } catch (err) {
              setError(
                err.message ||
                  "Payment verification failed. Contact support before retrying.",
              );
            }
          },
          modal: {
            ondismiss: () =>
              setError(
                "Payment was not completed. Your order remains pending.",
              ),
          },
        });
        checkout.open();
        return;
      }
      await persistShippingAddress();
      clearCart();
      setCartItems([]);
      setOrderNumber(order.orderNumber);
      setOrderPlaced(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setError(
        err.message || "We could not place your order. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-gray-50 text-gray-900">
        <Navbar />

        <main className="min-h-[70vh] flex items-center justify-center px-4 py-12">
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm max-w-xl w-full p-7 sm:p-10 text-center">
            <div className="w-20 h-20 mx-auto rounded-full bg-green-100 flex items-center justify-center text-4xl text-[#075631]">
              ✓
            </div>

            <p className="text-sm font-semibold text-[#075631] mt-6">
              ORDER RECEIVED
            </p>

            <h1 className="text-3xl sm:text-4xl font-bold mt-2">
              Thank You For Your Order!
            </h1>

            <p className="text-gray-500 mt-3 leading-6">
              Your order has been saved. You can view updates in your account.
            </p>
            {addressSaveMessage && (
              <p role="status" className="mt-3 text-sm text-amber-800">
                {addressSaveMessage}
              </p>
            )}

            <div className="bg-gray-50 rounded-xl p-4 mt-6">
              <p className="text-xs text-gray-500">Order Number</p>
              <p className="text-lg font-bold text-[#075631] mt-1">
                {orderNumber}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">
              <Link
                to="/product"
                className="border border-[#075631] text-[#075631] hover:bg-green-50 py-3 rounded-xl font-semibold transition"
              >
                Continue Shopping
              </Link>

              <Link
                to="/"
                className="bg-[#075631] hover:bg-[#053f25] text-white py-3 rounded-xl font-semibold transition"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  if (!cartItems.length) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />

        <main className="min-h-[65vh] flex items-center justify-center px-4">
          <div className="text-center max-w-md">
            <div className="text-6xl mb-5">🛒</div>
            <h1 className="text-3xl font-bold">Your Cart is Empty</h1>

            <p className="text-gray-500 mt-3">
              Please add products to your cart before going to checkout.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
              <Link
                to="/product"
                className="bg-[#075631] hover:bg-[#053f25] text-white px-6 py-3 rounded-xl font-semibold"
              >
                Shop Products
              </Link>

              <Link
                to="/cart"
                className="border border-gray-300 px-6 py-3 rounded-xl font-semibold"
              >
                View Cart
              </Link>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <img
          src="/images/hero.jpg"
          alt="Halla Bol checkout"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/55" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-5 py-9 sm:py-12">
          <p className="text-sm text-white/80 mb-2">Home / Cart / Checkout</p>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-white">
            Checkout
          </h1>
          <p className="text-sm sm:text-lg text-white mt-2">
            Complete your order securely
          </p>
        </div>
      </section>

      {/* Checkout steps */}
      <section className="max-w-4xl mx-auto px-4 sm:px-5 py-5">
        <div className="flex items-center justify-between">
          <CheckoutStep
            number="1"
            title="Shipping"
            subtitle="Delivery Address"
          />
          <div className="h-px bg-gray-300 flex-1 mx-2 sm:mx-4" />
          <CheckoutStep number="2" title="Payment" subtitle="Payment Method" />
          <div className="h-px bg-gray-300 flex-1 mx-2 sm:mx-4" />
          <CheckoutStep number="3" title="Review" subtitle="Confirm Order" />
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-5 pb-10">
        <div className="grid lg:grid-cols-[1.8fr_0.9fr] gap-5">
          <div className="space-y-4">
            {error && (
              <div
                role="alert"
                className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm"
              >
                ⚠️ {error}
              </div>
            )}

            {/* Shipping information */}
            <section className="border border-gray-200 rounded-xl p-4 sm:p-6">
              <SectionTitle
                number="1"
                title="Shipping Information"
                rightText="Required fields marked *"
              />

              {savedAddresses.length > 0 && (
                <label className="mt-5 block text-xs font-medium">
                  Use a saved address
                  <select
                    className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm"
                    value={selectedAddressId}
                    onChange={(event) => {
                      const address = savedAddresses.find(
                        (item) => item._id === event.target.value,
                      );
                      setSelectedAddressId(event.target.value);
                      if (address)
                        setFormData((current) => ({
                          ...current,
                          fullName: address.fullName || "",
                          phone: address.phone || "",
                          address: address.line1 || "",
                          apartment: address.line2 || "",
                          city: address.city || "",
                          state: address.state || "Delhi",
                          pinCode: address.postalCode || "",
                          country: address.country || "India",
                        }));
                    }}
                  >
                    <option value="">Enter a new address</option>
                    {savedAddresses.map((address) => (
                      <option key={address._id} value={address._id}>
                        {address.label || address.fullName} — {address.line1},{" "}
                        {address.city}
                      </option>
                    ))}
                  </select>
                </label>
              )}

              <div className="grid md:grid-cols-3 gap-4 mt-5">
                <InputField
                  label="Full Name"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  placeholder="Enter full name"
                />
                <InputField
                  label="Phone Number"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  placeholder="+91 9876543210"
                />
                <InputField
                  label="Email Address"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="you@example.com"
                />
              </div>

              <div className="grid md:grid-cols-[2fr_1fr] gap-4 mt-4">
                <InputField
                  label="Address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  placeholder="House number, street, area"
                />
                <InputField
                  label="Apartment, Suite"
                  name="apartment"
                  value={formData.apartment}
                  onChange={handleChange}
                  placeholder="Optional"
                />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                <InputField
                  label="City"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                  placeholder="City"
                />
                <SelectField
                  label="State"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  required
                  options={states}
                />
                <InputField
                  label="PIN / Postal Code"
                  name="pinCode"
                  value={formData.pinCode}
                  onChange={handleChange}
                  required
                  placeholder="110001"
                />
                <SelectField
                  label="Country"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  required
                  options={countries}
                />
              </div>

              {user ? (
                <label className="flex items-center gap-2 mt-5 text-xs sm:text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={saveAddress}
                    onChange={(e) => setSaveAddress(e.target.checked)}
                    className="accent-[#075631] w-4 h-4"
                  />
                  Save this address to your account
                </label>
              ) : (
                <p className="mt-5 text-xs text-gray-500">
                  Sign in to save this address to your account.
                </p>
              )}
            </section>

            {/* Billing address */}
            <section className="border border-gray-200 rounded-xl p-4 sm:p-6 bg-[#fcfbf8]">
              <SectionTitle number="2" title="Billing Address" />

              <div className="space-y-4 mt-5">
                <RadioLabel
                  checked={billingSame}
                  onChange={() => setBillingSame(true)}
                  label="Same as shipping address"
                />
                <RadioLabel
                  checked={!billingSame}
                  onChange={() => setBillingSame(false)}
                  label="Use a different billing address"
                />
              </div>

              {!billingSame && (
                <div className="mt-5 space-y-4">
                  <InputField
                    label="Billing Full Name"
                    name="billingFullName"
                    value={formData.billingFullName}
                    onChange={handleChange}
                    required
                    placeholder="Billing name"
                  />
                  <InputField
                    label="Billing Address"
                    name="billingAddress"
                    value={formData.billingAddress}
                    onChange={handleChange}
                    required
                    placeholder="Billing address"
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <InputField
                      label="City"
                      name="billingCity"
                      value={formData.billingCity}
                      onChange={handleChange}
                      required
                      placeholder="City"
                    />
                    <InputField
                      label="PIN / Postal Code"
                      name="billingPinCode"
                      value={formData.billingPinCode}
                      onChange={handleChange}
                      required
                      placeholder="PIN code"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <SelectField
                      label="State"
                      name="billingState"
                      value={formData.billingState}
                      onChange={handleChange}
                      required
                      options={states}
                    />
                    <SelectField
                      label="Country"
                      name="billingCountry"
                      value={formData.billingCountry}
                      onChange={handleChange}
                      required
                      options={countries}
                    />
                  </div>
                </div>
              )}
            </section>

            {/* Shipping method */}
            <section className="border border-gray-200 rounded-xl p-4 sm:p-6">
              <SectionTitle number="3" title="Shipping Method" />

              <div className="mt-5 rounded-lg bg-[#f7f8f4] p-4 text-sm">
                <p className="font-semibold">
                  {countryIsIndia
                    ? "Domestic shipping"
                    : "International shipping"}
                </p>
                <p className="mt-1 text-xs text-gray-600">
                  Shipping charges and free-shipping eligibility are based on
                  the delivery address and store settings.
                </p>
                <p className="mt-2 font-semibold text-[#075631]">
                  {storeSettings
                    ? formatMoney(shippingCost, currency)
                    : "Loading shipping rates…"}
                </p>
              </div>
            </section>

            {/* Payment method */}
            <section className="border border-gray-200 rounded-xl p-4 sm:p-6">
              <SectionTitle number="4" title="Payment Method" />

              <p className="text-xs text-gray-500 mt-3">
                {onlinePaymentsEnabled
                  ? "Online payment is completed securely with Razorpay."
                  : "Online payment is not currently configured."}{" "}
                COD availability depends on your delivery country and store
                settings.
              </p>

              <div className="grid md:grid-cols-2 gap-4 mt-5">
                {onlinePaymentsEnabled && (
                  <PaymentOption
                    value="upi"
                    selected={paymentMethod}
                    setSelected={setPaymentMethod}
                    title="UPI / Net Banking"
                    description="UPI, Google Pay, PhonePe, Paytm"
                    logos="GPay • PhonePe • Paytm"
                  />
                )}
                {onlinePaymentsEnabled && (
                  <PaymentOption
                    value="card"
                    selected={paymentMethod}
                    setSelected={setPaymentMethod}
                    title="Credit / Debit Card"
                    description="Card payment option"
                    logos="VISA • RuPay • AMEX"
                  />
                )}
                {codAvailable && (
                  <PaymentOption
                    value="cod"
                    selected={paymentMethod}
                    setSelected={setPaymentMethod}
                    title="Cash on Delivery"
                    description="Pay when the order arrives"
                    logos="COD"
                  />
                )}
                {storeSettings && !onlinePaymentsEnabled && !codAvailable && (
                  <p className="text-sm text-amber-800">
                    No payment methods are configured for this country and
                    currency.
                  </p>
                )}
              </div>
            </section>
          </div>

          {/* Order summary */}
          <aside className="lg:sticky lg:top-4 h-fit space-y-4">
            <section className="border border-gray-200 rounded-xl p-4 sm:p-6 bg-[#fcfaf5]">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="font-serif text-xl sm:text-2xl font-bold">
                    Order Summary
                  </h2>
                  <p className="text-xs text-gray-500 mt-1">
                    {cartItems.reduce(
                      (sum, item) => sum + Number(item.quantity || 0),
                      0,
                    )}{" "}
                    item(s) in your order
                  </p>
                </div>
                <Link
                  to="/cart"
                  className="text-xs font-semibold text-[#075631] underline"
                >
                  Edit Cart
                </Link>
              </div>

              <div className="mt-4">
                {cartItems.map((product, index) => (
                  <div
                    key={`${product.id}-${product.size || "standard"}-${index}`}
                    className="flex gap-3 py-3 border-b border-gray-200"
                  >
                    <img
                      src={getProductImage(product.image)}
                      alt={product.name || "Product"}
                      className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg object-cover shrink-0"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = "/images/hero.jpg";
                      }}
                    />

                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-xs sm:text-sm">
                        {product.name}
                      </h3>
                      <p className="text-[10px] text-gray-500 mt-1">
                        Size: {product.size || "Standard"}
                      </p>
                      <span className="inline-block bg-gray-100 rounded px-2 py-1 text-[10px] mt-2">
                        Qty: {product.quantity}
                      </span>
                    </div>

                    <div className="text-right shrink-0">
                      <strong className="text-sm">
                        {formatMoney(
                          Number(
                            currency === "USD"
                              ? (product.priceUSD ?? product.price)
                              : (product.priceINR ?? product.price),
                          ) * product.quantity,
                          currency,
                        )}
                      </strong>
                      <p className="text-[10px] text-gray-500 mt-1">
                        {formatMoney(
                          currency === "USD"
                            ? (product.priceUSD ?? product.price)
                            : (product.priceINR ?? product.price),
                          currency,
                        )}{" "}
                        each
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-3 text-sm mt-5">
                <SummaryRow
                  label="Subtotal"
                  value={formatMoney(subtotal, currency)}
                />
                <SummaryRow
                  label="Shipping"
                  value={
                    storeSettings
                      ? formatMoney(shippingCost, currency)
                      : "Loading…"
                  }
                />
                <SummaryRow
                  label="Tax"
                  value={
                    storeSettings ? formatMoney(tax, currency) : "Loading…"
                  }
                />

                {couponApplied && (
                  <SummaryRow
                    label="Coupon discount"
                    value={`−${formatMoney(discount, currency)}`}
                    green
                  />
                )}
              </div>

              <div className="flex items-center justify-between gap-3 bg-[#e7f3e4] rounded-xl px-4 py-4 mt-5">
                <span className="font-serif font-bold">Total Amount</span>
                <span className="text-xl sm:text-2xl font-bold text-[#075631] text-right">
                  {formatMoney(total, currency)}
                </span>
              </div>

              <p className="text-[10px] text-gray-500 mt-3">
                INR and USD use separate catalog prices. No exchange conversion
                is applied.
              </p>
            </section>

            {/* Currency selector */}
            <section className="border border-gray-200 rounded-xl p-4 bg-white">
              <h3 className="font-semibold text-sm">Display Currency</h3>
              <p className="text-xs text-gray-500 mt-1">
                Switch how prices are displayed.
              </p>

              <div className="grid grid-cols-2 gap-2 mt-3">
                <button
                  type="button"
                  onClick={() => setCurrency("INR")}
                  className={`rounded-lg border px-3 py-2.5 text-sm font-semibold transition ${
                    currency === "INR"
                      ? "border-[#075631] bg-[#f3faf4] text-[#075631]"
                      : "border-gray-200 hover:border-[#075631]"
                  }`}
                >
                  ₹ INR
                </button>
                <button
                  type="button"
                  onClick={() => setCurrency("USD")}
                  className={`rounded-lg border px-3 py-2.5 text-sm font-semibold transition ${
                    currency === "USD"
                      ? "border-[#075631] bg-[#f3faf4] text-[#075631]"
                      : "border-gray-200 hover:border-[#075631]"
                  }`}
                >
                  $ USD
                </button>
              </div>
            </section>

            {/* Coupon */}
            <section className="border border-gray-200 rounded-xl p-4 bg-[#fcfaf5]">
              <h3 className="font-semibold text-sm">Have a Coupon Code?</h3>

              <div className="flex gap-2 mt-3">
                <input
                  type="text"
                  value={coupon}
                  onChange={(e) => {
                    setCoupon(e.target.value);
                    setCouponApplied(false);
                    setCouponMessage("");
                  }}
                  placeholder="Enter coupon code"
                  aria-label="Coupon code"
                  className="flex-1 min-w-0 border border-gray-300 rounded-lg px-3 py-2.5 text-xs outline-none focus:border-[#075631]"
                />
                <button
                  type="button"
                  onClick={handleApplyCoupon}
                  className="bg-[#075631] hover:bg-[#053f25] text-white px-4 rounded-lg text-xs font-semibold"
                >
                  Apply
                </button>
              </div>

              {couponMessage && (
                <p
                  className={`text-xs mt-2 ${couponApplied ? "text-green-700" : "text-red-600"}`}
                >
                  {couponMessage}
                </p>
              )}
            </section>

            {/* Place order */}
            <section className="border border-gray-200 rounded-xl p-4">
              <button
                type="button"
                onClick={handlePlaceOrder}
                disabled={isSubmitting || !cartValidationReady}
                className="w-full bg-[#075631] hover:bg-[#053f25] text-white rounded-xl py-3.5 font-semibold text-sm transition"
              >
                {isSubmitting
                  ? "Processing…"
                  : `Place Order — ${formatMoney(total, currency)}`}
              </button>

              <label className="flex items-start gap-2 mt-4 text-[10px] sm:text-xs cursor-pointer">
                <input
                  type="checkbox"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  className="accent-[#075631] w-4 h-4 mt-0.5"
                />
                <span>
                  I agree to the{" "}
                  <Link
                    to="/terms-and-conditions"
                    className="text-[#075631] underline font-medium"
                  >
                    Terms & Conditions
                  </Link>{" "}
                  and{" "}
                  <Link
                    to="/privacy-policy"
                    className="text-[#075631] underline font-medium"
                  >
                    Privacy Policy
                  </Link>
                  .
                </span>
              </label>

              <p className="text-[10px] text-gray-500 mt-3">
                Final shipping, discount, tax, and payable total are validated
                by the server.
              </p>
              {addressSaveMessage && (
                <p role="status" className="mt-2 text-xs text-amber-800">
                  {addressSaveMessage}
                </p>
              )}
            </section>

            {/* Trust information */}
            <section className="bg-[#faf8ef] rounded-xl p-4">
              <div className="grid grid-cols-2 gap-4">
                <TrustItem
                  icon="♧"
                  title="Secure Checkout"
                  text="Server validated"
                />
                <TrustItem
                  icon="⟳"
                  title="Easy Returns"
                  text="See return policy"
                />
                <TrustItem
                  icon="◎"
                  title="Global Shipping"
                  text="Shipping options shown"
                />
                <TrustItem
                  icon="♡"
                  title="Customer Support"
                  text="We're here to help"
                />
              </div>
            </section>
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  );
};

const CheckoutStep = ({ number, title, subtitle }) => (
  <div className="flex items-center gap-2 sm:gap-3 min-w-0">
    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full shrink-0 flex items-center justify-center font-semibold bg-[#075631] text-white">
      {number}
    </div>
    <div className="hidden sm:block">
      <p className="font-semibold text-xs sm:text-sm">{title}</p>
      <p className="text-[10px] text-gray-500">{subtitle}</p>
    </div>
  </div>
);

const SectionTitle = ({ number, title, rightText }) => (
  <div className="flex items-center justify-between gap-3">
    <div className="flex items-center gap-3">
      {number && (
        <span className="w-8 h-8 rounded-full bg-[#075631] text-white flex items-center justify-center text-sm font-semibold shrink-0">
          {number}
        </span>
      )}
      <h2 className="font-serif text-xl sm:text-2xl font-bold">{title}</h2>
    </div>
    {rightText && (
      <span className="hidden sm:block text-xs text-gray-500">{rightText}</span>
    )}
  </div>
);

const InputField = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  required = false,
  placeholder = "",
}) => (
  <label className="block">
    <span className="block text-xs font-medium mb-1.5">
      {label}
      {required && <span className="text-red-500 ml-1">*</span>}
    </span>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      placeholder={placeholder}
      autoComplete="on"
      className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#075631] focus:ring-1 focus:ring-[#075631]/20"
    />
  </label>
);

const SelectField = ({
  label,
  name,
  value,
  onChange,
  required = false,
  options,
}) => (
  <label className="block">
    <span className="block text-xs font-medium mb-1.5">
      {label}
      {required && <span className="text-red-500 ml-1">*</span>}
    </span>
    <select
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#075631] bg-white"
    >
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  </label>
);

const RadioLabel = ({ checked, onChange, label }) => (
  <label className="flex items-center gap-3 cursor-pointer">
    <input
      type="radio"
      name="billing"
      checked={checked}
      onChange={onChange}
      className="accent-[#075631] w-4 h-4"
    />
    <span className="text-sm">{label}</span>
  </label>
);

const PaymentOption = ({
  value,
  selected,
  setSelected,
  title,
  description,
  logos,
}) => {
  const isSelected = selected === value;

  return (
    <button
      type="button"
      aria-pressed={isSelected}
      onClick={() => setSelected(value)}
      className={`text-left border rounded-xl p-4 transition w-full ${
        isSelected
          ? "border-[#075631] bg-[#f3faf4] ring-1 ring-[#075631]"
          : "border-gray-200 hover:border-[#075631]"
      }`}
    >
      <div className="flex items-start gap-3">
        <span
          className={`w-4 h-4 rounded-full border shrink-0 mt-0.5 flex items-center justify-center ${
            isSelected ? "border-[#075631]" : "border-gray-400"
          }`}
        >
          {isSelected && <span className="w-2 h-2 bg-[#075631] rounded-full" />}
        </span>
        <div className="flex-1">
          <h3 className="font-semibold text-xs sm:text-sm">{title}</h3>
          <p className="text-[10px] text-gray-500 mt-1">{description}</p>
          {logos && (
            <p className="text-[10px] font-semibold text-[#075631] mt-2">
              {logos}
            </p>
          )}
        </div>
      </div>
    </button>
  );
};

const SummaryRow = ({ label, value, green = false }) => (
  <div
    className={`flex justify-between gap-4 ${green ? "text-green-700" : ""}`}
  >
    <span>{label}</span>
    <span className="text-right">{value}</span>
  </div>
);

const TrustItem = ({ icon, title, text }) => (
  <div className="flex items-start gap-2">
    <span className="text-xl sm:text-2xl text-[#075631] shrink-0">{icon}</span>
    <div>
      <h3 className="font-semibold text-xs">{title}</h3>
      <p className="text-[10px] text-gray-500 mt-1">{text}</p>
    </div>
  </div>
);

export default Checkout;
