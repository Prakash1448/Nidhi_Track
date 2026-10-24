import React, { useState, useEffect } from 'react';
import { Search, X, FolderArchive, Building2, GitPullRequest, ArrowRight } from 'lucide-react';
import { FdrRecord, Institution, ReleaseRequest, NavPage } from '../../types';
import { formatINR } from '../../utils/formatters';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  fdrs: FdrRecord[];
  institutions: Institution[];
  requests: ReleaseRequest[];
  onSelectFdr: (fdrId: string) => void;
  onSelectInstitution: (instId: string) => void;
  onSelectRequest: (reqId: string) => void;
  onNavigate: (page: NavPage) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  fdrs,
  institutions,
  requests,
  onSelectFdr,
  onSelectInstitution,
  onSelectRequest,
  onNavigate,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const q = searchTerm.toLowerCase().trim();

  const matchingFdrs = q
    ? fdrs.filter(
        (f) =>
          f.fdrNumber.toLowerCase().includes(q) ||
          f.id.toLowerCase().includes(q) ||
          f.bankName.toLowerCase().includes(q) ||
          f.branch.toLowerCase().includes(q)
      )
    : fdrs.slice(0, 3);

  const matchingInstitutions = q
    ? institutions.filter(
        (i) =>
          i.name.toLowerCase().includes(q) ||
          i.code.toLowerCase().includes(q) ||
          i.region.toLowerCase().includes(q)
      )
    : institutions.slice(0, 2);

  const matchingRequests = q
    ? requests.filter(
        (r) =>
          r.id.toLowerCase().includes(q) ||
          r.status.toLowerCase().includes(q) ||
          r.nextResponsibleDesk.toLowerCase().includes(q)
      )
    : requests.slice(0, 2);

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-start justify-center pt-20 p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-100">
        {/* Search Input Bar */}
        <div className="p-4 border-b border-slate-200 flex items-center space-x-3 bg-slate-50">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            type="text"
            autoFocus
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search FDR number, bank name, institution code or request ID..."
            className="w-full bg-transparent text-sm focus:outline-none text-slate-900 placeholder:text-slate-400"
          />
          {searchTerm && (
            <button onClick={() => setSearchTerm('')} className="text-slate-400 hover:text-slate-600">
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="text-[10px] text-slate-400 border border-slate-300 px-1.5 py-0.5 rounded bg-white font-mono">
            ESC
          </kbd>
        </div>

        {/* Results Container */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-4 text-xs">
          {/* FDR Instruments */}
          <div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <FolderArchive className="w-3.5 h-3.5 text-blue-600" />
              <span>FDR Instruments</span>
            </div>
            {matchingFdrs.length === 0 ? (
              <p className="text-slate-400 italic py-1">No matching FDRs found</p>
            ) : (
              <div className="space-y-1.5">
                {matchingFdrs.map((fdr) => (
                  <div
                    key={fdr.id}
                    onClick={() => {
                      onSelectFdr(fdr.id);
                      onNavigate('register');
                      onClose();
                    }}
                    className="p-2.5 hover:bg-slate-50 rounded-lg cursor-pointer flex justify-between items-center transition border border-transparent hover:border-slate-200"
                  >
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-mono font-bold text-slate-900">{fdr.fdrNumber}</span>
                        <span className="text-[10px] text-slate-400 font-mono">({fdr.id})</span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 font-medium">
                          {fdr.status}
                        </span>
                      </div>
                      <p className="text-slate-500 text-[11px] mt-0.5">
                        {fdr.bankName} • {fdr.branch} • Matures: {fdr.maturityDate}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="font-mono font-bold text-slate-800">{formatINR(fdr.amount)}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400 ml-auto mt-1" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Institutions */}
          <div className="border-t border-slate-100 pt-3">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-indigo-600" />
              <span>Technical Institutions</span>
            </div>
            {matchingInstitutions.length === 0 ? (
              <p className="text-slate-400 italic py-1">No matching institutions found</p>
            ) : (
              <div className="space-y-1.5">
                {matchingInstitutions.map((inst) => (
                  <div
                    key={inst.id}
                    onClick={() => {
                      onSelectInstitution(inst.id);
                      onNavigate('classification');
                      onClose();
                    }}
                    className="p-2.5 hover:bg-slate-50 rounded-lg cursor-pointer flex justify-between items-center transition border border-transparent hover:border-slate-200"
                  >
                    <div>
                      <span className="font-bold text-slate-900">{inst.name}</span>
                      <p className="text-slate-500 text-[11px] mt-0.5">
                        Permanent ID: <span className="font-mono">{inst.code}</span> • {inst.region}
                      </p>
                    </div>
                    <span className="text-slate-400 text-xs font-semibold">Switch & View &rarr;</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Applications / Requests */}
          <div className="border-t border-slate-100 pt-3">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <GitPullRequest className="w-3.5 h-3.5 text-purple-600" />
              <span>Release Applications</span>
            </div>
            {matchingRequests.length === 0 ? (
              <p className="text-slate-400 italic py-1">No matching requests found</p>
            ) : (
              <div className="space-y-1.5">
                {matchingRequests.map((req) => (
                  <div
                    key={req.id}
                    onClick={() => {
                      onSelectRequest(req.id);
                      onNavigate('tracking');
                      onClose();
                    }}
                    className="p-2.5 hover:bg-slate-50 rounded-lg cursor-pointer flex justify-between items-center transition border border-transparent hover:border-slate-200"
                  >
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-mono font-bold text-blue-800">{req.id}</span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-50 text-amber-800 border border-amber-200 font-medium">
                          {req.status}
                        </span>
                      </div>
                      <p className="text-slate-500 text-[11px] mt-0.5">
                        {req.currentStage} • Waiting at {req.nextResponsibleDesk}
                      </p>
                    </div>
                    <span className="font-mono font-bold text-slate-800">{formatINR(req.fdrAmount)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
