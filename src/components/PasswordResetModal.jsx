import React, { useState } from 'react';
import { X, Copy, Check, AlertCircle } from 'lucide-react';

export default function PasswordResetModal({
  isOpen,
  onClose,
  onConfirm,
  userName,
  tempPassword,
  isPending,
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(tempPassword);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleConfirm = async () => {
    await onConfirm(tempPassword);
    setCopied(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-text-border border border-text-border shadow-2xl shadow-black/50 rounded-xl max-w-md w-full mx-4">
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <h2 className="text-lg font-bold text-white uppercase tracking-widest flex items-center gap-2">
            <AlertCircle size={20} className="text-action-mint" />
            Reset Password
          </h2>
          <button
            onClick={onClose}
            disabled={isPending}
            className="text-slate-400 hover:text-white transition-colors disabled:cursor-not-allowed"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <p className="text-slate-300 text-sm mb-4">
              A temporary password has been generated for <strong>{userName}</strong>:
            </p>

            <div className="bg-structural-navy border border-text-border rounded-lg p-4 mb-4">
              <div className="flex items-center justify-between">
                <code className="text-action-mint font-mono text-lg font-bold tracking-wider break-all">
                  {tempPassword}
                </code>
                <button
                  onClick={handleCopy}
                  type="button"
                  className="ml-3 text-slate-400 hover:text-action-mint transition-colors"
                  title="Copy to clipboard"
                >
                  {copied ? <Check size={18} className="text-emerald-400" /> : <Copy size={18} />}
                </button>
              </div>
            </div>

            <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-3 text-sm text-amber-300">
              <strong>Important:</strong> This password is displayed only once. The user must change it immediately after logging in. It cannot be recovered if lost.
            </div>

            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-3 text-sm text-emerald-300 mt-3">
              • User must log in with this temporary password and change it immediately.
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              onClick={onClose}
              disabled={isPending}
              className="flex-1 px-4 py-2 bg-structural-navy border border-text-border text-slate-300 text-sm font-bold uppercase tracking-wider rounded-lg hover:bg-text-border/50 transition-all disabled:opacity-60"
            >
              Close
            </button>
            <button
              onClick={handleConfirm}
              disabled={isPending}
              className="flex-1 px-4 py-2 bg-action-mint text-structural-navy border border-action-mint text-sm font-bold uppercase tracking-wider rounded-lg hover:bg-action-mint transition-all disabled:opacity-60"
            >
              {isPending ? 'Resetting...' : 'Confirm Reset'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
