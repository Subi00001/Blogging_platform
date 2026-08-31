import React from 'react';
import { useAuth } from '../context/AuthContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useAuth();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col space-y-2 max-w-sm w-full pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl shadow-lg border backdrop-blur-md transition-all duration-300 transform translate-y-0 ${
            t.type === 'success'
              ? 'bg-emerald-950/90 text-emerald-100 border-emerald-800/60'
              : t.type === 'error'
              ? 'bg-rose-950/90 text-rose-100 border-rose-800/60'
              : 'bg-slate-900/90 text-slate-100 border-slate-700/60'
          }`}
        >
          <div className="mt-0.5 shrink-0">
            {t.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
            {t.type === 'error' && <AlertCircle className="w-5 h-5 text-rose-400" />}
            {t.type === 'info' && <Info className="w-5 h-5 text-sky-400" />}
          </div>
          <p className="text-sm flex-1 font-medium leading-snug">{t.message}</p>
          <button
            onClick={() => removeToast(t.id)}
            className="text-slate-400 hover:text-white transition-colors shrink-0"
            aria-label="Close notification"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};
