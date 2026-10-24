import React from 'react';
import { X, GitPullRequest, CheckCircle2, Clock, AlertTriangle } from 'lucide-react';
import { ReleaseRequest, Institution, FdrRecord } from '../../types';
import { formatINR } from '../../utils/formatters';

interface TimelineModalProps {
  request: ReleaseRequest | null;
  institution: Institution | undefined;
  fdr: FdrRecord | undefined;
  onClose: () => void;
}

export const TimelineModal: React.FC<TimelineModalProps> = ({
  request,
  institution,
  fdr,
  onClose,
}) => {
  if (!request) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex justify-between items-start pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-mono font-bold text-xs bg-blue-50 text-blue-800 px-2.5 py-0.5 rounded border border-blue-200">
                {request.id}
              </span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                {request.status}
              </span>
            </div>
            <h3 className="text-base font-bold text-slate-900 mt-1">{institution?.name}</h3>
            <p className="text-xs text-slate-500">
              FDR: <span className="font-mono font-semibold">{fdr?.fdrNumber || request.fdrId}</span> • Deposit Amount: <span className="font-mono font-bold text-slate-800">{formatINR(request.fdrAmount)}</span>
            </p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Station Banner */}
        <div className="my-4 p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs flex justify-between items-center">
          <div>
            <span className="text-slate-400 block text-[10px] font-semibold uppercase">Currently Active Desk</span>
            <span className="font-bold text-slate-900 text-sm">{request.nextResponsibleDesk}</span>
          </div>
          <div className="text-right">
            <span className="text-slate-400 block text-[10px] font-semibold uppercase">Waiting Duration</span>
            <span className="font-mono font-bold text-amber-700 text-sm">{request.waitingDays} Days</span>
          </div>
        </div>

        {/* 6-Stage Timeline List */}
        <div className="my-5 space-y-4">
          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            6-Stage Statutory Processing Pipeline
          </h4>

          <div className="relative pl-6 space-y-5 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 text-xs">
            {request.stages.map((stage, idx) => {
              const isCompleted = stage.status === 'completed';
              const isInProgress = stage.status === 'in-progress';

              return (
                <div key={idx} className="relative">
                  {/* Indicator Icon */}
                  <div
                    className={`absolute -left-6 top-0.5 w-5 h-5 rounded-full flex items-center justify-center ${
                      isCompleted
                        ? 'bg-emerald-600 text-white'
                        : isInProgress
                        ? 'bg-amber-500 text-white animate-pulse'
                        : 'bg-slate-100 text-slate-400 border border-slate-300'
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    ) : isInProgress ? (
                      <Clock className="w-3.5 h-3.5" />
                    ) : (
                      <span className="text-[10px] font-bold">{idx + 1}</span>
                    )}
                  </div>

                  <div className={`p-3 rounded-xl border ${
                    isInProgress ? 'bg-amber-50/40 border-amber-200' : 'bg-white border-slate-200/80'
                  }`}>
                    <div className="flex justify-between items-center">
                      <h5 className="font-bold text-slate-900">
                        Stage {idx + 1}: {stage.name}
                      </h5>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        isCompleted ? 'bg-emerald-50 text-emerald-800' : (
                          isInProgress ? 'bg-amber-100 text-amber-900 font-bold' : 'text-slate-400'
                        )
                      }`}>
                        {isCompleted ? 'Completed' : (isInProgress ? 'In Progress' : 'Pending')}
                      </span>
                    </div>

                    {stage.date && (
                      <span className="text-[10px] text-slate-400 block mt-0.5 font-mono">
                        Date: {stage.date}
                      </span>
                    )}

                    {stage.note && (
                      <p className="text-slate-600 mt-1 text-[11px] leading-relaxed">
                        {stage.note}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Audit Notes Trail */}
        {request.notes.length > 0 && (
          <div className="border-t border-slate-100 pt-4 text-xs">
            <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[10px] mb-2">
              Official Review Notes ({request.notes.length})
            </h4>
            <div className="space-y-2">
              {request.notes.map((note, i) => (
                <div key={i} className="p-3 bg-slate-50 rounded-lg border border-slate-200/80">
                  <div className="flex justify-between font-semibold text-slate-800 text-[11px]">
                    <span>{note.role}</span>
                    <span className="text-slate-400 font-mono text-[10px]">{note.date}</span>
                  </div>
                  <p className="text-slate-600 mt-1 text-[11px]">{note.text}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-lg transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
