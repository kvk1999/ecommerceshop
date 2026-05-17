import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../api/http";
import Loader from "../components/Loader";
import { currency } from "../utils/format";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const { wishlistIds, toggleWishlist } = useWishlist();

  useEffect(() => {
    api.get(`/products/${id}`).then((res) => setProduct(res.data)).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="pt-10"><Loader label="Loading product..." /></div>;
  if (!product) return <div className="pt-10 text-slate-400">Product not found.</div>;

  return (
    <section className="pt-10">
      <div className="glass-card grid gap-8 p-8 lg:grid-cols-[360px_minmax(0,1fr)]">
        <div className="flex min-h-[320px] items-center justify-center rounded-[1.5rem] bg-gradient-to-br from-cyan-400/10 via-slate-900/50 to-violet-500/10 text-5xl font-black text-cyan-100">
          {product.category.slice(0, 2)}
        </div>
        <div>
          <p className="text-sm uppercase tracking-[0.28em] text-slate-400">{product.category}</p>
          <h1 className="mt-3 text-4xl font-bold">{product.title}</h1>
          <p className="mt-5 max-w-2xl text-base leading-8 text-slate-300">{product.description}</p>
          <div className="mt-6 text-3xl font-bold">{currency(product.price)}</div>
          <p className="mt-2 text-sm text-slate-400">{product.stock} units in stock</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <button onClick={() => addToCart(product.id)} className="rounded-full bg-gradient-to-r from-cyan-400 to-violet-500 px-6 py-3 text-sm font-semibold text-slate-950 shadow-glow">
              Add To Cart
            </button>
            <button onClick={() => toggleWishlist(product.id)} className="rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold">
              {wishlistIds.includes(product.id) ? "Remove Wishlist" : "Add Wishlist"}
            </button>
            <Link to="/products" className="rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold">
              Back to Products
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
