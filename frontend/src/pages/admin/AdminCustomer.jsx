import React, { useCallback, useEffect, useState } from "react";
import {
  getCustomers,
  updateCustomerStatus,
} from "../../services/adminService.js";

export default function AdminCustomer() {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const refresh = useCallback(async () => {
    const data = await getCustomers({ search, limit: 50 });
    setCustomers(data.customers || []);
  }, [search]);
  useEffect(() => {
    refresh().catch((e) => setError(e.message || "Could not load customers."));
  }, [refresh]);
  const toggle = async (customer) => {
    setError("");
    try {
      await updateCustomerStatus(customer._id, !customer.isActive);
      await refresh();
    } catch (e) {
      setError(e.message || "Could not update customer.");
    }
  };
  return (
    <section className="space-y-5">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-[#073b25]">Customers</h1>
          <p className="mt-1 text-sm text-gray-500">
            Customer records from the shared database.
          </p>
        </div>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search name or email"
          className="rounded-lg border px-3 py-2 text-sm"
        />
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
        <table className="w-full min-w-163 text-left text-sm">
          <thead className="bg-gray-50 text-gray-500">
            <tr>
              <th className="p-3">Customer</th>
              <th className="p-3">Phone</th>
              <th className="p-3">Joined</th>
              <th className="p-3">Status</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((c) => (
              <tr key={c._id} className="border-t">
                <td className="p-3 font-medium">
                  {c.name}
                  <div className="text-xs font-normal text-gray-500">
                    {c.email}
                  </div>
                </td>
                <td className="p-3">{c.phone || "—"}</td>
                <td className="p-3">
                  {new Date(c.createdAt).toLocaleDateString()}
                </td>
                <td className="p-3">{c.isActive ? "Active" : "Disabled"}</td>
                <td className="p-3">
                  <button
                    onClick={() => toggle(c)}
                    className="text-[#075631] underline"
                  >
                    {c.isActive ? "Disable" : "Enable"}
                  </button>
                </td>
              </tr>
            ))}
            {!customers.length && (
              <tr>
                <td colSpan="5" className="p-8 text-center text-gray-500">
                  No customers found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
