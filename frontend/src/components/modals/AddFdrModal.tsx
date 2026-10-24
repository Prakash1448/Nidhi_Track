import React, { useState } from 'react';
import { X, PlusCircle, GitMerge } from 'lucide-react';
import { FdrRecord, Institution } from '../../types';

interface AddFdrModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeInstitution: Institution;
  existingFdrs: FdrRecord[];
  onAddFdr: (newFdr: FdrRecord) => void;
}

export const AddFdrModal: React.FC<AddFdrModalProps> = ({
  isOpen,
  onClose,
  activeInstitution,
  existingFdrs,
  onAddFdr,
}) => {
  const [fdrNumber, setFdrNumber] = useState('');
  const [bankName, setBankName] = useState('State Bank of India');
  const [branch, setBranch] = useState('Main Branch, Mumbai');
  const [amount, setAmount] = useState('2500000');
  const [depositType, setDepositType] = useState('Course Expansion Reserve');
  const [isRollover, setIsRollover] = useState(false);
  const [predecessorId, setPredecessorId] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newId = `FDR-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    const newFdr: FdrRecord = {
      id: newId,
      institutionId: activeInstitution.id,
      fdrNumber: fdrNumber || `FDR${Math.floor(10000000 + Math.random() * 90000000)}`,
      bankName,
      branch,
      amount: Number(amount) || 2500000,
      issueDate: '2026-10-24',
      maturityDate: '2034-10-24',
      tenureYears: 8,
      depositType,
      jointHolding: `Joint with Regional Officer, AICTE ${activeInstitution.region}`,
      status: 'Active',
      replacementOf: isRollover && predecessorId ? predecessorId : null,
      replacedBy: null,
      verificationStatus: 'Verified in Demo',
      extractedBankRef: `CONF-${Math.floor(10000 + Math.random() * 90000)}`,
      discrepancyFlag: false,
      docs: [
        { name: 'Original FDR Instrument Copy', status: 'Verified', date: '2026-10-24' },
        { name: 'Bank Joint Pledge Letter', status: 'Verified', date: '2026-10-24' }
      ]
    };

    onAddFdr(newFdr);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex justify-between items-start pb-3 border-b border-slate-100">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700">
              Master Ledger Creation
            </span>
            <h3 className="text-base font-bold text-slate-900 mt-0.5">
              Add or Rollover Fixed Deposit (FDR)
            </h3>
            <p className="text-xs text-slate-500">{activeInstitution.name}</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="my-4 space-y-3.5 text-xs">
          <div>
            <label className="font-semibold text-slate-700 block mb-1">FDR Instrument Number:</label>
            <input
              type="text"
              required
              placeholder="e.g., SBIN00291048201"
              value={fdrNumber}
              onChange={(e) => setFdrNumber(e.target.value)}
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 font-mono"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Bank Name:</label>
              <select
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                <option value="State Bank of India">State Bank of India</option>
                <option value="Punjab National Bank">Punjab National Bank</option>
                <option value="Bank of Baroda">Bank of Baroda</option>
                <option value="Canara Bank">Canara Bank</option>
                <option value="Union Bank of India">Union Bank of India</option>
                <option value="HDFC Bank Ltd">HDFC Bank Ltd</option>
                <option value="ICICI Bank Ltd">ICICI Bank Ltd</option>
              </select>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Principal Amount (₹):</label>
              <input
                type="number"
                step="50000"
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Branch Location & IFSC:</label>
            <input
              type="text"
              required
              value={branch}
              onChange={(e) => setBranch(e.target.value)}
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Deposit Type / Obligation:</label>
            <select
              value={depositType}
              onChange={(e) => setDepositType(e.target.value)}
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              <option value="Mandatory Security Deposit (Establishment)">Mandatory Security Deposit (Establishment)</option>
              <option value="Course Expansion Reserve">Course Expansion Reserve</option>
              <option value="Integrated Campus Security Deposit">Integrated Campus Security Deposit</option>
              <option value="New Lab Expansion Pledge">New Lab Expansion Pledge</option>
            </select>
          </div>

          {/* Rollover / Replacement Toggle */}
          <div className="p-3 bg-purple-50/60 rounded-xl border border-purple-200 space-y-2">
            <label className="flex items-center space-x-2 cursor-pointer font-bold text-purple-900">
              <input
                type="checkbox"
                checked={isRollover}
                onChange={(e) => setIsRollover(e.target.checked)}
                className="rounded text-purple-600 focus:ring-purple-500"
              />
              <span className="flex items-center gap-1">
                <GitMerge className="w-3.5 h-3.5" />
                This is a Rollover / Replacement of an Older Instrument
              </span>
            </label>

            {isRollover && (
              <div>
                <label className="text-[11px] text-slate-600 block mb-1 font-medium">
                  Select Predecessor Instrument to Link Lineage:
                </label>
                <select
                  value={predecessorId}
                  onChange={(e) => setPredecessorId(e.target.value)}
                  className="w-full p-2 bg-white border border-slate-200 rounded-lg text-slate-800 font-mono text-xs"
                >
                  <option value="">-- Choose Older FDR --</option>
                  {existingFdrs
                    .filter((f) => f.institutionId === activeInstitution.id)
                    .map((f) => (
                      <option key={f.id} value={f.id}>
                        {f.fdrNumber} ({f.bankName}) - Matured {f.maturityDate}
                      </option>
                    ))}
                </select>
                <p className="text-[10px] text-purple-700 mt-1">
                  Connecting lineage ensures the historical 8-year deposit count and original approval link are preserved.
                </p>
              </div>
            )}
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
              className="px-5 py-2 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded-lg shadow-xs flex items-center space-x-1"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Record FDR in Ledger</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
