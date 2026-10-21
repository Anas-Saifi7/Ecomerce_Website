import React, { useCallback, useEffect, useState } from "react";
import {
  createCategory,
  deleteCategory,
  getCategories,
  updateCategory,
} from "../../services/categoryService.js";

const initial = { name: "", description: "", image: "" };
export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(initial);
  const [editing, setEditing] = useState("");
  const [error, setError] = useState("");
  const refresh = useCallback(async () => {
    const data = await getCategories({ all: true });
    setCategories(data.categories || []);
  }, []);
  useEffect(() => {
    refresh().catch((e) => setError(e.message));
  }, [refresh]);
  const save = async (event) => {
    event.preventDefault();
    setError("");
    try {
      if (editing) await updateCategory(editing, form);
      else await createCategory(form);
      setForm(initial);
      setEditing("");
      await refresh();
    } catch (e) {
      setError(e.message || "Could not save category.");
    }
  };
  const remove = async (category) => {
    if (!window.confirm(`Deactivate ${category.name}?`)) return;
    try {
      await deleteCategory(category._id);
      await refresh();
    } catch (e) {
      setError(e.message);
    }
  };
  const input = "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm";
  return (
    <section className="space-y-5">
      <header>
        <h1 className="text-2xl font-bold text-[#073b25]">Categories</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage categories shown in the catalog.
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
        className="grid gap-3 rounded-xl border bg-white p-4 sm:grid-cols-2"
      >
        <input
          className={input}
          required
          placeholder="Category name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          className={input}
          placeholder="Image URL or filename"
          value={form.image}
          onChange={(e) => setForm({ ...form, image: e.target.value })}
        />
        <textarea
          className={`${input} sm:col-span-2`}
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
        <div className="flex gap-2">
          <button className="rounded-lg bg-[#073b25] px-4 py-2 text-sm font-semibold text-white">
            {editing ? "Save changes" : "Add category"}
          </button>
          {editing && (
            <button
              type="button"
              className="rounded-lg border px-4 py-2 text-sm"
              onClick={() => {
                setEditing("");
                setForm(initial);
              }}
            >
              Cancel
            </button>
          )}
        </div>
      </form>
      <div className="overflow-x-auto rounded-xl border bg-white">
        <table className="w-full min-w-125 text-left text-sm">
          <thead className="bg-gray-50 text-gray-500">
            <tr>
              <th className="p-3">Category</th>
              <th className="p-3">Slug</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((c) => (
              <tr key={c._id} className="border-t">
                <td className="p-3 font-medium">
                  {c.name}
                  <div className="text-xs font-normal text-gray-500">
                    {c.description}
                  </div>
                </td>
                <td className="p-3">{c.slug}</td>
                <td className="p-3">
                  <button
                    className="mr-3 text-[#075631] underline"
                    onClick={() => {
                      setEditing(c._id);
                      setForm({
                        name: c.name,
                        description: c.description || "",
                        image: c.image || "",
                      });
                    }}
                  >
                    Edit
                  </button>
                  <button
                    className="text-red-600 underline"
                    onClick={() => remove(c)}
                  >
                    Deactivate
                  </button>
                </td>
              </tr>
            ))}
            {!categories.length && (
              <tr>
                <td colSpan="3" className="p-8 text-center text-gray-500">
                  No categories found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
