import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  adminMenu,
  defaultAdminData,
  loadAdminData,
  saveAdminData,
} from "../data/adminDashboard";

const money = (value) =>
  `₹${Number(value || 0).toLocaleString("en-IN")}`;

const statusStyle = (status) => {
  const styles = {
    Delivered: "bg-green-50 text-green-700",
    Replied: "bg-green-50 text-green-700",
    Processing: "bg-orange-50 text-orange-700",
    "In Progress": "bg-blue-50 text-blue-700",
    Shipped: "bg-blue-50 text-blue-700",
    Cancelled: "bg-red-50 text-red-700",
    New: "bg-red-50 text-red-600",
  };

  return styles[status] || "bg-gray-100 text-gray-600";
};

export default function Dashboard() {
  const navigate = useNavigate();

  const [data, setData] = useState(() => loadAdminData());
  const [search, setSearch] = useState("");
  const [range, setRange] = useState("7 Days");
  const [mobileMenu, setMobileMenu] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [dateOpen, setDateOpen] = useState(false);
  const [toast, setToast] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [enquiryFilter, setEnquiryFilter] = useState("All");

  const query = search.trim().toLowerCase();

  useEffect(() => {
    const refresh = () => setData(loadAdminData());

    window.addEventListener("Halla BolAdminUpdate", refresh);
    window.addEventListener("storage", refresh);

    return () => {
      window.removeEventListener("Halla Bol AdminUpdate", refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  const notify = (message) => {
    setToast(message);
  };

  const updateData = (nextData, message = "Changes saved") => {
    try {
      saveAdminData(nextData);
      setData(nextData);
      notify(message);
    } catch (error) {
      console.error("Could not save admin data:", error);
      notify("Could not save changes. Check browser storage.");
    }
  };

  const updateOrderStatus = (orderId, status) => {
    const nextData = {
      ...data,
      orders: data.orders.map((order) =>
        order.id === orderId ? { ...order, status } : order
      ),
    };

    updateData(nextData, `Order ${orderId} updated`);
    setSelectedOrder((current) =>
      current?.id === orderId ? { ...current, status } : current
    );
  };

  const updateEnquiryStatus = (id, status) => {
    const nextData = {
      ...data,
      enquiries: data.enquiries.map((enquiry) =>
        enquiry.id === id ? { ...enquiry, status } : enquiry
      ),
    };

    updateData(nextData, "Enquiry status updated");
  };

  useEffect(() => {
    if (!toast) return undefined;

    const timer = window.setTimeout(() => setToast(""), 2500);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const filteredOrders = useMemo(
    () =>
      data.orders.filter((order) =>
        `${order.id} ${order.status} ${order.amount}`
          .toLowerCase()
          .includes(query)
      ),
    [data.orders, query]
  );

  const filteredProducts = useMemo(
    () =>
      data.products.filter((product) =>
        `${product.name} ${product.category}`
          .toLowerCase()
          .includes(query)
      ),
    [data.products, query]
  );

  const filteredEnquiries = useMemo(
    () =>
      data.enquiries.filter((enquiry) => {
        const matchesSearch = `${enquiry.name} ${enquiry.type} ${enquiry.message}`
          .toLowerCase()
          .includes(query);

        return (
          matchesSearch &&
          (enquiryFilter === "All" || enquiry.status === enquiryFilter)
        );
      }),
    [data.enquiries, query, enquiryFilter]
  );

  const lowStock = useMemo(
    () =>
      data.products
        .filter((product) => Number(product.stock) <= 20)
        .sort((a, b) => Number(a.stock) - Number(b.stock)),
    [data.products]
  );

  const topProducts = useMemo(
    () => [...filteredProducts].sort((a, b) => b.sold - a.sold).slice(0, 5),
    [filteredProducts]
  );

  const salesValues = data.sales[range] || data.sales["7 Days"];
  const maxSales = Math.max(...salesValues, 1);

  const points = salesValues
    .map((value, index) => {
      const x = (index / Math.max(salesValues.length - 1, 1)) * 700;
      const y = 200 - (value / maxSales) * 175;
      return `${x},${y}`;
    })
    .join(" ");

  const pendingOrders = data.orders.filter(
    (order) => order.status === "Processing"
  ).length;

  const newEnquiries = data.enquiries.filter(
    (enquiry) => enquiry.status === "New"
  ).length;

  const metrics = [
    {
      title: "Total Orders",
      value: Number(data.summary.totalOrders).toLocaleString("en-IN"),
      icon: "🛒",
      bg: "bg-emerald-50",
      change: "+12%",
    },
    {
      title: "Total Revenue",
      value: money(data.summary.totalRevenue),
      icon: "₹",
      bg: "bg-green-50",
      change: "+18%",
    },
    {
      title: "Total Customers",
      value: Number(data.summary.totalCustomers).toLocaleString("en-IN"),
      icon: "♧",
      bg: "bg-sky-50",
      change: "+14%",
    },
    {
      title: "Products",
      value: data.products.length,
      icon: "◇",
      bg: "bg-orange-50",
      change: "+6%",
    },
    {
      title: "Enquiries",
      value: data.enquiries.length,
      icon: "✉",
      bg: "bg-purple-50",
      change: "+20%",
    },
  ];

  const logout = () => {
    localStorage.removeItem("HallaBol_admin_session");
    navigate("/login");
  };

  const resetDemo = () => {
    const confirmed = window.confirm(
      "Reset the dashboard to its original demo data?"
    );

    if (!confirmed) return;

    try {
      localStorage.removeItem("Halla Bol_admin_data");
      setData(loadAdminData());
      setSearch("");
      setEnquiryFilter("All");
      notify("Demo data reset");
    } catch (error) {
      console.error(error);
      notify("Unable to reset demo data");
    }
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#f7f8f7] text-gray-900">
      {toast && (
        <div
          role="status"
          className="fixed right-4 top-4 z-100 rounded-lg bg-[#075631] px-4 py-3 text-sm text-white shadow-xl"
        >
          {toast}
        </div>
      )}

     \
      <aside className="fixed bottom-0 left-0 top-0 z-40 hidden w-64 flex-col bg-[#032d1d] text-white lg:flex">
        <Link
          to="/admin"
          className="flex h-19 items-center gap-3 border-b border-white/10 px-5"
        >
          <span className="text-4xl text-[#d8b75a]">◇</span>
          <span>
            <span className="block font-serif text-2xl font-bold">Halla Bol</span>
            <span className="block text-[8px] tracking-wider text-gray-300">
              ROOTED IN INDIA. FOR A BETTER WORLD.
            </span>
          </span>
        </Link>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
          {adminMenu.map(([name, icon, path]) => (
            <Link
              key={name}
              to={path}
              className={`flex items-center gap-4 rounded-md px-4 py-3 text-sm transition ${
                name === "Dashboard"
                  ? "bg-[#0c4a32] text-white"
                  : "text-gray-200 hover:bg-white/10"
              }`}
            >
              <span className="w-6 text-center text-xl">{icon}</span>
              <span className="flex-1">{name}</span>

              {name === "Orders" && pendingOrders > 0 && (
                <span className="rounded-full bg-red-500 px-2 py-0.5 text-[10px]">
                  {pendingOrders}
                </span>
              )}

              {name === "Enquiries" && newEnquiries > 0 && (
                <span className="rounded-full bg-red-500 px-2 py-0.5 text-[10px]">
                  {newEnquiries}
                </span>
              )}
            </Link>
          ))}
        </nav>

        <div className="p-4">
          <div className="relative overflow-hidden rounded-lg border border-white/20 p-5">
            <p className="relative z-10 font-serif text-xl italic leading-6">
              Grow
              <br />
              A Better
              <br />
              Tomorrow
            </p>
            <Link
              to="/"
              className="relative z-10 mt-5 inline-flex rounded-md border border-[#b8d8a9] px-4 py-2 text-xs transition hover:bg-white hover:text-[#073b25]"
            >
              View Website ↗
            </Link>
            <span className="absolute -bottom-5 -right-2 text-7xl opacity-40">
              🌿
            </span>
          </div>
        </div>
      </aside>

      {mobileMenu && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close navigation"
            className="absolute inset-0 bg-black/50"
            onClick={() => setMobileMenu(false)}
          />

          <aside className="relative flex h-full w-72 max-w-[85vw] flex-col bg-[#032d1d] text-white shadow-2xl">
            <div className="flex h-19 items-center justify-between border-b border-white/10 px-5">
              <span className="font-serif text-2xl font-bold">Halla Bol</span>
              <button
                type="button"
                aria-label="Close menu"
                onClick={() => setMobileMenu(false)}
                className="text-2xl"
              >
                ×
              </button>
            </div>

            <nav className="flex-1 space-y-1 overflow-y-auto p-3">
              {adminMenu.map(([name, icon, path]) => (
                <Link
                  key={name}
                  to={path}
                  onClick={() => setMobileMenu(false)}
                  className={`flex items-center gap-4 rounded-md px-4 py-3 text-sm ${
                    name === "Dashboard"
                      ? "bg-[#0c4a32]"
                      : "hover:bg-white/10"
                  }`}
                >
                  <span className="w-6 text-center">{icon}</span>
                  {name}
                </Link>
              ))}
            </nav>
          </aside>
        </div>
      )}

      <div className="lg:ml-64">
       
        <header className="sticky top-0 z-30 border-b border-gray-200 bg-white">
          <div className="flex min-h-16 items-center gap-3 px-4 sm:px-6">
            <button
              type="button"
              aria-label="Open navigation"
              onClick={() => setMobileMenu(true)}
              className="h-10 w-10 rounded-md border lg:hidden"
            >
              ☰
            </button>

            <div className="flex h-10 min-w-0 max-w-xl flex-1 items-center rounded-md border border-gray-200 bg-gray-50 px-3">
              <span className="text-xl text-gray-500">⌕</span>
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search orders, products, enquiries..."
                aria-label="Search dashboard data"
                className="w-full min-w-0 bg-transparent px-3 text-sm outline-none"
              />
              {search && (
                <button
                  type="button"
                  aria-label="Clear search"
                  onClick={() => setSearch("")}
                  className="text-gray-500"
                >
                  ×
                </button>
              )}
            </div>

            <div className="relative ml-auto flex items-center gap-3 sm:gap-5">
              <span className="hidden text-sm sm:block">◎ EN</span>

              <div className="relative">
                <button
                  type="button"
                  aria-label="Notifications"
                  onClick={() => setNotificationsOpen((value) => !value)}
                  className="relative text-2xl"
                >
                  ♧
                  {pendingOrders + newEnquiries > 0 && (
                    <span className="absolute -right-2 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[9px] text-white">
                      {pendingOrders + newEnquiries}
                    </span>
                  )}
                </button>

                {notificationsOpen && (
                  <div className="absolute right-0 top-12 z-50 w-72 max-w-[90vw] rounded-lg border bg-white p-4 shadow-xl">
                    <h3 className="font-semibold">Notifications</h3>
                    <p className="mt-3 rounded bg-orange-50 p-3 text-xs">
                      {pendingOrders} processing order(s)
                    </p>
                    <p className="mt-2 rounded bg-red-50 p-3 text-xs">
                      {newEnquiries} new enquiry/enquiries
                    </p>
                    <p className="mt-2 rounded bg-yellow-50 p-3 text-xs">
                      {lowStock.length} low-stock product(s)
                    </p>
                  </div>
                )}
              </div>

              <div className="relative">
                <button
                  type="button"
                  onClick={() => setProfileOpen((value) => !value)}
                  className="flex items-center gap-2"
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-200">
                    👨🏻
                  </span>
                  <span className="hidden text-left sm:block">
                    <span className="block text-sm font-semibold">Doremon Shab</span>
                    <span className="block text-[10px] text-gray-500">
                      Admin
                    </span>
                  </span>
                  <span className="hidden sm:block">⌄</span>
                </button>

                {profileOpen && (
                  <div className="absolute right-0 top-12 z-50 w-48 overflow-hidden rounded-lg border bg-white shadow-xl">
                    <Link
                      to="/admin/settings"
                      onClick={() => setProfileOpen(false)}
                      className="block px-4 py-3 text-sm hover:bg-gray-50"
                    >
                      ⚙ Settings
                    </Link>
                    <Link
                      to="/"
                      onClick={() => setProfileOpen(false)}
                      className="block px-4 py-3 text-sm hover:bg-gray-50"
                    >
                      ↗ View Website
                    </Link>
                    <button
                      type="button"
                      onClick={logout}
                      className="w-full border-t px-4 py-3 text-left text-sm text-red-600 hover:bg-red-50"
                    >
                      ⇥ Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        <main className="space-y-5 p-4 sm:p-5 lg:p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold sm:text-4xl">Dashboard</h1>
              <p className="mt-1 text-sm text-gray-500">
                Welcome back,! Here's your Halla Bol store overview.
              </p>
              {query && (
                <p className="mt-2 text-xs text-[#075631]">
                  Showing results for "{search}"
                </p>
              )}
            </div>

            <div className="relative">
              <button
                type="button"
                onClick={() => setDateOpen((value) => !value)}
                className="rounded-md border border-gray-200 bg-white px-4 py-2.5 text-sm"
              >
                ▣ {range} <span className="ml-2">⌄</span>
              </button>

              {dateOpen && (
                <div className="absolute right-0 top-12 z-20 w-40 rounded-lg border bg-white p-1 shadow-lg">
                  {Object.keys(data.sales).map((item) => (
                    <button
                      type="button"
                      key={item}
                      onClick={() => {
                        setRange(item);
                        setDateOpen(false);
                      }}
                      className={`block w-full rounded px-3 py-2 text-left text-sm hover:bg-gray-50 ${
                        range === item ? "font-semibold text-[#075631]" : ""
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

        
          <section className="grid grid-cols-2 gap-3 xl:grid-cols-5">
            {metrics.map((metric) => (
              <article
                key={metric.title}
                className="rounded-lg border border-gray-200 bg-white p-4"
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-md text-xl ${metric.bg}`}
                  >
                    {metric.icon}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-gray-500">{metric.title}</p>
                    <h2 className="mt-1 wrap-break-word text-lg font-bold sm:text-2xl">
                      {metric.value}
                    </h2>
                    <p className="mt-1 text-xs text-green-600">
                      ↑ {metric.change}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </section>

          
          <section className="grid gap-4 xl:grid-cols-[1.45fr_0.85fr]">
            <article className="min-w-0 rounded-lg border border-gray-200 bg-white p-4 sm:p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-lg font-bold sm:text-xl">Sales Overview</h2>
                <span className="text-xs text-gray-500">
                  Demo data · {range}
                </span>
              </div>

              <div className="relative mt-6 h-60 pl-14">
                <div className="absolute bottom-7 left-0 top-0 flex flex-col justify-between text-[10px] text-gray-500">
                  <span>{money(maxSales)}</span>
                  <span>{money(maxSales * 0.75)}</span>
                  <span>{money(maxSales * 0.5)}</span>
                  <span>{money(maxSales * 0.25)}</span>
                  <span>₹0</span>
                </div>

                <div className="absolute bottom-7 left-14 right-0 top-0">
                  <div className="absolute inset-0 flex flex-col justify-between">
                    {[1, 2, 3, 4, 5].map((item) => (
                      <div key={item} className="border-t border-gray-100" />
                    ))}
                  </div>

                  <svg
                    viewBox="0 0 700 210"
                    preserveAspectRatio="none"
                    role="img"
                    aria-label={`Demo sales trend for ${range}`}
                    className="absolute inset-0 h-full w-full overflow-visible"
                  >
                    <polygon
                      points={`0,210 ${points} 700,210`}
                      fill="#dff2e5"
                    />
                    <polyline
                      points={points}
                      fill="none"
                      stroke="#075631"
                      strokeWidth="3"
                      vectorEffect="non-scaling-stroke"
                    />
                    {salesValues.map((value, index) => (
                      <circle
                        key={`${value}-${index}`}
                        cx={
                          (index / Math.max(salesValues.length - 1, 1)) * 700
                        }
                        cy={200 - (value / maxSales) * 175}
                        r="4"
                        fill="#075631"
                      />
                    ))}
                  </svg>

                  <div className="absolute -bottom-6 left-0 right-0 flex justify-between text-[10px] text-gray-500">
                    {salesValues.map((_, index) => (
                      <span key={index}>{index + 1}</span>
                    ))}
                  </div>
                </div>
              </div>
            </article>

            <article className="rounded-lg border border-gray-200 bg-white p-4 sm:p-5">
              <h2 className="text-lg font-bold sm:text-xl">Order Status</h2>
              <div className="mt-5 flex flex-col items-center gap-6 sm:flex-row xl:flex-col 2xl:flex-row">
                <div
                  className="relative h-40 w-40 shrink-0 rounded-full"
                  style={{
                    background:
                      "conic-gradient(#087443 0 62%, #8bd39b 62% 80%, #f6b51b 80% 92%, #ef3c3c 92% 97%, #a6a9ab 97% 100%)",
                  }}
                >
                  <div className="absolute inset-7 flex flex-col items-center justify-center rounded-full bg-white">
                    <strong className="text-2xl">
                      {data.orders.length}
                    </strong>
                    <span className="text-xs text-gray-500">Recent orders</span>
                  </div>
                </div>

                <div className="w-full space-y-3 text-xs">
                  {["Delivered", "Processing", "Shipped", "Cancelled", "Returned"].map(
                    (status) => (
                      <div
                        key={status}
                        className="flex items-center justify-between gap-2"
                      >
                        <span>{status}</span>
                        <strong>
                          {data.orders.filter((order) => order.status === status).length}
                        </strong>
                      </div>
                    )
                  )}
                  <p className="border-t pt-2 text-[10px] text-gray-400">
                    Status counts reflect the recent demo orders. The ring is illustrative.
                  </p>
                </div>
              </div>
            </article>
          </section>

         
          <section className="grid gap-4 xl:grid-cols-[1.35fr_0.8fr_0.85fr]">
            <article className="min-w-0 overflow-hidden rounded-lg border border-gray-200 bg-white">
              <div className="flex items-center justify-between gap-3 px-4 py-4">
                <h2 className="font-bold">Top Selling Products</h2>
                <Link
                  to="/admin/products"
                  className="shrink-0 text-xs font-medium text-[#075631]"
                >
                  View All →
                </Link>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-140 text-xs">
                  <thead className="bg-gray-50 text-left text-gray-600">
                    <tr>
                      <th className="px-4 py-3">Product</th>
                      <th className="px-2 py-3">Category</th>
                      <th className="px-2 py-3">Sold</th>
                      <th className="px-2 py-3">Revenue</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topProducts.map((product) => (
                      <tr key={product.id} className="border-t border-gray-100">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="h-9 w-9 rounded object-cover"
                              onError={(event) => {
                                event.currentTarget.style.visibility = "hidden";
                              }}
                            />
                            <span className="max-w-40 font-medium">
                              {product.name}
                            </span>
                          </div>
                        </td>
                        <td className="px-2 py-3">{product.category}</td>
                        <td className="px-2 py-3">{product.sold}</td>
                        <td className="px-2 py-3 font-medium">
                          {money(product.revenue)}
                        </td>
                      </tr>
                    ))}
                    {topProducts.length === 0 && (
                      <tr>
                        <td colSpan={4} className="p-5 text-center text-gray-500">
                          No matching products.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </article>

            <article className="rounded-lg border border-gray-200 bg-white p-4">
              <div className="flex items-center justify-between gap-2">
                <h2 className="font-bold">Customer Locations</h2>
                <Link
                  to="/admin/customers"
                  className="text-xs text-[#075631]"
                >
                  View All
                </Link>
              </div>

              <div className="my-4 text-center text-6xl">🗺️</div>
              <div className="space-y-4">
                {data.locations.map((location) => (
                  <div key={location.name}>
                    <div className="mb-1 flex justify-between text-xs">
                      <span>{location.name}</span>
                      <strong>{location.percent}%</strong>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                      <div
                        className="h-full rounded-full bg-[#087443]"
                        style={{
                          width: `${Math.min(
                            Math.max(Number(location.percent) || 0, 0),
                            100
                          )}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </article>

            <article className="min-w-0 overflow-hidden rounded-lg border border-gray-200 bg-white">
              <div className="flex items-center justify-between gap-2 px-4 py-4">
                <h2 className="font-bold">Recent Orders</h2>
                <Link
                  to="/admin/orders"
                  className="shrink-0 text-xs text-[#075631]"
                >
                  View All
                </Link>
              </div>

              <div>
                {filteredOrders.slice(0, 6).map((order) => (
                  <button
                    key={order.id}
                    type="button"
                    onClick={() => setSelectedOrder(order)}
                    className="flex w-full items-center gap-3 border-t border-gray-100 px-4 py-3 text-left transition hover:bg-gray-50"
                  >
                    <img
                      src={order.image}
                      alt=""
                      className="h-10 w-10 shrink-0 rounded object-cover"
                    />
                    <span className="min-w-0 flex-1">
                      <span className="block text-xs font-semibold">
                        {order.id}
                      </span>
                      <span className="mt-1 block text-[10px] text-gray-500">
                        {order.items} item(s) · {money(order.amount)}
                      </span>
                    </span>
                    <span
                      className={`shrink-0 rounded px-2 py-1 text-[9px] ${statusStyle(
                        order.status
                      )}`}
                    >
                      {order.status}
                    </span>
                  </button>
                ))}

                {filteredOrders.length === 0 && (
                  <p className="p-5 text-sm text-gray-500">No matching orders.</p>
                )}
              </div>
            </article>
          </section>

    
          <section className="grid gap-4 xl:grid-cols-[1.45fr_0.75fr_0.7fr]">
            <article className="min-w-0 overflow-hidden rounded-lg border border-gray-200 bg-white">
              <div className="flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
                <h2 className="font-bold">Recent Enquiries</h2>
                <div className="flex items-center gap-3">
                  <select
                    aria-label="Filter enquiries by status"
                    value={enquiryFilter}
                    onChange={(event) => setEnquiryFilter(event.target.value)}
                    className="rounded-md border bg-white px-2 py-2 text-xs"
                  >
                    {["All", "New", "In Progress", "Replied"].map((status) => (
                      <option key={status}>{status}</option>
                    ))}
                  </select>
                  <Link
                    to="/admin/enquiries"
                    className="text-xs text-[#075631]"
                  >
                    View All
                  </Link>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-170 text-xs">
                  <thead className="bg-gray-50 text-left">
                    <tr>
                      <th className="px-4 py-3">Name</th>
                      <th className="px-3 py-3">Type</th>
                      <th className="px-3 py-3">Message</th>
                      <th className="px-3 py-3">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredEnquiries.map((enquiry) => (
                      <tr key={enquiry.id} className="border-t border-gray-100">
                        <td className="px-4 py-3 font-medium">
                          {enquiry.name}
                        </td>
                        <td className="px-3 py-3">{enquiry.type}</td>
                        <td className="max-w-52 px-3 py-3">
                          {enquiry.message}
                        </td>
                        <td className="px-3 py-3">
                          <select
                            aria-label={`Status for ${enquiry.name}`}
                            value={enquiry.status}
                            onChange={(event) =>
                              updateEnquiryStatus(
                                enquiry.id,
                                event.target.value
                              )
                            }
                            className={`rounded px-2 py-1 text-[10px] ${statusStyle(
                              enquiry.status
                            )}`}
                          >
                            {["New", "In Progress", "Replied"].map((status) => (
                              <option key={status}>{status}</option>
                            ))}
                          </select>
                        </td>
                      </tr>
                    ))}
                    {filteredEnquiries.length === 0 && (
                      <tr>
                        <td colSpan={4} className="p-5 text-center text-gray-500">
                          No matching enquiries.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </article>

            <article className="overflow-hidden rounded-lg border border-gray-200 bg-white">
              <div className="flex items-center justify-between gap-2 px-4 py-4">
                <h2 className="font-bold">Low Stock Products</h2>
                <Link
                  to="/admin/products"
                  className="text-xs text-[#075631]"
                >
                  View All
                </Link>
              </div>

              {lowStock.slice(0, 6).map((product) => (
                <Link
                  key={product.id}
                  to="/admin/products"
                  className="flex items-center gap-3 border-t border-gray-100 px-4 py-3 hover:bg-gray-50"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-10 w-10 rounded object-cover"
                  />
                  <span className="min-w-0 flex-1 text-xs">
                    {product.name}
                  </span>
                  <span className="shrink-0 text-[10px] text-red-500">
                    {product.stock} left
                  </span>
                </Link>
              ))}

              {lowStock.length === 0 && (
                <p className="p-4 text-sm text-gray-500">
                  No low-stock products.
                </p>
              )}
            </article>

            <article className="rounded-lg border border-gray-200 bg-white p-4">
              <h2 className="mb-4 font-bold">Quick Actions</h2>
              <div className="grid grid-cols-2 gap-2">
                {[
                  ["◇", "Add Product", "/admin/products/add"],
                  ["▤", "Add Blog", "/admin/blog/add"],
                  ["▧", "Manage Banners", "/admin/banners"],
                  ["🛒", "View Orders", "/admin/orders"],
                  ["✉", "View Enquiries", "/admin/enquiries"],
                  ["⚙", "Settings", "/admin/settings"],
                ].map(([icon, label, path]) => (
                  <Link
                    key={label}
                    to={path}
                    className="flex min-h-24 flex-col items-center justify-center rounded-md border border-gray-200 p-3 text-center transition hover:border-[#075631] hover:bg-[#f5fbf6]"
                  >
                    <span className="text-2xl text-[#075631]">{icon}</span>
                    <span className="mt-2 text-[10px]">{label}</span>
                  </Link>
                ))}
              </div>

              <button
                type="button"
                onClick={resetDemo}
                className="mt-4 w-full rounded-md border border-red-200 px-3 py-2 text-xs text-red-600 transition hover:bg-red-50"
              >
                Reset Demo Data
              </button>
            </article>
          </section>
        </main>
      </div>

     
      {selectedOrder && (
        <div
          className="fixed inset-0 z-90 flex items-center justify-center bg-black/50 p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setSelectedOrder(null);
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="order-dialog-title"
            className="w-full max-w-md rounded-xl bg-white shadow-2xl"
          >
            <div className="flex items-center justify-between border-b px-5 py-4">
              <h2 id="order-dialog-title" className="font-bold">
                Order {selectedOrder.id}
              </h2>
              <button
                type="button"
                aria-label="Close order details"
                onClick={() => setSelectedOrder(null)}
                className="text-2xl text-gray-500"
              >
                ×
              </button>
            </div>

            <div className="p-5">
              <div className="flex items-center gap-4">
                <img
                  src={selectedOrder.image}
                  alt=""
                  className="h-16 w-16 rounded-lg object-cover"
                />
                <div>
                  <p className="text-sm">
                    {selectedOrder.items} item(s)
                  </p>
                  <p className="mt-1 text-xl font-bold text-[#075631]">
                    {money(selectedOrder.amount)}
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    {selectedOrder.time}
                  </p>
                </div>
              </div>

              <label
                htmlFor="order-status"
                className="mt-6 block text-sm font-medium"
              >
                Update order status
              </label>
              <select
                id="order-status"
                value={selectedOrder.status}
                onChange={(event) =>
                  updateOrderStatus(selectedOrder.id, event.target.value)
                }
                className="mt-2 w-full rounded-md border bg-white px-3 py-3 text-sm"
              >
                {["Processing", "Shipped", "Delivered", "Cancelled", "Returned"].map(
                  (status) => (
                    <option key={status}>{status}</option>
                  )
                )}
              </select>

              <Link
                to="/admin/orders"
                onClick={() => setSelectedOrder(null)}
                className="mt-4 block rounded-md bg-[#075631] py-3 text-center text-sm font-semibold text-white hover:bg-[#064524]"
              >
                Open Orders Management
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
