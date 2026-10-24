import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Award, 
  CheckCircle2, 
  Building2, 
  AlertCircle, 
  FileText 
} from 'lucide-react';
import { ReleaseRequest, Institution, FdrRecord } from '../types';
import { formatINR } from '../utils/formatters';

interface AuthorisedDecisionViewProps {
  requests: ReleaseRequest[];
  institutions: Institution[];
  fdrs: FdrRecord[];
  onExecuteDecision: (reqId: string, outcomeType: 'noc' | 'rtgs' | 'withhold', memo: string) => void;
}

export const AuthorisedDecisionView: React.FC<AuthorisedDecisionViewProps> = ({
  requests,
  institutions,
  fdrs,
  onExecuteDecision,
}) => {
  // Find a case ready for decision (or default to REQ-2026-9041)
  const readyCase = requests.find((r) => r.status.includes('Authorised Review') || r.id === 'REQ-2026-9041') || requests[0];
  const [selectedCaseId, setSelectedCaseId] = useState<string>(readyCase.id);
  const [outcomeType, setOutcomeType] = useState<'noc' | 'rtgs' | 'withhold'>('noc');
  const [decisionMemo, setDecisionMemo] = useState(
    'Approved by Competent Authority under Chapter 1 APH norms. Form-F Discharge NOC authorized for transmission to bank branch.'
  );

  const targetReq = requests.find((r) => r.id === selectedCaseId) || readyCase;
  const inst = institutions.find((i) => i.id === targetReq.institutionId);
  const fdr = fdrs.find((f) => f.id === targetReq.fdrId);

  const handleSign = (e: React.FormEvent) => {
    e.preventDefault();
    onExecuteDecision(targetReq.id, outcomeType, decisionMemo);
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <div>
          <div className="flex items-center space-x-2 text-xs text-slate-500 mb-1">
            <span>AICTE Council Portal</span>
            <span>/</span>
            <span className="text-indigo-700 font-semibold">Competent Authority Desk</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Authorised Decision & Statutory Outcome Recording
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Formal sign-off workspace for Competent Authority to generate Form-F NOC or sanction RTGS refund orders.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <label className="text-xs font-semibold text-slate-600">Select Case Dossier:</label>
          <select
            value={selectedCaseId}
            onChange={(e) => setSelectedCaseId(e.target.value)}
            className="text-xs bg-white border border-slate-200 font-mono font-bold py-1.5 px-3 rounded-lg shadow-xs text-indigo-900"
          >
            {requests.map((r) => (
              <option key={r.id} value={r.id}>
                {r.id} ({institutions.find((i) => i.id === r.institutionId)?.name})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Case Dossier Summary Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex justify-between items-center pb-4 border-b border-slate-100">
          <div>
            <span className="text-xs font-mono font-bold text-indigo-800 bg-indigo-50 border border-indigo-200 px-2.5 py-0.5 rounded">
              CASE DOSSIER: {targetReq.id}
            </span>
            <h3 className="text-lg font-bold text-slate-900 mt-1.5">{inst?.name}</h3>
            <p className="text-xs text-slate-500">
              {inst?.category} • Permanent AICTE Code: <span className="font-mono font-semibold">{inst?.code}</span>
            </p>
          </div>
          <div className="text-right">
            <span className="text-xs text-slate-400 block font-semibold uppercase">Pledged Principal</span>
            <span className="text-2xl font-mono font-extrabold text-slate-900">
              {formatINR(targetReq.fdrAmount)}
            </span>
          </div>
        </div>

        {/* Clearance Checklist Trio */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-slate-400 block font-semibold text-[10px] uppercase">Pledged Instrument</span>
            <span className="font-mono font-bold text-slate-900 mt-0.5 block">{fdr?.fdrNumber}</span>
            <p className="text-slate-500 mt-0.5">{fdr?.bankName} • Matured {fdr?.maturityDate}</p>
          </div>

          <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-200">
            <span className="text-emerald-800 block font-bold text-[10px] uppercase">Cross-Bureau Clearances</span>
            <span className="font-bold text-emerald-950 mt-0.5 block">All Clearances Verified</span>
            <p className="text-emerald-800 text-[11px] mt-0.5">Finance Cell, Approval Cell, Regional Office</p>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-slate-400 block font-semibold text-[10px] uppercase">Statutory Lock-in</span>
            <span className="font-bold text-slate-900 mt-0.5 block">Full 8 Years Concluded</span>
            <p className="text-slate-500 text-[11px] mt-0.5">Zero outstanding student grievances</p>
          </div>
        </div>

        {/* Form of Decision Selection */}
        <form onSubmit={handleSign} className="pt-4 border-t border-slate-100 space-y-4 text-xs">
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Record Statutory Determination
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <label
              className={`p-3.5 rounded-xl border-2 cursor-pointer block transition ${
                outcomeType === 'noc'
                  ? 'border-emerald-600 bg-emerald-50/40 shadow-xs'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <input
                type="radio"
                name="decisionOption"
                checked={outcomeType === 'noc'}
                onChange={() => setOutcomeType('noc')}
                className="mr-2 text-emerald-600"
              />
              <strong className="text-slate-900">Issue Form-F NOC (Lien Discharge)</strong>
              <p className="text-slate-500 text-[11px] mt-1">
                Authorizes bank branch manager to release principal & accrued interest to college.
              </p>
            </label>

            <label
              className={`p-3.5 rounded-xl border-2 cursor-pointer block transition ${
                outcomeType === 'rtgs'
                  ? 'border-blue-600 bg-blue-50/40 shadow-xs'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <input
                type="radio"
                name="decisionOption"
                checked={outcomeType === 'rtgs'}
                onChange={() => setOutcomeType('rtgs')}
                className="mr-2 text-blue-600"
              />
              <strong className="text-slate-900">Sanction RTGS Treasury Refund</strong>
              <p className="text-slate-500 text-[11px] mt-1">
                Where security deposit was deposited directly into AICTE central escrow account.
              </p>
            </label>

            <label
              className={`p-3.5 rounded-xl border-2 cursor-pointer block transition ${
                outcomeType === 'withhold'
                  ? 'border-rose-600 bg-rose-50/40 shadow-xs'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <input
                type="radio"
                name="decisionOption"
                checked={outcomeType === 'withhold'}
                onChange={() => setOutcomeType('withhold')}
                className="mr-2 text-rose-600"
              />
              <strong className="text-rose-900">Withhold / Require Evidence</strong>
              <p className="text-slate-500 text-[11px] mt-1">
                Return application with observation for further bureau or vigilance verification.
              </p>
            </label>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              Official Decision Endorsement & Seal:
            </label>
            <textarea
              rows={2}
              value={decisionMemo}
              onChange={(e) => setDecisionMemo(e.target.value)}
              className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 text-slate-900 font-mono"
            />
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-6 py-2.5 rounded-xl shadow-md transition flex items-center space-x-2"
            >
              <Award className="w-4 h-4" />
              <span>Sign & Issue Formal Release NOC</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
