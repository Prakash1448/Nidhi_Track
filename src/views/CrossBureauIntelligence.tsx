import React from 'react';
import { 
  Network, 
  AlertOctagon, 
  Send, 
  Clock, 
  Layers, 
  ArrowRight 
} from 'lucide-react';
import { ReleaseRequest } from '../types';

interface CrossBureauIntelligenceProps {
  requests: ReleaseRequest[];
  onShowToast: (title: string, message: string) => void;
}

export const CrossBureauIntelligence: React.FC<CrossBureauIntelligenceProps> = ({
  requests,
  onShowToast,
}) => {
  const handleDispatchMemo = () => {
    onShowToast('Internal Escalation Dispatched', 'Urgent memorandum forwarded to Director (Approval Bureau) regarding overdue case REQ-2026-7419.');
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 pb-4">
        <div className="flex items-center space-x-2 text-xs text-slate-500 mb-1">
          <span>AICTE Council Portal</span>
          <span>/</span>
          <span className="text-indigo-700 font-semibold">Workflow Analytics</span>
        </div>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">
          Cross-Bureau Workflow Intelligence & Bottlenecks
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Pinpoint departmental queues, latency spikes, and administrative lag across Council cells.
        </p>
      </div>

      {/* Critical Bottleneck Callout Banner */}
      <div className="bg-rose-50 border-l-4 border-rose-500 p-4 rounded-xl shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
        <div className="flex items-start space-x-3">
          <div className="p-2 bg-rose-100 rounded-lg text-rose-700 shrink-0">
            <AlertOctagon className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-rose-950">
              Critical Stage Bottleneck: Approval Bureau (Southern & Central Cells)
            </h4>
            <p className="text-xs text-rose-900 mt-0.5 leading-relaxed">
              Average retention at Stage 4 is currently <strong>28 days</strong> (target SLA: 10 days). 
              Case <strong className="font-mono">REQ-2026-7419</strong> is currently 29 days overdue for mandatory 10-year defect-free operational clearance.
            </p>
          </div>
        </div>
        <button
          onClick={handleDispatchMemo}
          className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-lg shadow-xs transition shrink-0 flex items-center space-x-1"
        >
          <Send className="w-3.5 h-3.5" />
          <span>Dispatch Internal Memo</span>
        </button>
      </div>

      {/* Stage Latency Strip */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 text-xs">
          <span className="text-[10px] uppercase font-bold text-slate-400">Stage 1: Intake</span>
          <div className="text-lg font-bold text-slate-800 mt-1">1 Day</div>
          <span className="text-[10px] text-emerald-600 font-semibold">Within SLA</span>
        </div>
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 text-xs">
          <span className="text-[10px] uppercase font-bold text-slate-400">Stage 2: Completeness</span>
          <div className="text-lg font-bold text-slate-800 mt-1">4 Days</div>
          <span className="text-[10px] text-emerald-600 font-semibold">Normal</span>
        </div>
        <div className="bg-white p-3.5 rounded-xl border border-amber-200 bg-amber-50/20 text-xs">
          <span className="text-[10px] uppercase font-bold text-amber-800">Stage 3: RO Scrutiny</span>
          <div className="text-lg font-bold text-amber-800 mt-1">14 Days</div>
          <span className="text-[10px] text-amber-700 font-semibold">+4d Over Target</span>
        </div>
        <div className="bg-white p-3.5 rounded-xl border-2 border-rose-300 bg-rose-50/30 text-xs shadow-xs">
          <span className="text-[10px] uppercase font-bold text-rose-800">Stage 4: Clearances</span>
          <div className="text-lg font-bold text-rose-900 mt-1">28 Days</div>
          <span className="text-[10px] text-rose-700 font-bold">CRITICAL BOTTLENECK</span>
        </div>
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 text-xs">
          <span className="text-[10px] uppercase font-bold text-slate-400">Stage 5: Review</span>
          <div className="text-lg font-bold text-slate-800 mt-1">6 Days</div>
          <span className="text-[10px] text-emerald-600 font-semibold">Normal</span>
        </div>
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 text-xs">
          <span className="text-[10px] uppercase font-bold text-slate-400">Stage 6: Outcome</span>
          <div className="text-lg font-bold text-slate-800 mt-1">2 Days</div>
          <span className="text-[10px] text-emerald-600 font-semibold">Prompt NOC</span>
        </div>
      </div>

      {/* Visual Throughput SVG Chart */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <h3 className="font-bold text-slate-900 text-sm mb-1">Stage Throughput & Congestion</h3>
        <p className="text-xs text-slate-500 mb-4">Volume of active applications currently lodged at each operational station</p>

        <div className="pt-2">
          <div className="h-56 flex items-end justify-between gap-4 px-4 pb-4 border-b border-slate-200">
            {/* Stage 1 */}
            <div className="flex-1 flex flex-col items-center gap-2">
              <span className="text-xs font-mono font-bold text-slate-700">1 Case</span>
              <div className="w-full max-w-[48px] bg-slate-300 rounded-t-lg" style={{ height: '35px' }} />
              <span className="text-[11px] font-medium text-slate-600 text-center">Stage 1</span>
            </div>

            {/* Stage 2 */}
            <div className="flex-1 flex flex-col items-center gap-2">
              <span className="text-xs font-mono font-bold text-slate-700">1 Case</span>
              <div className="w-full max-w-[48px] bg-slate-300 rounded-t-lg" style={{ height: '35px' }} />
              <span className="text-[11px] font-medium text-slate-600 text-center">Stage 2</span>
            </div>

            {/* Stage 3 */}
            <div className="flex-1 flex flex-col items-center gap-2">
              <span className="text-xs font-mono font-bold text-amber-700">2 Cases</span>
              <div className="w-full max-w-[48px] bg-amber-400 rounded-t-lg" style={{ height: '70px' }} />
              <span className="text-[11px] font-bold text-amber-900 text-center">Stage 3</span>
            </div>

            {/* Stage 4 (Bottleneck) */}
            <div className="flex-1 flex flex-col items-center gap-2">
              <span className="text-xs font-mono font-bold text-rose-700">3 Cases</span>
              <div className="w-full max-w-[48px] bg-rose-500 rounded-t-lg shadow-sm" style={{ height: '120px' }} />
              <span className="text-[11px] font-bold text-rose-900 text-center">Stage 4 (Peak)</span>
            </div>

            {/* Stage 5 */}
            <div className="flex-1 flex flex-col items-center gap-2">
              <span className="text-xs font-mono font-bold text-indigo-700">1 Case</span>
              <div className="w-full max-w-[48px] bg-indigo-500 rounded-t-lg" style={{ height: '35px' }} />
              <span className="text-[11px] font-medium text-slate-600 text-center">Stage 5</span>
            </div>

            {/* Stage 6 */}
            <div className="flex-1 flex flex-col items-center gap-2">
              <span className="text-xs font-mono font-bold text-emerald-700">1 Case</span>
              <div className="w-full max-w-[48px] bg-emerald-500 rounded-t-lg" style={{ height: '35px' }} />
              <span className="text-[11px] font-medium text-slate-600 text-center">Stage 6</span>
            </div>
          </div>

          <div className="pt-3 text-xs text-slate-500 flex justify-between">
            <span>Inter-Bureau Routing Engine: AICTE Finance Directorate</span>
            <span className="text-rose-700 font-semibold">Stage 4 represents 50% of aggregate pipeline latency</span>
          </div>
        </div>
      </div>
    </div>
  );
};
