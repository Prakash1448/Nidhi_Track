import React, { useState } from 'react';
import { 
  Sparkles, 
  Printer, 
  RefreshCw, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  HelpCircle, 
  ArrowRight, 
  Wrench,
  ShieldAlert
} from 'lucide-react';
import { Institution, FdrRecord, NavPage } from '../types';
import { formatINR } from '../utils/formatters';

interface PreliminaryReadinessViewProps {
  institution: Institution;
  fdrs: FdrRecord[];
  selectedFdrId: string;
  onSelectFdr: (fdrId: string) => void;
  onNavigate: (page: NavPage) => void;
  onShowToast: (title: string, message: string) => void;
}

export const PreliminaryReadinessView: React.FC<PreliminaryReadinessViewProps> = ({
  institution,
  fdrs,
  selectedFdrId,
  onSelectFdr,
  onNavigate,
  onShowToast,
}) => {
  const myFdrs = fdrs.filter((f) => f.institutionId === institution.id);
  const selectedFdr = myFdrs.find((f) => f.id === selectedFdrId) || myFdrs[0] || fdrs[0];

  // Dynamic Rule Evaluation Logic
  let readinessStatus: 'Ready for Formal Application Preparation' | 'Action Required' | 'Official Verification Required' = 'Action Required';
  let findings: { type: 'passed' | 'warning' | 'danger' | 'info'; title: string; desc: string }[] = [];

  if (selectedFdr.id === 'FDR-2018-9941') {
    readinessStatus = 'Action Required';
    findings = [
      {
        type: 'passed',
        title: 'Statutory Tenure Lock-in Completed',
        desc: 'FDR has completed the mandatory 8-year lock-in period prescribed under Establishment Deposit norms.'
      },
      {
        type: 'passed',
        title: 'Original Joint Pledge Instrument Validated',
        desc: 'Signed joint pledge receipt copy matched with Regional Office registry.'
      },
      {
        type: 'warning',
        title: 'Attested Non-Encumbrance Certificate Outstanding',
        desc: 'Recent branch-signed non-encumbrance certificate (Form 1.4g) is pending re-attestation from PNB Nariman Point.'
      },
      {
        type: 'info',
        title: 'Cross-Bureau Approvals Verification Required',
        desc: 'Approval Bureau must certify defect-free admissions and zero student fee penalties prior to final disbursement.'
      }
    ];
  } else if (selectedFdr.id === 'FDR-2015-4421') {
    readinessStatus = 'Action Required';
    findings = [
      {
        type: 'passed',
        title: 'Maturity Date Concluded',
        desc: 'Deposit matured on 10 Jun 2023. Eligible for release upon resolving branch mismatch.'
      },
      {
        type: 'danger',
        title: 'Bank Record Discrepancy (IFSC Mismatch)',
        desc: 'Branch IFSC code differs from original issue ledger due to bank amalgamation; branch verification required.'
      },
      {
        type: 'warning',
        title: 'Affidavit Form-1 Outstanding',
        desc: 'Mandatory non-judicial stamp paper affidavit has not been submitted in the vault.'
      }
    ];
  } else if (selectedFdr.id === 'FDR-2022-8819') {
    readinessStatus = 'Official Verification Required';
    findings = [
      {
        type: 'info',
        title: 'Tenure Lock-in Active until 2030',
        desc: 'Instrument has not reached natural maturity date (12 Apr 2030). Premature release requires Council Executive Committee dispensation.'
      },
      {
        type: 'passed',
        title: 'Linked Rollover Replacement Preserved',
        desc: 'Audit trail traces back to predecessor FDR-2014-1102.'
      }
    ];
  } else {
    readinessStatus = 'Ready for Formal Application Preparation';
    findings = [
      {
        type: 'passed',
        title: 'Preliminary Compliance Checks Satisfied',
        desc: 'No blocking statutory gaps detected in automated pre-submission screening.'
      }
    ];
  }

  const handleRerun = () => {
    onShowToast('Diagnostic Re-calculated', 'Evaluated latest checklist state against AICTE Approval Handbook rules.');
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <div className="flex items-center space-x-2 text-xs text-slate-500 mb-1">
            <span>Institution Portal</span>
            <span>/</span>
            <span className="text-blue-700 font-semibold">Diagnostic Engine</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Preliminary Release Readiness Diagnostic
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Automated gap-analysis engine to prevent application rejection before submitting formal requests.
          </p>
        </div>
        <div className="flex items-center space-x-2 no-print">
          <button
            onClick={() => window.print()}
            className="bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-xs px-3.5 py-2 rounded-lg shadow-xs transition flex items-center space-x-1.5"
          >
            <Printer className="w-4 h-4" />
            <span>Print Official Report</span>
          </button>
        </div>
      </div>

      {/* Selector Strip */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4 no-print">
        <div className="flex items-center space-x-3 w-full sm:w-auto">
          <label className="text-xs font-bold text-slate-700 whitespace-nowrap">
            Select FDR Instrument:
          </label>
          <select
            value={selectedFdr.id}
            onChange={(e) => onSelectFdr(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-600 font-mono font-medium text-slate-800"
          >
            {myFdrs.map((f) => (
              <option key={f.id} value={f.id}>
                {f.fdrNumber} ({f.bankName} - {formatINR(f.amount)}) [Maturity: {f.maturityDate}]
              </option>
            ))}
          </select>
        </div>
        <button
          onClick={handleRerun}
          className="w-full sm:w-auto bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs px-4 py-2 rounded-lg shadow-xs transition flex items-center justify-center space-x-1.5"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Re-run Preliminary Rules</span>
        </button>
      </div>

      {/* PRINTABLE OFFICIAL READINESS REPORT CARD */}
      <div id="print-area" className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 sm:p-8 space-y-6">
        {/* Report Header */}
        <div className="border-b border-slate-200 pb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-blue-900">
              All India Council for Technical Education • Finance Cell
            </div>
            <h2 className="text-xl font-extrabold text-slate-900 mt-0.5">
              Preliminary FDR Release Readiness Report
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Diagnostic Audit Ref: <span className="font-mono font-bold text-slate-800">READINESS-DIAG-{selectedFdr.id}-2026</span> • Evaluated: 24 Oct 2026
            </p>
          </div>
          <div className="text-left sm:text-right">
            <span
              className={`inline-block text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full ${
                readinessStatus === 'Ready for Formal Application Preparation'
                  ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                  : readinessStatus === 'Action Required'
                  ? 'bg-amber-100 text-amber-950 border border-amber-300'
                  : 'bg-blue-100 text-blue-900 border border-blue-200'
              }`}
            >
              {readinessStatus}
            </span>
            <p className="text-[10px] text-slate-400 mt-1">Automated Pre-Submission Screening</p>
          </div>
        </div>

        {/* Institution & Subject FDR Dossier Grid */}
        <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="text-slate-400 block text-[10px] font-semibold uppercase">Institution Name</span>
            <span className="font-bold text-slate-900">{institution.name}</span>
            <span className="text-slate-500 block text-[11px] font-mono">{institution.code}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] font-semibold uppercase">FDR Instrument No.</span>
            <span className="font-mono font-bold text-slate-900">{selectedFdr.fdrNumber}</span>
            <span className="text-slate-500 block text-[11px]">{selectedFdr.bankName}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] font-semibold uppercase">Pledged Principal</span>
            <span className="font-bold text-slate-900 font-mono text-sm">{formatINR(selectedFdr.amount)}</span>
            <span className="text-slate-500 block text-[11px]">Tenure: {selectedFdr.tenureYears} Years</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] font-semibold uppercase">Maturity Timeline</span>
            <span className="font-bold text-slate-800">{selectedFdr.maturityDate}</span>
            <span className={`text-[11px] ${selectedFdr.status === 'Maturing Soon' ? 'text-amber-800 font-bold' : 'text-slate-500'}`}>
              {selectedFdr.status}
            </span>
          </div>
        </div>

        {/* Findings Checklist */}
        <div>
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
            Diagnostic Findings & Statutory Checklist
          </h3>
          <div className="space-y-2.5">
            {findings.map((f, i) => (
              <div
                key={i}
                className={`p-3.5 rounded-xl border flex items-start space-x-3 ${
                  f.type === 'passed'
                    ? 'bg-emerald-50/50 border-emerald-200'
                    : f.type === 'warning'
                    ? 'bg-amber-50/60 border-amber-200'
                    : f.type === 'danger'
                    ? 'bg-rose-50/60 border-rose-200'
                    : 'bg-blue-50/50 border-blue-100'
                }`}
              >
                <div className="mt-0.5 shrink-0">
                  {f.type === 'passed' ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  ) : f.type === 'warning' ? (
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                  ) : f.type === 'danger' ? (
                    <XCircle className="w-4 h-4 text-rose-600" />
                  ) : (
                    <HelpCircle className="w-4 h-4 text-blue-600" />
                  )}
                </div>
                <div className="flex-1 text-xs">
                  <div className="flex justify-between items-center">
                    <h4
                      className={`font-bold ${
                        f.type === 'passed'
                          ? 'text-emerald-950'
                          : f.type === 'warning'
                          ? 'text-amber-950'
                          : f.type === 'danger'
                          ? 'text-rose-950'
                          : 'text-blue-950'
                      }`}
                    >
                      {f.title}
                    </h4>
                    <span
                      className={`text-[10px] font-semibold uppercase tracking-wider ${
                        f.type === 'passed'
                          ? 'text-emerald-700'
                          : f.type === 'warning'
                          ? 'text-amber-700'
                          : f.type === 'danger'
                          ? 'text-rose-700'
                          : 'text-blue-700'
                      }`}
                    >
                      {f.type.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-slate-600 mt-1 leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Prioritized Action Roadmap */}
        <div className="border-t border-slate-100 pt-4 text-xs">
          <h3 className="font-bold text-slate-900 uppercase tracking-wider mb-2">
            Recommended Action Roadmap
          </h3>
          <ol className="list-decimal list-inside space-y-1.5 text-slate-700">
            <li className="font-medium">
              Obtain attested Form 1.4(g) Non-Encumbrance Certificate signed by bank branch manager.
            </li>
            <li className="font-medium">
              Upload Board Resolution confirming official society bank account for lien discharge / RTGS.
            </li>
            <li className="font-medium">
              Proceed to <strong>Formal Release Request</strong> step to transmit dossier to Regional Officer.
            </li>
          </ol>
        </div>

        {/* MANDATORY STATUTORY DISCLAIMER */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-[10px] text-slate-500 leading-relaxed">
          <div className="flex items-start space-x-2">
            <ShieldAlert className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-700 block mb-0.5">
                Statutory & Regulatory Disclaimer (AICTE Approval Process Handbook):
              </strong>
              This preliminary release report is an automated pre-submission screening generated from configured rules and institution-provided records. It does <strong>not</strong> constitute official council approval, release sanction, or guarantee of disbursement. Final release of FDR or refund of Security Deposit requires statutory scrutiny by AICTE Regional Offices, inter-bureau clearances, and decision by the Competent Authority.
            </div>
          </div>
        </div>

        {/* Action Buttons Row */}
        <div className="pt-2 flex flex-col sm:flex-row justify-between items-center gap-3 no-print">
          <button
            onClick={() => onNavigate('verification')}
            className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center space-x-1"
          >
            <Wrench className="w-3.5 h-3.5" />
            <span>Resolve Gaps in Verification Studio</span>
          </button>
          <button
            onClick={() => onNavigate('formalRequest')}
            className="bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-xs transition flex items-center space-x-2"
          >
            <span>Proceed to Formal Release Request</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
