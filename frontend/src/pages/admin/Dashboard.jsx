import React, { useEffect, useState } from "react";
import { getDashboard } from "../../services/adminService.js";

const currency = (value, code) =>
  new Intl.NumberFormat(code === "USD" ? "en-US" : "en-IN", {
    style: "currency",
    currency: code,
    maximumFractionDigits: 0,
  }).format(value || 0);
export default function Dashboard() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  useEffect(() => {
    let active = true;
    getDashboard()
      .then((result) => {
        if (active) setData(result);
      })
      .catch((e) => {
        if (active) setError(e.message || "Could not load dashboard.");
      });
    return () => {
      active = false;
    };
  }, []);
  if (error)
    return (
      <div
        role="alert"
        className="rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-700"
      >
        {error}
      </div>
    );
  if (!data)
    return (
      <p className="py-12 text-center text-sm text-gray-500">
        Loading live store metrics…
      </p>
    );
  const stats = data.stats || {};
  const cards = [
    ["Orders", stats.totalOrders],
    ["Active products", stats.totalProducts],
    ["Customers", stats.totalCustomers],
    ["Open orders", stats.pendingOrders],
  ];
  return (
    <section className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-[#073b25]">Store Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Live metrics from the MOLOG store database.
        </p>
      </header>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map(([label, value]) => (
          <article
            key={label}
            className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
          >
            <p className="text-sm text-gray-500">{label}</p>
            <p className="mt-2 text-3xl font-bold text-[#073b25]">
              {value ?? 0}
            </p>
          </article>
        ))}
      </div>
      <section className="rounded-xl border bg-white p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold">Captured revenue</h2>
            <p className="text-xs text-gray-500">
              Grouped by order currency; amounts are not converted.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            {(stats.revenue || []).map((entry) => (
              <span
                key={entry._id}
                className="rounded-lg bg-green-50 px-3 py-2 text-sm font-semibold text-[#073b25]"
              >
                {currency(entry.total, entry._id)} · {entry.count} paid
              </span>
            ))}
            {!stats.revenue?.length && (
              <span className="text-sm text-gray-500">
                No captured payments recorded.
              </span>
            )}
          </div>
        </div>
      </section>
      <div className="grid gap-5 xl:grid-cols-3">
        <section className="overflow-hidden rounded-xl border bg-white xl:col-span-2">
          <h2 className="border-b p-4 text-lg font-semibold">Recent orders</h2>
          <div className="overflow-x-auto">
            <table className="w-full min-w-150 text-left text-sm">
              <thead className="bg-gray-50 text-gray-500">
                <tr>
                  <th className="p-3">Order</th>
                  <th className="p-3">Customer</th>
                  <th className="p-3">Total</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Date</th>
                </tr>
              </thead>
              <tbody>
                {(data.recentOrders || []).map((order) => (
                  <tr key={order._id} className="border-t">
                    <td className="p-3 font-semibold">{order.orderNumber}</td>
                    <td className="p-3">
                      {order.user?.name || order.user?.email || "Customer"}
                    </td>
                    <td className="p-3">
                      {currency(order.pricing?.total, order.currency)}
                    </td>
                    <td className="p-3 capitalize">
                      {order.status?.replaceAll("_", " ")}
                    </td>
                    <td className="p-3">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
                {!data.recentOrders?.length && (
                  <tr>
                    <td colSpan="5" className="p-6 text-center text-gray-500">
                      No orders yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
        <section className="rounded-xl border bg-white">
          <h2 className="border-b p-4 text-lg font-semibold">Low stock</h2>
          <div className="divide-y">
            {(data.lowStock || []).map((product) => (
              <div
                key={product._id}
                className="flex items-center justify-between gap-3 p-4"
              >
                <span className="text-sm font-medium">{product.name}</span>
                <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-800">
                  {product.stock} left
                </span>
              </div>
            ))}
            {!data.lowStock?.length && (
              <p className="p-5 text-sm text-gray-500">No low-stock items.</p>
            )}
          </div>
        </section>
      </div>
      <p className="text-xs text-gray-500">
        Open enquiries: {stats.openEnquiries ?? 0} · Orders by status:{" "}
        {(stats.ordersByStatus || [])
          .map((x) => `${x._id}: ${x.count}`)
          .join(" · ") || "none"}
      </p>
    </section>
  );
}
