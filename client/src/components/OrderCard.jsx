import { useState } from "react";
import { currency } from "../utils/format";
import CancellationModal from "./CancellationModal";
import api from "../api/http";

export default function OrderCard({ order, onOrderUpdate }) {
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentOrder, setCurrentOrder] = useState(order);

  const handleCancelOrder = async (reason) => {
    setIsLoading(true);
    try {
      const response = await api.patch(`/orders/${currentOrder.id}/cancel`, {
        cancellationReason: reason,
      });
      setCurrentOrder(response.data);
      setShowModal(false);
      if (onOrderUpdate) {
        onOrderUpdate(response.data);
      }
    } catch (error) {
      console.error("Failed to cancel order:", error);
      alert("Failed to cancel order. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const canCancelOrder = currentOrder.status === "Placed";

  return (
    <>
      <div className="rounded-2xl border border-white/10 bg-slate-950/35 p-4 dark:border-white/10 dark:bg-slate-950/35 light:border-slate-200 light:bg-white/95">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] dark:text-slate-500 light:text-slate-600">{currentOrder.id}</p>
            <p className="mt-2 font-semibold dark:text-white light:text-slate-900">{currentOrder.customer.fullName}</p>
            <p className="mt-1 text-sm dark:text-slate-400 light:text-slate-600">
              {currentOrder.customer.address}, {currentOrder.customer.city} {currentOrder.customer.postalCode}
            </p>
            <p className="mt-1 text-sm dark:text-slate-400 light:text-slate-600">{currentOrder.customer.email}</p>
          </div>
          <div className="text-right">
            <p className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-semibold dark:text-emerald-300 light:border-emerald-500/40 light:bg-emerald-100 light:text-emerald-700">
              {currentOrder.status}
            </p>
            <p className="mt-3 text-sm dark:text-slate-400 light:text-slate-600">{new Date(currentOrder.createdAt).toLocaleString()}</p>
            <p className="mt-1 text-lg font-semibold dark:text-white light:text-slate-900">{currency(currentOrder.total)}</p>
            {canCancelOrder && (
              <button
                onClick={() => setShowModal(true)}
                disabled={isLoading}
                className="mt-3 rounded-lg border border-red-500/50 bg-red-500/10 px-3 py-1 text-xs font-semibold dark:text-red-400 light:border-red-400 light:bg-red-100 light:text-red-700 transition dark:hover:bg-red-500/20 light:hover:bg-red-200 disabled:opacity-50"
              >
                Cancel Order
              </button>
            )}
          </div>
        </div>
        <div className="mt-4 border-t border-white/10 pt-4 text-sm dark:text-slate-300 light:text-slate-700 dark:border-white/10 light:border-slate-200">
          {currentOrder.items.map((item) => (
            <div key={item.productId} className="flex items-center justify-between py-1">
              <span>
                {item.title} x {item.quantity}
              </span>
              <span>{currency(item.lineTotal)}</span>
            </div>
          ))}
        </div>
      </div>
      <CancellationModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={handleCancelOrder}
        isLoading={isLoading}
      />
    </>
  );
}
