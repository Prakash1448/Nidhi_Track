import React, { useState } from 'react';
import { X, ShieldAlert, CheckCircle2, HelpCircle, Send } from 'lucide-react';
import { ReleaseRequest, Institution, FdrRecord } from '../../types';
import { formatINR } from '../../utils/formatters';

interface CouncilActionModalProps {
  request: ReleaseRequest | null;
  institution: Institution | undefined;
  fdr: FdrRecord | undefined;
  onClose: () => void;
  onSendClarification: (reqId: string, note: string) => void;
  onGrantClearance: (reqId: string, note: string) => void;
}

export const CouncilActionModal: React.FC<CouncilActionModalProps> = ({
  request,
  institution,
  fdr,
  onClose,
  onSendClarification,
  onGrantClearance,
}) => {
  const [noteText, setNoteText] = useState('');
  const [actionType, setActionType] = useState<'clarify' | 'clear'>('clarify');

  if (!request) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (actionType === 'clarify') {
      onSendClarification(
        request.id,
        noteText || 'Council requires attested confirmation statement from bank branch.'
      );
    } else {
      onGrantClearance(
        request.id,
        noteText || 'Regional Office verification completed and verified clean.'
      );
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-xl max-h-[90vh] overflow-y-auto p-6 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex justify-between items-start pb-3 border-b border-slate-100">
          <div>
            <span className="text-[10px] font-mono font-bold bg-indigo-50 text-indigo-900 px-2 py-0.5 rounded border border-indigo-200">
              Council Officer Workspace • {request.id}
            </span>
            <h3 className="text-base font-bold text-slate-900 mt-1">{institution?.name}</h3>
            <p className="text-xs text-slate-500">
              FDR: <span className="font-mono">{fdr?.fdrNumber}</span> • Pledged Principal: <span className="font-mono font-bold">{formatINR(request.fdrAmount)}</span>
            </p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="my-4 space-y-4 text-xs">
          {/* Action Choice Tabs */}
          <div>
            <label className="font-bold text-slate-700 block mb-2 uppercase text-[10px] tracking-wider">
              Select Officer Action
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setActionType('clarify')}
                className={`p-3 rounded-xl border text-left transition ${
                  actionType === 'clarify'
                    ? 'border-amber-400 bg-amber-50/50 shadow-xs'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center space-x-1.5 font-bold text-amber-900 mb-0.5">
                  <HelpCircle className="w-4 h-4 text-amber-600" />
                  <span>Request Clarification</span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Notify college regarding missing document, illegible seal, or IFSC mismatch.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setActionType('clear')}
                className={`p-3 rounded-xl border text-left transition ${
                  actionType === 'clear'
                    ? 'border-emerald-500 bg-emerald-50/50 shadow-xs'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center space-x-1.5 font-bold text-emerald-900 mb-0.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Grant Clearance</span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Certify verification findings and forward application to next approval desk.
                </p>
              </button>
            </div>
          </div>

          {/* Officer Note */}
          <div>
            <label className="font-semibold text-slate-700 block mb-1">
              {actionType === 'clarify' ? 'Query Explanation for Institution:' : 'Clearance Scrutiny Endorsement:'}
            </label>
            <textarea
              rows={3}
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              placeholder={
                actionType === 'clarify'
                  ? 'e.g., Discrepancy noted in branch IFSC code on bank certificate. Institution requested to re-upload clear confirmation from PNB.'
                  : 'e.g., Physical FDR instrument verified. 8-year lock-in satisfied without student complaints. Approved for Cross-Bureau clearance.'
              }
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 text-slate-900"
            />
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-[11px] text-slate-500 flex items-center space-x-2">
            <ShieldAlert className="w-4 h-4 text-slate-400 shrink-0" />
            <span>
              This simulated action will update the application stage and append to the institutional audit log.
            </span>
          </div>

          <div className="pt-2 flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`px-5 py-2 text-white font-bold rounded-lg shadow-xs flex items-center space-x-1.5 ${
                actionType === 'clarify' ? 'bg-amber-600 hover:bg-amber-700' : 'bg-emerald-600 hover:bg-emerald-700'
              }`}
            >
              <Send className="w-3.5 h-3.5" />
              <span>{actionType === 'clarify' ? 'Dispatch Query' : 'Record Clearance'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
