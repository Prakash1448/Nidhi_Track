import React from 'react';
import { CheckCircle2 } from 'lucide-react';

interface ToastProps {
  show: boolean;
  title: string;
  message: string;
}

export const Toast: React.FC<ToastProps> = ({ show, title, message }) => {
  if (!show) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-5 duration-200 pointer-events-none">
      <div className="bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center space-x-3 border border-slate-700 max-w-sm">
        <div className="text-emerald-400 shrink-0">
          <CheckCircle2 className="w-5 h-5" />
        </div>
        <div>
          <p className="text-xs font-bold text-white">{title}</p>
          <p className="text-xs text-slate-300 leading-snug mt-0.5">{message}</p>
        </div>
      </div>
    </div>
  );
};
