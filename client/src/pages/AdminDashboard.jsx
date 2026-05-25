import { useEffect, useMemo, useState } from "react";
import api from "../api/http";
import { useAuth } from "../context/AuthContext";
import Loader from "../components/Loader";
import { getImageCandidates } from "../utils/image";

function Field({ label, children }) {
  return (
    <label className="block">
      <div className="mb-2 text-sm font-semibold text-slate-300 light:text-slate-700">
        {label}
      </div>
      {children}
    </label>
  );
}

const inputClass =
  "w-full rounded-2xl border border-white/10 bg-slate-950/55 px-4 py-3 text-sm text-white placeholder:text-white/70 focus:border-cyan-400/40 focus:outline-none " +
  "light:bg-white/90 light:text-slate-900 light:border-slate-200/60 " +
  "light:placeholder:text-slate-900/70";

export default function AdminDashboard() {
  const { user, loading: authLoading, loggedIn } = useAuth();

  const isAdmin = Boolean(user?.role === "admin");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [products, setProducts] = useState([]);

  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    stock: "",
    image: "",
    code: "",
    images: "",
  });

  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loggedIn) return;

    if (authLoading) return;

    (async () => {
      try {
        setLoading(true);
        setError("");
        const res = await api.get("/products");
        setProducts(res.data);
      } catch (e) {
        setError(e?.response?.data?.message || "Failed to load products");
      } finally {
        setLoading(false);
      }
    })();
  }, [loggedIn, authLoading]);

  const mappedImages = useMemo(() => {
    // allow user to enter images as comma-separated list
    const raw = (form.images || "").trim();
    if (!raw) return [];
    return raw
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  }, [form.images]);

  function resetForm() {
    setEditingId(null);
    setForm({
      title: "",
      description: "",
      price: "",
      category: "",
      stock: "",
      image: "",
      code: "",
      images: "",
    });
  }

  async function handleUpsert(e) {
    e.preventDefault();

    if (!isAdmin) {
      setError("Admin access required");
      return;
    }

    const payload = {
      title: form.title.trim(),
      description: form.description.trim(),
      price: Number(form.price),
      category: form.category.trim(),
      stock: Number(form.stock),
      code: (form.code || "").trim() || undefined,
      image: (form.image || "").trim() || undefined,
      images: mappedImages,
    };

    if (!payload.title || !payload.description || !payload.price || !payload.category) {
      setError("Please fill title, description, price, and category");
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      if (editingId) {
        const res = await api.put(`/products/${editingId}`, payload);
        setProducts((prev) => prev.map((p) => (p.id === editingId ? res.data : p)));
      } else {
        const res = await api.post("/products", payload);
        setProducts((prev) => [res.data, ...prev]);
      }

      resetForm();
    } catch (e2) {
      setError(e2?.response?.data?.message || "Failed to save product");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id) {
    if (!isAdmin) return;
    const ok = window.confirm("Delete this product?");
    if (!ok) return;

    try {
      setSubmitting(true);
      setError("");
      await api.delete(`/products/${id}`);
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (e2) {
      setError(e2?.response?.data?.message || "Failed to delete product");
    } finally {
      setSubmitting(false);
    }
  }

  function startEdit(p) {
    setEditingId(p.id);
    setForm({
      title: p.title || "",
      description: p.description || "",
      price: p.price ?? "",
      category: p.category || "",
      stock: p.stock ?? "",
      image: p.image || "",
      code: p.code || "",
      images: (p.images || []).join(", "),
    });
  }

  if (authLoading || !loggedIn) {
    return (
      <div className="pt-10">
        <Loader label={loggedIn ? "Loading admin dashboard..." : "Please log in"} />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <section className="space-y-6 pt-10">
        <div className="glass-card p-10 text-center">
          <p className="text-lg font-semibold">Admin access required</p>
          <p className="mt-2 text-slate-400">Your account role is: {user?.role || "unknown"}</p>
        </div>
      </section>
    );
  }

  if (loading) {
    return (
      <div className="pt-10">
        <Loader label="Loading products..." />
      </div>
    );
  }

  return (
    <section className="space-y-6 pt-10">
      <div className="glass-card p-6">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="mt-2 text-slate-400">Manage products (create, edit, delete).</p>
      </div>

      {error && (
        <div className="glass-card border border-rose-400/20 bg-rose-500/10 p-4 text-rose-200">
          {error}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <div className="glass-card p-6">
            <h2 className="text-xl font-bold">{editingId ? "Edit product" : "Add product"}</h2>

            <form onSubmit={handleUpsert} className="mt-4 space-y-4">
              <Field label="Title">
                <input
                  className={inputClass}
                  value={form.title}
                  onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                  placeholder="e.g. Nebula X Headphones"
                />
              </Field>

              <Field label="Description">
                <textarea
                  className={inputClass}
                  value={form.description}
                  onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                  placeholder="Product description"
                  rows={3}
                />
              </Field>

              <div className="grid grid-cols-2 gap-4">
                <Field label="Price">
                  <input
                    className={inputClass}
                    type="number"
                    value={form.price}
                    onChange={(e) => setForm((p) => ({ ...p, price: e.target.value }))}
                  />
                </Field>

                <Field label="Stock">
                  <input
                    className={inputClass}
                    type="number"
                    value={form.stock}
                    onChange={(e) => setForm((p) => ({ ...p, stock: e.target.value }))}
                  />
                </Field>
              </div>

              <Field label="Category">
                <input
                  className={inputClass}
                  value={form.category}
                  onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}
                  placeholder="e.g. Electronics"
                />
              </Field>

              <div className="grid grid-cols-2 gap-4">
                <Field label="Image (single) - filename">
                  <input
                    className={inputClass}
                    value={form.image}
                    onChange={(e) => setForm((p) => ({ ...p, image: e.target.value }))}
                    placeholder="e.g. icon-electronics.svg"
                  />
                </Field>

                <Field label="Code (optional) - 2 letters">
                  <input
                    className={inputClass}
                    value={form.code}
                    onChange={(e) => setForm((p) => ({ ...p, code: e.target.value }))}
                    placeholder="e.g. El"
                  />
                </Field>
              </div>

              <Field label="Images (comma-separated filenames) - optional">
                <input
                  className={inputClass}
                  value={form.images}
                  onChange={(e) => setForm((p) => ({ ...p, images: e.target.value }))}
                  placeholder="e.g. icon-electronics.svg, icon-electronics-2.svg"
                />
              </Field>

              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary w-full disabled:opacity-60"
                >
                  {submitting ? "Saving..." : editingId ? "Update" : "Create"}
                </button>

                <button
                  type="button"
                  disabled={submitting}
                  onClick={resetForm}
                  className="w-full rounded-2xl px-4 py-3 text-sm font-semibold bg-slate-700 text-white transition hover:bg-slate-600 disabled:opacity-60"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="space-y-3">
          <div className="glass-card p-6">
            <h2 className="text-xl font-bold">Products ({products.length})</h2>
            <p className="mt-2 text-slate-400">Select a row to edit; use delete to remove.</p>
          </div>

          <div className="space-y-3">
            {products.map((p) => (
              <div
                key={p.id}
                className="glass-card p-5 flex items-start justify-between gap-4"
              >
                <button
                  type="button"
                  className="text-left flex-1"
                  onClick={() => startEdit(p)}
                >
                  <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl border border-white/10 bg-white/5 flex items-center justify-center overflow-hidden">
                      {(() => {
                        const src = getImageCandidates((p.images && p.images[0]) || p.image)[0];
                        return src ? (
                          <img src={src} alt="" className="h-6 w-6 object-contain" />
                        ) : (
                          <span className="text-sm text-slate-300">IMG</span>
                        );
                      })()}
                  </div>
                    <div>
                      <div className="font-bold">{p.title}</div>
                      <div className="text-sm text-slate-400">{p.category} • ₹{p.price}</div>
                    </div>
                  </div>
                </button>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => startEdit(p)}
                    className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold hover:border-cyan-400/40"
                    disabled={submitting}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(p.id)}
                    className="rounded-full border border-rose-400/30 bg-rose-500/10 px-4 py-2 text-sm font-semibold text-rose-200 hover:bg-rose-500/20"
                    disabled={submitting}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}

            {!products.length && (
              <div className="glass-card p-10 text-center">
                <p className="text-lg font-semibold">No products</p>
                <p className="mt-2 text-slate-400">Use the form to create the first product.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
