import { currency } from "../utils/format";

export default function WishlistCard({ item, onAddToCart, onRemove }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-950/35 p-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-slate-400">{item.category}</p>
          <h3 className="mt-1 font-semibold">{item.title}</h3>
          <p className="mt-2 text-sm text-slate-300">{currency(item.price)}</p>
        </div>
        <button onClick={onRemove} className="text-sm text-rose-300 hover:text-rose-200">
          Remove
        </button>
      </div>
      <button onClick={onAddToCart} className="mt-4 w-full rounded-full bg-gradient-to-r from-cyan-400 to-violet-500 px-4 py-3 text-sm font-semibold text-slate-950">
        Move to Cart
      </button>
    </div>
  );
}
