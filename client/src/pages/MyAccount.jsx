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
      <div className="mb-2 text-sm font-semibold text-slate-300 light:text-slate-700">
        {label}
      </div>
      {children}
    </label>
  );
}

const inputClass =
  "w-full rounded-2xl border border-white/10 bg-slate-950/55 px-4 py-3 text-sm text-white " +
  "placeholder:text-slate-400 focus:border-cyan-400/40 focus:outline-none " +
  "light:bg-white/90 light:text-slate-900 light:border-slate-200/60 " +
  "light:placeholder:text-slate-900/70";

export default function MyAccount() {
  const { loggedIn, logout } = useAuth();

  const [loading, setLoading] = useState(true);
  const [account, setAccount] = useState(null);

  const [profileForm, setProfileForm] = useState({
    name: "",
    fullName: "",
    email: "",
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
  });

  const [profileImageUrl, setProfileImageUrl] = useState("");

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

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
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
        <p className="mt-2 text-slate-400 light:text-slate-600">
          Manage profile, addresses, and security.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">

          {/* PROFILE */}
          <Section title="Profile">
            <form className="space-y-4">
              <Field label="Username">
                <input className={inputClass} placeholder="Enter username" />
              </Field>

              <Field label="Full name">
                <input className={inputClass} placeholder="Enter full name" />
              </Field>

              <Field label="Email">
                <input type="email" className={inputClass} placeholder="Enter email address" />
              </Field>

              <button className="btn-primary w-full">Save changes</button>
            </form>
          </Section>

          {/* PASSWORD */}
          <Section title="Password">
            <form className="space-y-4">
              <Field label="Current password">
                <input type="password" className={inputClass} placeholder="Enter current password" />
              </Field>

              <Field label="New password">
                <input type="password" className={inputClass} placeholder="Enter new password" />
              </Field>

              <button className="btn-secondary w-full">Update password</button>
            </form>
          </Section>

          {/* ADDRESSES */}
          <Section title="Addresses">
            <Field label="Address line 1">
              <input className={inputClass} placeholder="Enter address line 1" />
            </Field>

            <Field label="Address line 2 (optional)">
              <input className={inputClass} placeholder="Enter address line 2" />
            </Field>

            <Field label="City">
              <input className={inputClass} placeholder="Enter city" />
            </Field>

            <Field label="Postal code">
              <input className={inputClass} placeholder="Enter postal code" />
            </Field>

            <Field label="Phone (optional)">
              <input className={inputClass} placeholder="Enter phone number" />
            </Field>
          </Section>
        </div>

        {/* RIGHT PANEL */}
        <div className="space-y-6">

          {/* PROFILE IMAGE */}
          <Section title="Profile image">
            <input
              className={inputClass}
              placeholder="Paste image URL"
              value={profileImageUrl}
              onChange={(e) => setProfileImageUrl(e.target.value)}
            />

            <button className="btn-secondary w-full mt-3 light:bg-slate-200 light:text-slate-900">
              Save image
            </button>
          </Section>

          {/* DELETE ACCOUNT */}
          <Section title="Danger zone">
            <button
              className="
                w-full rounded-2xl px-4 py-3 text-sm font-semibold
                bg-red-500/20 text-red-200 border border-red-400/30
                hover:bg-red-500/30 transition
                light:bg-red-100 light:text-red-700 light:border-red-300
              "
              onClick={() => setDeleteModalOpen(true)}
            >
              Delete account
            </button>
          </Section>
        </div>
      </div>

      {/* DELETE MODAL */}
      {deleteModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50">
          <div className="bg-slate-950 light:bg-white p-6 rounded-xl w-[400px]">
            <h2 className="text-xl font-bold">Delete account</h2>

            <input
              type="password"
              className={inputClass + " mt-4"}
              placeholder="Enter password to confirm"
              value={deletePassword}
              onChange={(e) => setDeletePassword(e.target.value)}
            />

            <div className="flex gap-3 mt-6">
              <button className="btn-secondary w-full">Cancel</button>
              <button className="bg-red-600 text-white w-full rounded-xl py-2">
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}