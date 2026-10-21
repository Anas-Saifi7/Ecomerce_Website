import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  getProducts,
  updateStock,
  deleteProduct,
} from "../../services/productService.js";
import * as blog from "../../services/blogService.js";
import * as banners from "../../services/bannerService.js";
import * as reviews from "../../services/reviewService.js";
import * as coupons from "../../services/couponService.js";
import * as newsletter from "../../services/newsletterService.js";
import * as pages from "../../services/pageService.js";
import * as settings from "../../services/settingsService.js";
import { get, apiUpload } from "../../services/api.js";

const configs = {
  blog: {
    title: "Blog posts",
    key: "posts",
    service: blog,
    fields: [
      "title",
      "excerpt",
      "content",
      "image",
      "author",
      "tags",
      "isPublished",
    ],
    blank: {
      title: "",
      excerpt: "",
      content: "",
      image: "",
      author: "MOLOG",
      tags: [],
      isPublished: false,
    },
  },
  banners: {
    title: "Banners",
    key: "banners",
    service: banners,
    fields: ["title", "image", "link", "placement", "sortOrder", "isActive"],
    blank: {
      title: "",
      image: "",
      link: "",
      placement: "home-hero",
      sortOrder: 0,
      isActive: true,
    },
  },
  reviews: {
    title: "Reviews",
    key: "reviews",
    service: reviews,
    read: () => reviews.getAllReviews(),
    fields: [],
    blank: {},
  },
  coupons: {
    title: "Coupons",
    key: "coupons",
    service: coupons,
    fields: [
      "code",
      "type",
      "value",
      "currency",
      "minOrder",
      "maxDiscount",
      "usageLimit",
      "expiresAt",
      "isActive",
    ],
    blank: {
      code: "",
      type: "percent",
      value: 10,
      currency: "ANY",
      minOrder: 0,
      isActive: true,
    },
  },
  pages: {
    title: "Pages & content",
    key: "pages",
    service: pages,
    fields: ["title", "slug", "content", "isPublished"],
    blank: { title: "", slug: "", content: "", isPublished: false },
  },
};

const button =
  "rounded bg-[#073b25] px-3 py-2 text-sm text-white disabled:opacity-50";
const input = "w-full rounded border border-gray-300 px-3 py-2 text-sm";

