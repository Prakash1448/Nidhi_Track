import React from 'react';
import { 
  Sparkles, 
  Plus, 
  Clock, 
  Layers, 
  ShieldCheck, 
  Bell, 
  AlertCircle, 
  GitPullRequest, 
  FileWarning, 
  RefreshCw, 
  CheckCheck,
  Building2,
  ArrowRight
} from 'lucide-react';
import { Institution, FdrRecord, ReleaseRequest, NavPage } from '../types';
import { formatINR } from '../utils/formatters';

interface InstitutionDashboardProps {
  institution: Institution;
  fdrs: FdrRecord[];
  requests: ReleaseRequest[];
  onNavigate: (page: NavPage) => void;
  onRunDiagnostic: (fdrId: string) => void;
  onOpenFdrDossier: (fdrId: string) => void;
}

export const InstitutionDashboard: React.FC<InstitutionDashboardProps> = ({
  institution,
  fdrs,
  requests,
  onNavigate,
  onRunDiagnostic,
  onOpenFdrDossier,
}) => {
  const myFdrs = fdrs.filter((f) => f.institutionId === institution.id);
  const myRequests = requests.filter((r) => r.institutionId === institution.id);

  const totalFdrs = myFdrs.length;
  const activeFdrs = myFdrs.filter((f) => f.status === 'Active').length;
  const maturingSoon = myFdrs.filter((f) => f.status === 'Maturing Soon').length;
  const matured = myFdrs.filter((f) => f.status === 'Matured').length;
  const requestsInProgress = myRequests.filter((r) => !r.status.includes('Closed')).length;
  const totalAmount = myFdrs.reduce((acc, curr) => acc + curr.amount, 0);

  // Urgent instrument (if any)
  const urgentFdr = myFdrs.find((f) => f.status === 'Maturing Soon');

  return (
    <div className="space-y-6">
      {/* Page Header & Institution Dossier Banner */}
      <div className="bg-gradient-to-r from-blue-950 via-blue-900 to-indigo-900 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-80 bg-white/5 rounded-full blur-3xl transform translate-x-20 -translate-y-20 pointer-events-none" />
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 relative z-10">
          <div>
            <div className="flex items-center space-x-2">
              <span className="bg-blue-500/30 text-blue-100 text-[11px] font-semibold px-2.5 py-0.5 rounded-full border border-blue-400/30 flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5" /> Self-Service College Workspace
              </span>
              <span className="text-xs text-blue-200 hidden sm:inline">
                Session Ref: AICTE-{institution.region.slice(0, 2).toUpperCase()}-{institution.code.slice(-4)}
              </span>
            </div>
            <h1 className="text-2xl font-extrabold mt-1.5 tracking-tight text-white">
              {institution.name}
            </h1>
            <p className="text-xs text-blue-200 mt-0.5">
              Permanent AICTE Code: <span className="font-mono font-bold text-white">{institution.code}</span> • Region: {institution.region} • Category: {institution.category}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => {
                if (urgentFdr) onRunDiagnostic(urgentFdr.id);
                else onNavigate('readiness');
              }}
              className="bg-amber-400 hover:bg-amber-500 text-slate-900 font-bold px-4 py-2 rounded-xl text-xs flex items-center space-x-1.5 shadow-md transition transform active:scale-95"
            >
              <Sparkles className="w-4 h-4 text-slate-900" />
              <span>Preliminary Readiness Check</span>
            </button>
            <button
              onClick={() => onNavigate('formalRequest')}
              className="bg-white/10 hover:bg-white/20 text-white font-semibold px-3.5 py-2 rounded-xl text-xs flex items-center space-x-1.5 transition border border-white/20"
            >
              <Plus className="w-4 h-4" />
              <span>New Release Request</span>
            </button>
          </div>
        </div>
      </div>

      {/* Critical 30-Day Maturity Callout Banner */}
      {urgentFdr && (
        <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-xl shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
          <div className="flex items-start space-x-3">
            <div className="p-2 bg-amber-100 rounded-lg text-amber-800 shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-amber-950 flex items-center gap-2">
                Urgent Action: FDR Reaching Maturity within 30 Days
                <span className="text-[10px] bg-amber-200 text-amber-900 px-2 py-0.2 rounded-full uppercase tracking-wider font-extrabold">
                  Time Sensitive
                </span>
              </h4>
              <p className="text-xs text-amber-900 mt-0.5 leading-relaxed">
                FDR <strong className="font-mono">{urgentFdr.fdrNumber}</strong> ({formatINR(urgentFdr.amount)}) from {urgentFdr.bankName} matures on{' '}
                <strong>{urgentFdr.maturityDate}</strong>. Run a pre-submission diagnostic to resolve gaps and avoid regulatory forfeiture.
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2 shrink-0">
            <button
              onClick={() => onRunDiagnostic(urgentFdr.id)}
              className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs px-4 py-2 rounded-lg shadow-xs transition"
            >
              Run Release Diagnostic &rarr;
            </button>
          </div>
        </div>
      )}

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Total FDRs */}
        <div
          onClick={() => onNavigate('register')}
          className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs hover:shadow-md hover:border-blue-400 cursor-pointer transition"
        >
          <div className="flex justify-between items-center text-slate-500 mb-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Total FDRs</span>
            <Layers className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 tabular-nums">{totalFdrs}</div>
          <span className="text-[10px] text-slate-500 font-medium block truncate font-mono">
            {formatINR(totalAmount)}
          </span>
        </div>

        {/* Active Pledges */}
        <div
          onClick={() => onNavigate('register')}
          className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs hover:shadow-md hover:border-emerald-400 cursor-pointer transition"
        >
          <div className="flex justify-between items-center text-slate-500 mb-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Active Liens</span>
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-extrabold text-emerald-700 tabular-nums">{activeFdrs}</div>
          <span className="text-[10px] text-emerald-600 font-medium">Compliant Hold</span>
        </div>

        {/* Maturing Soon */}
        <div
          onClick={() => onNavigate('register')}
          className="bg-white p-4 rounded-xl border border-amber-200 bg-amber-50/30 shadow-xs hover:shadow-md hover:border-amber-400 cursor-pointer transition"
        >
          <div className="flex justify-between items-center text-amber-700 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">&lt; 90 Days</span>
            <Bell className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-extrabold text-amber-700 tabular-nums">{maturingSoon}</div>
          <span className="text-[10px] text-amber-700 font-medium">Attention Req</span>
        </div>

        {/* Matured */}
        <div
          onClick={() => onNavigate('register')}
          className="bg-white p-4 rounded-xl border border-rose-200 bg-rose-50/20 shadow-xs hover:shadow-md hover:border-rose-400 cursor-pointer transition"
        >
          <div className="flex justify-between items-center text-rose-700 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">Matured</span>
            <AlertCircle className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-2xl font-extrabold text-rose-700 tabular-nums">{matured}</div>
          <span className="text-[10px] text-rose-600 font-medium">Release Eligible</span>
        </div>

        {/* Requests in Progress */}
        <div
          onClick={() => onNavigate('tracking')}
          className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs hover:shadow-md hover:border-blue-400 cursor-pointer transition"
        >
          <div className="flex justify-between items-center text-slate-500 mb-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider">In Review</span>
            <GitPullRequest className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 tabular-nums">{requestsInProgress}</div>
          <span className="text-[10px] text-blue-600 font-medium">Active Applications</span>
        </div>

        {/* Diagnostic Gaps */}
        <div
          onClick={() => onNavigate('readiness')}
          className="bg-white p-4 rounded-xl border border-purple-200 bg-purple-50/30 shadow-xs hover:shadow-md hover:border-purple-400 cursor-pointer transition"
        >
          <div className="flex justify-between items-center text-purple-700 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">Gap Checks</span>
            <Sparkles className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl font-extrabold text-purple-700 tabular-nums">1</div>
          <span className="text-[10px] text-purple-600 font-medium">Items Pending</span>
        </div>
      </div>

      {/* Visual Timeline and Actionable Intelligence Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* SVG Maturity Distribution Chart */}
        <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">FDR Maturity Timeline & Capital Distribution</h3>
              <p className="text-xs text-slate-500">Scheduled releases mapped to statutory AICTE lock-in periods</p>
            </div>
            <span className="text-[11px] text-blue-800 font-semibold bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200">
              Live Forecast
            </span>
          </div>

          {/* Clean Responsive SVG Bar Chart */}
          <div className="w-full pt-4">
            <div className="h-52 flex items-end justify-between gap-4 px-4 pb-4 border-b border-slate-200">
              {/* Bar 1: Matured */}
              <div className="flex-1 flex flex-col items-center gap-2 group">
                <span className="text-[11px] font-mono font-bold text-rose-700">₹15L</span>
                <div 
                  className="w-full max-w-[56px] bg-rose-500 hover:bg-rose-600 rounded-t-lg transition-all"
                  style={{ height: '60px' }}
                />
                <span className="text-[11px] font-medium text-slate-600 text-center">Matured (SBI)</span>
              </div>

              {/* Bar 2: 2024-25 */}
              <div className="flex-1 flex flex-col items-center gap-2 group">
                <span className="text-[11px] font-mono font-bold text-slate-400">₹0</span>
                <div 
                  className="w-full max-w-[56px] bg-slate-200 rounded-t-lg transition-all"
                  style={{ height: '6px' }}
                />
                <span className="text-[11px] font-medium text-slate-600 text-center">2025</span>
              </div>

              {/* Bar 3: Q4 2026 (Urgent PNB) */}
              <div className="flex-1 flex flex-col items-center gap-2 group">
                <span className="text-[11px] font-mono font-bold text-amber-700">₹35L</span>
                <div 
                  className="w-full max-w-[56px] bg-amber-500 hover:bg-amber-600 rounded-t-lg transition-all shadow-md"
                  style={{ height: '140px' }}
                />
                <span className="text-[11px] font-bold text-amber-900 text-center">Nov 2026 (PNB)</span>
              </div>

              {/* Bar 4: 2028 */}
              <div className="flex-1 flex flex-col items-center gap-2 group">
                <span className="text-[11px] font-mono font-bold text-slate-400">₹0</span>
                <div 
                  className="w-full max-w-[56px] bg-slate-200 rounded-t-lg transition-all"
                  style={{ height: '6px' }}
                />
                <span className="text-[11px] font-medium text-slate-600 text-center">2028</span>
              </div>

              {/* Bar 5: 2030 (Baroda replacement) */}
              <div className="flex-1 flex flex-col items-center gap-2 group">
                <span className="text-[11px] font-mono font-bold text-emerald-700">₹25L</span>
                <div 
                  className="w-full max-w-[56px] bg-emerald-500 hover:bg-emerald-600 rounded-t-lg transition-all"
                  style={{ height: '100px' }}
                />
                <span className="text-[11px] font-medium text-slate-600 text-center">2030 (BOB)</span>
              </div>
            </div>

            <div className="flex justify-between items-center text-xs text-slate-500 pt-3">
              <span>*Bar heights represent capital principal held in joint escrow.</span>
              <span className="font-mono font-semibold text-slate-800">Total Active Portfolio: {formatINR(totalAmount)}</span>
            </div>
          </div>
        </div>

        {/* Actionable Intelligence Alerts */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-sm mb-1">Actionable Intelligence Alerts</h3>
            <p className="text-xs text-slate-500 mb-3">System-detected gaps requiring institutional action</p>

            <div className="space-y-2.5 text-xs">
              <div className="p-3 bg-rose-50 rounded-xl border border-rose-100 flex items-start space-x-2.5">
                <FileWarning className="w-4 h-4 text-rose-600 mt-0.5 shrink-0" />
                <div>
                  <p className="font-bold text-rose-900">Missing Non-Encumbrance Letter</p>
                  <p className="text-rose-700 text-[11px] mt-0.5">
                    REQ-2026-8812 requires attested certificate from PNB Nariman Point branch.
                  </p>
                  <button
                    onClick={() => onNavigate('verification')}
                    className="mt-1 text-[11px] font-bold text-rose-800 underline hover:text-rose-900"
                  >
                    Resolve in Verification Studio &rarr;
                  </button>
                </div>
              </div>

              <div className="p-3 bg-amber-50 rounded-xl border border-amber-100 flex items-start space-x-2.5">
                <RefreshCw className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                <div>
                  <p className="font-bold text-amber-900">Replacement Lineage Active</p>
                  <p className="text-amber-700 text-[11px] mt-0.5">
                    FDR-2022-8819 replaced older instrument FDR-2014-1102. Lineage preserved.
                  </p>
                  <button
                    onClick={() => onOpenFdrDossier('FDR-2022-8819')}
                    className="mt-1 text-[11px] font-bold text-amber-800 underline hover:text-amber-900"
                  >
                    Inspect Lineage Trace &rarr;
                  </button>
                </div>
              </div>

              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100 flex items-start space-x-2.5">
                <CheckCheck className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                <div>
                  <p className="font-bold text-emerald-900">EOA 2026-27 Compliant</p>
                  <p className="text-emerald-700 text-[11px] mt-0.5">
                    Extension of Approval verified with zero penal flags on security deposits.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between items-center text-xs text-slate-500">
            <span>Last audit ledger sync: <strong>Today 10:30 AM</strong></span>
            <button
              onClick={() => onNavigate('register')}
              className="font-bold text-blue-700 hover:text-blue-900 flex items-center space-x-1"
            >
              <span>View Register</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
