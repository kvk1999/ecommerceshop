import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import api from "../api/http";
import { useAuth } from "../context/AuthContext";


function Section({ title, children }) {
  return (
    <div className="glass-card p-6">
      <h2 className="text-xl font-bold">{title}</h2>
      <div className="mt-4">{children}</div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label className="block">
      <div className="mb-2 text-sm font-semibold text-slate-300">{label}</div>
      {children}
    </label>
  );
}

export default function MyAccount() {
  const { loggedIn, logout } = useAuth();

  const [loading, setLoading] = useState(true);
  const [account, setAccount] = useState(null);

  // Profile form
  const [profileForm, setProfileForm] = useState({
    name: "",
    fullName: "",
    email: "",
  });

  // Password form
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
  });

  // Profile image form
  const [profileImageUrl, setProfileImageUrl] = useState("");

  // Address form
  const [addressForm, setAddressForm] = useState({
    label: "Home",
    fullName: "",
    line1: "",
    line2: "",
    city: "",
    postalCode: "",
    country: "IN",
    phone: "",
    isDefault: false,
  });

  const [editingAddressId, setEditingAddressId] = useState(null);

  // Delete account modal
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteReason, setDeleteReason] = useState("");
  const [deletePassword, setDeletePassword] = useState("");
  const [deletingAccount, setDeletingAccount] = useState(false);

  const addresses = useMemo(() => account?.addresses || [], [account]);

  useEffect(() => {
    if (!loggedIn) return;
    (async () => {
      try {
        setLoading(true);
        const res = await api.get("/account/me");
        setAccount(res.data.user);
        setProfileForm({
          name: res.data.user.name || "",
          fullName: res.data.user.fullName || "",
          email: res.data.user.email || "",
        });
        setProfileImageUrl(res.data.user.profileImageUrl || "");
      } catch (e) {
        toast.error(e?.response?.data?.message || "Failed to load account");
      } finally {
        setLoading(false);
      }
    })();
  }, [loggedIn]);

  useEffect(() => {
    // Close dropdown when route changes etc. (no-op here)
  }, []);

  function resetAddressForm() {
    setEditingAddressId(null);
    setAddressForm({
      label: "Home",
      fullName: "",
      line1: "",
      line2: "",
      city: "",
      postalCode: "",
      country: "IN",
      phone: "",
      isDefault: false,
    });
  }

  async function handleSaveProfile(e) {
    e.preventDefault();
    try {
      const res = await api.patch("/account", {
        name: profileForm.name,
        fullName: profileForm.fullName,
        email: profileForm.email,
      });
      setAccount(res.data.user);
      toast.success("Account updated");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to update profile");
    }
  }

  async function handleChangePassword(e) {
    e.preventDefault();
    try {
      await api.patch("/account/password", {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      toast.success("Password updated");
      setPasswordForm({ currentPassword: "", newPassword: "" });
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to update password");
    }
  }

  async function handleProfileImageSave() {
    try {
      const res = await api.patch("/account/profile-image", { profileImageUrl });
      setAccount(res.data.user);
      toast.success("Profile image updated");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to update profile image");
    }
  }

  async function handleAddOrEditAddress(e) {
    e.preventDefault();

    try {
      if (editingAddressId) {
        const res = await api.patch(`/account/addresses/${editingAddressId}`, addressForm);
        setAccount(res.data.user);
        toast.success("Address updated");
        resetAddressForm();
      } else {
        const res = await api.post("/account/addresses", addressForm);
        setAccount(res.data.user);
        toast.success("Address added");
        resetAddressForm();
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Address operation failed");
    }
  }

  async function handleDeleteAddress(addressId) {
    try {
      const res = await api.delete(`/account/addresses/${addressId}`);
      setAccount(res.data.user);
      toast.success("Address deleted");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to delete address");
    }
  }

  async function handleSetDefault(addressId) {
    try {
      const res = await api.patch(`/account/addresses/${addressId}/default`);
      setAccount(res.data.user);
      toast.success("Default address updated");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to set default address");
    }
  }

  async function handleConfirmDeleteAccount() {
    setDeletingAccount(true);
    try {
      await api.delete("/account", {
        data: { currentPassword: deletePassword },
      });

      localStorage.removeItem("shopsphere-token");
      logout();
      toast.success("Account deleted");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Account deletion failed");
    } finally {
      setDeletingAccount(false);
      setDeleteModalOpen(false);
      setDeletePassword("");
      setDeleteReason("");
    }
  }

  if (!loggedIn) {
    return (
      <section className="space-y-6 pt-10">
        <div className="glass-card p-10 text-center">
          <p className="text-lg font-semibold">Please log in to manage your account.</p>
        </div>
      </section>
    );
  }

  if (loading || !account) {
    return (
      <div className="pt-10">
        <div className="glass-card p-10 text-center">Loading account...</div>
      </div>
    );
  }

  return (
    <section className="space-y-6 pt-10">
      <div className="glass-card p-6">
        <h1 className="text-3xl font-bold">My Account</h1>
        <p className="mt-2 text-slate-400">Manage profile, addresses, and security.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Section title="Profile">
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <Field label="Username">
                <input
                  className="w-full rounded-2xl border border-white/10 bg-slate-950/55 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-cyan-400/40 focus:outline-none"
                  value={profileForm.name}
                  onChange={(e) => setProfileForm((p) => ({ ...p, name: e.target.value }))}
                  required
                />
              </Field>

              <Field label="Full name">
                <input
                  className="w-full rounded-2xl border border-white/10 bg-slate-950/55 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-cyan-400/40 focus:outline-none"
                  value={profileForm.fullName}
                  onChange={(e) => setProfileForm((p) => ({ ...p, fullName: e.target.value }))}
                />
              </Field>

              <Field label="Email">
                <input
                  type="email"
                  className="w-full rounded-2xl border border-white/10 bg-slate-950/55 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-cyan-400/40 focus:outline-none"
                  value={profileForm.email}
                  onChange={(e) => setProfileForm((p) => ({ ...p, email: e.target.value }))}
                  required
                />
              </Field>

              <div className="flex gap-3">
                <button type="submit" className="btn-primary w-full">Save changes</button>
              </div>
            </form>
          </Section>

          <Section title="Password">
            <form onSubmit={handleChangePassword} className="space-y-4">
              <Field label="Current password">
                <input
                  type="password"
                  className="w-full rounded-2xl border border-white/10 bg-slate-950/55 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-cyan-400/40 focus:outline-none"
                  value={passwordForm.currentPassword}
                  onChange={(e) => setPasswordForm((p) => ({ ...p, currentPassword: e.target.value }))}
                  required
                />
              </Field>
              <Field label="New password">
                <input
                  type="password"
                  className="w-full rounded-2xl border border-white/10 bg-slate-950/55 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-cyan-400/40 focus:outline-none"
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm((p) => ({ ...p, newPassword: e.target.value }))}
                  required
                />
              </Field>
              <button type="submit" className="btn-secondary w-full">Update password</button>
            </form>
          </Section>

          <Section title="Addresses">
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <h3 className="text-lg font-bold">Saved addresses</h3>
                <div className="mt-4 space-y-3">
                  {addresses.length ? (
                    addresses.map((a) => (
                      <div key={a._id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <div className="font-bold">{a.label || "Address"}</div>
                            <div className="mt-1 text-sm text-slate-300">
                              {a.fullName ? `${a.fullName}, ` : ""}
                              {a.line1}, {a.line2 ? `${a.line2}, ` : ""}
                              {a.city} - {a.postalCode}
                            </div>
                            {a.isDefault ? (
                              <div className="mt-2 inline-flex rounded-full bg-cyan-400/20 px-3 py-1 text-xs font-semibold text-cyan-200">
                                Default
                              </div>
                            ) : null}
                          </div>
                        </div>

                        <div className="mt-3 flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() => handleSetDefault(a._id)}
                            className="btn-soft"
                          >
                            Set default
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setEditingAddressId(a._id);
                              setAddressForm({
                                label: a.label || "Home",
                                fullName: a.fullName || "",
                                line1: a.line1 || "",
                                line2: a.line2 || "",
                                city: a.city || "",
                                postalCode: a.postalCode || "",
                                country: a.country || "IN",
                                phone: a.phone || "",
                                isDefault: Boolean(a.isDefault),
                              });
                            }}
                            className="btn-soft"
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDeleteAddress(a._id)}
                            className="btn-soft text-rose-300 hover:text-rose-200"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-sm text-slate-400">No addresses saved yet.</div>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold">{editingAddressId ? "Edit address" : "Add new address"}</h3>
                <form onSubmit={handleAddOrEditAddress} className="mt-4 space-y-4">
                  <Field label="Label">
                    <input
                      className="w-full rounded-2xl border border-white/10 bg-slate-950/55 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-cyan-400/40 focus:outline-none"
                      value={addressForm.label}
                      onChange={(e) => setAddressForm((p) => ({ ...p, label: e.target.value }))}
                    />
                  </Field>

                  <Field label="Full name (optional)">
                    <input
                      className="w-full rounded-2xl border border-white/10 bg-slate-950/55 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-cyan-400/40 focus:outline-none"
                      value={addressForm.fullName}
                      onChange={(e) => setAddressForm((p) => ({ ...p, fullName: e.target.value }))}
                    />
                  </Field>

                  <Field label="Address line 1">
                    <input
                      className="w-full rounded-2xl border border-white/10 bg-slate-950/55 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-cyan-400/40 focus:outline-none"
                      value={addressForm.line1}
                      onChange={(e) => setAddressForm((p) => ({ ...p, line1: e.target.value }))}
                      required
                    />
                  </Field>

                  <Field label="Address line 2 (optional)">
                    <input
                      className="w-full rounded-2xl border border-white/10 bg-slate-950/55 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-cyan-400/40 focus:outline-none"
                      value={addressForm.line2}
                      onChange={(e) => setAddressForm((p) => ({ ...p, line2: e.target.value }))}
                    />
                  </Field>

                  <Field label="City">
                    <input
                      className="w-full rounded-2xl border border-white/10 bg-slate-950/55 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-cyan-400/40 focus:outline-none"
                      value={addressForm.city}
                      onChange={(e) => setAddressForm((p) => ({ ...p, city: e.target.value }))}
                      required
                    />
                  </Field>

                  <Field label="Postal code">
                    <input
                      className="w-full rounded-2xl border border-white/10 bg-slate-950/55 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-cyan-400/40 focus:outline-none"
                      value={addressForm.postalCode}
                      onChange={(e) => setAddressForm((p) => ({ ...p, postalCode: e.target.value }))}
                      required
                    />
                  </Field>

                  <Field label="Phone (optional)">
                    <input
                      className="w-full rounded-2xl border border-white/10 bg-slate-950/55 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-cyan-400/40 focus:outline-none"
                      value={addressForm.phone}
                      onChange={(e) => setAddressForm((p) => ({ ...p, phone: e.target.value }))}
                    />
                  </Field>

                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={addressForm.isDefault}
                      onChange={(e) => setAddressForm((p) => ({ ...p, isDefault: e.target.checked }))}
                    />
                    <span className="text-sm text-slate-300">Set as default address</span>
                  </label>

                  <div className="flex gap-3">
                    <button type="submit" className="btn-primary w-full">
                      {editingAddressId ? "Update address" : "Add address"}
                    </button>
                    {editingAddressId ? (
                      <button type="button" onClick={resetAddressForm} className="btn-secondary">
                        Cancel
                      </button>
                    ) : null}
                  </div>
                </form>
              </div>
            </div>
          </Section>
        </div>

        <div className="space-y-6">
          <Section title="Profile image">
            {account.profileImageUrl ? (
              <img
                src={account.profileImageUrl}
                alt="Profile"
                className="h-24 w-24 rounded-2xl border border-white/10 object-cover"
              />
            ) : (
              <div className="h-24 w-24 rounded-2xl border border-white/10 bg-white/5" />
            )}

            <div className="mt-4 space-y-3">
              <input
                className="w-full rounded-2xl border border-white/10 bg-slate-950/55 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-cyan-400/40 focus:outline-none"
                value={profileImageUrl}
                onChange={(e) => setProfileImageUrl(e.target.value)}
                placeholder="Paste image URL"
              />
              <button type="button" onClick={handleProfileImageSave} className="btn-secondary w-full">
                Save image
              </button>
            </div>
          </Section>

          <Section title="Danger zone">
            <button
              type="button"
              onClick={() => setDeleteModalOpen(true)}
              className="w-full rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm font-semibold text-rose-200 hover:bg-rose-500/15"
            >
              Delete account
            </button>
          </Section>
        </div>
      </div>

      {deleteModalOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-xl border border-white/10 bg-slate-950 p-6 shadow-2xl">
            <h2 className="text-xl font-bold text-white">Delete account</h2>
            <p className="mt-2 text-slate-300">
              This permanently removes your account data. This action cannot be undone.
            </p>

            <div className="mt-4 space-y-2">
              <div className="text-sm font-semibold text-slate-200">Enter your password to confirm</div>
              <input
                type="password"
                value={deletePassword}
                onChange={(e) => setDeletePassword(e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-slate-900/50 px-4 py-3 text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setDeleteModalOpen(false);
                  setDeletePassword("");
                }}
                disabled={deletingAccount}
                className="flex-1 rounded-lg border border-white/10 px-4 py-2 font-semibold text-slate-200 hover:bg-slate-900/40 transition disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteAccount}
                disabled={deletingAccount || !deletePassword.trim()}
                className="flex-1 rounded-lg bg-red-600 px-4 py-2 font-semibold text-white transition hover:bg-red-700 disabled:opacity-50"
              >
                {deletingAccount ? "Deleting..." : "Confirm delete"}
              </button>
            </div>
          </div>
        </div>
      ) : null}


    </section>
  );
}

