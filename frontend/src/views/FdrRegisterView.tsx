import React, { useState } from 'react';
import { 
  FolderArchive, 
  PlusCircle, 
  Eye, 
  Sparkles, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  GitMerge, 
  Filter 
} from 'lucide-react';
import { Institution, FdrRecord, FdrStatus, NavPage } from '../types';
import { formatINR, getStatusBadgeClass } from '../utils/formatters';

interface FdrRegisterViewProps {
  institution: Institution;
  fdrs: FdrRecord[];
  onOpenAddFdr: () => void;
  onOpenFdrDossier: (fdrId: string) => void;
  onRunDiagnostic: (fdrId: string) => void;
}

export const FdrRegisterView: React.FC<FdrRegisterViewProps> = ({
  institution,
  fdrs,
  onOpenAddFdr,
  onOpenFdrDossier,
  onRunDiagnostic,
}) => {
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const myFdrs = fdrs.filter((f) => f.institutionId === institution.id);

  const filteredFdrs = statusFilter === 'ALL'
    ? myFdrs
    : myFdrs.filter((f) => f.status === statusFilter);

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <div className="flex items-center space-x-2 text-xs text-slate-500 mb-1">
            <span>Institution Portal</span>
            <span>/</span>
            <span className="text-blue-700 font-semibold">Master Ledger</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            FDR Lifecycle Register & History Ledger
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Immutable registry of active pledges, matured deposits, and replacement rollover lineages.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={onOpenAddFdr}
            className="bg-blue-700 hover:bg-blue-800 text-white font-semibold text-xs px-3.5 py-2 rounded-lg shadow-xs transition flex items-center space-x-1.5"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add / Rollover FDR</span>
          </button>
        </div>
      </div>

      {/* Filter and Summary Strip */}
      <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row justify-between items-center gap-3">
        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="text-xs font-semibold text-slate-600">Filter Ledger:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-md py-1.5 px-2.5 focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-800"
          >
            <option value="ALL">All Records ({myFdrs.length})</option>
            <option value="Active">Active Only</option>
            <option value="Maturing Soon">Maturing Soon (&lt; 90 Days)</option>
            <option value="Matured">Matured</option>
            <option value="Replaced & Archived">Archived / Replaced</option>
          </select>
        </div>
        <div className="text-xs text-slate-500">
          Showing <span className="font-bold text-slate-800">{filteredFdrs.length}</span> of {myFdrs.length} instruments for {institution.name}
        </div>
      </div>

      {/* Master Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-bold text-[10px] tracking-wider">
                <th className="py-3 px-4">FDR Ref / Instrument</th>
                <th className="py-3 px-4">Bank Details</th>
                <th className="py-3 px-4">Deposit Principal</th>
                <th className="py-3 px-4">Maturity Timeline</th>
                <th className="py-3 px-4">Lifecycle Status</th>
                <th className="py-3 px-4">Lineage Rollover</th>
                <th className="py-3 px-4">Bank Verification</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredFdrs.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-8 text-slate-400">
                    No FDR records match the selected filter.
                  </td>
                </tr>
              ) : (
                filteredFdrs.map((fdr) => {
                  const isUrgent = fdr.status === 'Maturing Soon';
                  const isMatured = fdr.status === 'Matured';

                  return (
                    <tr
                      key={fdr.id}
                      className={`hover:bg-slate-50/80 transition ${
                        isUrgent ? 'bg-amber-50/30' : ''
                      }`}
                    >
                      <td className="py-3 px-4">
                        <span className="font-bold font-mono text-slate-900 block">
                          {fdr.fdrNumber}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {fdr.id}
                        </span>
                        {fdr.discrepancyFlag && (
                          <span className="inline-block text-[9px] bg-rose-100 text-rose-800 px-1.5 rounded font-bold mt-0.5">
                            IFSC Mismatch
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-semibold text-slate-800 block">
                          {fdr.bankName}
                        </span>
                        <span className="text-[11px] text-slate-500">
                          {fdr.branch}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-bold text-slate-900 font-mono">
                        {formatINR(fdr.amount)}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`font-bold ${
                            isUrgent
                              ? 'text-amber-800'
                              : isMatured
                              ? 'text-rose-800'
                              : 'text-slate-700'
                          }`}
                        >
                          {fdr.maturityDate}
                        </span>
                        <span className="block text-[10px] text-slate-400">
                          {fdr.tenureYears} Yrs Tenure
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${getStatusBadgeClass(
                            fdr.status
                          )}`}
                        >
                          {fdr.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {fdr.replacedBy ? (
                          <span className="text-[10px] text-purple-700 bg-purple-50 border border-purple-200 px-1.5 py-0.5 rounded font-mono font-medium block">
                            Replaced by: {fdr.replacedBy}
                          </span>
                        ) : fdr.replacementOf ? (
                          <span className="text-[10px] text-blue-700 bg-blue-50 border border-blue-200 px-1.5 py-0.5 rounded font-mono font-medium block">
                            Rolled from: {fdr.replacementOf}
                          </span>
                        ) : (
                          <span className="text-slate-400 text-[11px]">Original</span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        {fdr.verificationStatus === 'Verified in Demo' ? (
                          <span className="inline-flex items-center text-[10px] text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full font-medium">
                            <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-600" />
                            Verified
                          </span>
                        ) : fdr.verificationStatus === 'Inconsistent — Review Required' ? (
                          <span className="inline-flex items-center text-[10px] text-rose-800 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-full font-medium">
                            <AlertCircle className="w-3 h-3 mr-1 text-rose-600" />
                            Inconsistent
                          </span>
                        ) : (
                          <span className="inline-flex items-center text-[10px] text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full font-medium">
                            <Clock className="w-3 h-3 mr-1 text-amber-600" />
                            Pending Bank
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end space-x-1.5">
                          <button
                            onClick={() => onOpenFdrDossier(fdr.id)}
                            title="Inspect Full Dossier"
                            className="p-1.5 text-slate-500 hover:text-blue-700 hover:bg-slate-100 rounded-md transition"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onRunDiagnostic(fdr.id)}
                            title="Run Preliminary Diagnostic"
                            className="p-1.5 text-amber-600 hover:text-amber-800 hover:bg-amber-50 rounded-md transition"
                          >
                            <Sparkles className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
