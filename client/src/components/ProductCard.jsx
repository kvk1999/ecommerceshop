import { Heart, ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";
import { currency } from "../utils/format";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";
import { getImageCandidates } from "../utils/image";

export default function ProductCard({ product }) {
  const { wishlistIds, toggleWishlist } = useWishlist();
  const { addToCart, cartItems } = useCart();
  const inWishlist = wishlistIds.includes(product.id);
  const qty = cartItems.find((item) => item.productId === product.id)?.quantity || 0;

  const candidates = getImageCandidates((product.images && product.images[0]) || product.image);

  const handleImgError = (e) => {
    const el = e.currentTarget;
    const list = el.dataset.candidates ? JSON.parse(el.dataset.candidates) : candidates;
    let idx = parseInt(el.dataset.candidateIndex || "0", 10);
    idx++;
    el.dataset.candidateIndex = idx;
    if (list && list[idx]) el.src = list[idx];
    else el.src = "/icon-placeholder.svg";
  };

  return (
    <motion.article
      whileHover={{ y: -6 }}
      className="glass-card overflow-hidden p-5 shadow-lg shadow-slate-900/10 transition duration-300 hover:-translate-y-0.5 dark:border-white/10 dark:bg-slate-950/55 light:border-slate-200/30 light:bg-white/95"
    >
      <div className="flex items-center justify-between gap-3">
        <div className="badge-pill bg-slate-950/80 text-slate-100 dark:bg-slate-800/90">
          {(product.code && product.code.slice(0, 2)) || product.category.slice(0, 2)}
        </div>
        <button
          onClick={() => toggleWishlist(product.id)}
          className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
            inWishlist
              ? "border-pink-400/40 bg-pink-400/15 text-pink-200 dark:text-pink-200"
              : "dark:border-white/10 dark:bg-white/5 dark:text-slate-300 light:border-slate-300 light:bg-slate-200/50 light:text-slate-700"
          }`}
        >
          <span className="inline-flex items-center gap-1">
            <Heart className="h-3.5 w-3.5" />
            {inWishlist ? "Saved" : "Wishlist"}
          </span>
        </button>
      </div>

      <div className="mt-5 rounded-[1.75rem] border border-white/10 bg-slate-950/10 p-4 dark:border-white/10 dark:bg-slate-900/20">
        <div className="relative overflow-hidden rounded-[1.5rem] bg-white/5 shadow-inner shadow-slate-900/5">
          <img
            src={candidates[0]}
            data-candidates={JSON.stringify(candidates)}
            data-candidate-index={0}
            alt={product.title}
            loading="lazy"
            decoding="async"
            className="h-52 w-full object-cover"
            onError={handleImgError}
          />
        </div>
      </div>

      <div className="mt-5">
        <p className="text-sm uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">{product.category}</p>
        <Link
          to={`/products/${product.id}`}
          className="mt-3 block text-xl font-semibold leading-tight text-slate-950 transition hover:text-cyan-500 dark:text-white dark:hover:text-cyan-300"
        >
          {product.title}
        </Link>
        <p className="mt-3 min-h-[72px] text-sm leading-6 text-slate-600 dark:text-slate-400">{product.description}</p>
      </div>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-2xl font-bold text-slate-950 dark:text-white">{currency(product.price)}</p>
          <p className="text-sm text-slate-500 dark:text-slate-400">{product.stock} in stock</p>
        </div>
        <div className="rounded-full border border-white/10 bg-slate-950/45 px-3 py-1 text-xs text-slate-300 dark:border-white/10 dark:bg-slate-900/40 dark:text-slate-300">
          {qty} in cart
        </div>
      </div>

      <button onClick={() => addToCart(product.id)} className="btn-primary mt-5 w-full justify-center">
        <ShoppingBag className="h-4 w-4" />
        Add To Cart
      </button>
    </motion.article>
  );
}
