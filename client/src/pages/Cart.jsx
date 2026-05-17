import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { currency } from "../utils/format";
import api from "../api/http";
import CartItem from "../components/CartItem";
import Loader from "../components/Loader";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function Cart() {
  const { loggedIn } = useAuth();
  const { cartItems, syncCart, removeFromCart, loading } = useCart();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    api.get("/products").then((res) => setProducts(res.data));
  }, []);

  if (loading) return <div className="pt-10"><Loader label="Loading cart..." /></div>;
  if (!loggedIn) {
    return (
      <section className="space-y-6 pt-10">
        <div className="glass-card p-10 text-center">
          <p className="text-lg font-semibold">Please log in to access your cart.</p>
          <p className="mt-2 text-slate-400">Your cart now syncs against your authenticated account.</p>
        </div>
      </section>
    );
  }

  const detailed = cartItems
    .map((item) => {
      const product = products.find((entry) => entry.id === item.productId);
      return product ? { ...product, quantity: item.quantity } : null;
    })
    .filter(Boolean);

  const subtotal = detailed.reduce((sum, item) => sum + item.price * item.quantity, 0);

  async function updateQuantity(productId, quantity) {
    const next = cartItems
      .map((item) => (item.productId === productId ? { ...item, quantity } : item))
      .filter((item) => item.quantity > 0);
    await syncCart(next);
  }

  return (
    <section className="space-y-6 pt-10">
      <div className="glass-card p-6">
        <h1 className="text-3xl font-bold">Cart</h1>
        <p className="mt-2 text-slate-400">Review your products before checkout.</p>
      </div>
      {detailed.length ? (
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="space-y-4">
            {detailed.map((item) => (
              <CartItem
                key={item.id}
                item={item}
                quantity={item.quantity}
                onChange={(qty) => updateQuantity(item.id, qty)}
                onRemove={() => removeFromCart(item.id)}
              />
            ))}
          </div>
          <aside className="glass-card h-fit p-6">
            <div className="flex items-center justify-between text-sm text-slate-300">
              <span>Subtotal</span>
              <span className="font-semibold text-white">{currency(subtotal)}</span>
            </div>
            <div className="mt-2 flex items-center justify-between text-sm text-slate-300">
              <span>Shipping</span>
              <span className="font-semibold text-white">Free</span>
            </div>
            <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-4 text-base">
              <span>Total</span>
              <span className="font-bold text-white">{currency(subtotal)}</span>
            </div>
            <Link to="/checkout" className="mt-6 block rounded-full bg-gradient-to-r from-cyan-400 to-violet-500 px-4 py-3 text-center text-sm font-semibold text-slate-950 shadow-glow">
              Proceed to Checkout
            </Link>
          </aside>
        </div>
      ) : (
        <div className="glass-card p-10 text-center">
          <p className="text-lg font-semibold">Your cart is empty.</p>
          <p className="mt-2 text-slate-400">Add products from the catalog to start checkout.</p>
        </div>
      )}
    </section>
  );
}
