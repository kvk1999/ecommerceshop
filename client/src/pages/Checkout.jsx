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
        <div className="glass-card p-10 text-center">
          <p className="text-lg font-semibold">Checkout is waiting for products.</p>
          <p className="mt-2 text-slate-400">Add something to the cart before placing an order.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="grid gap-6 pt-10 lg:grid-cols-[minmax(0,1fr)_340px]">
      <form onSubmit={handleSubmit} className="glass-card space-y-4 p-6">
        <h1 className="text-3xl font-bold">Checkout</h1>
        <p className="text-slate-400">No payment gateway required for this blueprint implementation.</p>
        {["fullName", "email", "address", "city", "postalCode"].map((field) => (
          <input
            key={field}
            required
            value={form[field]}
            onChange={(event) => setForm((prev) => ({ ...prev, [field]: event.target.value }))}
            placeholder={field.replace(/([A-Z])/g, " $1").replace(/^./, (char) => char.toUpperCase())}
            className="w-full rounded-2xl border border-white/10 bg-slate-950/55 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-cyan-400/40 focus:outline-none"
          />
        ))}
        <button type="submit" className="w-full rounded-full bg-gradient-to-r from-cyan-400 to-violet-500 px-4 py-3 text-sm font-semibold text-slate-950 shadow-glow">
          Place Order
        </button>
      </form>

      <aside className="glass-card h-fit p-6">
        <p className="text-lg font-semibold">Order Summary</p>
        <div className="mt-4 space-y-3 text-sm text-slate-300">
          {detailed.map((item) => (
            <div key={item.id} className="flex items-center justify-between">
              <span>
                {item.title} x {item.quantity}
              </span>
              <span>{currency(item.lineTotal)}</span>
            </div>
          ))}
        </div>
        <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-4 font-semibold">
          <span>Total</span>
          <span>{currency(total)}</span>
        </div>
      </aside>
    </section>
  );
}
