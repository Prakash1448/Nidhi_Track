import React, { useState } from 'react';
import { 
  X, 
  ChevronRight, 
  ChevronLeft, 
  PlayCircle, 
  CheckCircle2, 
  ExternalLink,
  Sparkles,
  Building2,
  Landmark,
  ShieldCheck,
  FileSpreadsheet,
  FileCheck2,
  GitPullRequest,
  CheckSquare2
} from 'lucide-react';
import { NavPage, Role } from '../../types';

interface WalkthroughModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (page: NavPage) => void;
  onRoleChange: (role: Role) => void;
}

export const WalkthroughModal: React.FC<WalkthroughModalProps> = ({
  isOpen,
  onClose,
  onNavigate,
  onRoleChange,
}) => {
  const [currentStep, setCurrentStep] = useState(0);

  if (!isOpen) return null;

  const steps = [
    {
      title: "1. Problem Statement Context (SIH26265)",
      role: 'institution' as Role,
      targetPage: 'dashboard' as NavPage,
      icon: Sparkles,
      content: (
        <div className="space-y-3">
          <p>
            Welcome to the prototype for <strong>SIH26265 — Streamline of Security Deposit / FDR Portal</strong> for the <strong>All India Council for Technical Education (AICTE)</strong>.
          </p>
          <div className="bg-blue-50 p-3 rounded-lg border border-blue-200 text-xs text-blue-900 leading-relaxed">
            <strong>The Core Challenge:</strong> Thousands of engineering, management, and polytechnic colleges maintain mandatory Fixed Deposit Receipts (FDRs) pledged jointly with AICTE for 8 or 10-year lock-in tenures. Historically, tracking maturities, replacements, bank liens, and multi-bureau clearances was slow and fragmented.
          </div>
          <p className="text-slate-600">
            This platform solves this by providing dual-role transparency, automated pre-submission readiness checks, and digital end-to-end clearance.
          </p>
        </div>
      )
    },
    {
      title: "2. Dual Role Architecture",
      role: 'institution' as Role,
      targetPage: 'dashboard' as NavPage,
      icon: Building2,
      content: (
        <div className="space-y-3">
          <p>
            The portal features two synchronized personas, switchable in one click from the header:
          </p>
          <div className="grid grid-cols-2 gap-3 pt-1">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
              <span className="font-bold text-blue-800 flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5" /> Institution Self-Service
              </span>
              <p className="text-[11px] text-slate-500 mt-1">
                Colleges manage FDR instruments, run diagnostic scans, resolve bank discrepancies, and track release stages.
              </p>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
              <span className="font-bold text-indigo-800 flex items-center gap-1">
                <Landmark className="w-3.5 h-3.5" /> AICTE Council Portal
              </span>
              <p className="text-[11px] text-slate-500 mt-1">
                Regional officers and Competent Authorities monitor national exposure, prioritize urgent cases, and issue Form-F NOCs.
              </p>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "3. 30-Day Critical Maturity Alerts",
      role: 'institution' as Role,
      targetPage: 'dashboard' as NavPage,
      icon: CheckCircle2,
      content: (
        <div className="space-y-3">
          <p>
            On the <strong>Institution Dashboard</strong>, colleges receive prominent alerts when an FDR enters its critical 30-day maturity window.
          </p>
          <p className="text-slate-600 text-xs">
            For example, <strong>Apex Institute of Technology</strong> has FDR <code>PUNB00291048201</code> (₹35,00,000) maturing in 22 days. The system immediately prompts them to run a diagnostic to prevent interest lapse.
          </p>
        </div>
      )
    },
    {
      title: "4. Dynamic Classification & Operational Scenarios",
      role: 'institution' as Role,
      targetPage: 'classification' as NavPage,
      icon: FileSpreadsheet,
      content: (
        <div className="space-y-3">
          <p>
            Under <strong>Classification & Profile</strong>, institutions select their operational intent:
          </p>
          <ul className="list-disc list-inside space-y-1 text-slate-600 text-xs">
            <li><strong>Routine FDR Management:</strong> Track active pledges and branch updates.</li>
            <li><strong>Preliminary Release Diagnostic:</strong> Pre-submission sanity scan.</li>
            <li><strong>Formal Release Request:</strong> Multi-step statutory submission.</li>
            <li><strong>Audit & Historical Records:</strong> Preserved rollover lineage.</li>
          </ul>
        </div>
      )
    },
    {
      title: "5. Tailored Statutory Checklist",
      role: 'institution' as Role,
      targetPage: 'checklist' as NavPage,
      icon: CheckSquare2,
      content: (
        <div className="space-y-3">
          <p>
            In the <strong>Tailored Requirements</strong> module, the checklist compiles dynamically according to the college category and Approval Process Handbook (APH) clause:
          </p>
          <p className="text-slate-600 text-xs">
            Requirements include the original FDR scan (Clause 1.4b), attested non-encumbrance certificate (Clause 1.4g), trust board resolution, and Form-1 stamp paper affidavit. You can simulate uploading sample documents.
          </p>
        </div>
      )
    },
    {
      title: "6. FDR Lifecycle Register & Lineage Graph",
      role: 'institution' as Role,
      targetPage: 'register' as NavPage,
      icon: GitPullRequest,
      content: (
        <div className="space-y-3">
          <p>
            The <strong>FDR Lifecycle Register</strong> maintains an immutable audit trail.
          </p>
          <p className="text-slate-600 text-xs">
            <strong>Key Innovation:</strong> When an older instrument (e.g. <code>UBIN053219010</code>) is rolled over into a new instrument (<code>BARB0VJWAKH1</code>), the system links the replacement without breaking historical lineage.
          </p>
        </div>
      )
    },
    {
      title: "7. Verification Workspace with Mock OCR",
      role: 'institution' as Role,
      targetPage: 'verification' as NavPage,
      icon: FileCheck2,
      content: (
        <div className="space-y-3">
          <p>
            The <strong>Document & Evidence Verification Workspace</strong> features a split view:
          </p>
          <ul className="list-disc list-inside space-y-1 text-slate-600 text-xs">
            <li>Left: High-fidelity document certificate preview.</li>
            <li>Right: Field-by-field OCR comparison matching FDR numbers, principal, tenure, and bank confirmation status against the master ledger.</li>
          </ul>
        </div>
      )
    },
    {
      title: "8. Preliminary Release Readiness Diagnostic (Star Feature)",
      role: 'institution' as Role,
      targetPage: 'readiness' as NavPage,
      icon: Sparkles,
      content: (
        <div className="space-y-3">
          <p>
            The <strong>Star Feature</strong> is an automated pre-submission gap-analysis engine.
          </p>
          <p className="text-slate-600 text-xs">
            It checks lock-in completion, non-encumbrance attestation, and EOA status. It outputs a clear determination (e.g., <em>Action Required</em> vs <em>Ready for Formal Application Preparation</em>) and provides a <strong>Printable Official Diagnostic Report</strong> with mandatory statutory disclaimer.
          </p>
        </div>
      )
    },
    {
      title: "9. Formal Release Request Wizard",
      role: 'institution' as Role,
      targetPage: 'formalRequest' as NavPage,
      icon: ShieldCheck,
      content: (
        <div className="space-y-3">
          <p>
            The <strong>4-Step Application Wizard</strong> allows institutions to affirm regulatory conditions, attach verified evidence, review the dossier, and generate an official reference ID (e.g. <code>REQ-2026-8812</code>).
          </p>
        </div>
      )
    },
    {
      title: "10. Real-Time 6-Stage Request Tracker",
      role: 'institution' as Role,
      targetPage: 'tracking' as NavPage,
      icon: GitPullRequest,
      content: (
        <div className="space-y-3">
          <p>
            Applications are tracked through all 6 transparent administrative stations:
          </p>
          <p className="text-slate-600 text-xs">
            1. Request Submitted → 2. Completeness Check → 3. Regional Office Verification → 4. Cross-Bureau Clearance → 5. Authorised Council Review → 6. Final Outcome & Form-F NOC.
          </p>
        </div>
      )
    },
    {
      title: "11. Council Executive Portal & Priority Queue",
      role: 'council' as Role,
      targetPage: 'councilDashboard' as NavPage,
      icon: Landmark,
      content: (
        <div className="space-y-3">
          <p>
            Switch to the <strong>AICTE Council Portal</strong>:
          </p>
          <p className="text-slate-600 text-xs">
            Officials inspect national maturity distribution charts, bottleneck monitors, and an <strong>Intelligent Case Prioritisation Queue</strong> that ranks applications by urgency, overdue SLA, and risk of interest loss.
          </p>
        </div>
      )
    },
    {
      title: "12. Decisioning & Rule Impact Checker",
      role: 'council' as Role,
      targetPage: 'decision' as NavPage,
      icon: ShieldCheck,
      content: (
        <div className="space-y-3">
          <p>
            <strong>Statutory Outcome:</strong> The Competent Authority can review completed clearances and generate an official Form-F Discharge NOC with digital reference and SFMS bank release dispatch.
          </p>
          <p className="text-slate-600 text-xs">
            <strong>Cross-Workflow Rule Impact Checker:</strong> Council administrators can test proposed APH amendments (e.g. direct SFMS e-pledge mandate), preview impact diffs on open cases, and stage transitional grace periods.
          </p>
        </div>
      )
    }
  ];

  const step = steps[currentStep];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleJumpToScreen = () => {
    onRoleChange(step.role);
    onNavigate(step.targetPage);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Top Bar */}
        <div className="bg-slate-900 text-white px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <PlayCircle className="w-5 h-5 text-blue-400" />
            <h3 className="font-bold text-sm tracking-tight">
              SIH26265 Walkthrough Guide ({currentStep + 1} of {steps.length})
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Progress Bar */}
        <div className="w-full bg-slate-100 h-1.5">
          <div
            className="bg-blue-600 h-1.5 transition-all duration-300"
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          />
        </div>

        {/* Step Content */}
        <div className="p-6 space-y-4 text-xs text-slate-700">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-blue-100 text-blue-800 rounded-lg">
              <step.icon className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-slate-900">
              {step.title}
            </h4>
          </div>

          <div className="py-2">
            {step.content}
          </div>
        </div>

        {/* Modal Bottom Actions */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex justify-between items-center text-xs">
          <button
            onClick={handleJumpToScreen}
            className="text-blue-700 hover:text-blue-900 font-bold flex items-center space-x-1"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Jump Directly to this Screen</span>
          </button>

          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrev}
              disabled={currentStep === 0}
              className="px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 font-semibold hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed flex items-center space-x-1"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back</span>
            </button>

            {currentStep < steps.length - 1 ? (
              <button
                onClick={handleNext}
                className="px-4 py-1.5 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded-lg shadow-xs flex items-center space-x-1"
              >
                <span>Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={onClose}
                className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg shadow-xs"
              >
                Complete Tour
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
