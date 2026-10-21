import React, { useCallback, useEffect, useState } from "react";
import {
  getOrdersAdmin,
  refundOrder,
  updateOrderStatus,
} from "../../services/orderService.js";

const statuses = [
  "pending",
  "confirmed",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
  "return_requested",
  "returned",
];
export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState("");
  const refresh = useCallback(async () => {
    const data = await getOrdersAdmin({ limit: 50 });
    setOrders(data.orders || []);
  }, []);
  useEffect(() => {
    refresh().catch((e) => setError(e.message));
  }, [refresh]);
  const changeStatus = async (order, status) => {
    setBusyId(order._id);
    setError("");
    try {
      await updateOrderStatus(order._id, { status });
      await refresh();
    } catch (e) {
      setError(e.message || "Could not update order.");
    } finally {
      setBusyId("");
    }
  };
  const requestRefund = async (order) => {
    if (
      !window.confirm(
        `Process a refund for ${order.orderNumber}? This submits the refund to the configured payment provider.`,
      )
    )
      return;
    setBusyId(order._id);
    setError("");
    try {
      await refundOrder(order._id);
      await refresh();
    } catch (e) {
      setError(e.message || "Refund could not be processed.");
    } finally {
      setBusyId("");
    }
  };
  return (
    <section className="space-y-5">
      <header>
        <h1 className="text-2xl font-bold text-[#073b25]">Orders</h1>
        <p className="mt-1 text-sm text-gray-500">
          Customer orders from the shared database.
        </p>
      </header>
      {error && (
        <p
          role="alert"
          className="rounded-lg bg-red-50 p-3 text-sm text-red-700"
        >
          {error}
        </p>
      )}
      <div className="overflow-x-auto rounded-xl border bg-white">
        <table className="w-full min-w-213 text-left text-sm">
          <thead className="bg-gray-50 text-gray-500">
            <tr>
              <th className="p-3">Order</th>
              <th className="p-3">Customer</th>
              <th className="p-3">Date</th>
              <th className="p-3">Total</th>
              <th className="p-3">Payment</th>
              <th className="p-3">Status</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o._id} className="border-t">
                <td className="p-3 font-semibold">
                  {o.orderNumber}
                  <div className="text-xs font-normal text-gray-500">
                    {o.items?.length || 0} line item(s)
                  </div>
                </td>
                <td className="p-3">
                  {o.user?.name}
                  <div className="text-xs text-gray-500">{o.user?.email}</div>
                </td>
                <td className="p-3">
                  {new Date(o.createdAt).toLocaleDateString()}
                </td>
                <td className="p-3">
                  {o.currency === "USD" ? "$" : "₹"}
                  {o.pricing?.total}
                </td>
                <td className="p-3">
                  {o.payment?.method} · {o.payment?.status}
                </td>
                <td className="p-3">
                  <select
                    aria-label={`Status for ${o.orderNumber}`}
                    disabled={busyId === o._id}
                    value={o.status}
                    onChange={(e) => changeStatus(o, e.target.value)}
                    className="rounded border px-2 py-1"
                  >
                    {statuses.map((s) => (
                      <option key={s} value={s}>
                        {s.replaceAll("_", " ")}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="p-3">
                  {["paid", "partially_refunded"].includes(
                    o.payment?.status,
                  ) && (
                    <button
                      disabled={busyId === o._id}
                      onClick={() => requestRefund(o)}
                      className="text-red-700 underline disabled:opacity-50"
                    >
                      Process refund
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {!orders.length && (
              <tr>
                <td colSpan="7" className="p-8 text-center text-gray-500">
                  No orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
