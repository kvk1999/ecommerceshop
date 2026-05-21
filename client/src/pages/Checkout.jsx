import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/http";
import { useCart } from "../context/CartContext";
import { currency } from "../utils/format";
import Loader from "../components/Loader";
import { useAuth } from "../context/AuthContext";

export default function Checkout() {
  const navigate = useNavigate();
  const { user, loggedIn } = useAuth();
  const { cartItems, placeOrder, loading } = useCart();
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    fullName: user?.name || "",
    email: user?.email || "",
    address: "",
    city: "",
    postalCode: "",
  });

  useEffect(() => {
    api.get("/products").then((res) => setProducts(res.data));
  }, []);

  useEffect(() => {
    setForm((prev) => ({
      ...prev,
      fullName: user?.name || prev.fullName,
      email: user?.email || prev.email,
    }));
  }, [user]);

  const detailed = useMemo(
    () =>
      cartItems
        .map((item) => {
          const product = products.find((entry) => entry.id === item.productId);
          return product ? { ...product, quantity: item.quantity, lineTotal: product.price * item.quantity } : null;
        })
        .filter(Boolean),
    [cartItems, products]
  );

  const total = detailed.reduce((sum, item) => sum + item.lineTotal, 0);

  if (loading) return <div className="pt-10"><Loader label="Preparing checkout..." /></div>;

  if (!loggedIn) {
    return (
      <section className="pt-10">
        <div className="glass-card p-10 text-center">
          <p className="text-lg font-semibold">Please log in to checkout.</p>
          <p className="mt-2 text-slate-400">Authentication is now required for orders, wishlist, and cart sync.</p>
        </div>
      </section>
    );
  }

  async function handleSubmit(event) {
    event.preventDefault();
    await placeOrder({
      customer: form,
      items: detailed.map((item) => ({
        productId: item.id,
        title: item.title,
        quantity: item.quantity,
        lineTotal: item.lineTotal,
      })),
      total,
    });
    navigate("/orders");
  }

  if (!detailed.length) {
    return (
      <section className="pt-10">
        <div className="glass-card p-10 text-center shadow-xl shadow-slate-900/10">
          <p className="text-lg font-semibold text-slate-950 dark:text-white">Checkout is waiting for products.</p>
          <p className="mt-2 text-slate-500 dark:text-slate-400">Add something to the cart before placing an order.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="grid gap-6 pt-10 lg:grid-cols-[minmax(0,1fr)_360px]">
      <form onSubmit={handleSubmit} className="glass-card space-y-6 p-8 shadow-xl shadow-slate-900/10">
        <div className="space-y-2">
          <p className="text-sm uppercase tracking-[0.32em] text-slate-500 dark:text-slate-400">Checkout</p>
          <h1 className="text-3xl font-bold text-slate-950 dark:text-white">Complete your order</h1>
          <p className="text-sm text-slate-600 dark:text-slate-400">No payment gateway required — simply confirm your shipping details to place the order.</p>
        </div>

        {[
          { name: "fullName", label: "Full Name" },
          { name: "email", label: "Email" },
          { name: "address", label: "Shipping Address" },
          { name: "city", label: "City" },
          { name: "postalCode", label: "Postal Code" },
        ].map((field) => (
          <label key={field.name} className="block text-sm text-slate-700 dark:text-slate-300">
            <span className="mb-2 inline-block font-medium">{field.label}</span>
            <input
              required
              value={form[field.name]}
              onChange={(event) => setForm((prev) => ({ ...prev, [field.name]: event.target.value }))}
              placeholder={field.label}
              className="w-full rounded-3xl border border-white/10 bg-slate-950/55 px-4 py-3 text-sm text-white outline-none transition duration-200 focus:border-cyan-400/40 focus:ring-4 focus:ring-cyan-400/10 dark:border-white/10 dark:bg-slate-900/60"
            />
          </label>
        ))}

        <button type="submit" className="btn-primary w-full justify-center">
          Place Order
        </button>
      </form>

      <aside className="glass-card h-fit p-6 shadow-xl shadow-slate-900/10">
        <div className="space-y-4">
          <div>
            <p className="text-sm uppercase tracking-[0.32em] text-slate-500 dark:text-slate-400">Order Summary</p>
            <h2 className="mt-2 text-2xl font-bold text-slate-950 dark:text-white">Your items</h2>
          </div>

          <div className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
            {detailed.map((item) => (
              <div key={item.id} className="flex items-center justify-between rounded-3xl border border-white/10 bg-white/10 px-4 py-3">
                <span>{item.title} x {item.quantity}</span>
                <span>{currency(item.lineTotal)}</span>
              </div>
            ))}
          </div>

          <div className="rounded-3xl border border-white/10 bg-slate-950/30 p-4 text-sm text-slate-400 dark:border-white/10">
            <div className="flex items-center justify-between">
              <span>Subtotal</span>
              <span className="font-semibold text-slate-950 dark:text-white">{currency(total)}</span>
            </div>
            <div className="mt-3 flex items-center justify-between">
              <span>Shipping</span>
              <span className="font-semibold text-slate-950 dark:text-white">Free</span>
            </div>
          </div>
        </div>
      </aside>
    </section>
  );
}
