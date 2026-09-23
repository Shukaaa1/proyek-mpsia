import React from 'react';

export default function ToastContainer({ toasts, onDismiss }) {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div
      id="toast-container"
      className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none"
    >
      {toasts.map((toast) => {
        const bgClass =
          toast.type === 'success'
            ? 'bg-slate-900 text-white border-emerald-500'
            : toast.type === 'error'
            ? 'bg-red-600 text-white border-red-400'
            : 'bg-slate-900 text-white border-blue-500';

        return (
          <div
            key={toast.id}
            className={`p-3.5 rounded-xl border-l-4 shadow-xl text-xs font-semibold flex items-center justify-between pointer-events-auto transition-all animate-slide-up ${bgClass}`}
          >
            <span>{toast.message}</span>
            <button
              onClick={() => onDismiss(toast.id)}
              className="ml-2 text-slate-400 hover:text-white text-base leading-none"
              aria-label="Tutup notifikasi"
            >
              &times;
            </button>
          </div>
        );
      })}
    </div>
  );
}
