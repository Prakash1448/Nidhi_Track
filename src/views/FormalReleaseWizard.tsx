import React, { useState } from 'react';
import { 
  ArrowRight, 
  ArrowLeft, 
  Send, 
  CheckCircle2, 
  FileCheck, 
  ShieldCheck, 
  Building2 
} from 'lucide-react';
import { Institution, FdrRecord, ReleaseRequest, NavPage } from '../types';
import { formatINR } from '../utils/formatters';

interface FormalReleaseWizardProps {
  institution: Institution;
  fdrs: FdrRecord[];
  selectedFdrId: string;
  onSelectFdr: (fdrId: string) => void;
  onSubmitRequest: (newReq: ReleaseRequest) => void;
  onNavigate: (page: NavPage) => void;
}

export const FormalReleaseWizard: React.FC<FormalReleaseWizardProps> = ({
  institution,
  fdrs,
  selectedFdrId,
  onSelectFdr,
  onSubmitRequest,
  onNavigate,
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const myFdrs = fdrs.filter((f) => f.institutionId === institution.id);
  const targetFdr = myFdrs.find((f) => f.id === selectedFdrId) || myFdrs[0] || fdrs[0];

  const handleFinalSubmit = () => {
    const newId = `REQ-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    const newRequest: ReleaseRequest = {
      id: newId,
      institutionId: institution.id,
      fdrId: targetFdr.id,
      submissionDate: '2026-10-24',
      targetCompletionDate: '2026-11-24',
      fdrAmount: targetFdr.amount,
      status: 'Submitted / Under Scrutiny',
      currentStage: 'Stage 2: Document Completeness Check',
      waitingDays: 1,
      priority: 'Urgent',
      priorityReason: 'Newly submitted release application for FDR maturing in current period.',
      nextResponsibleDesk: `Regional Officer (AICTE ${institution.region})`,
      stages: [
        { name: 'Request Submitted', status: 'completed', date: '2026-10-24', note: 'Online request submitted via institution portal.' },
        { name: 'Document Completeness Check', status: 'in-progress', date: '2026-10-24', note: 'Automated completeness scan.' },
        { name: 'Regional Verification & Clarification', status: 'pending', date: null, note: '' },
        { name: 'Cross-Bureau Clearance', status: 'pending', date: null, note: '' },
        { name: 'Authorised Council Review', status: 'pending', date: null, note: '' },
        { name: 'Final Outcome & NOC', status: 'pending', date: null, note: '' }
      ],
      notes: [
        { role: 'System Ingest', date: '2026-10-24', text: 'Application lodged with 3 verified attachments.' }
      ]
    };

    onSubmitRequest(newRequest);
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 pb-4">
        <div className="flex items-center space-x-2 text-xs text-slate-500 mb-1">
          <span>Institution Portal</span>
          <span>/</span>
          <span className="text-blue-700 font-semibold">Application Submission</span>
        </div>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">
          Formal FDR Release Application Wizard
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Submit an official release dossier to AICTE Regional Office and Central Finance Cell.
        </p>
      </div>

      {/* Step Indicator */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between max-w-2xl mx-auto">
          {/* Step 1 */}
          <div className="flex items-center space-x-2">
            <span
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                currentStep >= 1 ? 'bg-blue-700 text-white' : 'bg-slate-100 text-slate-500'
              }`}
            >
              1
            </span>
            <span className={`text-xs font-semibold ${currentStep >= 1 ? 'text-slate-900' : 'text-slate-400'} hidden sm:inline`}>
              Select FDR
            </span>
          </div>
          <div className={`flex-1 h-0.5 mx-2 bg-slate-200 ${currentStep >= 2 ? 'bg-blue-600' : ''}`} />

          {/* Step 2 */}
          <div className="flex items-center space-x-2">
            <span
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                currentStep >= 2 ? 'bg-blue-700 text-white' : 'bg-slate-100 text-slate-500'
              }`}
            >
              2
            </span>
            <span className={`text-xs font-semibold ${currentStep >= 2 ? 'text-slate-900' : 'text-slate-400'} hidden sm:inline`}>
              Statutory Affirmations
            </span>
          </div>
          <div className={`flex-1 h-0.5 mx-2 bg-slate-200 ${currentStep >= 3 ? 'bg-blue-600' : ''}`} />

          {/* Step 3 */}
          <div className="flex items-center space-x-2">
            <span
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                currentStep >= 3 ? 'bg-blue-700 text-white' : 'bg-slate-100 text-slate-500'
              }`}
            >
              3
            </span>
            <span className={`text-xs font-semibold ${currentStep >= 3 ? 'text-slate-900' : 'text-slate-400'} hidden sm:inline`}>
              Evidence Vault
            </span>
          </div>
          <div className={`flex-1 h-0.5 mx-2 bg-slate-200 ${currentStep >= 4 ? 'bg-blue-600' : ''}`} />

          {/* Step 4 */}
          <div className="flex items-center space-x-2">
            <span
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                currentStep >= 4 ? 'bg-blue-700 text-white' : 'bg-slate-100 text-slate-500'
              }`}
            >
              4
            </span>
            <span className={`text-xs font-semibold ${currentStep >= 4 ? 'text-slate-900' : 'text-slate-400'} hidden sm:inline`}>
              Review & Submit
            </span>
          </div>
        </div>
      </div>

      {/* Step Contents */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        {currentStep === 1 && (
          <div className="space-y-4 max-w-xl mx-auto">
            <h3 className="text-base font-bold text-slate-900">Step 1: Confirm Target FDR Instrument</h3>
            <p className="text-xs text-slate-500">
              Select the pledged fixed deposit receipt you are applying to release or discharge.
            </p>

            <div className="space-y-3 pt-2">
              <label className="text-xs font-semibold text-slate-700 block">Choose Fixed Deposit Instrument:</label>
              <select
                value={targetFdr.id}
                onChange={(e) => onSelectFdr(e.target.value)}
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 font-mono text-slate-900"
              >
                {myFdrs.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.fdrNumber} — {f.bankName} ({formatINR(f.amount)}) [Maturity: {f.maturityDate}]
                  </option>
                ))}
              </select>
            </div>

            <div className="bg-blue-50/70 p-4 rounded-xl border border-blue-100 text-xs text-slate-700 space-y-1 mt-4">
              <p><strong>Applying Entity:</strong> {institution.name} (Code: {institution.code})</p>
              <p><strong>Regional Authority:</strong> AICTE {institution.region} Camp Office</p>
              <p><strong>Refund Mode:</strong> Form-F NOC (Lien Discharge) / RTGS to Official Trust Account</p>
            </div>

            <div className="pt-6 flex justify-end">
              <button
                onClick={() => setCurrentStep(2)}
                className="bg-blue-700 hover:bg-blue-800 text-white font-semibold text-xs px-5 py-2.5 rounded-lg shadow-xs transition flex items-center space-x-1.5"
              >
                <span>Continue to Affirmations</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-4 max-w-xl mx-auto">
            <h3 className="text-base font-bold text-slate-900">Step 2: Statutory Requirement Affirmation</h3>
            <p className="text-xs text-slate-500">
              Affirm regulatory eligibility as prescribed in Chapter 1 of Approval Process Handbook 2024-27.
            </p>

            <div className="space-y-3 pt-2 text-xs">
              <label className="flex items-start space-x-2.5 p-3 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer">
                <input type="checkbox" defaultChecked className="mt-0.5 rounded text-blue-600 focus:ring-blue-500" />
                <div>
                  <strong className="text-slate-800 block">Completion of Statutory Lock-in</strong>
                  <span className="text-slate-500">
                    The institution has completed the mandated 8 or 10-year term from initial approval.
                  </span>
                </div>
              </label>

              <label className="flex items-start space-x-2.5 p-3 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer">
                <input type="checkbox" defaultChecked className="mt-0.5 rounded text-blue-600 focus:ring-blue-500" />
                <div>
                  <strong className="text-slate-800 block">No Pending Grievances or Fee Default</strong>
                  <span className="text-slate-500">
                    No unresolved student grievance, regulatory penalty, or court stay order exists against the institute.
                  </span>
                </div>
              </label>

              <label className="flex items-start space-x-2.5 p-3 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer">
                <input type="checkbox" defaultChecked className="mt-0.5 rounded text-blue-600 focus:ring-blue-500" />
                <div>
                  <strong className="text-slate-800 block">Accreditation & EOA Standing</strong>
                  <span className="text-slate-500">
                    Extension of Approval has been maintained continuously across the deposit term.
                  </span>
                </div>
              </label>
            </div>

            <div className="pt-6 flex justify-between">
              <button
                onClick={() => setCurrentStep(1)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg"
              >
                Back
              </button>
              <button
                onClick={() => setCurrentStep(3)}
                className="bg-blue-700 hover:bg-blue-800 text-white font-semibold text-xs px-5 py-2.5 rounded-lg shadow-xs"
              >
                Continue to Evidence
              </button>
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-4 max-w-xl mx-auto">
            <h3 className="text-base font-bold text-slate-900">Step 3: Attach Mandatory Evidence Files</h3>
            <p className="text-xs text-slate-500">Verify file attachments to be transmitted with formal docket.</p>

            <div className="space-y-3 pt-2 text-xs">
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <FileCheck className="w-4 h-4 text-emerald-600" />
                  <span className="font-bold text-emerald-950">Original FDR Scan ({targetFdr.fdrNumber}.pdf)</span>
                </div>
                <span className="text-[10px] bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded font-bold">Attached</span>
              </div>

              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <FileCheck className="w-4 h-4 text-emerald-600" />
                  <span className="font-bold text-emerald-950">Board Mandate Resolution.pdf</span>
                </div>
                <span className="text-[10px] bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded font-bold">Attached</span>
              </div>

              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <FileCheck className="w-4 h-4 text-emerald-600" />
                  <span className="font-bold text-emerald-950">Attested Bank Non-Encumbrance Letter (Form 1.4g).pdf</span>
                </div>
                <span className="text-[10px] bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded font-bold">Attached</span>
              </div>
            </div>

            <div className="pt-6 flex justify-between">
              <button
                onClick={() => setCurrentStep(2)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg"
              >
                Back
              </button>
              <button
                onClick={() => setCurrentStep(4)}
                className="bg-blue-700 hover:bg-blue-800 text-white font-semibold text-xs px-5 py-2.5 rounded-lg shadow-xs"
              >
                Review & Confirm
              </button>
            </div>
          </div>
        )}

        {currentStep === 4 && (
          <div className="space-y-4 max-w-xl mx-auto">
            <h3 className="text-base font-bold text-slate-900">Step 4: Formal Request Summary & Sign-off</h3>
            <p className="text-xs text-slate-500">
              Please review the docket parameters before transmitting your application to Council officials.
            </p>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs space-y-2.5">
              <div className="flex justify-between py-1 border-b border-slate-200/60">
                <span className="text-slate-500">Institution:</span>
                <span className="font-bold text-slate-900">{institution.name}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200/60">
                <span className="text-slate-500">FDR Reference:</span>
                <span className="font-mono font-bold text-slate-900">{targetFdr.fdrNumber}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200/60">
                <span className="text-slate-500">Principal Deposit:</span>
                <span className="font-bold text-slate-900 font-mono">{formatINR(targetFdr.amount)}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200/60">
                <span className="text-slate-500">Maturity Date:</span>
                <span className="text-slate-800 font-semibold">{targetFdr.maturityDate}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">Assigned Council Routing:</span>
                <span className="text-blue-800 font-bold">AICTE {institution.region} RO & Bureau VI</span>
              </div>
            </div>

            <div className="pt-6 flex justify-between items-center">
              <button
                onClick={() => setCurrentStep(3)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg"
              >
                Back
              </button>
              <button
                onClick={handleFinalSubmit}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-6 py-2.5 rounded-lg shadow-md transition flex items-center space-x-2"
              >
                <Send className="w-4 h-4" />
                <span>Confirm & Generate Request ID</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
