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
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="mt-2 text-slate-400">Manage products (create, edit, delete).</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200">
            Total products: <span className="font-bold">{products.length}</span>
          </div>
        </div>
      </div>

      {error && (
        <div className="glass-card border border-rose-400/20 bg-rose-500/10 p-4 text-rose-200">
          {error}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-12">
        {/* Editor column */}
        <div className="lg:col-span-5">
          <div className="space-y-4">
            <div className="glass-card p-6 sticky top-6">
              <h2 className="text-xl font-bold">
                {editingId ? "Edit product" : "Add product"}
              </h2>
              <p className="mt-2 text-sm text-slate-400">
                Tip: Use filenames from <span className="font-semibold">/public</span> (e.g. <span className="font-mono">icon-electronics.svg</span>).
              </p>

              <form
                onSubmit={(e) => {
                  // Always submit multipart/form-data so it matches the backend multer route.
                  e.preventDefault();

                  if (!isAdmin) {
                    setError("Admin access required");
                    return;
                  }

                  (async () => {
                    try {
                      setSubmitting(true);
                      setError("");

                      const formEl = e.currentTarget;
                      const fileInput = formEl.querySelector('input[type="file"]');
                      const files = Array.from(fileInput?.files || []);

                      const formData = new FormData();
                      formData.append("title", form.title.trim());
                      formData.append("description", form.description.trim());
                      formData.append("price", String(Number(form.price)));
                      formData.append("category", form.category.trim());
                      formData.append("stock", String(Number(form.stock)));
                      formData.append("code", (form.code || "").trim() || "");

                      // append local files under field name `images` (if selected)
                      for (const f of files) formData.append("images", f);

                      // Also include typed filenames/images if present.
                      if (mappedImages?.length) {
                        for (const name of mappedImages) formData.append("images", name);
                      }
                      if (form.image?.trim()) formData.append("image", form.image.trim());

                      if (editingId) {
                        const res = await api.request({
                          method: "PUT",
                          url: `/products/${editingId}`,
                          data: formData,
                          headers: { "Content-Type": "multipart/form-data" },
                        });
                        setProducts((prev) => prev.map((p) => (p.id === editingId ? res.data : p)));
                      } else {
                        const res = await api.request({
                          method: "POST",
                          url: "/products",
                          data: formData,
                          headers: { "Content-Type": "multipart/form-data" },
                        });
                        setProducts((prev) => [res.data, ...prev]);
                      }

                      resetForm();
                    } catch (e2) {
                      setError(e2?.response?.data?.message || "Failed to save product");
                    } finally {
                      setSubmitting(false);
                    }
                  })();
                }}

                className="mt-4 space-y-4"

              >


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
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
                    <input
                      className={inputClass}
                      value={form.images}
                      onChange={(e) => setForm((p) => ({ ...p, images: e.target.value }))}
                      placeholder="e.g. icon-electronics.svg, icon-electronics-2.svg"
                    />

                    {/* “+” image add helper (frontend-only): appends one filename to the comma-separated list */}
                    <div className="w-full sm:w-56">
                      <button
                        type="button"
                        className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold hover:border-cyan-400/40 disabled:opacity-60"
                        onClick={() => {
                          const raw = (form.images || "").trim();
                          // Default suggestion; user can overwrite after adding.
                          const suggested = "icon-electronics.svg";
                          const next = raw ? `${raw}, ${suggested}` : suggested;
                          setForm((p) => ({ ...p, images: next }));
                        }}
                      >
                        + Add image
                      </button>
                      <p className="mt-2 text-xs text-slate-400">
                        Click to append a sample filename (then edit the field).
                      </p>
                    </div>
                  </div>
                </Field>

                <Field label="Image URL">
  <input
    className={inputClass}
    type="url"
    value={form.image}
    onChange={(e) =>
      setForm((p) => ({ ...p, image: e.target.value }))
    }
    placeholder="https://example.com/product-image.jpg"
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
        </div>

        {/* Products column */}
        <div className="lg:col-span-7 space-y-3">
          <div className="glass-card p-6">
            <h2 className="text-xl font-bold">Products</h2>
            <p className="mt-2 text-slate-400">
              Click a card to load it into the editor. Use Edit/Delete actions.
            </p>
          </div>

          {products.length ? (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {products.map((p) => {
                        const thumb = getImageCandidates((p.images && p.images[0]) || p.image).filter(Boolean)[0];

                return (
                  <div key={p.id} className="glass-card p-5">
                    <button
                      type="button"
                      onClick={() => startEdit(p)}
                      className="w-full text-left"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="h-11 w-11 rounded-xl border border-white/10 bg-white/5 flex items-center justify-center overflow-hidden">
                    {thumb ? (
                            <img
                              src={thumb}
                              alt={p.title || ""}
                              className="h-6 w-6 object-contain"
                              onError={(e) => {
                                // Hide broken images (common when an uploaded file wasn't a valid image)
                                e.currentTarget.style.display = "none";
                              }}
                            />
                          ) : (
                            <span className="text-sm text-slate-300">IMG</span>
                          )}

                        </div>
                        <span className="inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-slate-200">
                          {p.category}
                        </span>
                      </div>

                      <div className="mt-3">
                        <div className="font-bold line-clamp-2">{p.title}</div>
                        <div className="mt-1 text-sm text-slate-400">₹{p.price}</div>
                      </div>
                    </button>

                    <div className="mt-4 flex gap-2">
                      <button
                        type="button"
                        onClick={() => startEdit(p)}
                        className="flex-1 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm font-semibold hover:border-cyan-400/40 disabled:opacity-60"
                        disabled={submitting}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(p.id)}
                        className="flex-1 rounded-full border border-rose-400/30 bg-rose-500/10 px-3 py-2 text-sm font-semibold text-rose-200 hover:bg-rose-500/20 disabled:opacity-60"
                        disabled={submitting}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="glass-card p-10 text-center">
              <p className="text-lg font-semibold">No products</p>
              <p className="mt-2 text-slate-400">Use the editor to create the first product.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
