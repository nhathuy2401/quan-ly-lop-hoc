import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X, RotateCcw } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none no-print">
      {toasts.map((t) => {
        const isSuccess = t.type === 'success';
        const isError = t.type === 'error';
        const isWarning = t.type === 'warning';

        return (
          <div
            key={t.id}
            className={`pointer-events-auto flex items-center justify-between gap-3 p-3.5 rounded-xl shadow-lg border backdrop-blur-md transition-all animate-bounce-short ${
              isSuccess
                ? 'bg-emerald-900/95 text-white border-emerald-700'
                : isError
                ? 'bg-rose-900/95 text-white border-rose-700'
                : isWarning
                ? 'bg-amber-900/95 text-white border-amber-700'
                : 'bg-slate-900/95 text-white border-slate-700'
            }`}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              {isSuccess && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />}
              {isError && <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />}
              {isWarning && <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />}
              {!isSuccess && !isError && !isWarning && <Info className="w-5 h-5 text-blue-400 shrink-0" />}
              <span className="text-xs sm:text-sm font-medium leading-tight line-clamp-2">
                {t.message}
              </span>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              {t.onUndo && (
                <button
                  onClick={() => {
                    t.onUndo!();
                    removeToast(t.id);
                  }}
                  className="flex items-center gap-1 text-xs px-2 py-1 bg-white/20 hover:bg-white/30 text-white rounded-md font-semibold transition-colors"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Hoàn tác</span>
                </button>
              )}
              <button
                onClick={() => removeToast(t.id)}
                className="p-1 hover:bg-white/20 text-white/70 hover:text-white rounded-md transition-colors"
                aria-label="Đóng thông báo"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

