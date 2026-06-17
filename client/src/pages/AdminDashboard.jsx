import { useEffect, useMemo, useRef, useState } from "react";
import api from "../api/http";
import { useAuth } from "../context/AuthContext";
import Loader from "../components/Loader";
import { getImageCandidates } from "../utils/image";

function classNames(...xs) {
  return xs.filter(Boolean).join(" ");
}

function Field({ label, children }) {
  return (
    <label className="block">
      <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300">
        {label}
      </div>
      {children}
    </label>
  );
}

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-[#0f172a] placeholder:text-slate-400 transition-colors focus:border-purple-600 focus:outline-none dark:border-white/10 dark:bg-white/5 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-emerald-300/40";

function formatINR(v) {
  const n = typeof v === "number" ? v : Number(v);
  if (!Number.isFinite(n)) return "$0";
  try {
    return `$${n.toLocaleString("en-US")}`;
  } catch {
    return `$${n}`;
  }
}

export default function AdminDashboard() {
  const { user, loading: authLoading, loggedIn } = useAuth();
  const isAdmin = Boolean(user?.role === "admin");

  const [activeTab, setActiveTab] = useState("Overview");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [products, setProducts] = useState([]);
  const [usersList, setUsersList] = useState([]);
  
  const [editingProductId, setEditingProductId] = useState(null);
  const [showOnboardForm, setShowOnboardForm] = useState(false);

  // Dynamic MongoDB Compass Sync Lifecycle Hook
  useEffect(() => {
    if (!loggedIn || authLoading) return;

    (async () => {
      try {
        setLoading(true);
        setError("");
        
        const [prodRes, usersRes] = await Promise.all([
          api.get("/products").catch(() => ({ data: [] })),
          api.get("/admin/users").catch(() => ({ data: [] }))
        ]);

        setProducts(prodRes.data || []);

        const usersPayload = usersRes.data || [];
        setUsersList(
          usersPayload.map((row) => {
            const rawUser = row.user || row.customer || row;
            const rawDate = rawUser.createdAt || row.createdAt || rawUser.joinDate || row.joinDate;
            
            let computedJoinDate = "";
            if (rawDate) {
              try {
                computedJoinDate = new Date(rawDate).toISOString().split('T')[0];
              } catch (e) {
                console.error("Compass timestamp parsing anomaly:", e);
                computedJoinDate = "";
              }
            }

            return {
              ...rawUser,
              // Normalize identifier access rules so both configurations work safely
              _id: rawUser._id || row._id || rawUser.id,
              id: rawUser.id || rawUser._id || row._id,
              joinDate: computedJoinDate,
              orders: row.orders || rawUser.orders || [],
            };
          })
        );
      } catch (e) {
        setError(e?.response?.data?.message || "Failed to synchronize master dashboard records");
      } finally {
        setLoading(false);
      }
    })();
  }, [loggedIn, authLoading]);

  const salesRecords = useMemo(() => {
    const list = [];
    usersList.forEach((u) => {
      if (Array.isArray(u.orders)) {
        u.orders.forEach((o) => {
          list.push({
            ...o,
            id: o.id || o._id || `TXN-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
            customerName: u.name || u.fullName || "Verified User",
            customerEmail: u.email
          });
        });
      }
    });
    return list;
  }, [usersList]);

  const [form, setForm] = useState({
    title: "", description: "", price: "", category: "", stock: "", logo: "", skuOrCode: "", images: "",
  });

  const [selectedLogoFiles, setSelectedLogoFiles] = useState([]);
  const [logoPreview, setLogoPreview] = useState("");
  const fileInputRef = useRef(null);

  const [onboardForm, setOnboardForm] = useState({
    name: "", email: "", password: "", role: "user"
  });

  useEffect(() => {
    if (!selectedLogoFiles.length) {
      setLogoPreview("");
      return;
    }
    const f = selectedLogoFiles[0];
    try {
      const url = URL.createObjectURL(f);
      setLogoPreview(url);
      return () => URL.revokeObjectURL(url);
    } catch {
      setLogoPreview("");
    }
  }, [selectedLogoFiles]);

  const portfolioItems = useMemo(() => {
    return products.map((p) => {
      const thumb = getImageCandidates((p.images && p.images[0]) || p.image).filter(Boolean)[0];
      return {
        id: p.id || p._id,
        title: p.title || "Untitled Catalog Item",
        price: p.price ?? 0,
        category: p.category || "General",
        stock: p.stock ?? 0,
        img: thumb,
        description: p.description || "",
        code: p.code || ""
      };
    });
  }, [products]);

  const totalRevenue = useMemo(() => {
    return salesRecords.reduce((sum, item) => sum + (Number(item.total) || 0), 0);
  }, [salesRecords]);

  function resetForm() {
    setForm({ title: "", description: "", price: "", category: "", stock: "", logo: "", skuOrCode: "", images: "" });
    setSelectedLogoFiles([]);
    setLogoPreview("");
    setEditingProductId(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function startEditProduct(prod) {
    setEditingProductId(prod.id);
    setForm({
      title: prod.title,
      description: prod.description,
      price: String(prod.price),
      category: prod.category,
      stock: String(prod.stock),
      skuOrCode: prod.code || "",
      logo: ""
    });
    setActiveTab("Overview");
  }

  async function handleDeleteProduct(id) {
    if (!window.confirm("Are you sure you want to permanently remove this product item record?")) return;
    try {
      setError("");
      await api.delete(`/products/${id}`);
      setProducts((prev) => prev.filter((p) => (p.id || p._id) !== id));
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to execute document deletion mapping requests");
    }
  }

  async function handleCreateOrUpdate(e) {
    e.preventDefault();
    if (!isAdmin) {
      setError("Admin access required");
      return;
    }

    try {
      setError("");
      setLoading(true);

      const formData = new FormData();
      formData.append("title", form.title.trim());
      formData.append("description", form.description.trim());
      formData.append("price", String(Number(form.price)));
      formData.append("category", form.category.trim());
      formData.append("stock", String(Number(form.stock || 0)));
      formData.append("code", (form.skuOrCode || "").trim());

      if (form.logo?.trim()) formData.append("images", form.logo.trim());
      for (const f of selectedLogoFiles) {
        formData.append("images", f);
      }

      if (editingProductId) {
        const res = await api.put(`/products/${editingProductId}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setProducts((prev) => prev.map((p) => ((p.id || p._id) === editingProductId ? res.data : p)));
      } else {
        const res = await api.post("/products", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setProducts((prev) => [res.data, ...prev]);
      }
      
      resetForm();
      setActiveTab("Products");
    } catch (e2) {
      setError(e2?.response?.data?.message || "Failed to sync inventory item payload adjustments");
    } finally {
      setLoading(false);
    }
  }

  // FIX: Dynamic Role Toggling Function with Strict MongoDB ID Checking Matchers
  async function handleToggleUserRole(userId, currentRole) {

    const currentAdminId = user?.id || user?._id;
    if (userId === currentAdminId) {
      alert("Security warning: You cannot toggle your own administrative access permissions while logged into this session.");
      return;
    }

    if (!window.confirm(`Are you sure you want to change this user's role to ${currentRole === "admin" ? "customer" : "admin"}?`)) {
      return;
    }

    try {
      setError("");
      const res = await api.patch(`/admin/users/${userId}/toggle-role`);
      const updatedRole = res.data.role;

      // Fixed: Matches both standard text id strings and raw MongoDB reference components securely
      setUsersList((prevList) =>
        prevList.map((u) => 
          u._id === userId || u.id === userId ? { ...u, role: updatedRole } : u
        )
      );
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to modify user role mapping parameters");
    }
  }

  // FIX: Handle Onboarding and Sync Real Timestamps
  async function handleOnboardUser(e) {
    e.preventDefault();
    if (!onboardForm.name.trim() || !onboardForm.email.trim() || !onboardForm.password) {
      setError("Please fill out name, email, and security credential fields completely.");
      return;
    }

    try {
      setError("");
      setLoading(true);
      // Backend expects payload keys: { name, email, password, role }
      const payload = {
        name: onboardForm.name,
        email: onboardForm.email,
        password: onboardForm.password,
        role: onboardForm.role,
      };

      const res = await api.post("/admin/users/onboard", payload);
      const returnedUser = res.data?.user || res.data || {};
      
      // Extract the actual database date returned from MongoDB
      const targetDate = returnedUser.createdAt || new Date().toISOString();
      const formattedJoinDate = new Date(targetDate).toISOString().split('T')[0];
      
      const builtUser = {
        ...returnedUser,
        _id: returnedUser._id || returnedUser.id,
        id: returnedUser.id || returnedUser._id,
        joinDate: formattedJoinDate,
        orders: []
      };

      setUsersList((prev) => [builtUser, ...prev]);
      setOnboardForm({ name: "", email: "", password: "", role: "user" });
      setShowOnboardForm(false);
      setActiveTab("Customers"); // Snap back to view the newly added record
    } catch (err) {
      setError(err?.response?.data?.message || "Could not write credentials to database container");
    } finally {
      setLoading(false);
    }
  }

  if (authLoading || loading) {
    return (
      <div className="pt-10">
        <Loader label="Synchronizing database documents..." />
      </div>
    );
  }

  return (
    <section className="min-h-[calc(100vh-3rem)] py-6 bg-slate-50 dark:bg-[#0b0f19] transition-colors duration-200">
      <div className="mx-auto w-full max-w-6xl px-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* SIDEBAR NAVIGATION AREA */}
          <aside className="lg:col-span-3">
            <div className="bg-white border border-slate-200 rounded-[2rem] p-5 dark:border-white/10 dark:bg-white/5 shadow-xs">
              <div className="flex items-center gap-3">
                <div className="h-11 w-11 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center dark:bg-white/5 dark:border-white/10">
                  <div className="h-5 w-5 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 dark:from-emerald-300 dark:to-cyan-300" />
                </div>
                <div>
                  <div className="text-sm font-bold text-[#0f172a] dark:text-white">ShopSphere</div>
                  <div className="text-xs text-slate-500 dark:text-[#8d9ba8]">Dashboard</div>
                </div>
              </div>

              <nav className="mt-6 space-y-1.5">
                {[
                  { label: "Overview" },
                  { label: "Products" },
                  { label: "Orders" },
                  { label: "Customers" },
                ].map((item) => (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => { setActiveTab(item.label); setError(""); }}
                    className={classNames(
                      "w-full rounded-xl border px-4 py-3 text-left text-sm font-semibold transition-all duration-200",
                      activeTab === item.label
                        ? "border-purple-200 bg-purple-50 text-purple-700 shadow-xs dark:border-emerald-300/30 dark:bg-emerald-500/10 dark:text-emerald-100"
                        : "border-transparent bg-transparent text-slate-500 hover:bg-slate-50 hover:text-[#0f172a] dark:text-slate-400 dark:hover:bg-white/5 dark:hover:text-white"
                    )}
                  >
                    {item.label}
                  </button>
                ))}
              </nav>

              <div className="mt-6 rounded-2xl border border-slate-100 bg-slate-50/50 p-4 dark:border-white/5 dark:bg-white/5">
                <div className="text-xs font-semibold text-slate-400 dark:text-[#8d9ba8]">Session</div>
                <div className="mt-1.5 text-sm font-medium text-[#1e293b] dark:text-slate-300">Admin</div>
                <div className="text-xs text-slate-500 dark:text-[#8d9ba8] truncate mt-0.5">{user?.email || "vijaybabbar@yahoo.com"}</div>
              </div>
            </div>
          </aside>

          {/* MAIN MANAGEMENT AREA PANEL WORKSPACE */}
          <main className="lg:col-span-9 space-y-6">
            
            {error && (
              <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700 text-sm font-semibold dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-200">
                {error}
              </div>
            )}

            {/* TAB SECTION 1: OVERVIEW & CONFIGURATION */}
            {activeTab === "Overview" && (
              <div className="bg-white border border-slate-200 rounded-[2rem] p-6 md:p-8 dark:border-white/10 dark:bg-white/5 shadow-xs">
                <div className="border-b border-slate-100 pb-4 mb-6 dark:border-white/5 flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-bold text-[#0f172a] dark:text-white">
                      {editingProductId ? "Modify Product Attributes Mapping" : "Product Configuration Sheet"}
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-[#8d9ba8] mt-0.5">Initialize stock files and register parameters into core data layers.</p>
                  </div>
                  {editingProductId && (
                    <button type="button" onClick={resetForm} className="text-xs text-purple-600 dark:text-emerald-400 font-bold underline">
                      Cancel Editing Mode
                    </button>
                  )}
                </div>

                <form onSubmit={handleCreateOrUpdate} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div className="md:col-span-2">
                      <Field label="Product Name">
                        <input className={inputClass} value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} placeholder="e.g. Premium Leather Wallet" required />
                      </Field>
                    </div>
                    <div>
                      <Field label="Price (INR)">
                        <input className={inputClass} type="number" value={form.price} onChange={(e) => setForm((p) => ({ ...p, price: e.target.value }))} placeholder="e.g. 2499" required />
                      </Field>
                    </div>
                  </div>

                  <Field label="Description Paragraph Story">
                    <textarea className={classNames(inputClass, "h-24 resize-none")} value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} placeholder="Describe your product core value..." rows={3} required />
                  </Field>

                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-5">
                    <Field label="Category Group"><input className={inputClass} value={form.category} onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))} placeholder="e.g. Accessories" required /></Field>
                    <Field label="Stock Inventory"><input className={inputClass} type="number" value={form.stock} onChange={(e) => setForm((p) => ({ ...p, stock: e.target.value }))} placeholder="e.g. 100" required /></Field>
                    <Field label="SKU / Tracking Code"><input className={inputClass} value={form.skuOrCode} onChange={(e) => setForm((p) => ({ ...p, skuOrCode: e.target.value }))} placeholder="e.g. LTHR-WL-01" /></Field>
                    <Field label="Public Logo Filename"><input className={inputClass} value={form.logo} onChange={(e) => setForm((p) => ({ ...p, logo: e.target.value }))} placeholder="e.g. badge-brand.svg" /></Field>
                  </div>

                  <div className="space-y-2">
                    <div className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300">Product Hero Image File Selection</div>
                    <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50 p-6 text-center transition hover:border-purple-500 min-h-[150px] flex flex-col items-center justify-center gap-2 dark:border-white/10 dark:bg-slate-950/20 dark:hover:border-emerald-400"
                      onDragOver={(e) => { e.preventDefault(); }}
                      onDrop={(e) => {
                        e.preventDefault();
                        if (e.dataTransfer?.files?.length) setSelectedLogoFiles([e.dataTransfer.files[0]]);
                      }}
                    >
                      <p className="text-sm font-bold text-[#0f172a] dark:text-white">Drag and drop single media file here</p>
                      <button type="button" className="rounded-xl bg-white border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700 dark:bg-white/5 dark:border-white/10 dark:text-slate-200" onClick={() => fileInputRef.current?.click()}>Browse File Storage</button>
                      <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => { if (e.target.files?.length) setSelectedLogoFiles([e.target.files[0]]); }} />
                      {logoPreview && (
                        <div className="mt-3 h-16 w-16 rounded-xl border border-slate-200 bg-white overflow-hidden p-1 dark:border-white/10 dark:bg-white/5"><img src={logoPreview} alt="preview" className="h-full w-full object-contain rounded-lg" /></div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-5 border-t border-slate-100 dark:border-white/5">
                    <button type="button" onClick={resetForm} className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-xs font-bold text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-300">Clear Changes</button>
                    <button type="submit" className="rounded-xl bg-purple-600 px-6 py-2.5 text-xs font-bold text-white dark:bg-emerald-500 dark:text-slate-950">
                      {editingProductId ? "Save Modifications" : "Publish Product Listing"}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* TAB SECTION 2: PRODUCTS PORTFOLIO */}
            {activeTab === "Products" && (
              <div className="bg-white border border-slate-200 rounded-[2rem] p-6 md:p-8 dark:border-white/10 dark:bg-white/5 shadow-xs space-y-6">
                <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-4 dark:border-white/5">
                  <div>
                    <h2 className="text-xl font-bold text-[#0f172a] dark:text-white">Master Inventory Catalog</h2>
                    <p className="text-xs text-slate-500 dark:text-[#8d9ba8] mt-0.5">Live monitoring dashboard showing all registered catalog items.</p>
                  </div>
                  <div className="rounded-full border border-slate-200 bg-slate-50 px-4 py-1.5 text-xs font-bold text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-300">
                    {products.length} Products Found
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {portfolioItems.length ? (
                    portfolioItems.map((it) => (
                      <div key={it.id} className="group relative rounded-2xl border border-slate-200 bg-white p-3 flex flex-col justify-between dark:border-white/10 dark:bg-white/5 transition duration-200 hover:shadow-md">
                        <div>
                          <div className="relative h-32 w-full rounded-xl bg-slate-50 border border-slate-100 overflow-hidden flex items-center justify-center dark:bg-slate-900/40 dark:border-white/5">
                            {it.img ? (
                              <img src={it.img} alt={it.title} className="h-full w-full object-contain p-2 transition group-hover:scale-105 duration-300" />
                            ) : (
                              <div className="h-10 w-10 rounded-full bg-purple-100 dark:bg-emerald-500/15 flex items-center justify-center text-xs" />
                            )}

                            <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2">
                              <button type="button" onClick={() => startEditProduct(it)} className="bg-white hover:bg-purple-50 text-slate-900 text-xs font-bold px-2.5 py-1.5 rounded-lg shadow-sm transition">
                                Edit
                              </button>
                              <button type="button" onClick={() => handleDeleteProduct(it.id)} className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-2.5 py-1.5 rounded-lg shadow-sm transition">
                                Delete
                              </button>
                            </div>
                          </div>
                          <div className="mt-3">
                            <span className="inline-block text-[9px] uppercase font-extrabold tracking-wider px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md dark:bg-white/10 dark:text-slate-400 mb-1">
                              {it.category}
                            </span>
                            <h3 className="text-sm font-bold text-[#0f172a] truncate dark:text-slate-200">{it.title}</h3>
                          </div>
                        </div>
                        
                        <div className="mt-4 pt-2.5 border-t border-slate-100 dark:border-white/5 flex items-center justify-between">
                          <span className="text-sm font-black text-slate-900 dark:text-white">{formatINR(it.price)}</span>
                          <span className={classNames("text-[10px] font-bold px-2 py-0.5 rounded-sm", 
                            it.stock > 0 ? "text-emerald-600 dark:text-emerald-400" : "text-red-500"
                          )}>
                            {it.stock > 0 ? `${it.stock} items left` : "Out of Stock"}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-full text-center text-slate-400 py-12 text-sm">No inventory logged.</div>
                  )}
                </div>
              </div>
            )}

            {/* TAB SECTION 3: ORDERS RENDERING */}
            {activeTab === "Orders" && (
              <div className="bg-white border border-slate-200 rounded-[2rem] p-6 md:p-8 dark:border-white/10 dark:bg-white/5 shadow-xs space-y-6">
                <div className="border-b border-slate-100 pb-4 dark:border-white/5">
                  <h2 className="text-lg font-bold text-[#0f172a] dark:text-white">Active Order Processing Hub</h2>
                  <p className="text-xs text-slate-400 dark:text-[#8d9ba8] mt-0.5">Real-time status tracking framework, logistics references, and secure summaries.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 dark:border-white/5 dark:bg-white/5">
                    <div className="text-xs font-bold text-slate-400 dark:text-[#8d9ba8] uppercase">Gross Capital</div>
                    <div className="mt-2 text-2xl font-black text-purple-600 dark:text-emerald-300">{formatINR(totalRevenue)}</div>
                  </div>
                  <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 dark:border-white/5 dark:bg-white/5">
                    <div className="text-xs font-bold text-slate-400 dark:text-[#8d9ba8] uppercase">Active Invoices Pipeline</div>
                    <div className="mt-2 text-2xl font-black text-slate-800 dark:text-white">{salesRecords.length} System Records</div>
                  </div>
                </div>

                <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-white/5">
                  <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
                    <thead className="bg-slate-50 text-xs font-bold uppercase text-slate-500 dark:text-[#8d9ba8] dark:bg-white/5 border-b border-slate-200 dark:border-white/5">
                      <tr>
                        <th className="px-6 py-4">Order Ref ID</th>
                        <th className="px-6 py-4">Customer Account</th>
                        <th className="px-6 py-4 text-center">Volume</th>
                        <th className="px-6 py-4 text-right">Invoiced Total</th>
                        <th className="px-6 py-4 text-center">Fulfillment State</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-white/5">
                      {salesRecords.length ? (
                        salesRecords.map((sale) => (
                          <tr key={sale.id} className="hover:bg-slate-50/50 dark:hover:bg-white/5">
                            <td className="px-6 py-4 text-xs font-mono font-bold text-slate-900 dark:text-white">{sale.id}</td>
                            <td className="px-6 py-4 font-semibold text-slate-700 dark:text-slate-300">
                              <div>{sale.customerName}</div>
                              <div className="text-[10px] text-slate-400 font-normal">{sale.customerEmail}</div>
                            </td>
                            <td className="px-6 py-4 text-center">
                              {Array.isArray(sale.items) ? `${sale.items.length} lines` : `${sale.items || 1} items`}
                            </td>
                            <td className="px-6 py-4 text-right font-black text-slate-900 dark:text-white">{formatINR(sale.total)}</td>
                            <td className="px-6 py-4 text-center">
                              <span className={classNames(
                                "inline-block rounded-md px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wide",
                                sale.status === "Delivered" ? "bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-300" : "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300"
                              )}>{sale.status || "Processing"}</span>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="5" className="text-center py-10 text-slate-400 text-sm">No transaction files mapped down.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB SECTION 4: ACCOUNT DIRECTORY */}
            {activeTab === "Customers" && (
              <div className="bg-white border border-slate-200 rounded-[2rem] p-6 md:p-8 dark:border-white/10 dark:bg-white/5 shadow-xs space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-white/5">
                  <div>
                    <h2 className="text-lg font-bold text-[#0f172a] dark:text-white">Account Profile Index</h2>
                    <p className="text-xs text-slate-400 dark:text-[#8d9ba8] mt-0.5">Database index containing consumer records and administrative access keys.</p>
                  </div>
                  <button type="button" onClick={() => setShowOnboardForm(!showOnboardForm)} className="rounded-xl border border-purple-200 bg-purple-50 px-3 py-1.5 text-xs font-bold text-purple-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-200">
                    {showOnboardForm ? "View Directory Table" : "+ Provision Account"}
                  </button>
                </div>

                {showOnboardForm ? (
                  <form onSubmit={handleOnboardUser} className="p-6 border border-slate-200 dark:border-white/5 rounded-2xl bg-slate-50/50 dark:bg-slate-900/20 space-y-4">
                    <h3 className="text-sm font-bold text-slate-800 dark:text-white">Provision New Identity Token</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <Field label="Full Account Name">
                        <input className={inputClass} value={onboardForm.name} onChange={(e) => setOnboardForm(p => ({ ...p, name: e.target.value }))} placeholder="e.g. Sudharsan" required />
                      </Field>
                      <Field label="Communications Email">
                        <input className={inputClass} type="email" value={onboardForm.email} onChange={(e) => setOnboardForm(p => ({ ...p, email: e.target.value }))} placeholder="user@store.com" required />
                      </Field>
                      <Field label="Security Key Password">
                        <input className={inputClass} type="password" value={onboardForm.password} onChange={(e) => setOnboardForm(p => ({ ...p, password: e.target.value }))} placeholder="••••••••" required />
                      </Field>
                    </div>
                    <div className="flex items-center justify-between pt-2">
                      <Field label="Security clearance">
                        <select 
                          className={classNames(inputClass, "py-2.5")} 
                          value={onboardForm.role} 
                          onChange={(e) => setOnboardForm(p => ({ ...p, role: e.target.value }))}
                        >
                          <option value="user" className="bg-white text-[#0f172a] dark:bg-[#1e293b] dark:text-slate-200">
                            Standard Consumer (User)
                          </option>
                          <option value="admin" className="bg-white text-[#0f172a] dark:bg-[#1e293b] dark:text-slate-200">
                            System Administrator (Admin)
                          </option>
                        </select>
                      </Field>
                      <button type="submit" className="h-11 self-end px-5 rounded-xl bg-purple-600 dark:bg-emerald-500 text-xs font-bold text-white dark:text-slate-950">
                        Commit Credentials
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-white/5">
                    <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
                      <thead className="bg-slate-50 text-xs font-bold uppercase text-slate-500 dark:text-[#8d9ba8] dark:bg-white/5 border-b border-slate-200 dark:border-white/5">
                        <tr>
                          <th className="px-6 py-4">Account Profile Holder</th>
                          <th className="px-6 py-4">Email Communications Channel</th>
                          <th className="px-6 py-4">Registration Matrix Date</th>
                          <th className="px-6 py-4 text-center">Security Credentials Flag</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 dark:divide-white/5">
                        {usersList.length ? (
                          usersList.map((usr) => {
                            // Ensure an extraction point exists for key definitions
                            const actualRowId = usr._id || usr.id;
                            return (
                              <tr 
                                key={actualRowId} 
                                onClick={() => handleToggleUserRole(actualRowId, usr.role)}
                                className="cursor-pointer transition hover:bg-purple-50/40 dark:hover:bg-purple-500/5 select-none"
                                title="Click this row to toggle user role settings"
                              >
                                <td className="px-6 py-4 font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                  <div className={classNames("h-2 w-2 rounded-full", usr.role === "admin" ? "bg-purple-500 dark:bg-emerald-400" : "bg-blue-400")} />
                                  <div>
                                    <div>{usr.fullName || usr.name || "Anonymous Account"}</div>
                                    {Array.isArray(usr.orders) && usr.orders.length > 0 && (
                                      <div className="text-[10px] text-purple-500 dark:text-emerald-400 font-extrabold mt-0.5">
                                        {usr.orders.length} orders
                                      </div>
                                    )}
                                  </div>
                                </td>
                                <td className="px-6 py-4 text-xs font-mono">{usr.email}</td>
                                <td className="px-6 py-4 text-xs font-medium text-slate-500 dark:text-slate-400">
                                  {usr.joinDate || "Pending"}
                                </td>
                                <td className="px-6 py-4 text-center">
                                  <span className={classNames(
                                    "inline-block rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider transition-colors duration-200",
                                    usr.role === "admin" ? "bg-purple-100 text-purple-700 dark:bg-emerald-400/10 dark:text-emerald-300" : "bg-slate-100 text-slate-600 dark:bg-white/5 dark:text-slate-400"
                                  )}>
                                    {usr.role || "user"}
                                  </span>
                                </td>
                              </tr>
                            );
                          })
                        ) : (
                          <tr>
                            <td colSpan="4" className="text-center py-10 text-slate-400 text-sm">No identity rows logged in active arrays.</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </main>
        </div>
      </div>
    </section>
  );
}