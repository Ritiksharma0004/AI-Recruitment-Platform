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
      className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-md animate-fadeIn" 
      onClick={() => !loading && onClose()}
    >
      <div 
        className="ai-card-glow rounded-3xl p-6 sm:p-7 max-w-md w-full border border-white/[0.1] shadow-2xl relative space-y-5 bg-[#0e1222]/95" 
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start gap-4">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
            confirmStyle === 'danger' 
              ? 'bg-rose-500/10 border border-rose-500/20 text-rose-400' 
              : confirmStyle === 'amber'
              ? 'bg-amber-500/10 border border-amber-500/20 text-amber-400'
              : 'bg-purple-500/10 border border-purple-500/20 text-purple-400'
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
            <h4 className="text-base font-normal text-white">{title}</h4>
            <p className="text-xs text-slate-400 font-light mt-1.5 leading-relaxed">
              {message}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            disabled={loading}
            onClick={onClose}
            className="px-4 py-2 bg-[#121524] hover:bg-[#1a1f33] text-slate-300 border border-white/[0.08] rounded-xl text-xs font-normal transition-colors"
          >
            {cancelText}
          </button>
          
          <button
            type="button"
            disabled={loading}
            onClick={onConfirm}
            className={`px-4 py-2 rounded-xl text-xs font-medium transition-all shadow-lg flex items-center gap-1.5 ${
              confirmStyle === 'danger'
                ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/25'
                : confirmStyle === 'amber'
                ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-amber-600/25'
                : 'bg-purple-600 hover:bg-purple-500 text-white shadow-purple-600/25'
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
    <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-2xl border backdrop-blur-xl shadow-2xl transition-all max-w-sm ${
      toast.type === 'error'
        ? 'bg-rose-950/90 border-rose-500/30 text-rose-200 shadow-rose-950/50'
        : toast.type === 'info'
        ? 'bg-blue-950/90 border-blue-500/30 text-blue-200 shadow-blue-950/50'
        : 'bg-emerald-950/90 border-emerald-500/30 text-emerald-200 shadow-emerald-950/50'
    }`}>
      {toast.type === 'error' ? (
        <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
      ) : toast.type === 'info' ? (
        <Info className="w-4 h-4 text-blue-400 shrink-0" />
      ) : (
        <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
      )}
      <span className="text-xs font-light flex-1 leading-snug">{toast.text}</span>
      <button 
        onClick={onClose} 
        className="text-slate-400 hover:text-white transition-colors p-0.5"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};

export default ConfirmModal;
