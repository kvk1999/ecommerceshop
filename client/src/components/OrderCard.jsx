import { currency } from "../utils/format";

export default function OrderCard({ order }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-950/35 p-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-slate-500">{order.id}</p>
          <p className="mt-2 font-semibold">{order.customer.fullName}</p>
          <p className="mt-1 text-sm text-slate-400">
            {order.customer.address}, {order.customer.city} {order.customer.postalCode}
          </p>
          <p className="mt-1 text-sm text-slate-400">{order.customer.email}</p>
        </div>
        <div className="text-right">
          <p className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-300">
            {order.status}
          </p>
          <p className="mt-3 text-sm text-slate-400">{new Date(order.createdAt).toLocaleString()}</p>
          <p className="mt-1 text-lg font-semibold">{currency(order.total)}</p>
        </div>
      </div>
      <div className="mt-4 border-t border-white/10 pt-4 text-sm text-slate-300">
        {order.items.map((item) => (
          <div key={item.productId} className="flex items-center justify-between py-1">
            <span>
              {item.title} x {item.quantity}
            </span>
            <span>{currency(item.lineTotal)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
