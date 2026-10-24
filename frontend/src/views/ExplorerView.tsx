import React from 'react';
import { 
  Building2, 
  GitMerge, 
  FolderArchive, 
  Eye, 
  ShieldCheck, 
  ExternalLink 
} from 'lucide-react';
import { Institution, FdrRecord, ReleaseRequest } from '../types';
import { formatINR, getStatusBadgeClass } from '../utils/formatters';

interface ExplorerViewProps {
  institutions: Institution[];
  activeInstitutionId: string;
  onInstitutionChange: (id: string) => void;
  fdrs: FdrRecord[];
  requests: ReleaseRequest[];
  onOpenFdrDossier: (fdrId: string) => void;
}

export const ExplorerView: React.FC<ExplorerViewProps> = ({
  institutions,
  activeInstitutionId,
  onInstitutionChange,
  fdrs,
  requests,
  onOpenFdrDossier,
}) => {
  const currentInst = institutions.find((i) => i.id === activeInstitutionId) || institutions[0];
  const instFdrs = fdrs.filter((f) => f.institutionId === currentInst.id);
  const totalExposure = instFdrs.reduce((a, c) => a + c.amount, 0);

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <div className="flex items-center space-x-2 text-xs text-slate-500 mb-1">
            <span>AICTE Council Portal</span>
            <span>/</span>
            <span className="text-indigo-700 font-semibold">Institutional Dossier</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Institutional FDR Dossier & Audit Explorer
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            360-degree audit history, replacement lineage traces, and cumulative financial exposure.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <label className="text-xs font-semibold text-slate-600">Switch College:</label>
          <select
            value={currentInst.id}
            onChange={(e) => onInstitutionChange(e.target.value)}
            className="text-xs py-1.5 px-3 bg-white border border-slate-200 rounded-lg shadow-xs font-semibold text-slate-900"
          >
            {institutions.map((i) => (
              <option key={i.id} value={i.id}>
                {i.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Institutional Profile Dossier */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
        <div>
          <span className="text-slate-400 font-semibold uppercase text-[10px]">Institution Name & Region</span>
          <h3 className="font-bold text-slate-900 text-sm mt-0.5">{currentInst.name}</h3>
          <p className="text-slate-500 mt-0.5">{currentInst.region} • Estd {currentInst.establishmentYear}</p>
        </div>
        <div>
          <span className="text-slate-400 font-semibold uppercase text-[10px]">AICTE Permanent Code</span>
          <div className="font-mono font-bold text-slate-900 text-sm mt-0.5">{currentInst.code}</div>
          <p className="text-emerald-700 font-semibold mt-0.5">{currentInst.currentApprovalStatus}</p>
        </div>
        <div>
          <span className="text-slate-400 font-semibold uppercase text-[10px]">Approved Intake Capacity</span>
          <div className="font-bold text-slate-900 text-sm mt-0.5">{currentInst.approvedIntake} Approved Seats</div>
          <p className="text-slate-500 truncate mt-0.5">{currentInst.courses.join(', ')}</p>
        </div>
        <div>
          <span className="text-slate-400 font-semibold uppercase text-[10px]">Security Deposit Exposure</span>
          <div className="font-mono font-bold text-indigo-900 text-sm mt-0.5">{formatINR(totalExposure)}</div>
          <p className="text-slate-500 mt-0.5">{instFdrs.length} Recorded Instruments</p>
        </div>
      </div>

      {/* Rollover Lineage Graph */}
      <div className="bg-indigo-50/40 rounded-2xl border border-indigo-200 p-5">
        <div className="flex items-center space-x-2 mb-3">
          <GitMerge className="w-4 h-4 text-indigo-700" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-950">
            Historical Instrument Lineage Tracing
          </h4>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-3 text-xs">
          <div className="bg-white p-3 rounded-xl border border-slate-200 flex-1 w-full">
            <span className="text-[10px] text-slate-400 font-mono block">INITIAL APPROVAL PLEDGE (2014)</span>
            <span className="font-bold text-slate-900 font-mono block">UBIN053219010</span>
            <p className="text-slate-500 text-[11px]">Union Bank of India • ₹25,00,000</p>
            <span className="inline-block mt-2 text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-medium">
              Discharged & Rolled Over
            </span>
          </div>

          <span className="text-indigo-600 font-bold hidden sm:inline text-lg">&rarr;</span>

          <div className="bg-white p-3 rounded-xl border-2 border-indigo-400 shadow-xs flex-1 w-full">
            <span className="text-[10px] text-indigo-800 font-mono font-bold block">CURRENT SUCCESSOR LIEN (2022-2030)</span>
            <span className="font-bold text-slate-900 font-mono block">BARB0VJWAKH1</span>
            <p className="text-slate-500 text-[11px]">Bank of Baroda • ₹25,00,000</p>
            <span className="inline-block mt-2 text-[10px] bg-indigo-100 text-indigo-900 font-bold px-2 py-0.5 rounded">
              Active Lineage Link
            </span>
          </div>
        </div>
      </div>

      {/* All Linked FDRs Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3">
          All Instruments on File ({instFdrs.length})
        </h4>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold text-[10px] uppercase">
                <th className="py-2.5 px-3">FDR No.</th>
                <th className="py-2.5 px-3">Bank Details</th>
                <th className="py-2.5 px-3">Amount</th>
                <th className="py-2.5 px-3">Maturity Date</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3">Bank Verification</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {instFdrs.map((f) => (
                <tr key={f.id} className="hover:bg-slate-50">
                  <td className="py-2.5 px-3 font-mono font-bold text-slate-900">{f.fdrNumber}</td>
                  <td className="py-2.5 px-3">
                    <span className="font-semibold block">{f.bankName}</span>
                    <span className="text-[10px] text-slate-500">{f.branch}</span>
                  </td>
                  <td className="py-2.5 px-3 font-mono font-bold text-slate-900">{formatINR(f.amount)}</td>
                  <td className="py-2.5 px-3">{f.maturityDate}</td>
                  <td className="py-2.5 px-3">
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${getStatusBadgeClass(f.status)}`}>
                      {f.status}
                    </span>
                  </td>
                  <td className="py-2.5 px-3">{f.verificationStatus}</td>
                  <td className="py-2.5 px-3 text-right">
                    <button
                      onClick={() => onOpenFdrDossier(f.id)}
                      className="text-blue-700 font-bold hover:underline text-xs"
                    >
                      Inspect Dossier &rarr;
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
