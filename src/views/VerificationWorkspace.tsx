import React, { useState } from 'react';
import { 
  FileCheck2, 
  CheckCircle2, 
  AlertTriangle, 
  HelpCircle, 
  Check, 
  Eye, 
  ShieldAlert, 
  FileText 
} from 'lucide-react';
import { Institution, FdrRecord } from '../types';

interface VerificationWorkspaceProps {
  institution: Institution;
  fdrs: FdrRecord[];
  onOpenDocumentPreview: (title: string, fileName: string) => void;
  onShowToast: (title: string, message: string) => void;
}

export const VerificationWorkspace: React.FC<VerificationWorkspaceProps> = ({
  institution,
  fdrs,
  onOpenDocumentPreview,
  onShowToast,
}) => {
  const [selectedFdrId, setSelectedFdrId] = useState<string>(
    fdrs.find((f) => f.institutionId === institution.id)?.id || fdrs[0].id
  );

  const selectedFdr = fdrs.find((f) => f.id === selectedFdrId) || fdrs[0];

  const handleMarkFindingReviewed = () => {
    onShowToast('Finding Reviewed', `Document OCR attributes verified for ${selectedFdr.fdrNumber}.`);
  };

  const handleClarificationRequest = () => {
    onShowToast('Clarification Query Drafted', `Formal inquiry staged for bank branch regarding ${selectedFdr.fdrNumber}.`);
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <div>
          <div className="flex items-center space-x-2 text-xs text-slate-500 mb-1">
            <span>Institution Portal</span>
            <span>/</span>
            <span className="text-blue-700 font-semibold">Verification Studio</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Document & Evidence Verification Workspace
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Automated document OCR extraction, field-by-field reconciliation, and bank API mock validation.
          </p>
        </div>
        <div className="bg-blue-50 text-blue-900 text-xs px-3 py-1 rounded-lg border border-blue-200 font-semibold">
          Simulated OCR Engine v4.2
        </div>
      </div>

      {/* Selector Strip */}
      <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between text-xs">
        <div className="flex items-center space-x-2">
          <label className="font-semibold text-slate-700">Select FDR Record for Scrutiny:</label>
          <select
            value={selectedFdrId}
            onChange={(e) => setSelectedFdrId(e.target.value)}
            className="p-1.5 bg-slate-50 border border-slate-200 rounded-md font-mono text-slate-800"
          >
            {fdrs
              .filter((f) => f.institutionId === institution.id)
              .map((f) => (
                <option key={f.id} value={f.id}>
                  {f.fdrNumber} ({f.bankName})
                </option>
              ))}
          </select>
        </div>
        <span className="text-slate-500 hidden sm:inline">
          Lien Holder: {selectedFdr.jointHolding}
        </span>
      </div>

      {/* Split View Studio */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Visual Document Preview */}
        <div className="lg:col-span-5 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col">
          <div className="flex justify-between items-center pb-3 border-b border-slate-100 mb-3">
            <div>
              <h4 className="font-bold text-xs text-slate-900">Uploaded Instrument Preview</h4>
              <p className="text-[11px] text-slate-500 font-mono">PUNB_Original_FDR_35L.pdf</p>
            </div>
            <span className="text-[10px] bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-full font-semibold">
              OCR Processed
            </span>
          </div>

          {/* Certificate Simulation */}
          <div className="flex-1 bg-amber-50/40 border-2 border-dashed border-amber-300 rounded-xl p-5 font-serif text-slate-800 relative overflow-hidden flex flex-col justify-between shadow-inner">
            <div className="text-center border-b border-amber-200 pb-3 font-sans">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-widest block">
                Fixed Deposit Receipt • Council Copy
              </span>
              <h3 className="text-base font-extrabold text-slate-900 mt-0.5 uppercase tracking-wide">
                {selectedFdr.bankName}
              </h3>
              <p className="text-[11px] text-slate-500 font-mono">{selectedFdr.branch}</p>
            </div>

            <div className="my-4 space-y-2 text-xs font-sans leading-relaxed">
              <p>
                <strong>Receipt No:</strong> <span className="font-mono">{selectedFdr.fdrNumber}</span>
              </p>
              <p>
                <strong>Joint Depositors:</strong> {selectedFdr.jointHolding}
              </p>
              <p>
                <strong>Principal Deposit:</strong> ₹{(selectedFdr.amount / 100000).toFixed(2)} Lakhs
              </p>
              <p>
                <strong>Maturity Date:</strong> {selectedFdr.maturityDate} ({selectedFdr.tenureYears} Years)
              </p>
              <p className="text-[10px] text-slate-500 italic bg-amber-100/50 p-1.5 rounded">
                "Subject to joint discharge sanction by AICTE Regional Office."
              </p>
            </div>

            <div className="pt-2 border-t border-amber-200 flex justify-between items-end text-[10px] font-sans text-slate-500">
              <span>Authorized Officer Seal</span>
              <span className="font-mono">HASH: 91b4a8e2...</span>
            </div>
          </div>

          <div className="mt-3 flex justify-between items-center text-xs">
            <span className="text-slate-500 text-[11px]">Vault File Size: 1.4 MB</span>
            <button
              onClick={() => onOpenDocumentPreview('FDR Instrument Copy', 'PUNB_Original_FDR_35L.pdf')}
              className="text-blue-700 hover:text-blue-900 font-bold flex items-center space-x-1"
            >
              <span>Full Screen Inspection</span>
              <Eye className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Right Column: OCR Field-by-Field Comparison */}
        <div className="lg:col-span-7 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center pb-3 border-b border-slate-100 mb-4">
              <div>
                <h4 className="font-bold text-sm text-slate-900">
                  Extracted Attributes vs AICTE Master Ledger
                </h4>
                <p className="text-xs text-slate-500">Comparing scanned certificate against council records</p>
              </div>
              <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                Ledger Sync Active
              </span>
            </div>

            <div className="space-y-2.5 text-xs">
              {/* Row 1: FDR Number */}
              <div className="grid grid-cols-12 gap-2 p-2.5 rounded-lg bg-slate-50 border border-slate-100 items-center">
                <div className="col-span-4 font-semibold text-slate-600">FDR Number</div>
                <div className="col-span-4 font-mono font-bold text-slate-900">{selectedFdr.fdrNumber}</div>
                <div className="col-span-4 flex items-center text-emerald-700 font-semibold space-x-1">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Exact Match</span>
                </div>
              </div>

              {/* Row 2: Amount */}
              <div className="grid grid-cols-12 gap-2 p-2.5 rounded-lg bg-slate-50 border border-slate-100 items-center">
                <div className="col-span-4 font-semibold text-slate-600">Principal Deposit</div>
                <div className="col-span-4 font-mono font-bold text-slate-900">
                  ₹{Number(selectedFdr.amount).toLocaleString('en-IN')}
                </div>
                <div className="col-span-4 flex items-center text-emerald-700 font-semibold space-x-1">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Exact Match</span>
                </div>
              </div>

              {/* Row 3: Maturity Date */}
              <div className="grid grid-cols-12 gap-2 p-2.5 rounded-lg bg-slate-50 border border-slate-100 items-center">
                <div className="col-span-4 font-semibold text-slate-600">Maturity Date</div>
                <div className="col-span-4 font-bold text-slate-900">{selectedFdr.maturityDate}</div>
                <div className="col-span-4 flex items-center text-emerald-700 font-semibold space-x-1">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Valid Lock-in ({selectedFdr.tenureYears} Yrs)</span>
                </div>
              </div>

              {/* Row 4: Bank Confirmation Status */}
              <div
                className={`grid grid-cols-12 gap-2 p-2.5 rounded-lg border items-center ${
                  selectedFdr.discrepancyFlag
                    ? 'bg-rose-50/70 border-rose-200'
                    : 'bg-amber-50/60 border-amber-200'
                }`}
              >
                <div className="col-span-4 font-semibold text-slate-800">Bank Non-Encumbrance</div>
                <div className="col-span-4 font-medium text-slate-900">
                  {selectedFdr.discrepancyFlag ? 'IFSC Code Mismatch' : 'Pending Re-attestation'}
                </div>
                <div className="col-span-4 flex items-center font-semibold space-x-1 text-amber-800">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span>Action Required</span>
                </div>
              </div>
            </div>

            {/* Simulated SFMS note */}
            <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-600 leading-relaxed">
              <div className="font-bold text-slate-800 flex items-center gap-1 mb-0.5">
                <ShieldAlert className="w-3.5 h-3.5 text-blue-700" />
                <span>Simulated Bank Confirmation Gateway</span>
              </div>
              Demo validates simulated responses from banking core systems. In production, digital lien confirmation is exchanged directly via encrypted banking APIs or authorized Council email clearing.
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 pt-4 border-t border-slate-100 flex flex-wrap justify-between items-center gap-2">
            <button
              onClick={handleClarificationRequest}
              className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition flex items-center space-x-1"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Record Clarification Request</span>
            </button>
            <button
              onClick={handleMarkFindingReviewed}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-xs transition flex items-center space-x-1"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Mark Finding Reviewed</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
