import React from 'react';
import { 
  Flame, 
  Clock, 
  AlertTriangle, 
  ShieldAlert, 
  ArrowRight, 
  Info,
  CheckCircle2
} from 'lucide-react';
import { Institution, ReleaseRequest, FdrRecord } from '../types';
import { formatINR, getPriorityBadgeClass } from '../utils/formatters';

interface CasePrioritisationViewProps {
  institutions: Institution[];
  requests: ReleaseRequest[];
  fdrs: FdrRecord[];
  onOpenCouncilAction: (reqId: string) => void;
}

export const CasePrioritisationView: React.FC<CasePrioritisationViewProps> = ({
  institutions,
  requests,
  fdrs,
  onOpenCouncilAction,
}) => {
  // Transparent Urgency Ranking Engine
  const scoredCases = [...requests]
    .filter((r) => !r.status.includes('Closed'))
    .map((req) => {
      let score = 0;
      const reasons: string[] = [];

      // Factor 1: Overdue bottleneck
      if (req.priority === 'Overdue Bottleneck') {
        score += 100;
        reasons.push('+100 Overdue SLA Lag');
      } else if (req.priority === 'Urgent') {
        score += 80;
        reasons.push('+80 Critical Window (<30d)');
      } else if (req.priority === 'High') {
        score += 60;
        reasons.push('+60 High Priority');
      }

      // Factor 2: Days waiting
      score += (req.waitingDays || 0) * 1.5;
      reasons.push(`+${Math.round((req.waitingDays || 0) * 1.5)} Stage Latency`);

      // Factor 3: Deposit magnitude
      if (req.fdrAmount >= 3500000) {
        score += 25;
        reasons.push('+25 High Capital Value (≥35L)');
      }

      return {
        ...req,
        calculatedScore: Math.round(score),
        scoreFactors: reasons,
      };
    })
    .sort((a, b) => b.calculatedScore - a.calculatedScore);

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <div>
          <div className="flex items-center space-x-2 text-xs text-slate-500 mb-1">
            <span>AICTE Council Portal</span>
            <span>/</span>
            <span className="text-indigo-700 font-semibold">Priority Queue</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Intelligent Case Prioritisation Queue
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Transparent algorithmic triage ranking cases by maturity urgency, overdue stage SLAs, and capital exposure.
          </p>
        </div>
        <span className="text-xs font-bold px-3 py-1 bg-rose-50 text-rose-800 border border-rose-200 rounded-lg">
          Dynamic Urgency Scoring Active
        </span>
      </div>

      {/* Explanatory Callout */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-slate-600">
        <div className="flex items-center space-x-2.5">
          <Info className="w-4 h-4 text-indigo-600 shrink-0" />
          <span>
            <strong>Prioritisation Engine:</strong> Automatically separates <em>eligibility</em> from <em>urgency</em> so cases risking interest lapse or statutory default are tackled first.
          </span>
        </div>
        <span className="text-[11px] text-slate-400 shrink-0">Weights: SLA Lag (50%) • Maturity Risk (35%) • Capital Size (15%)</span>
      </div>

      {/* Ranked Queue Cards */}
      <div className="space-y-3">
        {scoredCases.map((req, idx) => {
          const inst = institutions.find((i) => i.id === req.institutionId);
          const fdr = fdrs.find((f) => f.id === req.fdrId);
          const isBottleneck = req.priority === 'Overdue Bottleneck';
          const isUrgent = req.priority === 'Urgent';

          return (
            <div
              key={req.id}
              className={`bg-white rounded-xl border p-4 shadow-xs hover:shadow-md transition ${
                isBottleneck
                  ? 'border-rose-300 bg-rose-50/20'
                  : isUrgent
                  ? 'border-amber-300 bg-amber-50/20'
                  : 'border-slate-200'
              }`}
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-2">
                <div className="flex items-center space-x-2.5">
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                      idx === 0
                        ? 'bg-rose-600 text-white'
                        : idx === 1
                        ? 'bg-amber-500 text-white'
                        : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    #{idx + 1}
                  </span>
                  <span className="font-mono font-bold text-sm text-slate-900">{req.id}</span>
                  <span className="font-semibold text-xs text-slate-800">{inst?.name}</span>
                  <span className="text-xs text-slate-400 font-mono">({inst?.code})</span>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="text-xs font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                    Score: {req.calculatedScore}
                  </span>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${getPriorityBadgeClass(req.priority)}`}>
                    {req.priority}
                  </span>
                  <span className="font-mono font-bold text-slate-900 text-xs">{formatINR(req.fdrAmount)}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs pt-1 border-t border-slate-100/80">
                <div>
                  <span className="text-slate-400 text-[10px] block font-semibold uppercase">Current Station</span>
                  <span className="font-bold text-blue-900">{req.currentStage}</span>
                  <p className="text-slate-500 text-[11px] mt-0.5">
                    Waiting at: <strong className="text-slate-700">{req.nextResponsibleDesk}</strong> ({req.waitingDays}d)
                  </p>
                </div>

                <div>
                  <span className="text-slate-400 text-[10px] block font-semibold uppercase">Urgency Reason</span>
                  <p className="text-slate-800 font-medium">{req.priorityReason}</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {req.scoreFactors.map((factor, i) => (
                      <span key={i} className="text-[9px] font-mono bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded">
                        {factor}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-end space-x-2 self-center">
                  <button
                    onClick={() => onOpenCouncilAction(req.id)}
                    className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs rounded-lg shadow-xs transition flex items-center space-x-1"
                  >
                    <span>Open Officer Workspace</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
