import React from 'react';
import { 
  GitPullRequest, 
  Plus, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  ExternalLink 
} from 'lucide-react';
import { Institution, ReleaseRequest, FdrRecord, NavPage } from '../types';
import { formatINR, getPriorityBadgeClass } from '../utils/formatters';

interface ReleaseTrackingViewProps {
  institution: Institution;
  requests: ReleaseRequest[];
  fdrs: FdrRecord[];
  onOpenTimeline: (reqId: string) => void;
  onNavigate: (page: NavPage) => void;
}

export const ReleaseTrackingView: React.FC<ReleaseTrackingViewProps> = ({
  institution,
  requests,
  fdrs,
  onOpenTimeline,
  onNavigate,
}) => {
  const myRequests = requests.filter((r) => r.institutionId === institution.id);

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <div>
          <div className="flex items-center space-x-2 text-xs text-slate-500 mb-1">
            <span>Institution Portal</span>
            <span>/</span>
            <span className="text-blue-700 font-semibold">Live Tracker</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Release Application Stage Tracker
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Transparent real-time status across all 6 statutory clearance stations.
          </p>
        </div>
        <button
          onClick={() => onNavigate('formalRequest')}
          className="bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold px-3.5 py-2 rounded-lg shadow-xs flex items-center space-x-1"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Release Request</span>
        </button>
      </div>

      {/* Requests List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="divide-y divide-slate-100">
          {myRequests.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs">
              No release applications lodged yet for this institution.
            </div>
          ) : (
            myRequests.map((req) => {
              const targetFdr = fdrs.find((f) => f.id === req.fdrId);

              return (
                <div key={req.id} className="p-5 hover:bg-slate-50/50 transition">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-3">
                    <div className="flex items-center space-x-3">
                      <span className="font-mono font-bold text-sm text-blue-900 bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded-md">
                        {req.id}
                      </span>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900">
                          FDR: <span className="font-mono">{targetFdr?.fdrNumber || req.fdrId}</span> ({targetFdr?.bankName || 'Bank'}) — {formatINR(req.fdrAmount)}
                        </h4>
                        <span className="text-[11px] text-slate-500">
                          Lodged: {req.submissionDate} • SLA Target: {req.targetCompletionDate}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${getPriorityBadgeClass(req.priority)}`}>
                        {req.status}
                      </span>
                      <button
                        onClick={() => onOpenTimeline(req.id)}
                        className="text-xs font-semibold text-blue-800 hover:text-blue-950 bg-blue-50 hover:bg-blue-100 px-3 py-1 rounded-md border border-blue-200 transition flex items-center space-x-1"
                      >
                        <span>Inspect Timeline</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  {/* 6 Stages Visual Progress */}
                  <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 text-center text-[10px] pt-2">
                    {req.stages.map((st, i) => (
                      <div
                        key={i}
                        className={`p-2 rounded-lg border ${
                          st.status === 'completed'
                            ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                            : st.status === 'in-progress'
                            ? 'bg-amber-50 border-amber-300 text-amber-900 font-bold'
                            : 'bg-slate-50 border-slate-100 text-slate-400'
                        }`}
                      >
                        <div className="truncate font-medium">{i + 1}. {st.name.split(':')[0]}</div>
                        <span className="font-bold block mt-0.5">
                          {st.status === 'completed'
                            ? '✓ Passed'
                            : st.status === 'in-progress'
                            ? '● In Progress'
                            : '○ Pending'}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Current Active Desk Footer */}
                  <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                    <span>
                      Currently waiting at: <strong className="text-slate-800">{req.nextResponsibleDesk}</strong> ({req.waitingDays} days in station)
                    </span>
                    {req.notes.length > 0 && (
                      <span className="text-blue-800 font-semibold">
                        {req.notes.length} Council note(s) logged
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
