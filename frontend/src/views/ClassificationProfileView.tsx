import React from 'react';
import { 
  Shield, 
  Sparkles, 
  Send, 
  History, 
  CheckCircle2, 
  ArrowRight, 
  Building2, 
  GraduationCap 
} from 'lucide-react';
import { Institution, NavPage } from '../types';

interface ClassificationProfileViewProps {
  institution: Institution;
  onNavigate: (page: NavPage) => void;
}

export const ClassificationProfileView: React.FC<ClassificationProfileViewProps> = ({
  institution,
  onNavigate,
}) => {
  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 pb-4">
        <div className="flex items-center space-x-2 text-xs text-slate-500 mb-1">
          <span>Institution Portal</span>
          <span>/</span>
          <span className="text-blue-700 font-semibold">Classification & Scenarios</span>
        </div>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">
          Institution Profile & Regulatory Classification
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Select your operational scenario to load dynamic statutory requirements per the AICTE Approval Process Handbook (APH).
        </p>
      </div>

      {/* Operational Intent Scenario Cards */}
      <div>
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
          Select Operational Intent
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Scenario 1 */}
          <div
            onClick={() => onNavigate('register')}
            className="border-2 border-blue-600 bg-blue-50/50 p-4 rounded-xl cursor-pointer transition shadow-xs hover:shadow-md"
          >
            <div className="w-8 h-8 rounded-lg bg-blue-700 text-white flex items-center justify-center mb-3">
              <Shield className="w-4 h-4" />
            </div>
            <h4 className="font-bold text-slate-900 text-sm">Routine FDR Management</h4>
            <p className="text-xs text-slate-600 mt-1">
              Monitor active pledge status, branch updates, renewal tracking, and rollover records.
            </p>
            <span className="inline-block mt-3 text-[10px] font-bold text-blue-800 bg-blue-100 px-2 py-0.5 rounded">
              Active Scenario
            </span>
          </div>

          {/* Scenario 2 */}
          <div
            onClick={() => onNavigate('readiness')}
            className="border border-slate-200 bg-white hover:border-amber-400 p-4 rounded-xl cursor-pointer transition shadow-xs hover:shadow-md"
          >
            <div className="w-8 h-8 rounded-lg bg-amber-500 text-white flex items-center justify-center mb-3">
              <Sparkles className="w-4 h-4" />
            </div>
            <h4 className="font-bold text-slate-900 text-sm">Preliminary Release Diagnostic</h4>
            <p className="text-xs text-slate-600 mt-1">
              Pre-submission sanity scan: Identify missing affidavits, IFSC issues, and unverified encumbrance.
            </p>
            <span className="inline-block mt-3 text-[10px] font-semibold text-slate-500">
              Recommended Next Step
            </span>
          </div>

          {/* Scenario 3 */}
          <div
            onClick={() => onNavigate('formalRequest')}
            className="border border-slate-200 bg-white hover:border-emerald-400 p-4 rounded-xl cursor-pointer transition shadow-xs hover:shadow-md"
          >
            <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center mb-3">
              <Send className="w-4 h-4" />
            </div>
            <h4 className="font-bold text-slate-900 text-sm">Formal Release Request</h4>
            <p className="text-xs text-slate-600 mt-1">
              Generate 4-step formal submission for Council review, NOC generation, or RTGS refund.
            </p>
            <span className="inline-block mt-3 text-[10px] font-semibold text-slate-500">
              Post Maturity Completion
            </span>
          </div>

          {/* Scenario 4 */}
          <div
            onClick={() => onNavigate('tracking')}
            className="border border-slate-200 bg-white hover:border-purple-400 p-4 rounded-xl cursor-pointer transition shadow-xs hover:shadow-md"
          >
            <div className="w-8 h-8 rounded-lg bg-purple-600 text-white flex items-center justify-center mb-3">
              <History className="w-4 h-4" />
            </div>
            <h4 className="font-bold text-slate-900 text-sm">Audit & Past Request Trail</h4>
            <p className="text-xs text-slate-600 mt-1">
              View previous NOC letters, discharged instruments, archival history, and bureau notes.
            </p>
            <span className="inline-block mt-3 text-[10px] font-semibold text-slate-500">
              History Log
            </span>
          </div>
        </div>
      </div>

      {/* Institution Regulatory Profile Dossier */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-2">
            <Building2 className="w-5 h-5 text-blue-700" />
            <h3 className="font-bold text-slate-900 text-base">Permanent Regulatory Dossier Details</h3>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
            EOA Active (2026-27)
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
          <div className="space-y-3">
            <div>
              <span className="text-slate-400 block font-semibold text-[10px] uppercase">Legal Institution Name</span>
              <span className="font-bold text-slate-900 text-sm">{institution.name}</span>
            </div>
            <div>
              <span className="text-slate-400 block font-semibold text-[10px] uppercase">Permanent AICTE Application ID</span>
              <span className="font-mono text-slate-900 font-bold">{institution.code}</span>
            </div>
            <div>
              <span className="text-slate-400 block font-semibold text-[10px] uppercase">Affiliated Programs</span>
              <span className="text-slate-700">{institution.courses.join(', ')}</span>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <span className="text-slate-400 block font-semibold text-[10px] uppercase">Institution Category</span>
              <span className="text-slate-800 font-medium">{institution.category}</span>
            </div>
            <div>
              <span className="text-slate-400 block font-semibold text-[10px] uppercase">Jurisdiction Regional Office</span>
              <span className="text-slate-800 font-medium">{institution.region}</span>
            </div>
            <div>
              <span className="text-slate-400 block font-semibold text-[10px] uppercase">Year of Establishment</span>
              <span className="text-slate-800 font-medium">
                {institution.establishmentYear} ({2026 - institution.establishmentYear} Years of Operation)
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <span className="text-slate-400 block font-semibold text-[10px] uppercase">Approved Annual Intake</span>
              <span className="text-slate-800 font-bold text-sm">{institution.approvedIntake} Student Seats</span>
            </div>
            <div>
              <span className="text-slate-400 block font-semibold text-[10px] uppercase">Designated Nodal Officer</span>
              <span className="text-slate-800 font-medium">{institution.nodalOfficer}</span>
            </div>
            <div>
              <span className="text-slate-400 block font-semibold text-[10px] uppercase">Contact Details</span>
              <span className="text-slate-800 font-medium">{institution.contactEmail} | {institution.phone}</span>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-xs text-slate-500">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 inline mr-1" />
            Security Deposit / FDR obligation is calculated according to norms in Chapter 1 of the AICTE Approval Process Handbook.
          </p>
          <button
            onClick={() => onNavigate('checklist')}
            className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-lg text-xs font-semibold shadow-xs transition flex items-center space-x-1"
          >
            <span>View Tailored Requirements</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
