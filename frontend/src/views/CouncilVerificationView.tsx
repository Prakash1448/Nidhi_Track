import React, { useState } from 'react';
import { 
  Microscope, 
  FileText, 
  AlertTriangle, 
  CheckCircle2, 
  HelpCircle, 
  Send, 
  Eye, 
  ShieldCheck 
} from 'lucide-react';
import { ReleaseRequest, Institution, FdrRecord } from '../types';
import { formatINR } from '../utils/formatters';

interface CouncilVerificationViewProps {
  requests: ReleaseRequest[];
  institutions: Institution[];
  fdrs: FdrRecord[];
  onPreviewDocument: (name: string, fileName: string) => void;
  onSendClarification: (reqId: string, note: string) => void;
  onGrantClearance: (reqId: string, note: string) => void;
  onShowToast: (title: string, message: string) => void;
}

export const CouncilVerificationView: React.FC<CouncilVerificationViewProps> = ({
  requests,
  institutions,
  fdrs,
  onPreviewDocument,
  onSendClarification,
  onGrantClearance,
  onShowToast,
}) => {
  const activeReqs = requests.filter((r) => !r.status.includes('Closed'));
  const [selectedReqId, setSelectedReqId] = useState<string>(
    activeReqs.find((r) => r.id === 'REQ-2026-8812')?.id || activeReqs[0]?.id || requests[0].id
  );
  const [officerNote, setOfficerNote] = useState('');

  const targetReq = requests.find((r) => r.id === selectedReqId) || requests[0];
  const inst = institutions.find((i) => i.id === targetReq.institutionId);
  const fdr = fdrs.find((f) => f.id === targetReq.fdrId);

  const handleQuery = () => {
    onSendClarification(
      targetReq.id,
      officerNote || 'Council requires branch manager attested non-encumbrance certificate with clear IFSC.'
    );
    setOfficerNote('');
  };

  const handleClear = () => {
    onGrantClearance(
      targetReq.id,
      officerNote || 'Regional Office verification clean. 8-year lock-in verified.'
    );
    setOfficerNote('');
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <div>
          <div className="flex items-center space-x-2 text-xs text-slate-500 mb-1">
            <span>AICTE Council Portal</span>
            <span>/</span>
            <span className="text-indigo-700 font-semibold">Council Verification Desk</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Council Evidence Verification & Clarification Console
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Inspect applicant documents, record official scrutiny findings, and issue formal clarification inquiries.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <label className="text-xs font-semibold text-slate-600">Select Case:</label>
          <select
            value={selectedReqId}
            onChange={(e) => setSelectedReqId(e.target.value)}
            className="text-xs bg-white border border-slate-200 font-mono font-bold py-1.5 px-3 rounded-lg shadow-xs text-indigo-900"
          >
            {activeReqs.map((r) => (
              <option key={r.id} value={r.id}>
                {r.id} — {institutions.find((i) => i.id === r.institutionId)?.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Case Header Dossier */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        <div>
          <span className="text-slate-400 font-semibold uppercase text-[10px]">Applicant Entity</span>
          <div className="font-bold text-slate-900 text-sm mt-0.5">{inst?.name}</div>
          <p className="text-slate-500 font-mono text-[11px] mt-0.5">{inst?.code} • {inst?.region}</p>
        </div>
        <div>
          <span className="text-slate-400 font-semibold uppercase text-[10px]">Claimed Deposit</span>
          <div className="font-mono font-bold text-slate-900 text-sm mt-0.5">{formatINR(targetReq.fdrAmount)}</div>
          <p className="text-slate-500 text-[11px] mt-0.5">{fdr?.bankName} (Maturity: {fdr?.maturityDate})</p>
        </div>
        <div>
          <span className="text-slate-400 font-semibold uppercase text-[10px]">Workflow Status</span>
          <div className="font-bold text-blue-900 text-sm mt-0.5">{targetReq.currentStage}</div>
          <p className="text-amber-800 font-semibold text-[11px] mt-0.5">In Station: {targetReq.waitingDays} Days</p>
        </div>
      </div>

      {/* Evidence & Action Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Submitted Evidence List */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="font-bold text-slate-900 text-sm">Submitted Evidence Files</h3>

          <div className="space-y-2 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <FileText className="w-4 h-4 text-blue-700" />
                <div>
                  <span className="font-bold text-slate-900">Original_Pledge_FDR.pdf</span>
                  <span className="text-[10px] text-slate-400 block">Uploaded 02 Oct 2026 • Verified OCR Match</span>
                </div>
              </div>
              <button
                onClick={() => onPreviewDocument('Original Pledge FDR', 'PUNB_Original_FDR_35L.pdf')}
                className="text-xs px-2.5 py-1 bg-white border border-slate-200 rounded font-semibold text-blue-800 hover:bg-blue-50"
              >
                Inspect
              </button>
            </div>

            <div className="p-3 bg-amber-50/70 rounded-xl border border-amber-200 flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <div>
                  <span className="font-bold text-amber-950">Bank_NonEncumbrance_Draft.pdf</span>
                  <span className="text-[10px] text-amber-800 block">Discrepancy: Branch manager signature illegible</span>
                </div>
              </div>
              <button
                onClick={() => onPreviewDocument('Bank Non-Encumbrance Draft', 'Bank_NonEncumbrance_Draft.pdf')}
                className="text-xs px-2.5 py-1 bg-white border border-amber-300 rounded font-semibold text-amber-900 hover:bg-amber-50"
              >
                Inspect
              </button>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <div>
                  <span className="font-bold text-slate-900">Trust_Board_Resolution.pdf</span>
                  <span className="text-[10px] text-slate-400 block">Signed Resolution of Trust</span>
                </div>
              </div>
              <button
                onClick={() => onPreviewDocument('Trust Board Resolution', 'Trust_Resolution_2026_09.pdf')}
                className="text-xs px-2.5 py-1 bg-white border border-slate-200 rounded font-semibold text-blue-800 hover:bg-blue-50"
              >
                Inspect
              </button>
            </div>
          </div>
        </div>

        {/* Scrutiny Action Desk */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-sm mb-1">Council Scrutiny Action Desk</h3>
            <p className="text-xs text-slate-500 mb-4">Record official verification determination for this docket.</p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Scrutiny Officer Findings & Instructions:
                </label>
                <textarea
                  rows={3}
                  value={officerNote}
                  onChange={(e) => setOfficerNote(e.target.value)}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 text-slate-900"
                  placeholder="Enter findings regarding bank verification, seal validation, or encumbrance..."
                />
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 text-[11px] text-slate-500 flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-indigo-700 shrink-0" />
                <span>All scrutiny findings are permanently recorded in the institutional audit log.</span>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100 flex flex-wrap gap-2 justify-end">
            <button
              onClick={handleQuery}
              className="px-3.5 py-2 bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold text-xs rounded-lg transition flex items-center space-x-1"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Request College Clarification</span>
            </button>
            <button
              onClick={handleClear}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg shadow-xs transition flex items-center space-x-1"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Grant Stage Clearance & Advance</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
