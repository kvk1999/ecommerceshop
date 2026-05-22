import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import api from "../api/http";
import { useAuth } from "../context/AuthContext";

function Section({ title, children }) {
  return (
    <div className="glass-card p-6">
      <h2 className="text-xl font-bold text-white light:text-slate-900">
        {title}
      </h2>

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
  "placeholder:text-white/70 focus:border-cyan-400/40 focus:outline-none " +
  "light:bg-white/90 light:text-slate-900 light:border-slate-200/60 " +
  "light:placeholder:text-slate-900/70";

export default function MyAccount() {
  const { loggedIn } = useAuth();

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

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");

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

        setProfileImageUrl(
          res.data.user.profileImageUrl || ""
        );
      } catch (e) {
        toast.error(
          e?.response?.data?.message ||
            "Failed to load account"
        );
      } finally {
        setLoading(false);
      }
    })();
  }, [loggedIn]);

  if (!loggedIn) {
    return (
      <section className="space-y-6 pt-10">
        <div className="glass-card p-10 text-center">
          <p className="text-lg font-semibold text-white light:text-slate-900">
            Please log in to manage your account.
          </p>
        </div>
      </section>
    );
  }

  if (loading || !account) {
    return (
      <div className="pt-10">
        <div className="glass-card p-10 text-center text-white light:text-slate-900">
          Loading account...
        </div>
      </div>
    );
  }

  return (
    <section className="space-y-6 pt-10">

      {/* HEADER */}
      <div className="glass-card p-6">
        <h1 className="text-3xl font-bold text-white light:text-slate-900">
          My Account
        </h1>

        <p className="mt-2 text-slate-400 light:text-slate-600">
          Manage profile, addresses, and security.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">

        {/* LEFT SIDE */}
        <div className="space-y-6 lg:col-span-2">

          {/* PROFILE */}
          <Section title="Profile">

            <form className="space-y-4">

              <Field label="Username">
                <input
                  className={inputClass}
                  placeholder="Enter username"
                  value={profileForm.name}
                  onChange={(e) =>
                    setProfileForm((p) => ({
                      ...p,
                      name: e.target.value,
                    }))
                  }
                />
              </Field>

              <Field label="Full name">
                <input
                  className={inputClass}
                  placeholder="Enter full name"
                  value={profileForm.fullName}
                  onChange={(e) =>
                    setProfileForm((p) => ({
                      ...p,
                      fullName: e.target.value,
                    }))
                  }
                />
              </Field>

              <Field label="Email">
                <input
                  type="email"
                  className={inputClass}
                  placeholder="Enter email address"
                  value={profileForm.email}
                  onChange={(e) =>
                    setProfileForm((p) => ({
                      ...p,
                      email: e.target.value,
                    }))
                  }
                />
              </Field>

              <button
                type="button"
                className="btn-primary w-full"
              >
                Save changes
              </button>

            </form>

          </Section>

          {/* PASSWORD */}
          <Section title="Password">

            <form className="space-y-4">

              <Field label="Current password">
                <input
                  type="password"
                  className={inputClass}
                  placeholder="Enter current password"
                  value={passwordForm.currentPassword}
                  onChange={(e) =>
                    setPasswordForm((p) => ({
                      ...p,
                      currentPassword: e.target.value,
                    }))
                  }
                />
              </Field>

              <Field label="New password">
                <input
                  type="password"
                  className={inputClass}
                  placeholder="Enter new password"
                  value={passwordForm.newPassword}
                  onChange={(e) =>
                    setPasswordForm((p) => ({
                      ...p,
                      newPassword: e.target.value,
                    }))
                  }
                />
              </Field>

              <button
                type="button"
                className="btn-primary w-full"
              >
                Update password
              </button>

            </form>

          </Section>

          {/* ADDRESSES */}
          <Section title="Addresses">

            <div className="space-y-4">

              <Field label="Full name (optional)">
                <input
                  className={inputClass}
                  placeholder="Enter full name"
                  value={addressForm.fullName}
                  onChange={(e) =>
                    setAddressForm((p) => ({
                      ...p,
                      fullName: e.target.value,
                    }))
                  }
                />
              </Field>

              <Field label="Address line 1">
                <input
                  className={inputClass}
                  placeholder="Enter address line 1"
                  value={addressForm.line1}
                  onChange={(e) =>
                    setAddressForm((p) => ({
                      ...p,
                      line1: e.target.value,
                    }))
                  }
                />
              </Field>

              <Field label="Address line 2 (optional)">
                <input
                  className={inputClass}
                  placeholder="Enter address line 2"
                  value={addressForm.line2}
                  onChange={(e) =>
                    setAddressForm((p) => ({
                      ...p,
                      line2: e.target.value,
                    }))
                  }
                />
              </Field>

              <Field label="City">
                <input
                  className={inputClass}
                  placeholder="Enter city"
                  value={addressForm.city}
                  onChange={(e) =>
                    setAddressForm((p) => ({
                      ...p,
                      city: e.target.value,
                    }))
                  }
                />
              </Field>

              <Field label="Postal code">
                <input
                  className={inputClass}
                  placeholder="Enter postal code"
                  value={addressForm.postalCode}
                  onChange={(e) =>
                    setAddressForm((p) => ({
                      ...p,
                      postalCode: e.target.value,
                    }))
                  }
                />
              </Field>

              <Field label="Phone (optional)">
                <input
                  className={inputClass}
                  placeholder="Enter phone number"
                  value={addressForm.phone}
                  onChange={(e) =>
                    setAddressForm((p) => ({
                      ...p,
                      phone: e.target.value,
                    }))
                  }
                />
              </Field>

              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={addressForm.isDefault}
                  onChange={(e) =>
                    setAddressForm((p) => ({
                      ...p,
                      isDefault: e.target.checked,
                    }))
                  }
                />

                <span className="text-sm text-slate-300 light:text-slate-700">
                  Set as default address
                </span>
              </label>

              {/* BUTTONS */}
              <div className="flex gap-3">

                <button
                  type="button"
                  className="btn-primary w-full"
                >
                  Add address
                </button>

                <button
                  type="button"
                  className="
                    w-full rounded-2xl px-4 py-3 text-sm font-semibold
                    bg-slate-700 text-white transition hover:bg-slate-600
                    light:bg-slate-200 light:text-slate-900 light:hover:bg-slate-300
                  "
                >
                  Cancel
                </button>

              </div>

            </div>

          </Section>

        </div>

        {/* RIGHT SIDE */}
        <div className="space-y-6">

          {/* PROFILE IMAGE */}
          <Section title="Profile image">

            <input
              className={inputClass}
              placeholder="Paste image URL"
              value={profileImageUrl}
              onChange={(e) =>
                setProfileImageUrl(e.target.value)
              }
            />

            <button
              type="button"
              className="
                mt-3 w-full rounded-2xl px-4 py-3 text-sm font-semibold
                bg-slate-800 text-white transition hover:bg-slate-700
                light:bg-slate-200 light:text-slate-900 light:hover:bg-slate-300
              "
            >
              Save image
            </button>

          </Section>

          {/* DELETE ACCOUNT */}
          <Section title="Danger zone">

            <button
              type="button"
              onClick={() => setDeleteModalOpen(true)}
              className="
                w-full rounded-2xl border border-red-400/30
                bg-red-500/20 px-4 py-3 text-sm font-semibold
                text-red-200 transition hover:bg-red-500/30
                light:border-red-300
                light:bg-red-100
                light:text-red-700
              "
            >
              Delete account
            </button>

          </Section>

        </div>

      </div>

      {/* DELETE MODAL */}
      {deleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">

          <div className="w-full max-w-md rounded-2xl bg-slate-950 p-6 light:bg-white">

            <h2 className="text-xl font-bold text-white light:text-slate-900">
              Delete account
            </h2>

            <p className="mt-2 text-slate-400 light:text-slate-600">
              This action cannot be undone.
            </p>

            <input
              type="password"
              className={`${inputClass} mt-4`}
              placeholder="Enter password to confirm"
              value={deletePassword}
              onChange={(e) =>
                setDeletePassword(e.target.value)
              }
            />

            <div className="mt-6 flex gap-3">

              <button
                type="button"
                onClick={() =>
                  setDeleteModalOpen(false)
                }
                className="
                  w-full rounded-2xl px-4 py-3 text-sm font-semibold
                  bg-slate-700 text-white transition hover:bg-slate-600
                  light:bg-slate-200 light:text-slate-900 light:hover:bg-slate-300
                "
              >
                Cancel
              </button>

              <button
                type="button"
                className="
                  w-full rounded-2xl bg-red-600 px-4 py-3
                  text-sm font-semibold text-white transition
                  hover:bg-red-700
                "
              >
                Confirm
              </button>

            </div>

          </div>

        </div>
      )}

    </section>
  );
}