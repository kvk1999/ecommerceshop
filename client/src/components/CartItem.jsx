import { currency } from "../utils/format";

export default function CartItem({ item, quantity, onChange, onRemove }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-950/35 p-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-slate-400">{item.category}</p>
          <h3 className="mt-1 font-semibold">{item.title}</h3>
          <p className="mt-2 text-sm text-slate-300">{currency(item.price)} each</p>
        </div>
        <button onClick={onRemove} className="text-sm text-rose-300 hover:text-rose-200">
          Remove
        </button>
      </div>
      <div className="mt-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button onClick={() => onChange(quantity - 1)} className="h-9 w-9 rounded-full border border-white/10 bg-white/5 text-lg">
            -
          </button>
          <span className="min-w-[2rem] text-center">{quantity}</span>
          <button onClick={() => onChange(quantity + 1)} className="h-9 w-9 rounded-full border border-white/10 bg-white/5 text-lg">
            +
          </button>
        </div>
        <p className="text-lg font-semibold">{currency(item.price * quantity)}</p>
      </div>
    </div>
  );
}
