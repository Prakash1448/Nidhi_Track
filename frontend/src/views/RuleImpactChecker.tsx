import React from 'react';
import { 
  GitBranch, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight, 
  Layers, 
  ShieldAlert, 
  Sparkles,
  Info
} from 'lucide-react';
import { ReleaseRequest, Institution, FdrRecord } from '../types';

interface RuleImpactCheckerProps {
  requests: ReleaseRequest[];
  institutions: Institution[];
  fdrs: FdrRecord[];
  onShowToast: (title: string, message: string) => void;
}

export const RuleImpactChecker: React.FC<RuleImpactCheckerProps> = ({
  requests,
  institutions,
  fdrs,
  onShowToast,
}) => {
  const openCases = requests.filter((r) => !r.status.includes('Closed'));

  const handleSimulateActivation = () => {
    onShowToast(
      'Simulated Rulebook Activated',
      'The illustrative amendment has been staged with a 45-day transitional SFMS grace provision for open cases.'
    );
  };

  const handleFlagCase = (reqId: string) => {
    onShowToast(
      'Case Flagged for Review',
      `Case ${reqId} tagged for supervisory transitional evaluation.`
    );
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <div>
          <div className="flex items-center space-x-2 text-xs text-purple-700 font-semibold mb-1">
            <span>AICTE Council Administration</span>
            <span>/</span>
            <span>Governance & Norms Engine</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Rule Change Impact Checker & Simulation Engine
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Test illustrative APH amendments, run impact diffs across active applications, and stage transitional provisions.
          </p>
        </div>
        <span className="bg-purple-100 text-purple-900 font-bold text-xs px-3 py-1 rounded-md border border-purple-200">
          Cross-Workflow Sandbox
        </span>
      </div>

      {/* Side-by-Side Version Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Active In-Force Version */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Current In-Force Edition
            </span>
            <span className="text-xs bg-emerald-50 text-emerald-800 font-bold px-2 py-0.5 rounded border border-emerald-200">
              APH 2024-27
            </span>
          </div>
          <div className="space-y-2.5 text-xs text-slate-700">
            <p><strong>Mandatory Lock-in Tenure:</strong> 8 Years for private technical colleges.</p>
            <p><strong>Bank Guarantee & Lien Mode:</strong> Physical FDR paper receipt + Joint pledge endorsement copy.</p>
            <p><strong>Transitional Clause:</strong> Existing physical instruments remain valid until natural maturity; renewals must adhere to digital lien register.</p>
          </div>
        </div>

        {/* Proposed Draft Amendment */}
        <div className="bg-purple-50/50 p-5 rounded-2xl border-2 border-purple-300 shadow-xs">
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-900">
              Proposed Draft Amendment (Simulation)
            </span>
            <span className="text-xs bg-purple-200 text-purple-900 font-bold px-2 py-0.5 rounded">
              Draft APH 2027
            </span>
          </div>
          <div className="space-y-2.5 text-xs text-slate-800">
            <p><strong>Proposed Mandate:</strong> Mandatory automated SFMS e-pledge verification directly with bank core systems prior to 60 days before maturity.</p>
            <p><strong>Proposed Effective Date:</strong> 01 January 2027</p>
            <p><strong>Transitional Grace:</strong> Colleges with FDRs maturing within 90 days are granted a 45-day provisional grace for physical verification.</p>
          </div>
        </div>
      </div>

      {/* System Impact Diff Table */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-bold text-slate-900 text-sm">System Impact Diff on Open Applications</h3>
            <p className="text-xs text-slate-500">Simulating how the proposed amendment alters compliance for active cases</p>
          </div>
          <span className="text-xs font-bold text-rose-800 bg-rose-50 px-2.5 py-1 rounded border border-rose-200">
            {openCases.length} Active Applications Potentially Affected
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold text-[10px] uppercase">
                <th className="py-2.5 px-3">Case ID</th>
                <th className="py-2.5 px-3">Institution</th>
                <th className="py-2.5 px-3">FDR Ref</th>
                <th className="py-2.5 px-3">Current Status</th>
                <th className="py-2.5 px-3">Predicted Rule Impact</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {openCases.map((req) => {
                const inst = institutions.find((i) => i.id === req.institutionId);
                const fdr = fdrs.find((f) => f.id === req.fdrId);

                return (
                  <tr key={req.id} className="hover:bg-slate-50">
                    <td className="py-2.5 px-3 font-mono font-bold text-blue-900">{req.id}</td>
                    <td className="py-2.5 px-3 font-semibold text-slate-800">{inst?.name}</td>
                    <td className="py-2.5 px-3 font-mono">{fdr?.fdrNumber || req.fdrId}</td>
                    <td className="py-2.5 px-3">{req.status}</td>
                    <td className="py-2.5 px-3">
                      <span className="text-[11px] text-purple-900 font-medium bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                        Subject to 45-day transitional SFMS verification grace
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <button
                        onClick={() => handleFlagCase(req.id)}
                        className="px-2.5 py-1 bg-white border border-slate-300 hover:border-purple-600 text-purple-700 rounded text-xs font-semibold"
                      >
                        Flag for Review
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-3">
          <span className="text-xs text-slate-500">
            <Info className="w-3.5 h-3.5 inline mr-1 text-slate-400" />
            Amendments do not apply retroactively without authorized transitional provisions.
          </span>
          <button
            onClick={handleSimulateActivation}
            className="px-4 py-2 bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center space-x-1.5"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Simulate Activating Rulebook Update</span>
          </button>
        </div>
      </div>
    </div>
  );
};
