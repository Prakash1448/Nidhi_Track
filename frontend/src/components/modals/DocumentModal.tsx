import React from 'react';
import { X, FileText, CheckCircle2, ShieldCheck, Download, Printer } from 'lucide-react';

interface DocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  documentTitle: string;
  fileName: string;
}

export const DocumentModal: React.FC<DocumentModalProps> = ({
  isOpen,
  onClose,
  documentTitle,
  fileName,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex justify-between items-start pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded uppercase">
                Simulated AICTE Vault Record
              </span>
              <span className="text-xs text-slate-400 font-mono">OCR Confidence: 99.4%</span>
            </div>
            <h3 className="text-base font-bold text-slate-900 mt-1">{documentTitle}</h3>
            <p className="text-xs text-slate-500 font-mono">{fileName}</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Realistic Fixed Deposit Certificate Visual */}
        <div className="my-5 p-6 bg-amber-50/40 border-2 border-dashed border-amber-300 rounded-xl font-serif text-slate-800 space-y-4 shadow-inner relative overflow-hidden">
          <div className="text-center border-b border-amber-200 pb-3">
            <div className="font-sans text-[10px] uppercase font-bold text-slate-500 tracking-widest">
              Fixed Deposit Receipt • Joint Council Lien Copy
            </div>
            <h2 className="text-xl font-extrabold text-slate-900 mt-1">PUNJAB NATIONAL BANK</h2>
            <p className="text-xs font-sans text-slate-600">Nariman Point Branch, Mumbai 400021 • IFSC: PUNB0029100</p>
          </div>

          <div className="space-y-2 text-xs leading-relaxed font-sans">
            <div className="flex justify-between">
              <span><strong>Receipt No:</strong> <span className="font-mono">PUNB00291048201</span></span>
              <span><strong>Customer ID:</strong> <span className="font-mono">CUST-APEX-9912</span></span>
            </div>
            <p>
              <strong>Lien / Depositor:</strong> Apex Institute of Technology & Regional Officer, Western Region AICTE Joint A/c
            </p>
            <div className="flex justify-between">
              <p><strong>Principal Amount:</strong> ₹35,00,000 (Rupees Thirty-Five Lakhs Only)</p>
              <p><strong>Rate:</strong> 7.25% p.a. Cumulative</p>
            </div>
            <div className="flex justify-between">
              <p><strong>Date of Issue:</strong> 15 Nov 2018</p>
              <p><strong>Date of Maturity:</strong> 15 Nov 2026</p>
            </div>
            <p className="text-[11px] text-slate-600 italic bg-amber-100/60 p-2 rounded border border-amber-200">
              "Condition of Lien: This deposit is pledged to AICTE. No loan, overdraft, or premature encashment is permitted without written NOC signed by Regional Officer, AICTE Western Region."
            </p>
          </div>

          <div className="pt-3 border-t border-amber-200 flex justify-between items-end text-[10px] font-sans text-slate-600">
            <div>
              <span className="block font-semibold">Authorized Bank Branch Seal</span>
              <span className="font-bold text-slate-800">Shri R. K. Saxena (Sr. Branch Manager)</span>
            </div>
            <div className="text-right">
              <span className="font-mono block">SHA256: 91b4a8e2fc104928...</span>
              <span className="text-emerald-700 font-bold flex items-center justify-end gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Cryptographic Integrity Verified
              </span>
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="pt-3 border-t border-slate-100 flex justify-between items-center text-xs">
          <span className="text-slate-500">Document size: 1.4 MB • 300 DPI Scanned</span>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => window.print()}
              className="px-3 py-1.5 border border-slate-300 rounded-lg text-slate-700 font-semibold hover:bg-slate-50 flex items-center space-x-1"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-1.5 bg-blue-700 hover:bg-blue-800 text-white font-semibold rounded-lg"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
