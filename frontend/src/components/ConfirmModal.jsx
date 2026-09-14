import React, { useEffect } from 'react';
import { Trash2, AlertCircle, CheckCircle, Info, Loader, X } from 'lucide-react';

export const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Are you sure?',
  message = 'This action cannot be undone.',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  confirmStyle = 'danger',
  loading = false,
}) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen && !loading) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, loading, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fadeIn" 
      onClick={() => !loading && onClose()}
    >
      <div 
        className="bg-white rounded-3xl p-6 sm:p-7 max-w-md w-full border border-slate-200 shadow-2xl relative space-y-5" 
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start gap-4">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
            confirmStyle === 'danger' 
              ? 'bg-rose-50 border border-rose-200 text-rose-600' 
              : confirmStyle === 'amber'
              ? 'bg-amber-50 border border-amber-200 text-amber-600'
              : 'bg-indigo-50 border border-indigo-200 text-indigo-600'
          }`}>
            {confirmStyle === 'danger' ? (
              <Trash2 className="w-6 h-6" />
            ) : confirmStyle === 'amber' ? (
              <AlertCircle className="w-6 h-6" />
            ) : (
              <Info className="w-6 h-6" />
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <h4 className="text-base font-bold text-slate-900">{title}</h4>
            <p className="text-xs text-slate-600 font-normal mt-1.5 leading-relaxed">
              {message}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            disabled={loading}
            onClick={onClose}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 rounded-xl text-xs font-semibold transition-colors"
          >
            {cancelText}
          </button>
          
          <button
            type="button"
            disabled={loading}
            onClick={onConfirm}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all shadow-sm flex items-center gap-1.5 ${
              confirmStyle === 'danger'
                ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/25'
                : confirmStyle === 'amber'
                ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-amber-600/25'
                : 'bg-slate-900 hover:bg-slate-800 text-white shadow-sm'
            }`}
          >
            {loading && <Loader className="w-3.5 h-3.5 animate-spin" />}
            <span>{confirmText}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export const ToastNotification = ({ toast, onClose }) => {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      onClose();
    }, 4500);
    return () => clearTimeout(timer);
  }, [toast, onClose]);

  if (!toast) return null;

  return (
    <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-2xl border shadow-xl transition-all max-w-sm ${
      toast.type === 'error'
        ? 'bg-rose-50 border-rose-200 text-rose-900 shadow-rose-900/10'
        : toast.type === 'info'
        ? 'bg-blue-50 border-blue-200 text-blue-900 shadow-blue-900/10'
        : 'bg-emerald-50 border-emerald-200 text-emerald-900 shadow-emerald-900/10'
    }`}>
      {toast.type === 'error' ? (
        <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
      ) : toast.type === 'info' ? (
        <Info className="w-4 h-4 text-blue-600 shrink-0" />
      ) : (
        <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
      )}
      <span className="text-xs font-semibold flex-1 leading-snug">{toast.text}</span>
      <button 
        onClick={onClose} 
        className="text-slate-400 hover:text-slate-700 p-1 transition-colors"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
