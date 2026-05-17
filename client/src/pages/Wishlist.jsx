import { useEffect, useMemo, useState } from "react";
import api from "../api/http";
import Loader from "../components/Loader";
import WishlistCard from "../components/WishlistCard";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

export default function Wishlist() {
  const { loggedIn } = useAuth();
  const { wishlistIds, toggleWishlist, loading } = useWishlist();
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    api.get("/products").then((res) => setProducts(res.data));
  }, []);

  const items = useMemo(() => products.filter((product) => wishlistIds.includes(product.id)), [products, wishlistIds]);

  if (loading) return <div className="pt-10"><Loader label="Loading wishlist..." /></div>;
  if (!loggedIn) {
    return (
      <section className="space-y-6 pt-10">
        <div className="glass-card p-10 text-center">
          <p className="text-lg font-semibold">Please log in to use your wishlist.</p>
          <p className="mt-2 text-slate-400">Wishlist items are now stored against your user account.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-6 pt-10">
      <div className="glass-card p-6">
        <h1 className="text-3xl font-bold">Wishlist</h1>
        <p className="mt-2 text-slate-400">Your saved products live here.</p>
      </div>
      {items.length ? (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {items.map((item) => (
            <WishlistCard
              key={item.id}
              item={item}
              onAddToCart={() => addToCart(item.id)}
              onRemove={() => toggleWishlist(item.id)}
            />
          ))}
        </div>
      ) : (
        <div className="glass-card p-10 text-center">
          <p className="text-lg font-semibold">No saved products yet.</p>
          <p className="mt-2 text-slate-400">Tap wishlist on any product card to keep it here.</p>
        </div>
      )}
    </section>
  );
}
