import React, { useState } from 'react';
import { 
  CheckSquare2, 
  UploadCloud, 
  Eye, 
  FileText, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowLeft, 
  Sparkles,
  Check
} from 'lucide-react';
import { Institution, ChecklistItem, NavPage } from '../types';

interface TailoredChecklistProps {
  institution: Institution;
  checklistItems: ChecklistItem[];
  onUploadSimulate: (id: string, name: string) => void;
  onPreviewDocument: (name: string, fileName: string) => void;
  onNavigate: (page: NavPage) => void;
}

export const TailoredChecklist: React.FC<TailoredChecklistProps> = ({
  institution,
  checklistItems,
  onUploadSimulate,
  onPreviewDocument,
  onNavigate,
}) => {
  const completedCount = checklistItems.filter((i) => i.status === 'Complete').length;
  const progressPct = Math.round((completedCount / checklistItems.length) * 100);

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <div>
          <div className="flex items-center space-x-2 text-xs text-slate-500 mb-1">
            <span>Institution Portal</span>
            <span>/</span>
            <span className="text-blue-700 font-semibold">Dynamic Checklist</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Tailored Regulatory Requirement Checklist
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Dynamically compiled for <span className="font-semibold text-slate-800">{institution.name}</span> based on {institution.category} category.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-xs font-semibold px-2.5 py-1 rounded bg-blue-50 text-blue-900 border border-blue-200">
            APH Edition: 2024-27 (In-Force)
          </span>
        </div>
      </div>

      {/* Progress Header Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-4 w-full sm:w-auto">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center justify-center font-bold text-base font-mono">
            {completedCount}/{checklistItems.length}
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900">Checklist Completion Status</h4>
            <p className="text-xs text-slate-500">
              {completedCount} Verified • {checklistItems.filter((i) => i.status === 'Needs Review').length} Review Required • {checklistItems.filter((i) => i.status === 'Missing').length} Missing Document
            </p>
          </div>
        </div>
        <div className="w-full sm:w-64 bg-slate-100 rounded-full h-2.5 overflow-hidden">
          <div
            className="bg-emerald-600 h-2.5 rounded-full transition-all duration-500"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      {/* Interactive Checklist Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="divide-y divide-slate-100">
          {checklistItems.map((item, idx) => (
            <div
              key={item.id}
              className="p-4 hover:bg-slate-50/70 transition flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
            >
              <div className="flex items-start space-x-3.5">
                <span
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${
                    item.status === 'Complete'
                      ? 'bg-emerald-100 text-emerald-800'
                      : item.status === 'Needs Review'
                      ? 'bg-amber-100 text-amber-900'
                      : 'bg-rose-100 text-rose-800'
                  }`}
                >
                  {item.status === 'Complete' ? <Check className="w-3.5 h-3.5" /> : idx + 1}
                </span>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h4 className="text-xs font-bold text-slate-900">{item.name}</h4>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200 font-semibold">
                      {item.clause}
                    </span>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        item.status === 'Complete'
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : item.status === 'Needs Review'
                          ? 'bg-amber-50 text-amber-900 border border-amber-200'
                          : 'bg-rose-50 text-rose-800 border border-rose-200'
                      }`}
                    >
                      {item.status === 'Complete'
                        ? 'Verified Complete'
                        : item.status === 'Needs Review'
                        ? 'Review Required'
                        : 'Document Missing'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1">{item.reason}</p>

                  {item.fileName ? (
                    <div className="flex items-center space-x-1.5 mt-1.5 text-[11px] text-blue-700 font-medium">
                      <FileText className="w-3.5 h-3.5" />
                      <span className="font-mono">{item.fileName}</span>
                      <span className="text-slate-400">• {item.date}</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-1.5 mt-1.5 text-[11px] text-rose-600 font-medium">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>No verified file attached. Required prior to formal release.</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-2 self-end md:self-center shrink-0">
                <button
                  onClick={() => onUploadSimulate(item.id, item.name)}
                  className="text-xs px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium transition flex items-center space-x-1"
                >
                  <UploadCloud className="w-3.5 h-3.5" />
                  <span>{item.fileName ? 'Replace File' : 'Upload File'}</span>
                </button>
                {item.fileName && (
                  <button
                    onClick={() => onPreviewDocument(item.name, item.fileName!)}
                    className="text-xs px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-800 rounded-lg font-medium transition flex items-center space-x-1"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Inspect</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Footer */}
      <div className="flex justify-between items-center pt-2">
        <button
          onClick={() => onNavigate('classification')}
          className="text-xs text-slate-600 font-semibold hover:text-slate-900 flex items-center space-x-1"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Profile</span>
        </button>
        <button
          onClick={() => onNavigate('readiness')}
          className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold px-4 py-2 rounded-lg text-xs shadow-xs transition flex items-center space-x-1.5"
        >
          <Sparkles className="w-4 h-4" />
          <span>Run Preliminary Readiness Diagnostic &rarr;</span>
        </button>
      </div>
    </div>
  );
};
