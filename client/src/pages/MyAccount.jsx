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

  const [loadingAddresses, setLoadingAddresses] = useState(false);

  async function handleAddAddress() {
    // Basic client-side validation to match backend requirements
    if (!addressForm.line1?.trim()) {
      toast.error("Address line 1 is required");
      return;
    }
    if (!addressForm.city?.trim()) {
      toast.error("City is required");
      return;
    }
    if (!addressForm.postalCode?.trim()) {
      toast.error("Postal code is required");
      return;
    }

    setLoadingAddresses(true);
    try {
      const res = await api.post("/account/addresses", {
        label: addressForm.label,
        fullName: addressForm.fullName,
        line1: addressForm.line1,
        line2: addressForm.line2,
        city: addressForm.city,
        postalCode: addressForm.postalCode,
        country: addressForm.country,
        phone: addressForm.phone,
        isDefault: addressForm.isDefault,
      });

      setAccount(res.data.user);

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

      toast.success("Address saved");
    } catch (e) {
      toast.error(e?.response?.data?.message || "Failed to save address");
    } finally {
      setLoadingAddresses(false);
    }
  }

  async function handleDeleteAddress(addressId) {
    if (!addressId) return;

    const ok = window.confirm("Delete this address?");
    if (!ok) return;

    try {
      const res = await api.delete(`/account/addresses/${addressId}`);
      setAccount(res.data.user);
      toast.success("Address deleted");
    } catch (e) {
      toast.error(e?.response?.data?.message || "Failed to delete address");
    }
  }

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
                onClick={async () => {
                  try {
                    const res = await api.patch("/account/", {
                      name: profileForm.name,
                      fullName: profileForm.fullName,
                      email: profileForm.email,
                    });
                    setAccount(res.data.user);
                    toast.success("Profile updated");
                  } catch (e) {
                    toast.error(
                      e?.response?.data?.message || "Failed to update profile"
                    );
                  }
                }}
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
                onClick={async () => {
                  try {
                    await api.patch("/account/password", {
                      currentPassword: passwordForm.currentPassword,
                      newPassword: passwordForm.newPassword,
                    });
                    setPasswordForm({
                      currentPassword: "",
                      newPassword: "",
                    });
                    toast.success("Password updated");
                  } catch (e) {
                    toast.error(
                      e?.response?.data?.message || "Failed to update password"
                    );
                  }
                }}
              >
                Update password
              </button>

            </form>

          </Section>

          {/* ADDRESSES */}
          <Section title="Addresses">

            {addresses.length > 0 && (
              <div className="mb-5">
                <p className="mb-3 text-sm font-semibold text-slate-300 light:text-slate-700">
                  Saved addresses
                </p>
                <div className="space-y-3">
                  {addresses.map((a) => (
                    <div
                      key={a._id || a.id}
                      className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-200"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="font-semibold text-slate-50">
                            {a.label || "Home"}
                          </p>
                          {a.isDefault && (
                            <span className="mt-1 inline-flex rounded-full bg-cyan-400/20 px-3 py-1 text-xs text-cyan-200">
                              Default
                            </span>
                          )}
                        </div>

                        <button
                          type="button"
                          className="rounded-full border border-red-400/30 bg-red-500/10 px-3 py-1 text-xs font-semibold text-red-200 transition hover:bg-red-500/20"
                          onClick={() => handleDeleteAddress(a._id || a.id)}
                        >
                          Delete
                        </button>
                      </div>

                      <p className="mt-2 text-slate-300 light:text-slate-700">
                        {a.fullName ? `${a.fullName}, ` : ""}
                        {a.line1}{a.line2 ? `, ${a.line2}` : ""}
                        {`, ${a.city}`}
                        {a.postalCode ? `, ${a.postalCode}` : ""}
                      </p>
                      {a.phone && (
                        <p className="mt-2 text-slate-400 light:text-slate-500">
                          Phone: {a.phone}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {addresses.length === 0 && (
              <p className="text-sm text-slate-400 light:text-slate-600">
                No addresses saved yet.
              </p>
            )}

            <div className="space-y-4 mt-4">

              <button
                type="button"
                className="w-full rounded-2xl bg-white/5 px-4 py-3 text-sm font-semibold text-slate-200 transition hover:bg-white/10 light:bg-slate-100 light:text-slate-900"
                onClick={() => {
                  // prefill address form from the default saved address (if any)
                  const defaultAddr = addresses.find((a) => a.isDefault) || addresses[0];
                  if (!defaultAddr) return;

                  setAddressForm({
                    label: defaultAddr.label || "Home",
                    fullName: defaultAddr.fullName || "",
                    line1: defaultAddr.line1 || "",
                    line2: defaultAddr.line2 || "",
                    city: defaultAddr.city || "",
                    postalCode: defaultAddr.postalCode || "",
                    country: defaultAddr.country || "IN",
                    phone: defaultAddr.phone || "",
                    isDefault: Boolean(defaultAddr.isDefault),
                  });

                  toast.success("Prefilled from saved address");
                }}
                disabled={addresses.length === 0}
              >
                Use saved address
              </button>

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
                  onClick={handleAddAddress}
                  disabled={loadingAddresses}
                >
                  {loadingAddresses ? "Saving..." : "Add address"}
                </button>

                <button
                  type="button"
                  className="
                    w-full rounded-2xl px-4 py-3 text-sm font-semibold
                    bg-slate-700 text-white transition hover:bg-slate-600
                    light:bg-slate-200 light:text-slate-900 light:hover:bg-slate-300
                  "
                  onClick={() =>
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
                    })
                  }
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
              onChange={(e) => setProfileImageUrl(e.target.value)}
            />

            {profileImageUrl?.trim() ? (
              <img
                src={profileImageUrl.trim()}
                alt="Profile"
                className="mt-4 h-28 w-28 rounded-full object-cover border border-white/10"
                onError={() => toast.error("Unable to load this image URL")}
              />
            ) : (
              <div className="mt-4 text-sm text-slate-400">
                No profile image saved yet.
              </div>
            )}

            <div className="mt-4 flex gap-3">
              <button
                type="button"
                className="
                  w-full rounded-2xl px-4 py-3 text-sm font-semibold
                  bg-slate-800 text-white transition hover:bg-slate-700
                  light:bg-slate-200 light:text-slate-900 light:hover:bg-slate-300
                "
                onClick={async () => {
                  try {
                    if (!profileImageUrl?.trim()) {
                      toast.error("profileImageUrl is required");
                      return;
                    }
                    const res = await api.patch("/account/profile-image", {
                      profileImageUrl: profileImageUrl.trim(),
                    });
                    setAccount(res.data.user);
                    toast.success("Profile image updated");
                  } catch (e) {
                    toast.error(
                      e?.response?.data?.message || "Failed to update image"
                    );
                  }
                }}
              >
                Save image
              </button>

              <button
                type="button"
                disabled={!profileImageUrl?.trim()}
                className="
                  w-full rounded-2xl px-4 py-3 text-sm font-semibold
                  bg-red-500/20 text-red-200 transition hover:bg-red-500/30
                  disabled:opacity-50 disabled:hover:bg-red-500/20
                  light:bg-red-100 light:text-red-700 light:hover:bg-red-200
                "
                onClick={async () => {
                  if (!profileImageUrl?.trim()) return;
                  const ok = window.confirm("Delete profile image?");
                  if (!ok) return;

                  try {
                    const res = await api.patch("/account/profile-image", {
                      profileImageUrl: "",
                    });
                    setAccount(res.data.user);
                    setProfileImageUrl("");
                    toast.success("Profile image deleted");
                  } catch (e) {
                    toast.error(
                      e?.response?.data?.message || "Failed to delete image"
                    );
                  }
                }}
              >
                Delete image
              </button>
            </div>

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
                onClick={async () => {
                  try {
                    if (!deletePassword?.trim()) {
                      toast.error("Please enter your password to confirm");
                      return;
                    }

                    // Force axios to send request body with DELETE.
                    await api.request({
                      method: "DELETE",
                      url: "/account/",
                      data: { currentPassword: deletePassword.trim() },
                    });

                    localStorage.removeItem("shopsphere-token");
                    window.location.href = "/login";
                  } catch (e) {
                    toast.error(
                      e?.response?.data?.message || "Failed to delete account"
                    );
                  }
                }}
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