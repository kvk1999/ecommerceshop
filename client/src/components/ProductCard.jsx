import { Heart, ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";
import { currency } from "../utils/format";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";

export default function ProductCard({ product }) {
  const { wishlistIds, toggleWishlist } = useWishlist();
  const { addToCart, cartItems } = useCart();
  const inWishlist = wishlistIds.includes(product.id);
  const qty = cartItems.find((item) => item.productId === product.id)?.quantity || 0;

  return (
    <motion.article whileHover={{ y: -6 }} className="glass-card p-5 dark:border-white/10 dark:bg-slate-950/45 light:border-slate-200 light:bg-white/95">
      <div className="flex items-start justify-between gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 to-violet-500 text-sm font-bold text-slate-950 shadow-glow">
          {product.category.slice(0, 2)}
        </div>
        <button
          onClick={() => toggleWishlist(product.id)}
          className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
            inWishlist ? "border-pink-400/40 bg-pink-400/15 text-pink-200 dark:text-pink-200" : "dark:border-white/10 dark:bg-white/5 dark:text-slate-300 light:border-slate-300 light:bg-slate-200/50 light:text-slate-700"
          }`}
        >
          <span className="inline-flex items-center gap-1">
            <Heart className="h-3.5 w-3.5" />
            {inWishlist ? "Saved" : "Wishlist"}
          </span>
        </button>
      </div>

      <div className="mt-5">
        <p className="text-sm dark:text-slate-400 light:text-slate-600">{product.category}</p>
        <Link to={`/products/${product.id}`} className="mt-1 block text-xl font-semibold dark:hover:text-cyan-200 light:text-slate-900 light:hover:text-slate-700">
          {product.title}
        </Link>
        <p className="mt-3 min-h-[72px] text-sm leading-6 dark:text-slate-300 light:text-slate-600">{product.description}</p>
      </div>

      <div className="mt-5 flex items-center justify-between">
        <div>
          <p className="text-2xl font-bold dark:text-white light:text-slate-900">{currency(product.price)}</p>
          <p className="text-sm dark:text-slate-500 light:text-slate-600">{product.stock} in stock</p>
        </div>
        <div className="rounded-full border border-white/10 bg-slate-950/45 px-3 py-1 text-xs dark:text-slate-300 light:border-slate-300 light:bg-slate-100 light:text-slate-700">
          {qty} in cart
        </div>
      </div>

      <button
        onClick={() => addToCart(product.id)}
        className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-cyan-400 to-violet-500 px-4 py-3 text-sm font-semibold text-slate-950 shadow-glow"
      >
        <ShoppingBag className="h-4 w-4" />
        Add To Cart
      </button>
    </motion.article>
  );
}
