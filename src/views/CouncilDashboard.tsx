import React from 'react';
import { 
  Flame, 
  ShieldCheck, 
  AlertOctagon, 
  Clock, 
  Building2, 
  Layers, 
  ArrowRight, 
  ExternalLink 
} from 'lucide-react';
import { Institution, FdrRecord, ReleaseRequest, NavPage } from '../types';
import { formatINR, formatLakhs } from '../utils/formatters';

interface CouncilDashboardProps {
  institutions: Institution[];
  fdrs: FdrRecord[];
  requests: ReleaseRequest[];
  onNavigate: (page: NavPage) => void;
  onOpenCouncilAction: (reqId: string) => void;
}

export const CouncilDashboard: React.FC<CouncilDashboardProps> = ({
  institutions,
  fdrs,
  requests,
  onNavigate,
  onOpenCouncilAction,
}) => {
  const totalAmount = fdrs.reduce((a, c) => a + c.amount, 0);
  const openRequests = requests.filter((r) => !r.status.includes('Closed'));
  const overdueCount = requests.filter((r) => r.priority === 'Overdue Bottleneck').length;
  const readySignoffCount = requests.filter((r) => r.status.includes('Authorised Review')).length;

  return (
    <div className="space-y-6">
      {/* Council Executive Banner */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 relative z-10">
          <div>
            <div className="flex items-center space-x-2">
              <span className="bg-indigo-500/30 text-indigo-200 text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-indigo-400/30">
                AICTE Central Directorate • Finance & Approvals Cell
              </span>
              <span className="text-xs text-slate-400">HQ New Delhi</span>
            </div>
            <h1 className="text-2xl font-extrabold mt-1.5 tracking-tight text-white">
              Council Executive Monitoring Dashboard
            </h1>
            <p className="text-xs text-slate-300 mt-0.5">
              Statutory oversight of national institutional security deposits, maturity horizons, and inter-bureau bottlenecks.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => onNavigate('casePrioritisation')}
              className="bg-rose-500 hover:bg-rose-600 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center space-x-1.5 shadow-md transition"
            >
              <Flame className="w-4 h-4 text-white" />
              <span>Priority Case Queue</span>
            </button>
            <button
              onClick={() => onNavigate('decision')}
              className="bg-white/10 hover:bg-white/20 text-white font-semibold px-3.5 py-2 rounded-xl text-xs flex items-center space-x-1.5 transition border border-white/20"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Authorised Decisioning</span>
            </button>
          </div>
        </div>
      </div>

      {/* Council KPI Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">Affiliated Insts</div>
          <div className="text-2xl font-extrabold text-slate-900 tabular-nums">{institutions.length}</div>
          <span className="text-[10px] text-slate-500 font-medium">All 5 Regions</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">Tracked FDRs</div>
          <div className="text-2xl font-extrabold text-slate-900 tabular-nums">{fdrs.length}</div>
          <span className="text-[10px] text-indigo-700 font-semibold font-mono">Vol: {formatLakhs(totalAmount)}</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-amber-200 bg-amber-50/20 shadow-xs">
          <div className="text-[11px] font-bold uppercase tracking-wider text-amber-800 mb-1">&lt; 90d Maturity</div>
          <div className="text-2xl font-extrabold text-amber-800 tabular-nums">1</div>
          <span className="text-[10px] text-amber-700 font-medium">Urgent Audit</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-blue-200 bg-blue-50/20 shadow-xs">
          <div className="text-[11px] font-bold uppercase tracking-wider text-blue-800 mb-1">Open Requests</div>
          <div className="text-2xl font-extrabold text-blue-900 tabular-nums">{openRequests.length}</div>
          <span className="text-[10px] text-blue-700 font-medium">In Pipeline</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-rose-200 bg-rose-50/30 shadow-xs">
          <div className="text-[11px] font-bold uppercase tracking-wider text-rose-800 mb-1">Overdue Lags</div>
          <div className="text-2xl font-extrabold text-rose-700 tabular-nums">{overdueCount}</div>
          <span className="text-[10px] text-rose-700 font-bold">&gt; 30 Days Past SLA</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-emerald-200 bg-emerald-50/20 shadow-xs">
          <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 mb-1">Ready Sign-off</div>
          <div className="text-2xl font-extrabold text-emerald-800 tabular-nums">{readySignoffCount}</div>
          <span className="text-[10px] text-emerald-700 font-medium">Form-F NOC Ready</span>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Maturity Distribution */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Council-Wide FDR Maturity Distribution</h3>
              <p className="text-xs text-slate-500">Scheduled releases by maturity horizon</p>
            </div>
            <span className="text-[11px] text-indigo-800 font-semibold bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
              All Banks
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-around gap-6 pt-2">
            {/* SVG Donut Chart */}
            <div className="relative w-44 h-44 shrink-0">
              <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                {/* Background Ring */}
                <circle cx="50" cy="50" r="38" fill="transparent" stroke="#f1f5f9" strokeWidth="18" />
                {/* Segment 1: Matured (40%) */}
                <circle
                  cx="50" cy="50" r="38" fill="transparent" stroke="#ef4444" strokeWidth="18"
                  strokeDasharray="95.5 143.2" strokeDashoffset="0"
                />
                {/* Segment 2: <90 Days (10%) */}
                <circle
                  cx="50" cy="50" r="38" fill="transparent" stroke="#f59e0b" strokeWidth="18"
                  strokeDasharray="23.8 214.9" strokeDashoffset="-95.5"
                />
                {/* Segment 3: 2027-2029 (30%) */}
                <circle
                  cx="50" cy="50" r="38" fill="transparent" stroke="#3b82f6" strokeWidth="18"
                  strokeDasharray="71.6 167.1" strokeDashoffset="-119.3"
                />
                {/* Segment 4: 2030+ (20%) */}
                <circle
                  cx="50" cy="50" r="38" fill="transparent" stroke="#10b981" strokeWidth="18"
                  strokeDasharray="47.7 191" strokeDashoffset="-190.9"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-tighter">Total</span>
                <span className="text-lg font-extrabold text-slate-900 font-mono">10 FDRs</span>
              </div>
            </div>

            {/* Legend */}
            <div className="space-y-2 text-xs">
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 rounded-full bg-rose-500 shrink-0" />
                <span className="text-slate-700">Matured (Eligible): <strong>4 (40%)</strong></span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 rounded-full bg-amber-500 shrink-0" />
                <span className="text-slate-700">&lt; 90 Days (Urgent): <strong>1 (10%)</strong></span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 rounded-full bg-blue-500 shrink-0" />
                <span className="text-slate-700">Active (2027-2029): <strong>3 (30%)</strong></span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 rounded-full bg-emerald-500 shrink-0" />
                <span className="text-slate-700">Long-term (2030+): <strong>2 (20%)</strong></span>
              </div>
            </div>
          </div>
        </div>

        {/* Chart 2: Average Stage Delay Analysis */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Average Waiting Days by Clearance Desk</h3>
              <p className="text-xs text-slate-500">Benchmark target SLA vs actual simulated performance</p>
            </div>
            <span className="text-[11px] text-rose-800 font-semibold bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
              Bottleneck Focus
            </span>
          </div>

          <div className="space-y-3 pt-2 text-xs">
            {/* Stage 1 */}
            <div>
              <div className="flex justify-between mb-1">
                <span className="font-semibold text-slate-700">Stage 1: Initial Ingest</span>
                <span className="font-mono text-emerald-700 font-bold">1 Day (SLA: 3d)</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '20%' }} />
              </div>
            </div>

            {/* Stage 2 */}
            <div>
              <div className="flex justify-between mb-1">
                <span className="font-semibold text-slate-700">Stage 2: Completeness Check</span>
                <span className="font-mono text-emerald-700 font-bold">4 Days (SLA: 5d)</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '40%' }} />
              </div>
            </div>

            {/* Stage 3 */}
            <div>
              <div className="flex justify-between mb-1">
                <span className="font-semibold text-slate-700">Stage 3: RO Regional Verification</span>
                <span className="font-mono text-amber-700 font-bold">14 Days (SLA: 7d)</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div className="bg-amber-500 h-2 rounded-full" style={{ width: '65%' }} />
              </div>
            </div>

            {/* Stage 4: Critical Bottleneck */}
            <div>
              <div className="flex justify-between mb-1">
                <span className="font-semibold text-rose-900">Stage 4: Approval Bureau Clearances</span>
                <span className="font-mono text-rose-700 font-extrabold">28 Days (SLA: 10d) [LAG]</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div className="bg-rose-500 h-2 rounded-full" style={{ width: '95%' }} />
              </div>
            </div>

            {/* Stage 5 */}
            <div>
              <div className="flex justify-between mb-1">
                <span className="font-semibold text-slate-700">Stage 5: Authorised Review</span>
                <span className="font-mono text-emerald-700 font-bold">6 Days (SLA: 5d)</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '45%' }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Priority Action Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="font-bold text-slate-900 text-sm">High-Urgency Escalation Queue</h3>
            <p className="text-xs text-slate-500">Ranked by risk of interest lapse and SLA breach</p>
          </div>
          <button
            onClick={() => onNavigate('casePrioritisation')}
            className="text-xs text-blue-700 font-bold hover:underline flex items-center space-x-1"
          >
            <span>View All in Prioritisation Engine</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold text-[10px] uppercase">
                <th className="py-2.5 px-3">Case ID</th>
                <th className="py-2.5 px-3">Institution</th>
                <th className="py-2.5 px-3">Deposit Value</th>
                <th className="py-2.5 px-3">Current Station</th>
                <th className="py-2.5 px-3">Delay Time</th>
                <th className="py-2.5 px-3">Priority Trigger</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr className="hover:bg-slate-50">
                <td className="py-3 px-3 font-mono font-bold text-blue-900">REQ-2026-7419</td>
                <td className="py-3 px-3 font-semibold text-slate-900">National College of Engineering</td>
                <td className="py-3 px-3 font-mono font-bold">₹50,00,000</td>
                <td className="py-3 px-3">Stage 4: Approval Bureau Clearance</td>
                <td className="py-3 px-3 font-bold text-rose-600">60 Days (+29 over SLA)</td>
                <td className="py-3 px-3">
                  <span className="text-[10px] font-bold bg-rose-100 text-rose-800 px-2 py-0.5 rounded-full border border-rose-300">
                    Bottleneck: Approval Cell
                  </span>
                </td>
                <td className="py-3 px-3 text-right">
                  <button
                    onClick={() => onOpenCouncilAction('REQ-2026-7419')}
                    className="px-3 py-1 bg-blue-700 text-white font-semibold rounded-md text-xs hover:bg-blue-800"
                  >
                    Inspect
                  </button>
                </td>
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="py-3 px-3 font-mono font-bold text-blue-900">REQ-2026-8812</td>
                <td className="py-3 px-3 font-semibold text-slate-900">Apex Institute of Technology</td>
                <td className="py-3 px-3 font-mono font-bold">₹35,00,000</td>
                <td className="py-3 px-3">Stage 3: Regional Office Verification</td>
                <td className="py-3 px-3 font-bold text-amber-700">22 Days (Matures in 22d)</td>
                <td className="py-3 px-3">
                  <span className="text-[10px] font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full border border-amber-300">
                    Lapse Warning (&lt;30d)
                  </span>
                </td>
                <td className="py-3 px-3 text-right">
                  <button
                    onClick={() => onOpenCouncilAction('REQ-2026-8812')}
                    className="px-3 py-1 bg-blue-700 text-white font-semibold rounded-md text-xs hover:bg-blue-800"
                  >
                    Inspect
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
