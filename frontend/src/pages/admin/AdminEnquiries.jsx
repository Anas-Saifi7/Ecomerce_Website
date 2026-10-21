import React, { useCallback, useEffect, useState } from "react";
import {
  deleteEnquiry,
  getEnquiries,
  updateEnquiry,
} from "../../services/enquiryService.js";

const statuses = ["new", "in_progress", "replied", "closed"];
export default function AdminEnquiries() {
  const [enquiries, setEnquiries] = useState([]);
  const [error, setError] = useState("");

  const refresh = useCallback(async () => {
    const data = await getEnquiries();
    setEnquiries(data.enquiries || []);
  }, []);

  useEffect(() => {
    refresh().catch((e) => setError(e.message || "Could not load enquiries."));
  }, [refresh]);
  const statusChange = async (item, status) => {
    setError("");
    try {
      await updateEnquiry(item._id, { status });
      await refresh();
    } catch (e) {
      setError(e.message || "Could not update enquiry.");
    }
  };
  const remove = async (item) => {
    if (!window.confirm("Delete this enquiry?")) return;
    try {
      await deleteEnquiry(item._id);
      await refresh();
    } catch (e) {
      setError(e.message || "Could not delete enquiry.");
    }
  };

  return (
    <section className="space-y-5">
      <header>
        <h1 className="text-2xl font-bold text-[#073b25]">Enquiries</h1>
        <p className="mt-1 text-sm text-gray-500">
          Contact and wholesale requests from customers.
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
      <div className="space-y-3">
        {enquiries.map((item) => (
          <article
            key={item._id}
            className="rounded-xl border bg-white p-4 sm:p-5"
          >
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-wide text-[#075631]">
                  {item.type} · {new Date(item.createdAt).toLocaleString()}
                </p>
                <h2 className="mt-1 font-semibold">
                  {item.subject || item.name}
                </h2>

                <p className="text-sm text-gray-500">
                  {item.name} · {item.email}
                  {item.phone ? ` · ${item.phone}` : ""}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <select
                  aria-label="Enquiry status"
                  value={item.status}
                  onChange={(e) => statusChange(item, e.target.value)}
                  className="rounded border px-2 py-2 text-sm"
                >
                  {statuses.map((s) => (
                    <option key={s} value={s}>
                      {s.replace("_", " ")}
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => remove(item)}
                  className="rounded border border-red-200 px-3 py-2 text-xs text-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
            <p className="mt-4 whitespace-pre-wrap text-sm leading-6 text-gray-700">
              {item.message}
            </p>
          </article>
        ))}
        {!enquiries.length && (
          <p className="rounded-xl border bg-white p-8 text-center text-sm text-gray-500">
            No enquiries yet.
          </p>
        )}
      </div>
    </section>
  );
}
