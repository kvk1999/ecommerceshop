import React from "react";

export default function CancellationModal({ isOpen, onClose, onConfirm, isLoading }) {
  const [reason, setReason] = React.useState("");

  const handleConfirm = () => {
    if (reason.trim()) {
      onConfirm(reason);
      setReason("");
    }
  };

  const handleClose = () => {
    setReason("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-xl border border-white/10 bg-slate-950 p-6 shadow-2xl dark:border-white/10 dark:bg-slate-950 light:border-slate-200 light:bg-white">
        <h2 className="text-xl font-bold dark:text-white light:text-slate-900">Cancel Order</h2>
        <p className="mt-2 dark:text-slate-400 light:text-slate-600">Please provide a reason for cancellation.</p>

        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Enter cancellation reason..."
          className="mt-4 w-full rounded-lg border border-white/10 bg-slate-900/50 px-4 py-3 text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none dark:border-white/10 dark:bg-slate-900/50 dark:text-white dark:placeholder-slate-500 light:border-slate-300 light:bg-slate-100 light:text-slate-900 light:placeholder-slate-400"
          rows="4"
          disabled={isLoading}
        />

        <div className="mt-6 flex gap-3">
          <button
            onClick={handleClose}
            disabled={isLoading}
            className="flex-1 rounded-lg border border-white/10 px-4 py-2 font-semibold dark:text-slate-300 dark:hover:bg-slate-900/50 light:border-slate-300 light:text-slate-700 light:hover:bg-slate-100 transition disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={isLoading || !reason.trim()}
            className="flex-1 rounded-lg bg-red-600 px-4 py-2 font-semibold text-white transition hover:bg-red-700 disabled:opacity-50"
          >
            {isLoading ? "Cancelling..." : "Confirm"}
          </button>
        </div>
      </div>
    </div>
  );
}
