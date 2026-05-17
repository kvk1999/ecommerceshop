import { currency } from "../utils/format";

export default function CartItem({ item, quantity, onChange, onRemove }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-950/35 p-4 dark:border-white/10 dark:bg-slate-950/35 light:border-slate-200 light:bg-white/95">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm dark:text-slate-400 light:text-slate-600">{item.category}</p>
          <h3 className="mt-1 font-semibold dark:text-white light:text-slate-900">{item.title}</h3>
          <p className="mt-2 text-sm dark:text-slate-300 light:text-slate-600">{currency(item.price)} each</p>
        </div>
        <button onClick={onRemove} className="text-sm dark:text-rose-300 dark:hover:text-rose-200 light:text-rose-600 light:hover:text-rose-700">
          Remove
        </button>
      </div>
      <div className="mt-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button onClick={() => onChange(quantity - 1)} className="h-9 w-9 rounded-full border border-white/10 bg-white/5 text-lg dark:border-white/10 dark:bg-white/5 dark:text-white light:border-slate-300 light:bg-slate-200 light:text-slate-900">
            -
          </button>
          <span className="min-w-[2rem] text-center dark:text-white light:text-slate-900">{quantity}</span>
          <button onClick={() => onChange(quantity + 1)} className="h-9 w-9 rounded-full border border-white/10 bg-white/5 text-lg dark:border-white/10 dark:bg-white/5 dark:text-white light:border-slate-300 light:bg-slate-200 light:text-slate-900">
            +
          </button>
        </div>
        <p className="text-lg font-semibold dark:text-white light:text-slate-900">{currency(item.price * quantity)}</p>
      </div>
    </div>
  );
}