export default function AdminResources({ type }) {
  const config = configs[type];
  const [rows, setRows] = useState([]);
  const [form, setForm] = useState(config?.blank || {});
  const [editing, setEditing] = useState(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const refresh = async () => {
    if (["settings", "analytics", "export"].includes(type)) return;
    setError("");
    try {
      if (type === "inventory") {
        const r = await getProducts({ includeInactive: true, limit: 200 });
        setRows(r.products || []);
      } else if (type === "newsletter") {
        const r = await newsletter.getSubscribers();
        setRows(r.subscribers || []);
      } else {
        const r = await (
          config.read ||
          (() =>
            config.service[
              type === "blog"
                ? "getPosts"
                : type === "banners"
                  ? "getBanners"
                  : type === "reviews"
                    ? "getAllReviews"
                    : type === "coupons"
                      ? "getCoupons"
                      : "getPages"
            ]({ all: true }))
        )();
        setRows(r[config.key] || []);
      }
    } catch (e) {
      setError(e.message);
    }
  };
  useEffect(() => {
    refresh();
  }, [type]);
  if (type === "settings") return <SettingsPanel />;
  if (type === "analytics") return <AnalyticsPanel />;
  if (type === "export") return <WholesalePanel />;
  const save = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      if (type === "inventory") await updateStock(editing, Number(form.stock));
      else if (editing)
        await config.service[
          type === "blog"
            ? "updatePost"
            : type === "banners"
              ? "updateBanner"
              : type === "coupons"
                ? "updateCoupon"
                : "updatePage"
        ](editing, form);
      else
        await config.service[
          type === "blog"
            ? "createPost"
            : type === "banners"
              ? "createBanner"
              : type === "coupons"
                ? "createCoupon"
                : "createPage"
        ](form);
      setEditing(null);
      setForm(config?.blank || {});
      await refresh();
    } catch (e2) {
      setError(e2.message);
    } finally {
      setBusy(false);
    }
  };
  const remove = async (row) => {
    const action =
      type === "newsletter"
        ? "Unsubscribe"
        : type === "inventory"
          ? "Deactivate"
          : "Delete";
    if (
      !window.confirm(
        `${action} ${type === "newsletter" ? row.email : "this item"}?`,
      )
    )
      return;
    try {
      if (type === "newsletter") await newsletter.unsubscribe(row.email);
      else if (type === "reviews") await reviews.deleteReview(row._id);
      else if (type === "inventory") await deleteProduct(row._id);
      else
        await config.service[
          type === "blog"
            ? "deletePost"
            : type === "banners"
              ? "deleteBanner"
              : type === "coupons"
                ? "deleteCoupon"
                : "deletePage"
        ](row._id);
      await refresh();
    } catch (e) {
      setError(e.message);
    }
  };
  const toggleReview = async (row) => {
    try {
      await reviews.moderateReview(row._id, { isApproved: !row.isApproved });
      await refresh();
    } catch (e) {
      setError(e.message);
    }
  };
  const startEdit = (row) => {
    setEditing(row._id);
    setForm(
      type === "inventory"
        ? { stock: row.stock }
        : Object.fromEntries(
            (config?.fields || []).map((k) => [
              k,
              Array.isArray(row[k]) ? row[k].join(", ") : (row[k] ?? ""),
            ]),
          ),
    );
  };
  const title =
    type === "inventory"
      ? "Inventory"
      : type === "newsletter"
        ? "Newsletter subscribers"
        : config.title;
  return (
    <section className="space-y-5">
      <header>
        <h1 className="font-serif text-3xl text-[#073b25]">{title}</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage records saved in the MOLOG store database.
        </p>
      </header>
      {error && (
        <p role="alert" className="rounded bg-red-50 p-3 text-sm text-red-700">
          {error}
        </p>
      )}
      {type !== "reviews" &&
        type !== "newsletter" &&
        (type !== "inventory" || editing) && (
          <form
            onSubmit={save}
            className="grid gap-3 rounded-lg bg-white p-4 shadow-sm sm:grid-cols-2"
          >
            {(type === "inventory" ? ["stock"] : config.fields).map((key) => (
              <label key={key} className="space-y-1 text-sm">
                <span className="capitalize">{key}</span>
                {["content", "excerpt"].includes(key) ? (
                  <textarea
                    className={input}
                    rows={key === "content" ? 5 : 2}
                    value={form[key] ?? ""}
                    onChange={(e) =>
                      setForm({ ...form, [key]: e.target.value })
                    }
                  />
                ) : ["isPublished", "isActive"].includes(key) ? (
                  <input
                    type="checkbox"
                    checked={Boolean(form[key])}
                    onChange={(e) =>
                      setForm({ ...form, [key]: e.target.checked })
                    }
                  />
                ) : (
                  <input
                    className={input}
                    type={
                      [
                        "value",
                        "minOrder",
                        "maxDiscount",
                        "usageLimit",
                        "sortOrder",
                        "stock",
                      ].includes(key)
                        ? "number"
                        : key === "expiresAt"
                          ? "datetime-local"
                          : "text"
                    }
                    value={
                      Array.isArray(form[key])
                        ? form[key].join(", ")
                        : (form[key] ?? "")
                    }
                    onChange={(e) =>
                      setForm({
                        ...form,
                        [key]: [
                          "value",
                          "minOrder",
                          "maxDiscount",
                          "usageLimit",
                          "sortOrder",
                          "stock",
                        ].includes(key)
                          ? e.target.value === ""
                            ? ""
                            : Number(e.target.value)
                          : key === "tags"
                            ? e.target.value
                                .split(",")
                                .map((x) => x.trim())
                                .filter(Boolean)
                            : e.target.value,
                      })
                    }
                  />
                )}
                {key === "image" && (
                  <input
                    aria-label="Upload image"
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/avif"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      try {
                        const body = new FormData();
                        body.append("images", file);
                        const result = await apiUpload(
                          type === "blog"
                            ? "/uploads/blog"
                            : "/uploads/banners",
                          body,
                        );
                        setForm((prev) => ({
                          ...prev,
                          image: result.files?.[0]?.url || prev.image,
                        }));
                      } catch (err) {
                        setError(err.message);
                      }
                    }}
                  />
                )}
              </label>
            ))}
            <div className="flex items-end gap-2">
              <button className={button} disabled={busy}>
                {busy ? "Saving…" : editing ? "Save changes" : "Add new"}
              </button>
              {editing && (
                <button
                  type="button"
                  className="rounded border px-3 py-2 text-sm"
                  onClick={() => {
                    setEditing(null);
                    setForm(config?.blank || {});
                  }}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        )}
      {type === "newsletter" && (
        <div className="flex justify-end">
          <button
            className={button}
            onClick={() => {
              const csv = [
                "email,isActive,createdAt",
                ...rows.map((x) => `${x.email},${x.isActive},${x.createdAt}`),
              ].join("\n");
              const a = document.createElement("a");
              a.href = URL.createObjectURL(
                new Blob([csv], { type: "text/csv" }),
              );
              a.download = "molog-newsletter.csv";
              a.click();
              URL.revokeObjectURL(a.href);
            }}
          >
            Download CSV
          </button>
        </div>
      )}
      <div className="overflow-x-auto rounded-lg bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-3">Record</th>
              <th className="p-3">Details</th>
              <th className="p-3">Status</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row._id || row.email} className="border-t">
                <td className="p-3 font-medium">
                  {row.title ||
                    row.name ||
                    row.code ||
                    row.email ||
                    row.product?.name ||
                    row._id}
                </td>
                <td className="max-w-lg truncate p-3">
                  {type === "inventory"
                    ? `Stock: ${row.stock} · ${row.priceINR} INR / ${row.priceUSD} USD`
                    : row.excerpt ||
                      row.comment ||
                      row.placement ||
                      row.type ||
                      row.slug ||
                      row.createdAt}
                </td>
                <td className="p-3">
                  {type === "reviews"
                    ? row.isApproved
                      ? "Approved"
                      : "Pending"
                    : row.isActive === false || row.isPublished === false
                      ? "Inactive"
                      : "Active"}
                </td>
                <td className="space-x-2 whitespace-nowrap p-3">
                  {type === "reviews" ? (
                    <button
                      className="text-[#075631]"
                      onClick={() => toggleReview(row)}
                    >
                      {row.isApproved ? "Unapprove" : "Approve"}
                    </button>
                  ) : type === "newsletter" ? null : (
                    <button
                      className="text-[#075631]"
                      onClick={() => startEdit(row)}
                    >
                      Edit
                    </button>
                  )}
                  {type === "pages" && row.isPublished && (
                    <Link
                      className="text-[#075631]"
                      to={`/pages/${row.slug}`}
                      target="_blank"
                    >
                      Preview
                    </Link>
                  )}
                  {type === "newsletter" ? (
                    row.isActive !== false && (
                      <button
                        className="text-red-700"
                        onClick={() => remove(row)}
                      >
                        Unsubscribe
                      </button>
                    )
                  ) : (
                    <button
                      className="text-red-700"
                      onClick={() => remove(row)}
                    >
                      {type === "inventory" ? "Deactivate" : "Delete"}
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {!rows.length && (
              <tr>
                <td colSpan="4" className="p-8 text-center text-gray-500">
                  No records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function SettingsPanel() {
  const [value, setValue] = useState(null),
    [error, setError] = useState(""),
    [saved, setSaved] = useState(false);
  useEffect(() => {
    settings
      .getSettings()
      .then((r) => setValue(r.settings))
      .catch((e) => setError(e.message));
  }, []);
  if (!value) return <p>{error || "Loading store settings…"}</p>;
  const save = async (e) => {
    e.preventDefault();
    try {
      const r = await settings.updateSettings(value);
      setValue(r.settings);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (e2) {
      setError(e2.message);
    }
  };
  return (
    <form onSubmit={save} className="max-w-3xl space-y-4">
      <h1 className="font-serif text-3xl text-[#073b25]">Store settings</h1>
      {error && <p className="text-red-700">{error}</p>}
      <div className="grid gap-3 rounded bg-white p-5 sm:grid-cols-2">
        {[
          "storeName",
          "contact.email",
          "contact.phone",
          "contact.address",
          "lowStockThreshold",
          "tax.INR",
          "tax.USD",
          "shipping.INR.domestic",
          "shipping.INR.freeAbove",
          "shipping.INR.international",
          "shipping.USD.domestic",
          "shipping.USD.freeAbove",
          "shipping.USD.international",
        ].map((path) => {
          const keys = path.split(".");
          let val = keys.reduce((v, k) => v?.[k], value);
          return (
            <label key={path} className="space-y-1 text-sm">
              <span>{path}</span>
              <input
                className={input}
                value={val ?? ""}
                onChange={(e) =>
                  setValue((prev) => {
                    const copy = structuredClone(prev);
                    let obj = copy;
                    keys.slice(0, -1).forEach((k) => (obj = obj[k]));
                    obj[keys.at(-1)] = ["lowStockThreshold"].includes(path)
                      ? Number(e.target.value)
                      : ["tax", "shipping"].includes(keys[0])
                        ? Number(e.target.value)
                        : e.target.value;
                    return copy;
                  })
                }
              />
            </label>
          );
        })}
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={value.codEnabled}
            onChange={(e) =>
              setValue({ ...value, codEnabled: e.target.checked })
            }
          />
          Cash on delivery enabled
        </label>
      </div>
      <button className={button}>Save settings</button>
      {saved && <span className="ml-3 text-green-700">Saved.</span>}
    </form>
  );
}
function AnalyticsPanel() {
  const [data, setData] = useState(null),
    [error, setError] = useState("");
  useEffect(() => {
    get("/admin/analytics")
      .then(setData)
      .catch((e) => setError(e.message));
  }, []);
  return (
    <section>
      <h1 className="mb-5 font-serif text-3xl text-[#073b25]">Analytics</h1>
      {error && <p className="text-red-700">{error}</p>}
      {!data ? (
        "Loading…"
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Object.entries(data.analytics || {}).map(([k, v]) => (
            <article key={k} className="rounded bg-white p-5 shadow-sm">
              <h2 className="capitalize text-gray-500">
                {k.replaceAll("_", " ")}
              </h2>
              <pre className="mt-3 whitespace-pre-wrap text-sm">
                {JSON.stringify(v, null, 2)}
              </pre>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
function WholesalePanel() {
  const [items, setItems] = useState([]),
    [error, setError] = useState("");
  useEffect(() => {
    get("/enquiries")
      .then((r) =>
        setItems(
          (r.enquiries || []).filter(
            (e) => e.type === "export" || e.type === "wholesale",
          ),
        ),
      )
      .catch((e) => setError(e.message));
  }, []);
  return (
    <section>
      <h1 className="mb-5 font-serif text-3xl text-[#073b25]">
        Wholesale & export enquiries
      </h1>
      {error && <p className="text-red-700">{error}</p>}
      <div className="space-y-3">
        {items.map((i) => (
          <article key={i._id} className="rounded bg-white p-4">
            <b>{i.name}</b> · {i.email} · {i.status}
            <p>{i.message}</p>
          </article>
        ))}
        {!items.length && !error && (
          <p className="text-gray-500">No wholesale/export enquiries found.</p>
        )}
      </div>
    </section>
  );
}
