import { useEffect, useMemo, useState } from "react";
import api from "../api/http";
import { useAuth } from "../context/AuthContext";
import Loader from "../components/Loader";

function Section({ title, subtitle, children }) {
  return (
    <div className="glass-card p-6">
      <h1 className="text-3xl font-bold">{title}</h1>
      {subtitle ? <p className="mt-2 text-slate-400">{subtitle}</p> : null}
      <div className="mt-6">{children}</div>
    </div>
  );
}

function formatMoney(v) {
  if (typeof v !== "number" || Number.isNaN(v)) return "₹0";
  return `₹${v.toFixed(0)}`;
}

export default function AdminUsers() {
  const { user, loading: authLoading, loggedIn } = useAuth();
  const isAdmin = Boolean(user?.role === "admin");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [rows, setRows] = useState([]);
  const [expanded, setExpanded] = useState(() => new Set());
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loggedIn || authLoading) return;

    (async () => {
      try {
        setLoading(true);
        setError("");
        const res = await api.get("/admin/users");
        setRows(res.data || []);
      } catch (e) {
        setError(e?.response?.data?.message || "Failed to load users");
      } finally {
        setLoading(false);
      }
    })();
  }, [loggedIn, authLoading]);

  const usersCount = useMemo(() => rows.length, [rows]);

  async function handlePromote(userId) {
    if (!isAdmin) return;
    const ok = window.confirm("Promote this user to admin? This cannot be undone easily.");
    if (!ok) return;

    try {
      setSubmitting(true);
      setError("");
      const res = await api.post(`/admin/users/${userId}/promote`);
      setRows((prev) =>
        prev.map((r) => (r.user.id === userId ? { ...r, user: res.data.user } : r))
      );
    } catch (e) {
      setError(e?.response?.data?.message || "Failed to promote user");
    } finally {
      setSubmitting(false);
    }
  }

  if (authLoading || !loggedIn) {
    return (
      <div className="pt-10">
        <Loader label={loggedIn ? "Loading admin users..." : "Please log in"} />
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
        <Loader label="Loading users..." />
      </div>
    );
  }

  return (
    <section className="space-y-6 pt-10">
      <Section title="User Management" subtitle={`Admins can view users and their order history. Total users: ${usersCount}.`}>
        {error ? (
          <div className="mb-4 rounded-2xl border border-rose-400/20 bg-rose-500/10 p-4 text-rose-200">
            {error}
          </div>
        ) : null}

        {!rows.length ? (
          <div className="text-center text-slate-400">No users found.</div>
        ) : (
          <div className="space-y-4">
            {rows.map(({ user: u, orders }) => {
              const isOpen = expanded.has(u.id);
              const latest = orders?.[0];

              return (
                <div key={u.id} className="glass-card p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 overflow-hidden rounded-xl border border-white/10 bg-white/5 flex items-center justify-center">
                          {u.profileImageUrl ? (
                            <img src={u.profileImageUrl} alt="" className="h-full w-full object-cover" />
                          ) : (
                            <span className="text-sm text-slate-300">{(u.name || "U").slice(0, 1).toUpperCase()}</span>
                          )}
                        </div>
                        <div className="min-w-0">
                          <div className="font-bold truncate">{u.fullName || u.name}</div>
                          <div className="text-sm text-slate-400 truncate">{u.email}</div>
                        </div>
                      </div>

                      <div className="mt-3 flex flex-wrap gap-2">
                        <span className="inline-flex items-center rounded-full bg-white/5 px-3 py-1 text-xs text-slate-200 border border-white/10">
                          Role: {u.role}
                        </span>
                        {latest ? (
                          <span className="inline-flex items-center rounded-full bg-cyan-400/15 px-3 py-1 text-xs text-cyan-200 border border-cyan-400/20">
                            Latest: {latest.status} • {formatMoney(latest.total)}
                          </span>
                        ) : (
                          <span className="inline-flex items-center rounded-full bg-slate-700/50 px-3 py-1 text-xs text-slate-300 border border-white/10">
                            No orders
                          </span>
                        )}
                        <span className="inline-flex items-center rounded-full bg-white/5 px-3 py-1 text-xs text-slate-200 border border-white/10">
                          Orders: {orders?.length || 0}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      <button
                        type="button"
                        className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold hover:border-cyan-400/40"
                        onClick={() => {
                          setExpanded((prev) => {
                            const next = new Set(prev);
                            if (next.has(u.id)) next.delete(u.id);
                            else next.add(u.id);
                            return next;
                          });
                        }}
                      >
                        {isOpen ? "Hide" : "View"}
                      </button>

                      {u.role !== "admin" ? (
                        <button
                          type="button"
                          className="rounded-full border border-cyan-400/30 bg-cyan-500/10 px-4 py-2 text-sm font-semibold text-cyan-200 hover:bg-cyan-500/20 disabled:opacity-60"
                          onClick={() => handlePromote(u.id)}
                          disabled={submitting}
                        >
                          {submitting ? "Processing..." : "Promote"}
                        </button>
                      ) : (
                        <span className="text-xs text-slate-400">Admin</span>
                      )}
                    </div>
                  </div>

                  {isOpen ? (
                    <div className="mt-4">
                      {orders?.length ? (
                        <div className="space-y-3">
                          {[...orders].map((o) => (
                            <div
                              key={o.id}
                              className="rounded-2xl border border-white/10 bg-white/5 p-4"
                            >
                              <div className="flex items-center justify-between gap-3">
                                <div className="min-w-0">
                                  <div className="font-semibold">
                                    Order • {new Date(o.createdAt).toLocaleString()}
                                  </div>
                                  <div className="text-sm text-slate-400">
                                    Status: <span className="text-slate-200">{o.status}</span>
                                    {o.cancellationReason ? (
                                      <span className="ml-2 text-xs text-rose-200">({o.cancellationReason})</span>
                                    ) : null}
                                  </div>
                                </div>
                                <div className="text-right">
                                  <div className="text-sm text-slate-400">Total</div>
                                  <div className="font-bold text-slate-100">{formatMoney(o.total)}</div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-sm text-slate-400">No order history.</div>
                      )}
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        )}
      </Section>
    </section>
  );
}

