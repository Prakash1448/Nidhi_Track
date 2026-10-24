export type Role = 'institution' | 'council';

export type NavPage = 
  | 'dashboard'
  | 'classification'
  | 'checklist'
  | 'register'
  | 'verification'
  | 'readiness'
  | 'formalRequest'
  | 'tracking'
  | 'councilDashboard'
  | 'casePrioritisation'
  | 'explorer'
  | 'councilVerification'
  | 'crossBureau'
  | 'decision'
  | 'ruleImpact';

export interface Institution {
  id: string;
  name: string;
  code: string;
  category: string;
  region: string;
  establishmentYear: number;
  currentApprovalStatus: string;
  approvedIntake: number;
  courses: string[];
  nodalOfficer: string;
  contactEmail: string;
  phone: string;
}

export type FdrStatus = 'Active' | 'Maturing Soon' | 'Matured' | 'Replaced & Archived';

export interface FdrDocument {
  name: string;
  status: 'Verified' | 'Pending Verification' | 'Inconsistent' | 'Archived';
  date: string;
}

export interface FdrRecord {
  id: string;
  institutionId: string;
  fdrNumber: string;
  bankName: string;
  branch: string;
  amount: number;
  issueDate: string;
  maturityDate: string;
  tenureYears: number;
  depositType: string;
  jointHolding: string;
  status: FdrStatus;
  replacementOf: string | null;
  replacedBy: string | null;
  verificationStatus: 'Verified in Demo' | 'Inconsistent — Review Required' | 'Bank Confirmation Pending';
  extractedBankRef: string;
  discrepancyFlag: boolean;
  discrepancyNotes?: string;
  docs: FdrDocument[];
}

export type StageStatus = 'completed' | 'in-progress' | 'pending';

export interface WorkflowStage {
  name: string;
  status: StageStatus;
  date: string | null;
  note: string;
}

export interface RequestNote {
  role: string;
  date: string;
  text: string;
}

export interface ReleaseRequest {
  id: string;
  institutionId: string;
  fdrId: string;
  submissionDate: string;
  targetCompletionDate: string;
  fdrAmount: number;
  status: string;
  currentStage: string;
  waitingDays: number;
  priority: 'Urgent' | 'Overdue Bottleneck' | 'High' | 'Medium' | 'Closed';
  priorityReason: string;
  nextResponsibleDesk: string;
  stages: WorkflowStage[];
  notes: RequestNote[];
}

export interface RulebookVersion {
  version: string;
  approvedDate: string;
  mandatoryTenureYears: number;
  retentionPolicy: string;
  digitalBankGuaranteeAllowed: boolean;
  jointHoldingRequirement: string;
  transitionalClause: string;
}

export interface ChecklistItem {
  id: string;
  name: string;
  clause: string;
  reason: string;
  status: 'Complete' | 'Needs Review' | 'Missing';
  fileName: string | null;
  date: string;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'urgent' | 'info' | 'success';
  time: string;
  targetPage?: NavPage;
}
