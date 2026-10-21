import React, { useCallback, useEffect, useState } from "react";
import {
  createProduct,
  deleteProduct,
  getProducts,
  updateProduct,
} from "../../services/productService.js";
import { getCategories } from "../../services/categoryService.js";
import { apiUpload } from "../../services/api.js";

const blank = {
  name: "",
  description: "",
  category: "",
  categoryType: "",
  region: "",
  image: "",
  priceINR: "",
  priceUSD: "",
  stock: 0,
  isFeatured: false,
};

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(blank);
  const [editing, setEditing] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);
  const refresh = useCallback(async () => {
    const [result, categoryData] = await Promise.all([
      getProducts({ includeInactive: true, limit: 50 }),
      getCategories({ all: true }),
    ]);
    setProducts(result.products || []);
    setCategories(categoryData.categories || []);
  }, []);
  useEffect(() => {
    refresh().catch((e) => setError(e.message));
  }, [refresh]);

  const save = async (event) => {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      const payload = {
        ...form,
        category: form.category || undefined,
        priceINR: Number(form.priceINR),
        priceUSD: Number(form.priceUSD),
        stock: Number(form.stock),
      };
      if (editing) await updateProduct(editing, payload);
      else await createProduct(payload);
      setForm(blank);
      setEditing("");
      await refresh();
    } catch (e) {
      setError(e.message || "Could not save product.");
    } finally {
      setBusy(false);
    }
  };
  const edit = (product) => {
    setEditing(product._id);
    setForm({
      ...blank,
      ...product,
      category:
        typeof product.category === "object"
          ? product.category?._id || ""
          : product.category || "",
      categoryType: product.categoryType || product.category?.name || "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const remove = async (product) => {
    if (!window.confirm(`Deactivate ${product.name}?`)) return;
    try {
      await deleteProduct(product._id);
      await refresh();
    } catch (e) {
      setError(e.message);
    }
  };
  const set = (key) => (e) =>
    setForm((current) => ({
      ...current,
      [key]: e.target.type === "checkbox" ? e.target.checked : e.target.value,
    }));
  const input = "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm";
  const uploadImage = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      const body = new FormData();
      body.append("images", file);
      const result = await apiUpload("/uploads/products", body);
      const url = result.files?.[0]?.url;
      if (!url) throw new Error("Image provider returned no URL");
      setForm((current) => ({
        ...current,
        image: url,
        images: [
          ...(current.images || []).filter((image) => image !== current.image),
          url,
        ],
      }));
    } catch (e) {
      setError(e.message || "Image upload failed.");
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  };

  return (
    <section className="space-y-5">
      <header>
        <h1 className="text-2xl font-bold text-[#073b25]">Products</h1>
        <p className="mt-1 text-sm text-gray-500">
          Changes are saved to the shared product database.
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
      <form
        onSubmit={save}
        className="grid gap-3 rounded-xl border bg-white p-4 sm:grid-cols-2 lg:grid-cols-4"
      >
        <input
          className={input}
          placeholder="Product name"
          value={form.name}
          onChange={set("name")}
          required
        />
        <select
          className={input}
          value={form.category}
          onChange={(e) => {
            const category = categories.find(
              (item) => item._id === e.target.value,
            );
            setForm((current) => ({
              ...current,
              category: e.target.value,
              categoryType: category?.name || "",
            }));
          }}
        >
          <option value="">Choose category</option>
          {categories
            .filter((category) => category.isActive)
            .map((category) => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
        </select>
        <input
          className={input}
          placeholder="Region"
          value={form.region}
          onChange={set("region")}
        />
        <label className="space-y-1 text-xs text-gray-600">
          Product image{" "}
          <input
            className={input}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/avif"
            onChange={uploadImage}
            disabled={uploading}
          />
          {uploading ? (
            "Uploading…"
          ) : form.image ? (
            <span className="block truncate">Image ready</span>
          ) : null}
          <input
            type="text"
            inputMode="url"
            className={input}
            placeholder="Or paste an image URL"
            value={form.image}
            onChange={set("image")}
          />
        </label>
        <input
          className={input}
          type="number"
          min="0"
          step="0.01"
          placeholder="Price INR"
          value={form.priceINR}
          onChange={set("priceINR")}
          required
        />
        <input
          className={input}
          type="number"
          min="0"
          step="0.01"
          placeholder="Price USD"
          value={form.priceUSD}
          onChange={set("priceUSD")}
          required
        />
        <input
          className={input}
          type="number"
          min="0"
          step="1"
          placeholder="Stock"
          value={form.stock}
          onChange={set("stock")}
          required
        />
        <input
          className={input}
          placeholder="Description"
          value={form.description}
          onChange={set("description")}
        />
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={Boolean(form.isFeatured)}
            onChange={set("isFeatured")}
          />{" "}
          Featured product
        </label>
        <div className="flex gap-2">
          <button
            disabled={busy}
            className="rounded-lg bg-[#073b25] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
          >
            {busy ? "Saving…" : editing ? "Save changes" : "Add product"}
          </button>
          {editing && (
            <button
              type="button"
              onClick={() => {
                setEditing("");
                setForm(blank);
              }}
              className="rounded-lg border px-4 py-2 text-sm"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
      <div className="overflow-x-auto rounded-xl border bg-white">
        <table className="w-full min-w-163 text-left text-sm">
          <thead className="bg-gray-50 text-gray-500">
            <tr>
              <th className="p-3">Product</th>
              <th className="p-3">Prices</th>
              <th className="p-3">Stock</th>
              <th className="p-3">Status</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p._id} className="border-t">
                <td className="p-3 font-medium">
                  {p.name}
                  <div className="text-xs text-gray-500">
                    {p.categoryType || p.category?.name || ""}
                  </div>
                </td>
                <td className="p-3">
                  ₹{p.priceINR} · ${p.priceUSD}
                </td>
                <td className="p-3">{p.stock}</td>
                <td className="p-3">{p.isActive ? "Active" : "Inactive"}</td>
                <td className="p-3">
                  <div className="flex gap-2">
                    <button
                      onClick={() => edit(p)}
                      className="text-[#075631] underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => remove(p)}
                      className="text-red-600 underline"
                    >
                      Deactivate
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {!products.length && (
              <tr>
                <td colSpan="5" className="p-8 text-center text-gray-500">
                  No products found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
