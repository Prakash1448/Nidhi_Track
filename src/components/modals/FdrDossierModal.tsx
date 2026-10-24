import React from 'react';
import { X, FolderArchive, GitMerge, FileText, Sparkles, Building, AlertCircle, CheckCircle2 } from 'lucide-react';
import { FdrRecord, Institution } from '../../types';
import { formatINR, getStatusBadgeClass } from '../../utils/formatters';

interface FdrDossierModalProps {
  fdr: FdrRecord | null;
  institution: Institution | undefined;
  allFdrs: FdrRecord[];
  onClose: () => void;
  onRunDiagnostic: (fdrId: string) => void;
}

export const FdrDossierModal: React.FC<FdrDossierModalProps> = ({
  fdr,
  institution,
  allFdrs,
  onClose,
  onRunDiagnostic,
}) => {
  if (!fdr) return null;

  const predecessor = fdr.replacementOf ? allFdrs.find((f) => f.id === fdr.replacementOf) : null;
  const successor = fdr.replacedBy ? allFdrs.find((f) => f.id === fdr.replacedBy) : null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex justify-between items-start pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-mono font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200">
                {fdr.id}
              </span>
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${getStatusBadgeClass(fdr.status)}`}>
                {fdr.status}
              </span>
              {fdr.discrepancyFlag && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-300">
                  Mismatch Flag
                </span>
              )}
            </div>
            <h3 className="text-lg font-bold text-slate-900 mt-1 font-mono">{fdr.fdrNumber}</h3>
            <p className="text-xs text-slate-500">
              {institution?.name} • Permanent Code: <span className="font-mono">{institution?.code}</span>
            </p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Core Attributes Grid */}
        <div className="my-5 grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-slate-400 block font-semibold text-[10px] uppercase">Pledged Principal</span>
            <span className="text-base font-bold text-slate-900 font-mono mt-0.5 block">{formatINR(fdr.amount)}</span>
            <span className="text-[11px] text-slate-500">{fdr.tenureYears} Years Fixed Tenure</span>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-slate-400 block font-semibold text-[10px] uppercase">Bank Details</span>
            <span className="font-bold text-slate-800 block mt-0.5">{fdr.bankName}</span>
            <span className="text-[11px] text-slate-500 truncate block">{fdr.branch}</span>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-slate-400 block font-semibold text-[10px] uppercase">Maturity Timeline</span>
            <span className="font-bold text-slate-800 block mt-0.5">{fdr.maturityDate}</span>
            <span className="text-[11px] text-slate-500">Issued: {fdr.issueDate}</span>
          </div>

          <div className="col-span-2 sm:col-span-3 p-3 bg-blue-50/50 rounded-xl border border-blue-100">
            <span className="text-blue-700 block font-semibold text-[10px] uppercase">Joint Holding Authority</span>
            <p className="font-semibold text-slate-900 mt-0.5">{fdr.jointHolding}</p>
            <span className="text-[11px] text-slate-500 block mt-0.5">
              Deposit Nature: {fdr.depositType}
            </span>
          </div>
        </div>

        {/* Discrepancy Note Callout */}
        {fdr.discrepancyFlag && fdr.discrepancyNotes && (
          <div className="mb-5 p-3.5 bg-rose-50 rounded-xl border border-rose-200 text-xs">
            <div className="flex items-center space-x-2 text-rose-800 font-bold mb-1">
              <AlertCircle className="w-4 h-4" />
              <span>Audit Discrepancy Observation Recorded</span>
            </div>
            <p className="text-rose-700 leading-relaxed">{fdr.discrepancyNotes}</p>
          </div>
        )}

        {/* Replacement / Rollover Lineage Graph */}
        <div className="mb-5 p-4 bg-purple-50/50 rounded-xl border border-purple-200 text-xs">
          <div className="flex items-center space-x-2 text-purple-900 font-bold mb-3">
            <GitMerge className="w-4 h-4 text-purple-700" />
            <span className="uppercase text-[10px] tracking-wider">Instrument Lineage & Rollover History</span>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            {predecessor ? (
              <div className="bg-white p-3 rounded-lg border border-slate-200 flex-1 w-full">
                <span className="text-[10px] text-slate-400 font-mono block">PREDECESSOR ({predecessor.issueDate.slice(0,4)})</span>
                <span className="font-mono font-bold text-slate-800 block">{predecessor.fdrNumber}</span>
                <span className="text-[11px] text-slate-500">{predecessor.bankName} • {formatINR(predecessor.amount)}</span>
                <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded mt-1 inline-block">Discharged</span>
              </div>
            ) : (
              <div className="bg-white p-3 rounded-lg border border-slate-200 flex-1 w-full text-slate-400 italic">
                Initial Establishment Deposit (No predecessor)
              </div>
            )}

            <span className="text-purple-600 font-bold hidden sm:inline">&rarr;</span>

            <div className="bg-white p-3 rounded-lg border-2 border-purple-400 shadow-xs flex-1 w-full">
              <span className="text-[10px] text-purple-700 font-mono font-bold block">CURRENT INSTRUMENT</span>
              <span className="font-mono font-bold text-slate-900 block">{fdr.fdrNumber}</span>
              <span className="text-[11px] text-slate-500">{fdr.bankName} • {formatINR(fdr.amount)}</span>
              <span className="text-[10px] bg-purple-100 text-purple-800 px-1.5 py-0.2 rounded mt-1 inline-block font-semibold">Active Record</span>
            </div>

            {successor && (
              <>
                <span className="text-purple-600 font-bold hidden sm:inline">&rarr;</span>
                <div className="bg-white p-3 rounded-lg border border-slate-200 flex-1 w-full">
                  <span className="text-[10px] text-slate-400 font-mono block">SUCCESSOR</span>
                  <span className="font-mono font-bold text-slate-800 block">{successor.fdrNumber}</span>
                  <span className="text-[11px] text-slate-500">{successor.bankName}</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Attached Verification Records */}
        <div className="mb-5 text-xs">
          <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[10px] mb-2 flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-blue-700" />
            <span>Vault Evidence Documents ({fdr.docs.length})</span>
          </h4>
          {fdr.docs.length === 0 ? (
            <p className="text-slate-400 italic">No document attachments uploaded yet for this record.</p>
          ) : (
            <div className="divide-y divide-slate-100 border border-slate-200 rounded-lg overflow-hidden">
              {fdr.docs.map((doc, i) => (
                <div key={i} className="p-2.5 flex justify-between items-center bg-slate-50/50">
                  <div className="flex items-center space-x-2">
                    <FileText className="w-4 h-4 text-slate-400" />
                    <div>
                      <span className="font-semibold text-slate-800">{doc.name}</span>
                      <span className="text-[10px] text-slate-400 block">Uploaded {doc.date}</span>
                    </div>
                  </div>
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      doc.status === 'Verified'
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        : doc.status === 'Inconsistent'
                        ? 'bg-rose-50 text-rose-800 border border-rose-200'
                        : 'bg-amber-50 text-amber-800 border border-amber-200'
                    }`}
                  >
                    {doc.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal Actions */}
        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-2">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-lg transition"
          >
            Close Dossier
          </button>
          <button
            onClick={() => {
              onClose();
              onRunDiagnostic(fdr.id);
            }}
            className="w-full sm:w-auto px-5 py-2 bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold text-xs rounded-lg shadow-xs transition flex items-center justify-center space-x-1.5"
          >
            <Sparkles className="w-4 h-4" />
            <span>Run Preliminary Readiness Check</span>
          </button>
        </div>
      </div>
    </div>
  );
};
