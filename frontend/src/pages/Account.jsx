import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {
  sidebarItems,
  orders,
  initialAddresses,
  initialWishlist,
  initialProfile,
  initialReviews,
  initialPaymentMethods,
  initialNotificationPreferences,
} from "../data/Account.js";

const Account = () => {
  const navigate = useNavigate();

  const [activeItem, setActiveItem] = useState("Dashboard");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [profile, setProfile] = useState(() => {
    try {
      return {
        ...initialProfile,
        ...JSON.parse(localStorage.getItem("Halla_account_profile") || "{}"),
      };
    } catch {
      return initialProfile;
    }
  });

  const [addresses, setAddresses] = useState(() => {
    try {
      return (
        JSON.parse(localStorage.getItem("Halla Bol_account_addresses") || "null") ||
        initialAddresses
      );
    } catch {
      return initialAddresses;
    }
  });

  const [wishlist, setWishlist] = useState(() => {
    try {
      return (
        JSON.parse(localStorage.getItem("Halla Bol_account_wishlist") || "null") ||
        initialWishlist
      );
    } catch {
      return initialWishlist;
    }
  });

  const [notification, setNotification] = useState("");
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);

  const [emailNotifications, setEmailNotifications] = useState(
    initialNotificationPreferences.emailNotifications
  );
  const [orderNotifications, setOrderNotifications] = useState(
    initialNotificationPreferences.orderUpdates
  );
  const [offerNotifications, setOfferNotifications] = useState(
    initialNotificationPreferences.offersPromotions
  );

  const [paymentMethods, setPaymentMethods] = useState(initialPaymentMethods);
  const [profileForm, setProfileForm] = useState(profile);

  const [addressForm, setAddressForm] = useState({
    title: "",
    name: "",
    address1: "",
    address2: "",
    phone: "",
  });

  const [paymentForm, setPaymentForm] = useState({
    cardNumber: "",
    expiry: "",
    cvv: "",
    cardholder: "",
  });

  const showMessage = (message) => {
    setNotification(message);
    window.setTimeout(() => setNotification(""), 2800);
  };

  const persistAddresses = (next) => {
    setAddresses(next);
    localStorage.setItem("Halla Bol_account_addresses", JSON.stringify(next));
  };

  const persistWishlist = (next) => {
    setWishlist(next);
    localStorage.setItem("Halla Bol_account_wishlist", JSON.stringify(next));
  };

  const handleSidebarClick = (label) => {
    setActiveItem(label);
    setMobileMenuOpen(false);

    if (label === "Personal Information") {
      setProfileForm(profile);
      setShowProfileModal(true);
    }
  };

  const handleProfileChange = (e) => {
    setProfileForm({
      ...profileForm,
      [e.target.name]: e.target.value,
    });
  };

  const saveProfile = (e) => {
    e.preventDefault();

    const updated = {
      name: profileForm.name.trim(),
      email: profileForm.email.trim(),
      phone: profileForm.phone.trim(),
    };

    setProfile(updated);
    localStorage.setItem("Halla Bol_account_profile", JSON.stringify(updated));
    setShowProfileModal(false);
    showMessage("Profile updated successfully");
  };

  const openAddressEdit = (address) => {
    setEditingAddress(address);

    setAddressForm({
      title: address.title,
      name: address.name,
      address1: address.address[0] || "",
      address2: address.address[1] || "",
      phone: address.phone,
    });

    setShowAddressModal(true);
  };

  const handleAddressChange = (e) => {
    setAddressForm({
      ...addressForm,
      [e.target.name]: e.target.value,
    });
  };

  const saveAddress = (e) => {
    e.preventDefault();

    if (!editingAddress) return;

    const updated = addresses.map((item) =>
      item.id === editingAddress.id
        ? {
            ...item,
            title: addressForm.title.trim(),
            name: addressForm.name.trim(),
            address: [
              addressForm.address1.trim(),
              addressForm.address2.trim(),
            ].filter(Boolean),
            phone: addressForm.phone.trim(),
          }
        : item
    );

    persistAddresses(updated);
    setShowAddressModal(false);
    setEditingAddress(null);
    showMessage("Address updated successfully");
  };

  const removeWishlist = (id) => {
    persistWishlist(wishlist.filter((item) => item.id !== id));
    showMessage("Product removed from wishlist");
  };

  const addToCart = (product) => {
    let existing = [];

    try {
      existing = JSON.parse(localStorage.getItem("Halla Bol_cart") || "[]");
      if (!Array.isArray(existing)) existing = [];
    } catch {
      existing = [];
    }

    const updated = [...existing, { ...product, quantity: 1 }];

    localStorage.setItem("Halla Bol_cart", JSON.stringify(updated));
    window.dispatchEvent(new Event("cartUpdated"));
    showMessage(`${product.name} added to cart`);
  };

  const logout = () => {
    setShowLogoutModal(false);
    localStorage.removeItem("Halla Bol_user");
    showMessage("Logging out...");
    window.setTimeout(() => navigate("/login"), 500);
  };

  const getStatusClass = (status) => {
    if (status === "Cancelled") return "bg-red-50 text-red-600";
    if (status === "In Transit") return "bg-blue-50 text-blue-600";
    return "bg-green-50 text-green-600";
  };

  const PageCard = ({ title, subtitle, children }) => (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
      <div className="border-b px-4 py-5 sm:px-6">
        <h2 className="font-serif text-2xl font-bold sm:text-3xl">{title}</h2>
        {subtitle && (
          <p className="mt-1 text-xs text-gray-500 sm:text-sm">{subtitle}</p>
        )}
      </div>
      <div className="p-4 sm:p-6">{children}</div>
    </div>
  );

  const InfoRow = ({ label, value }) => (
    <div className="rounded-lg border border-gray-200 p-4">
      <p className="text-xs text-gray-500">{label}</p>
      <p className="mt-1 wrap-break-word text-sm font-semibold">
        {value || "Not provided"}
      </p>
    </div>
  );

  const Stat = ({ icon, value, label, red = false }) => (
    <div className="flex items-center gap-3 border-b border-gray-200 p-3 last:border-r-0 sm:border-b-0 sm:border-r">
      <span
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-md text-xl ${
          red
            ? "bg-red-50 text-red-500"
            : "bg-[#eff7e9] text-[#073b25]"
        }`}
      >
        {icon}
      </span>
      <div>
        <h3 className="text-lg font-bold">{value}</h3>
        <p className="text-[10px] text-gray-500">{label}</p>
      </div>
    </div>
  );

  const SecurityRow = ({ title, description, action, onClick }) => (
    <div className="flex flex-col justify-between gap-4 rounded-lg border border-gray-200 p-4 sm:flex-row sm:items-center">
      <div>
        <h3 className="font-semibold">{title}</h3>
        <p className="mt-1 text-xs text-gray-500">{description}</p>
      </div>
      <button
        onClick={onClick}
        className="rounded-md border border-[#073b25] px-4 py-2 text-xs font-semibold text-[#073b25] transition hover:bg-[#073b25] hover:text-white"
      >
        {action}
      </button>
    </div>
  );

  const NotificationToggle = ({
    title,
    description,
    checked,
    onChange,
  }) => (
    <div className="flex items-center justify-between gap-4 rounded-lg border border-gray-200 p-4">
      <div>
        <h3 className="text-sm font-semibold">{title}</h3>
        <p className="mt-1 text-xs text-gray-500">{description}</p>
      </div>

      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={onChange}
        className={`h-6 w-12 shrink-0 rounded-full p-1 transition ${
          checked ? "bg-[#073b25]" : "bg-gray-300"
        }`}
      >
        <span
          className={`block h-4 w-4 rounded-full bg-white transition ${
            checked ? "translate-x-6" : "translate-x-0"
          }`}
        />
      </button>
    </div>
  );

  const Modal = ({ title, onClose, children }) => (
    <div
      className="fixed inset-0 z-100 flex items-center justify-center bg-black/60 p-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl bg-white shadow-2xl">
        <div className="sticky top-0 flex items-center justify-between border-b bg-white px-5 py-4">
          <h2 className="font-serif text-xl font-bold">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="text-2xl text-gray-500 hover:text-black"
          >
            ×
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );

  const Input = ({ label, ...props }) => (
    <div>
      {label && (
        <label
          htmlFor={props.id || props.name}
          className="mb-1 block text-sm font-medium"
        >
          {label}
        </label>
      )}
      <input
        {...props}
        id={props.id || props.name}
        className={`w-full rounded-md border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-[#073b25] focus:ring-1 focus:ring-[#073b25] ${
          props.className || ""
        }`}
      />
    </div>
  );

  const OrdersSection = () => (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
      <div className="flex items-center justify-between gap-3 border-b px-4 py-4 sm:px-5">
        <h2 className="font-serif text-xl font-bold sm:text-2xl">
          Recent Orders
        </h2>
        <button
          onClick={() => setActiveItem("My Orders")}
          className="text-xs font-semibold text-[#073b25] hover:underline sm:text-sm"
        >
          View All Orders →
        </button>
      </div>

      <div className="hidden overflow-x-auto md:block">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left text-xs text-gray-500">
              <th className="px-5 py-3">Order ID</th>
              <th className="px-3 py-3">Date</th>
              <th className="px-3 py-3">Items</th>
              <th className="px-3 py-3">Total</th>
              <th className="px-3 py-3">Status</th>
              <th className="px-5 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr
                key={order.id}
                className="border-b last:border-0 hover:bg-gray-50"
              >
                <td className="px-5 py-4 font-semibold">{order.id}</td>
                <td className="px-3 py-4 text-xs text-gray-500">
                  {order.date}
                </td>
                <td className="px-3 py-4">
                  <div className="flex gap-2">
                    {order.images.map((image, index) => (
                      <img
                        key={`${order.id}-${index}`}
                        src={image}
                        alt="Ordered product"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                        className="h-10 w-10 rounded object-cover"
                      />
                    ))}
                  </div>
                </td>
                <td className="px-3 py-4 font-bold">{order.total}</td>
                <td className="px-3 py-4">
                  <span
                    className={`rounded px-2.5 py-1 text-[10px] font-semibold ${getStatusClass(
                      order.status
                    )}`}
                  >
                    {order.status}
                  </span>
                </td>
                <td className="px-5 py-4 text-right">
                  <button
                    onClick={() =>
                      order.status === "In Transit"
                        ? navigate("/track-order")
                        : showMessage(`Demo order ${order.id}`)
                    }
                    className="rounded-md border border-[#9bb9ac] px-3 py-2 text-xs font-semibold text-[#073b25] transition hover:bg-[#073b25] hover:text-white"
                  >
                    {order.status === "In Transit"
                      ? "Track Order"
                      : "View Details"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="divide-y md:hidden">
        {orders.map((order) => (
          <div key={order.id} className="p-4">
            <div className="flex justify-between gap-3">
              <div>
                <h3 className="text-sm font-semibold">{order.id}</h3>
                <p className="mt-1 text-xs text-gray-500">{order.date}</p>
              </div>
              <span
                className={`h-fit rounded px-2 py-1 text-[10px] font-semibold ${getStatusClass(
                  order.status
                )}`}
              >
                {order.status}
              </span>
            </div>
            <div className="mt-4 flex items-center justify-between gap-3">
              <div className="flex gap-2">
                {order.images.slice(0, 3).map((image, index) => (
                  <img
                    key={`${order.id}-mobile-${index}`}
                    src={image}
                    alt="Ordered product"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                    className="h-10 w-10 rounded object-cover"
                  />
                ))}
              </div>
              <div className="text-right">
                <p className="font-bold">{order.total}</p>
                <button
                  onClick={() =>
                    order.status === "In Transit"
                      ? navigate("/track-order")
                      : showMessage(`Demo order ${order.id}`)
                  }
                  className="mt-1 text-xs font-semibold text-[#073b25]"
                >
                  View →
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const DashboardContent = () => (
    <div className="space-y-4">
      <div className="grid gap-4 xl:grid-cols-[1fr_1.7fr]">
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <div className="flex items-center gap-4">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-[#073b25] text-2xl font-bold text-white">
              {profile.name
                .split(" ")
                .map((part) => part[0])
                .join("")
                .slice(0, 2)
                .toUpperCase()}
            </div>
            <div className="min-w-0">
              <h2 className="font-serif text-xl font-bold sm:text-2xl">
                {profile.name}
              </h2>
              <p className="mt-1 truncate text-sm text-gray-500">
                {profile.email}
              </p>
              <button
                onClick={() => {
                  setProfileForm(profile);
                  setShowProfileModal(true);
                }}
                className="mt-3 rounded-md border border-[#073b25] px-3 py-1.5 text-xs font-semibold text-[#073b25] transition hover:bg-[#073b25] hover:text-white"
              >
                ♙ Edit Profile
              </button>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <div className="grid grid-cols-2 sm:grid-cols-4">
            <Stat icon="▣" value={orders.length} label="Total Orders" />
            <Stat icon="♡" value={wishlist.length} label="Wishlist Items" red />
            <Stat icon="⌖" value={addresses.length} label="Saved Addresses" />
            <Stat
              icon="☆"
              value={initialReviews.length}
              label="Product Reviews"
            />
          </div>
        </div>
      </div>
      <OrdersSection />
    </div>
  );

  const OrdersPage = () => (
    <PageCard title="My Orders" subtitle="View and track all your orders.">
      <div className="space-y-3">
        {orders.map((order) => (
          <div key={order.id} className="rounded-lg border border-gray-200 p-4">
            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
              <div>
                <h3 className="font-semibold">{order.id}</h3>
                <p className="mt-1 text-xs text-gray-500">
                  Ordered on {order.date}
                </p>
              </div>
              <span
                className={`w-fit rounded-full px-3 py-1 text-xs font-semibold ${getStatusClass(
                  order.status
                )}`}
              >
                {order.status}
              </span>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {order.images.map((image, index) => (
                <img
                  key={`${order.id}-item-${index}`}
                  src={image}
                  alt="Ordered product"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                  className="h-14 w-14 rounded object-cover"
                />
              ))}
            </div>

            <div className="mt-4 flex items-center justify-between">
              <span className="font-bold">{order.total}</span>
              <button
                onClick={() =>
                  order.status === "In Transit"
                    ? navigate("/track-order")
                    : showMessage(`Demo order ${order.id}`)
                }
                className="rounded-md border border-[#073b25] px-4 py-2 text-xs font-semibold text-[#073b25] hover:bg-[#073b25] hover:text-white"
              >
                {order.status === "In Transit" ? "Track Order" : "View Details"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </PageCard>
  );

  const AddressesPage = () => (
    <PageCard
      title="My Addresses"
      subtitle="Manage your saved delivery addresses."
    >
      <div className="grid gap-4 md:grid-cols-2">
        {addresses.map((address) => (
          <div
            key={address.id}
            className={`rounded-xl border p-5 ${
              address.default
                ? "border-[#b7d8c3] bg-[#f5fbf5]"
                : "border-gray-200"
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex gap-3">
                <span className="text-2xl text-[#073b25]">
                  {address.icon || "⌂"}
                </span>
                <div>
                  <h3 className="font-semibold">{address.title}</h3>
                  <p className="mt-2 text-sm">{address.name}</p>
                  {address.address.map((line, index) => (
                    <p
                      key={`${address.id}-${index}`}
                      className="text-xs text-gray-500"
                    >
                      {line}
                    </p>
                  ))}
                  <p className="mt-1 text-xs text-gray-500">
                    {address.phone}
                  </p>
                </div>
              </div>
              {address.default && (
                <span className="rounded bg-green-100 px-2 py-1 text-[10px] text-green-700">
                  Default
                </span>
              )}
            </div>

            <button
              onClick={() => openAddressEdit(address)}
              className="mt-4 w-full rounded-md border border-[#073b25] py-2 text-xs font-semibold text-[#073b25] transition hover:bg-[#073b25] hover:text-white"
            >
              Edit Address
            </button>
          </div>
        ))}
      </div>
    </PageCard>
  );

  const WishlistPage = () => (
    <PageCard
      title="My Wishlist"
      subtitle={`${wishlist.length} products saved in your wishlist.`}
    >
      {wishlist.length === 0 ? (
        <div className="py-14 text-center">
          <div className="text-5xl">♡</div>
          <h3 className="mt-3 font-serif text-xl font-bold">
            Your wishlist is empty
          </h3>
          <Link
            to="/product"
            className="mt-4 inline-block rounded-md bg-[#073b25] px-5 py-2.5 text-sm text-white"
          >
            Explore Products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {wishlist.map((product) => (
            <div
              key={product.id}
              className="overflow-hidden rounded-lg border border-gray-200"
            >
              <div className="relative h-36 sm:h-44">
                <img
                  src={product.image}
                  alt={product.name}
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                  className="h-full w-full object-cover"
                />
                <button
                  onClick={() => removeWishlist(product.id)}
                  aria-label={`Remove ${product.name} from wishlist`}
                  className="absolute right-2 top-2 h-8 w-8 rounded-full bg-white text-red-500 shadow"
                >
                  ♥
                </button>
              </div>
              <div className="p-3">
                <h3 className="line-clamp-2 text-sm font-semibold">
                  {product.name}
                </h3>
                <p className="mt-2 font-bold">{product.price}</p>
                <button
                  onClick={() => addToCart(product)}
                  className="mt-3 w-full rounded-md bg-[#073b25] py-2 text-xs font-semibold text-white"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </PageCard>
  );

  const ReviewsPage = () => (
    <PageCard title="My Reviews" subtitle="Manage your product reviews.">
      {initialReviews.map((review) => (
        <div key={review.id} className="border-b py-4 last:border-0">
          <div className="flex justify-between gap-3">
            <div>
              <h3 className="text-sm font-semibold">{review.productName}</h3>
              <div className="mt-1 text-yellow-500">
                {"★".repeat(review.rating)}
                {"☆".repeat(5 - review.rating)}
              </div>
            </div>
            <span className="text-xs text-gray-400">{review.date}</span>
          </div>
          <p className="mt-2 text-sm text-gray-600">{review.comment}</p>
        </div>
      ))}
    </PageCard>
  );

  const PersonalPage = () => (
    <PageCard
      title="Personal Information"
      subtitle="Update your personal information."
    >
      <div className="max-w-2xl space-y-4">
        <InfoRow label="Full Name" value={profile.name} />
        <InfoRow label="Email Address" value={profile.email} />
        <InfoRow label="Phone Number" value={profile.phone} />
        <button
          onClick={() => {
            setProfileForm(profile);
            setShowProfileModal(true);
          }}
          className="rounded-md bg-[#073b25] px-5 py-2.5 text-sm font-semibold text-white"
        >
          Edit Information
        </button>
      </div>
    </PageCard>
  );

  const SecurityPage = () => (
    <PageCard title="Security" subtitle="Keep your Halla Bol account secure.">
      <div className="max-w-2xl space-y-4">
        <SecurityRow
          title="Password"
          description="Manage your account password."
          action="Change Password"
          onClick={() => navigate("/forgot-password")}
        />
        <SecurityRow
          title="Two-Factor Authentication"
          description="Add an extra layer of security."
          action="Learn More"
          onClick={() =>
            showMessage("Two-factor authentication is not connected yet.")
          }
        />
        <SecurityRow
          title="Login Activity"
          description="Review recent account activity."
          action="View Activity"
          onClick={() => showMessage("Login activity is not connected yet.")}
        />
      </div>
    </PageCard>
  );

  const NotificationsPage = () => (
    <PageCard
      title="Notifications"
      subtitle="Choose how Halla Bol communicates with you."
    >
      <div className="space-y-4">
        <NotificationToggle
          title="Email Notifications"
          description="Receive order and account updates."
          checked={emailNotifications}
          onChange={() => setEmailNotifications((v) => !v)}
        />
        <NotificationToggle
          title="Order Updates"
          description="Get shipping and delivery notifications."
          checked={orderNotifications}
          onChange={() => setOrderNotifications((v) => !v)}
        />
        <NotificationToggle
          title="Offers & Promotions"
          description="Receive special offers and product updates."
          checked={offerNotifications}
          onChange={() => setOfferNotifications((v) => !v)}
        />
        <button
          onClick={() =>
            showMessage("Notification preferences updated for this session.")
          }
          className="rounded-md bg-[#073b25] px-5 py-2.5 text-sm font-semibold text-white"
        >
          Save Preferences
        </button>
      </div>
    </PageCard>
  );

  const PaymentPage = () => (
    <PageCard
      title="Payment Methods"
      subtitle="Manage your saved payment methods."
    >
      <div className="max-w-xl space-y-4">
        {paymentMethods.map((method) => (
          <div
            key={method.id}
            className="rounded-xl border border-gray-200 p-5"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="text-xl font-bold italic text-blue-700">
                  {method.type}
                </div>
                <div>
                  <p className="font-semibold">•••• {method.lastFour}</p>
                  <p className="text-xs text-gray-500">
                    Expires {method.expiry}
                  </p>
                </div>
              </div>
              {method.isDefault && (
                <span className="rounded bg-green-100 px-2 py-1 text-xs text-green-700">
                  Default
                </span>
              )}
            </div>
          </div>
        ))}

        <button
          onClick={() => setShowPaymentModal(true)}
          className="w-full rounded-md border border-[#073b25] py-3 text-sm font-semibold text-[#073b25] transition hover:bg-[#073b25] hover:text-white"
        >
          + Add New Payment Method
        </button>
        <p className="text-xs text-gray-500">
          Demo only: do not enter real card details. Payment data is not sent
          to a payment provider.
        </p>
      </div>
    </PageCard>
  );

  const SupportPage = () => (
    <PageCard title="Customer Support" subtitle="We're here to help.">
      <div className="grid gap-4 sm:grid-cols-2">
        {[
          {
            icon: "◉",
            title: "Contact Support",
            description: "Talk to our customer support team.",
            button: "Contact Us",
            to: "/contact",
          },
          {
            icon: "?",
            title: "Help Center",
            description: "Find answers to common questions.",
            button: "Open Help Center",
            to: "/faq",
          },
          {
            icon: "▣",
            title: "Track Order",
            description: "Track your current shipment.",
            button: "Track Order",
            to: "/track-order",
          },
          {
            icon: "✉",
            title: "Email Support",
            description: "Send us your question.",
            button: "Send Email",
            to: "/support",
          },
        ].map((item) => (
          <div
            key={item.title}
            className="rounded-xl border border-gray-200 p-5"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#eff7e9] text-2xl text-[#073b25]">
              {item.icon}
            </div>
            <h3 className="mt-4 font-serif text-xl font-bold">
              {item.title}
            </h3>
            <p className="mt-1 text-sm text-gray-500">{item.description}</p>
            <Link
              to={item.to}
              className="mt-4 inline-block rounded-md border border-[#073b25] px-4 py-2 text-xs font-semibold text-[#073b25] transition hover:bg-[#073b25] hover:text-white"
            >
              {item.button}
            </Link>
          </div>
        ))}
      </div>
    </PageCard>
  );

  const renderContent = () => {
    switch (activeItem) {
      case "My Orders":
        return <OrdersPage />;
      case "My Addresses":
        return <AddressesPage />;
      case "My Wishlist":
        return <WishlistPage />;
      case "My Reviews":
        return <ReviewsPage />;
      case "Personal Information":
        return <PersonalPage />;
      case "Security":
        return <SecurityPage />;
      case "Notifications":
        return <NotificationsPage />;
      case "Payment Methods":
        return <PaymentPage />;
      case "Support":
        return <SupportPage />;
      default:
        return <DashboardContent />;
    }
  };

  return (
    <div className="min-h-screen bg-[#fafbf9] text-gray-900">
      <Navbar />

      {notification && (
        <div
          role="status"
          className="fixed right-5 top-5 z-200 max-w-[calc(100%-2rem)] rounded-lg bg-[#073b25] px-5 py-3 text-sm text-white shadow-xl"
        >
          {notification}
        </div>
      )}

      <section className="relative h-64 overflow-hidden sm:h-72">
        <img
          src="/images/account-hero.jpg"
          alt="My Account"
          className="absolute inset-0 h-full w-full object-cover"
          onError={(e) => {
            e.currentTarget.style.display = "none";
          }}
        />
        <div className="absolute inset-0 bg-black/55" />
        <div className="relative z-10 mx-auto flex h-full max-w-7xl items-center px-5 sm:px-8 lg:px-5">
          <div className="text-white">
            <p className="mb-3 text-xs text-gray-200 sm:text-sm">
              
            </p>
            <h1 className="font-serif text-4xl font-bold sm:text-5xl">
              My Account
            </h1>
            <p className="mt-2 text-sm sm:text-base">
              Manage your profile, orders, addresses and more.
            </p>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-4 py-5 sm:px-6 sm:py-7 lg:px-5">
        <button
          type="button"
          onClick={() => setMobileMenuOpen((v) => !v)}
          className="mb-4 flex w-full items-center justify-between rounded-xl border border-gray-200 bg-white px-4 py-3.5 text-sm font-semibold shadow-sm lg:hidden"
        >
          <span className="flex items-center gap-3">
            <span className="text-xl">☰</span>
            {activeItem}
          </span>
          <span className="text-xl">{mobileMenuOpen ? "×" : "⌄"}</span>
        </button>

        <div className="grid gap-5 lg:grid-cols-[215px_1fr] xl:grid-cols-[225px_1fr]">
          <aside className={`${mobileMenuOpen ? "block" : "hidden"} lg:block`}>
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm lg:sticky lg:top-4">
              {sidebarItems.map((item) => (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => handleSidebarClick(item.label)}
                  className={`flex w-full items-center gap-3 border-b border-gray-100 px-4 py-3.5 text-left text-sm transition-all ${
                    activeItem === item.label
                      ? "bg-[#073b25] font-semibold text-white"
                      : "text-gray-700 hover:bg-[#eff7e9] hover:text-[#073b25]"
                  }`}
                >
                  <span className="w-7 shrink-0 text-center text-xl">
                    {item.icon}
                  </span>
                  <span className="flex-1">{item.label}</span>
                  {activeItem === item.label && (
                    <span className="text-xs">→</span>
                  )}
                </button>
              ))}

              <button
                type="button"
                onClick={() => setShowLogoutModal(true)}
                className="flex w-full items-center gap-3 px-4 py-3.5 text-left text-sm text-red-600 transition hover:bg-red-50"
              >
                <span className="w-7 text-center text-xl">⇥</span>
                Logout
              </button>
            </div>
          </aside>

          <section className="min-w-0">{renderContent()}</section>
        </div>
      </main>

      <section className="border-y bg-white">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-5 px-5 py-5 md:grid-cols-4">
          {[
            ["♧", "Worldwide Shipping", "Delivery options vary by destination"],
            ["▣", "Secure Payments", "Secure payment options at checkout"],
            ["◇", "Easy Returns", "See our return policy"],
            ["◉", "Customer Support", "We're here to help"],
          ].map(([icon, title, text]) => (
            <div
              key={title}
              className="flex items-center justify-center gap-3"
            >
              <span className="text-3xl text-[#073b25]">{icon}</span>
              <div>
                <h3 className="text-xs font-semibold sm:text-sm">{title}</h3>
                <p className="text-[10px] text-gray-500">{text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Footer />

      {showProfileModal && (
        <Modal
          title="Edit Profile"
          onClose={() => setShowProfileModal(false)}
        >
          <form onSubmit={saveProfile} className="space-y-4">
            <Input
              label="Full Name"
              name="name"
              value={profileForm.name}
              onChange={handleProfileChange}
              required
            />
            <Input
              label="Email Address"
              type="email"
              name="email"
              value={profileForm.email}
              onChange={handleProfileChange}
              required
            />
            <Input
              label="Phone Number"
              name="phone"
              value={profileForm.phone}
              onChange={handleProfileChange}
            />
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowProfileModal(false)}
                className="flex-1 rounded-md border border-gray-300 py-2.5 text-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 rounded-md bg-[#073b25] py-2.5 text-sm font-semibold text-white"
              >
                Save Changes
              </button>
            </div>
          </form>
        </Modal>
      )}

      {showAddressModal && (
        <Modal
          title="Edit Address"
          onClose={() => setShowAddressModal(false)}
        >
          <form onSubmit={saveAddress} className="space-y-4">
            <Input
              label="Address Name"
              name="title"
              value={addressForm.title}
              onChange={handleAddressChange}
              required
            />
            <Input
              label="Full Name"
              name="name"
              value={addressForm.name}
              onChange={handleAddressChange}
              required
            />
            <Input
              label="Address"
              name="address1"
              value={addressForm.address1}
              onChange={handleAddressChange}
              required
            />
            <Input
              label="City / State / PIN"
              name="address2"
              value={addressForm.address2}
              onChange={handleAddressChange}
            />
            <Input
              label="Phone"
              name="phone"
              value={addressForm.phone}
              onChange={handleAddressChange}
              required
            />
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowAddressModal(false)}
                className="flex-1 rounded-md border border-gray-300 py-2.5 text-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 rounded-md bg-[#073b25] py-2.5 text-sm font-semibold text-white"
              >
                Save Address
              </button>
            </div>
          </form>
        </Modal>
      )}

      {showPaymentModal && (
        <Modal
          title="Add Demo Payment Method"
          onClose={() => setShowPaymentModal(false)}
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();

              const digits = paymentForm.cardNumber.replace(/\D/g, "");

              if (
                digits.length < 4 ||
                !paymentForm.expiry.trim() ||
                !paymentForm.cardholder.trim()
              ) {
                showMessage(
                  "Enter a card number, expiry and cardholder name for this demo."
                );
                return;
              }

              const next = [
                ...paymentMethods,
                {
                  id: Date.now(),
                  type: digits.startsWith("4") ? "VISA" : "CARD",
                  lastFour: digits.slice(-4),
                  expiry: paymentForm.expiry,
                  isDefault: paymentMethods.length === 0,
                },
              ];

              setPaymentMethods(next);
              setPaymentForm({
                cardNumber: "",
                expiry: "",
                cvv: "",
                cardholder: "",
              });
              setShowPaymentModal(false);
              showMessage(
                "Demo payment method added. No card details were sent or stored."
              );
            }}
            className="space-y-4"
          >
            <p className="rounded-lg bg-amber-50 p-3 text-xs text-amber-800">
              Demo only. Please do not enter real payment card details. This
              form does not connect to a payment gateway.
            </p>

            <Input
              label="Card Number (demo)"
              name="cardNumber"
              inputMode="numeric"
              value={paymentForm.cardNumber}
              onChange={(e) =>
                setPaymentForm({
                  ...paymentForm,
                  cardNumber: e.target.value,
                })
              }
              placeholder="Use a fictional number"
              required
            />

            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Expiry"
                name="expiry"
                value={paymentForm.expiry}
                onChange={(e) =>
                  setPaymentForm({
                    ...paymentForm,
                    expiry: e.target.value,
                  })
                }
                placeholder="MM/YY"
                required
              />
              <Input
                label="CVV (not stored)"
                name="cvv"
                type="password"
                value={paymentForm.cvv}
                onChange={(e) =>
                  setPaymentForm({
                    ...paymentForm,
                    cvv: e.target.value,
                  })
                }
                placeholder="Demo only"
              />
            </div>

            <Input
              label="Cardholder Name"
              name="cardholder"
              value={paymentForm.cardholder}
              onChange={(e) =>
                setPaymentForm({
                  ...paymentForm,
                  cardholder: e.target.value,
                })
              }
              required
            />

            <button
              type="submit"
              className="w-full rounded-md bg-[#073b25] py-3 text-sm font-semibold text-white"
            >
              Add Demo Method
            </button>
          </form>
        </Modal>
      )}

      {showLogoutModal && (
        <Modal title="Logout?" onClose={() => setShowLogoutModal(false)}>
          <p className="text-sm text-gray-600">
            Are you sure you want to log out of your Halla Bol account?
          </p>
          <div className="mt-6 flex gap-3">
            <button
              onClick={() => setShowLogoutModal(false)}
              className="flex-1 rounded-md border border-gray-300 py-2.5 text-sm"
            >
              Cancel
            </button>
            <button
              onClick={logout}
              className="flex-1 rounded-md bg-[#073b25] py-2.5 text-sm font-semibold text-white"
            >
              Logout
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Account;
