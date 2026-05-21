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
    <section className="space-y-8 pt-10">
      <div className="glass-card p-6 shadow-xl shadow-slate-900/10">
        <h1 className="text-3xl font-bold text-slate-950 dark:text-white">Your Cart</h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-600 dark:text-slate-400">Review your selected products, adjust quantities, and continue to checkout with confidence.</p>
      </div>
      {detailed.length ? (
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
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
          <aside className="glass-card h-fit p-6 shadow-xl shadow-slate-900/10">
            <div className="space-y-4 text-slate-600 dark:text-slate-300">
              <div className="flex items-center justify-between text-sm">
                <span>Subtotal</span>
                <span className="font-semibold text-slate-950 dark:text-white">{currency(subtotal)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Shipping</span>
                <span className="font-semibold text-slate-950 dark:text-white">Free</span>
              </div>
              <div className="flex items-center justify-between border-t border-white/10 pt-4 text-base font-semibold text-slate-950 dark:text-white">
                <span>Total</span>
                <span>{currency(subtotal)}</span>
              </div>
            </div>
            <Link to="/checkout" className="btn-primary mt-6 w-full text-center">
              Proceed to Checkout
            </Link>
          </aside>
        </div>
      ) : (
        <div className="glass-card p-10 text-center shadow-xl shadow-slate-900/10">
          <p className="text-lg font-semibold text-slate-950 dark:text-white">Your cart is empty.</p>
          <p className="mt-2 text-slate-500 dark:text-slate-400">Add products from the catalog to start checkout.</p>
          <Link to="/products" className="btn-secondary mt-6 inline-flex">
            Browse Products
          </Link>
        </div>
      )}
    </section>
  );
}
