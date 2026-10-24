export function formatINR(val: number): string {
  return "₹" + Number(val).toLocaleString('en-IN');
}

export function formatLakhs(val: number): string {
  const lakhs = val / 100000;
  if (lakhs >= 100) {
    return `₹${(lakhs / 100).toFixed(2)} Cr`;
  }
  return `₹${lakhs.toFixed(1)} L`;
}

export function getStatusBadgeClass(status: string): string {
  switch (status) {
    case 'Active':
      return 'bg-emerald-50 text-emerald-800 border border-emerald-200';
    case 'Maturing Soon':
      return 'bg-amber-100 text-amber-900 border border-amber-300 font-bold';
    case 'Matured':
      return 'bg-rose-100 text-rose-800 border border-rose-200 font-bold';
    case 'Replaced & Archived':
      return 'bg-slate-100 text-slate-600 border border-slate-200';
    case 'Verified in Demo':
    case 'Complete':
      return 'bg-emerald-50 text-emerald-700 border border-emerald-200';
    case 'Inconsistent — Review Required':
    case 'Needs Review':
      return 'bg-amber-50 text-amber-800 border border-amber-200';
    case 'Bank Confirmation Pending':
    case 'Missing':
      return 'bg-rose-50 text-rose-700 border border-rose-200';
    default:
      return 'bg-slate-100 text-slate-700 border border-slate-200';
  }
}

export function getPriorityBadgeClass(priority: string): string {
  switch (priority) {
    case 'Overdue Bottleneck':
      return 'bg-rose-100 text-rose-800 border border-rose-300 font-bold';
    case 'Urgent':
      return 'bg-amber-100 text-amber-900 border border-amber-300 font-bold';
    case 'High':
      return 'bg-orange-100 text-orange-800 border border-orange-200';
    case 'Medium':
      return 'bg-blue-50 text-blue-700 border border-blue-200';
    case 'Closed':
      return 'bg-slate-100 text-slate-600 border border-slate-200';
    default:
      return 'bg-slate-100 text-slate-700';
  }
}
