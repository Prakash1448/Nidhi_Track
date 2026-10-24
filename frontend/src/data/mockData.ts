import { Institution, FdrRecord, ReleaseRequest, RulebookVersion, ChecklistItem, AppNotification } from '../types';

export const INITIAL_INSTITUTIONS: Institution[] = [
  {
    id: "INST-01",
    name: "Apex Institute of Technology",
    code: "1-33290481",
    category: "Private Self-Financed",
    region: "Western (Maharashtra)",
    establishmentYear: 2012,
    currentApprovalStatus: "Approved (EOA 2026-27)",
    approvedIntake: 720,
    courses: ["Computer Science & Engg", "Electronics & Comm", "AI & Data Science"],
    nodalOfficer: "Dr. Arvind S. Kulkarni",
    contactEmail: "principal@apextech.edu.in",
    phone: "+91 22 2847 1190"
  },
  {
    id: "INST-02",
    name: "National College of Engineering",
    code: "1-10492817",
    category: "Private Aided / Autonomous",
    region: "Southern (Karnataka)",
    establishmentYear: 2004,
    currentApprovalStatus: "Approved (EOA 2026-27)",
    approvedIntake: 940,
    courses: ["Mechanical Engg", "Civil Engg", "Information Technology"],
    nodalOfficer: "Prof. S. Ramaswamy",
    contactEmail: "registrar@nceblr.ac.in",
    phone: "+91 80 2311 4455"
  },
  {
    id: "INST-03",
    name: "Greenfield Polytechnic Institute",
    code: "1-49201944",
    category: "Polytechnic / Diploma",
    region: "Northern (Uttar Pradesh)",
    establishmentYear: 2017,
    currentApprovalStatus: "Approved with Observations",
    approvedIntake: 360,
    courses: ["Diploma Electrical", "Diploma Mechanical"],
    nodalOfficer: "Er. Manoj Verma",
    contactEmail: "admin@greenfieldpoly.edu.in",
    phone: "+91 522 2490 882"
  },
  {
    id: "INST-04",
    name: "Saraswati School of Pharmacy",
    code: "1-88401923",
    category: "Pharmacy / Standalone",
    region: "Central (Madhya Pradesh)",
    establishmentYear: 2014,
    currentApprovalStatus: "Approved (EOA 2026-27)",
    approvedIntake: 180,
    courses: ["B.Pharm", "M.Pharm Pharmaceutics"],
    nodalOfficer: "Dr. Neha Sharma",
    contactEmail: "director@saraswatipharm.edu.in",
    phone: "+91 755 2671 990"
  },
  {
    id: "INST-05",
    name: "Horizon Management Studies",
    code: "1-77291039",
    category: "Management (PGDM)",
    region: "Northern (Delhi-NCR)",
    establishmentYear: 2019,
    currentApprovalStatus: "Under Extension Review",
    approvedIntake: 240,
    courses: ["PGDM Core", "PGDM Financial Mgmt"],
    nodalOfficer: "Prof. Vikram Malhotra",
    contactEmail: "v.malhotra@horizonmgmt.org",
    phone: "+91 11 2981 7744"
  }
];

export const INITIAL_FDRS: FdrRecord[] = [
  {
    id: "FDR-2018-9941",
    institutionId: "INST-01",
    fdrNumber: "PUNB00291048201",
    bankName: "Punjab National Bank",
    branch: "Nariman Point, Mumbai",
    amount: 3500000, // 35 Lakhs
    issueDate: "2018-11-15",
    maturityDate: "2026-11-15", // Maturing within 22 days!
    tenureYears: 8,
    depositType: "Mandatory Security Deposit (Establishment)",
    jointHolding: "Joint with Regional Officer, AICTE Western Region",
    status: "Maturing Soon",
    replacementOf: null,
    replacedBy: null,
    verificationStatus: "Verified in Demo",
    extractedBankRef: "PNB-MUM-CONF-9844",
    discrepancyFlag: false,
    docs: [
      { name: "Original FDR Copy", status: "Verified", date: "2018-11-20" },
      { name: "Bank Joint Pledge Letter", status: "Verified", date: "2018-11-22" },
      { name: "Current Encumbrance Certificate", status: "Pending Verification", date: "2026-10-10" }
    ]
  },
  {
    id: "FDR-2015-4421",
    institutionId: "INST-01",
    fdrNumber: "SBI00192837411",
    bankName: "State Bank of India",
    branch: "Chembur, Mumbai",
    amount: 1500000, // 15 Lakhs
    issueDate: "2015-06-10",
    maturityDate: "2023-06-10", // Matured!
    tenureYears: 8,
    depositType: "Additional Course Deposit (Electronics)",
    jointHolding: "Joint with Member Secretary, AICTE New Delhi",
    status: "Matured",
    replacementOf: null,
    replacedBy: null,
    verificationStatus: "Inconsistent — Review Required",
    extractedBankRef: "SBI-REC-MISMATCH-12",
    discrepancyFlag: true,
    discrepancyNotes: "Bank statement reports branch IFSC changed due to SBI associate merger; pledge confirmation letter not re-validated.",
    docs: [
      { name: "Original FDR Copy", status: "Verified", date: "2015-06-15" },
      { name: "Bank Confirmation Letter", status: "Inconsistent", date: "2023-07-01" }
    ]
  },
  {
    id: "FDR-2022-8819",
    institutionId: "INST-01",
    fdrNumber: "BARB0VJWAKH1",
    bankName: "Bank of Baroda",
    branch: "Andheri East, Mumbai",
    amount: 2500000, // 25 Lakhs
    issueDate: "2022-04-12",
    maturityDate: "2030-04-12",
    tenureYears: 8,
    depositType: "Integrated Campus Security Deposit",
    jointHolding: "Joint with Regional Officer, AICTE Western Region",
    status: "Active",
    replacementOf: "FDR-2014-1102",
    replacedBy: null,
    verificationStatus: "Verified in Demo",
    extractedBankRef: "BOB-2022-PLEDGE-019",
    discrepancyFlag: false,
    docs: [
      { name: "Replacement Lien Instrument", status: "Verified", date: "2022-04-15" },
      { name: "Old Instrument Cancellation Note", status: "Verified", date: "2022-04-15" }
    ]
  },
  {
    id: "FDR-2014-1102",
    institutionId: "INST-01",
    fdrNumber: "UBIN053219010",
    bankName: "Union Bank of India",
    branch: "Fort, Mumbai",
    amount: 2500000,
    issueDate: "2014-04-10",
    maturityDate: "2022-04-10",
    tenureYears: 8,
    depositType: "Security Deposit (Old Campus)",
    jointHolding: "Joint with Member Secretary AICTE",
    status: "Replaced & Archived",
    replacementOf: null,
    replacedBy: "FDR-2022-8819",
    verificationStatus: "Verified in Demo",
    extractedBankRef: "UBI-ARCHIVE-991",
    discrepancyFlag: false,
    docs: [
      { name: "Old Original FDR Record", status: "Archived", date: "2014-04-12" },
      { name: "Discharge & Renewal Endorsement", status: "Verified", date: "2022-04-14" }
    ]
  },
  {
    id: "FDR-2016-7731",
    institutionId: "INST-02",
    fdrNumber: "CNRB000109281",
    bankName: "Canara Bank",
    branch: "Malleshwaram, Bengaluru",
    amount: 5000000, // 50 Lakhs
    issueDate: "2016-08-20",
    maturityDate: "2026-08-20", // Matured 2 months ago
    tenureYears: 10,
    depositType: "Autonomous College Security Reserve",
    jointHolding: "Joint with RO AICTE South-Western",
    status: "Matured",
    replacementOf: null,
    replacedBy: null,
    verificationStatus: "Verified in Demo",
    extractedBankRef: "CAN-BLR-88219",
    discrepancyFlag: false,
    docs: [
      { name: "Original FDR", status: "Verified", date: "2016-08-25" }
    ]
  },
  {
    id: "FDR-2020-3392",
    institutionId: "INST-02",
    fdrNumber: "HDFC000018291",
    bankName: "HDFC Bank Ltd",
    branch: "Koramangala, Bengaluru",
    amount: 2000000,
    issueDate: "2020-03-01",
    maturityDate: "2028-03-01",
    tenureYears: 8,
    depositType: "Course Expansion Reserve",
    jointHolding: "Joint with AICTE SWRO",
    status: "Active",
    replacementOf: null,
    replacedBy: null,
    verificationStatus: "Verified in Demo",
    extractedBankRef: "HDFC-KOR-2020-1",
    discrepancyFlag: false,
    docs: []
  },
  {
    id: "FDR-2018-1209",
    institutionId: "INST-03",
    fdrNumber: "PUNB051900119",
    bankName: "Punjab National Bank",
    branch: "Hazratganj, Lucknow",
    amount: 1500000,
    issueDate: "2018-09-14",
    maturityDate: "2026-09-14",
    tenureYears: 8,
    depositType: "Diploma Establishment Deposit",
    jointHolding: "Joint with AICTE Northern Region",
    status: "Matured",
    replacementOf: null,
    replacedBy: null,
    verificationStatus: "Bank Confirmation Pending",
    extractedBankRef: "PNB-LKO-PENDING",
    discrepancyFlag: true,
    discrepancyNotes: "Verification request sent to PNB Lucknow branch on 20 Sep 2026; bank automated verification pending.",
    docs: []
  },
  {
    id: "FDR-2024-5501",
    institutionId: "INST-03",
    fdrNumber: "SBIN000401829",
    bankName: "State Bank of India",
    branch: "Alambagh, Lucknow",
    amount: 1000000,
    issueDate: "2024-02-10",
    maturityDate: "2032-02-10",
    tenureYears: 8,
    depositType: "New Lab Expansion Pledge",
    jointHolding: "Joint with AICTE Northern Region",
    status: "Active",
    replacementOf: null,
    replacedBy: null,
    verificationStatus: "Verified in Demo",
    extractedBankRef: "SBI-LKO-99120",
    discrepancyFlag: false,
    docs: []
  },
  {
    id: "FDR-2017-9022",
    institutionId: "INST-04",
    fdrNumber: "BKID000910283",
    bankName: "Bank of India",
    branch: "Arera Hills, Bhopal",
    amount: 2500000,
    issueDate: "2017-05-15",
    maturityDate: "2025-05-15",
    tenureYears: 8,
    depositType: "Pharmacy College Setup Deposit",
    jointHolding: "Joint with AICTE Central Region",
    status: "Matured",
    replacementOf: null,
    replacedBy: null,
    verificationStatus: "Verified in Demo",
    extractedBankRef: "BOI-BHO-88410",
    discrepancyFlag: false,
    docs: []
  },
  {
    id: "FDR-2021-6640",
    institutionId: "INST-05",
    fdrNumber: "ICIC000192801",
    bankName: "ICICI Bank Ltd",
    branch: "Connaught Place, New Delhi",
    amount: 3000000,
    issueDate: "2021-07-20",
    maturityDate: "2029-07-20",
    tenureYears: 8,
    depositType: "PGDM Standalone Security Deposit",
    jointHolding: "Joint with AICTE HQ New Delhi",
    status: "Active",
    replacementOf: null,
    replacedBy: null,
    verificationStatus: "Verified in Demo",
    extractedBankRef: "ICICI-CP-49102",
    discrepancyFlag: false,
    docs: []
  }
];

export const INITIAL_RELEASE_REQUESTS: ReleaseRequest[] = [
  {
    id: "REQ-2026-8812",
    institutionId: "INST-01",
    fdrId: "FDR-2018-9941",
    submissionDate: "2026-10-02",
    targetCompletionDate: "2026-11-01",
    fdrAmount: 3500000,
    status: "Clarification Requested",
    currentStage: "Stage 3: Regional Office Verification",
    waitingDays: 22,
    priority: "Urgent",
    priorityReason: "FDR matures within 22 days; awaiting institution reply to bank encumbrance certificate query.",
    nextResponsibleDesk: "Institution / Regional Officer (Western)",
    stages: [
      { name: "Request Submitted", status: "completed", date: "2026-10-02", note: "Online request generated with checklist." },
      { name: "Document Completeness Check", status: "completed", date: "2026-10-06", note: "Basic completeness verified by Finance Desk." },
      { name: "Regional Verification & Clarification", status: "in-progress", date: "2026-10-12", note: "Awaiting uploaded attested bank non-encumbrance letter." },
      { name: "Cross-Bureau Clearance", status: "pending", date: null, note: "Approval Cell & Legal Cell clearances required." },
      { name: "Authorised Council Review", status: "pending", date: null, note: "Finance Officer / Member Secretary review." },
      { name: "Final Outcome & NOC", status: "pending", date: null, note: "Issue of Form-F FDR Discharge NOC." }
    ],
    notes: [
      { role: "Council Reviewer (Finance)", date: "2026-10-12", text: "Discrepancy noted in branch IFSC code on bank certificate. Institution requested to re-upload clear confirmation from PNB." }
    ]
  },
  {
    id: "REQ-2026-7419",
    institutionId: "INST-02",
    fdrId: "FDR-2016-7731",
    submissionDate: "2026-08-25",
    targetCompletionDate: "2026-09-25",
    fdrAmount: 5000000,
    status: "Bureau Clearance Pending",
    currentStage: "Stage 4: Approval Bureau Clearance",
    waitingDays: 60,
    priority: "Overdue Bottleneck",
    priorityReason: "Overdue by 29 days. Stuck at Approval Bureau for mandatory intake compliance clearance.",
    nextResponsibleDesk: "Director (Approval Bureau - South)",
    stages: [
      { name: "Request Submitted", status: "completed", date: "2026-08-25", note: "Institution submitted release request post maturity." },
      { name: "Document Completeness Check", status: "completed", date: "2026-08-28", note: "All primary documents verified." },
      { name: "Regional Verification", status: "completed", date: "2026-09-08", note: "Canara Bank pledge discharge verified." },
      { name: "Cross-Bureau Clearance", status: "in-progress", date: "2026-09-15", note: "Approval Bureau pending confirmation of 10-year defect-free operations." },
      { name: "Authorised Council Review", status: "pending", date: null, note: "" },
      { name: "Final Outcome & NOC", status: "pending", date: null, note: "" }
    ],
    notes: [
      { role: "RO Bengaluru", date: "2026-09-08", text: "Physical FDR original is accounted for and safe in Council custody." }
    ]
  },
  {
    id: "REQ-2026-9041",
    institutionId: "INST-04",
    fdrId: "FDR-2017-9022",
    submissionDate: "2026-09-10",
    targetCompletionDate: "2026-10-10",
    fdrAmount: 2500000,
    status: "Authorised Review Ready",
    currentStage: "Stage 5: Authorised Review",
    waitingDays: 44,
    priority: "High",
    priorityReason: "All clearances received. Awaiting simulated Member Secretary sign-off for NOC generation.",
    nextResponsibleDesk: "Member Secretary / Competent Authority",
    stages: [
      { name: "Request Submitted", status: "completed", date: "2026-09-10", note: "Complete application submitted." },
      { name: "Document Completeness Check", status: "completed", date: "2026-09-14", note: "All 6 required documents validated." },
      { name: "Regional Verification", status: "completed", date: "2026-09-22", note: "BOI verification clean." },
      { name: "Cross-Bureau Clearance", status: "completed", date: "2026-10-02", note: "Approval Cell No-Dues Clearance Ref: AC/2026/8190 recorded." },
      { name: "Authorised Council Review", status: "in-progress", date: "2026-10-15", note: "Case put up for formal decision." },
      { name: "Final Outcome & NOC", status: "pending", date: null, note: "" }
    ],
    notes: [
      { role: "Central RO Bhopal", date: "2026-09-22", text: "Course completed 8 years without any outstanding penal fee or student grievance." }
    ]
  },
  {
    id: "REQ-2026-6102",
    institutionId: "INST-01",
    fdrId: "FDR-2015-4421",
    submissionDate: "2026-10-18",
    targetCompletionDate: "2026-11-18",
    fdrAmount: 1500000,
    status: "Initial Review",
    currentStage: "Stage 2: Document Completeness Check",
    waitingDays: 6,
    priority: "Medium",
    priorityReason: "Matured record. Initial verification flagged IFSC mismatch in old SBI record.",
    nextResponsibleDesk: "Finance Cell Case Officer",
    stages: [
      { name: "Request Submitted", status: "completed", date: "2026-10-18", note: "Submitted via institution portal." },
      { name: "Document Completeness Check", status: "in-progress", date: "2026-10-20", note: "Scrutiny in progress." },
      { name: "Regional Verification", status: "pending", date: null, note: "" },
      { name: "Cross-Bureau Clearance", status: "pending", date: null, note: "" },
      { name: "Authorised Council Review", status: "pending", date: null, note: "" },
      { name: "Final Outcome & NOC", status: "pending", date: null, note: "" }
    ],
    notes: []
  },
  {
    id: "REQ-2025-4122",
    institutionId: "INST-01",
    fdrId: "FDR-2014-1102",
    submissionDate: "2022-03-10",
    targetCompletionDate: "2022-04-10",
    fdrAmount: 2500000,
    status: "Closed / Replaced",
    currentStage: "Stage 6: Outcome Recorded",
    waitingDays: 0,
    priority: "Closed",
    priorityReason: "Replacement FDR BARB0VJWAKH1 accepted and linked; old FDR released & discharged.",
    nextResponsibleDesk: "Archived",
    stages: [
      { name: "Request Submitted", status: "completed", date: "2022-03-10", note: "Roll-over & replacement request." },
      { name: "Document Completeness Check", status: "completed", date: "2022-03-15", note: "Passed." },
      { name: "Regional Verification", status: "completed", date: "2022-03-24", note: "Bank verified." },
      { name: "Cross-Bureau Clearance", status: "completed", date: "2022-04-01", note: "Cleared." },
      { name: "Authorised Council Review", status: "completed", date: "2022-04-08", note: "Approved replacement." },
      { name: "Final Outcome & NOC", status: "completed", date: "2022-04-14", note: "NOC Issued: NOC/WR/2022/9912. Replaced by FDR-2022-8819." }
    ],
    notes: []
  },
  {
    id: "REQ-2026-5531",
    institutionId: "INST-03",
    fdrId: "FDR-2018-1209",
    submissionDate: "2026-10-05",
    targetCompletionDate: "2026-11-05",
    fdrAmount: 1500000,
    status: "Bank Confirmation Pending",
    currentStage: "Stage 3: Regional Office Verification",
    waitingDays: 19,
    priority: "High",
    priorityReason: "Automated bank pledge confirmation pending from PNB Hazratganj.",
    nextResponsibleDesk: "Bank Nodal Desk / RO Northern",
    stages: [
      { name: "Request Submitted", status: "completed", date: "2026-10-05", note: "Request submitted." },
      { name: "Document Completeness Check", status: "completed", date: "2026-10-08", note: "Documents verified." },
      { name: "Regional Verification", status: "in-progress", date: "2026-10-10", note: "Simulated bank API status: Confirmation Awaited." },
      { name: "Cross-Bureau Clearance", status: "pending", date: null, note: "" },
      { name: "Authorised Council Review", status: "pending", date: null, note: "" },
      { name: "Final Outcome & NOC", status: "pending", date: null, note: "" }
    ],
    notes: []
  }
];

export const INITIAL_CHECKLIST_ITEMS: ChecklistItem[] = [
  {
    id: "chk-1",
    name: "Original Fixed Deposit Receipt (FDR) / Joint Pledge Deed",
    clause: "APH 2024-27 Clause 1.4(b)",
    reason: "Proof of lock-in deposit creation under joint lien with Regional Officer.",
    status: "Complete",
    fileName: "PUNB_Original_FDR_35L.pdf",
    date: "Verified 15 Nov 2018"
  },
  {
    id: "chk-2",
    name: "Attested Bank Confirmation / Non-Encumbrance Certificate",
    clause: "APH 2024-27 Clause 1.4(g)",
    reason: "Bank branch manager verification that no loan/overdraft exists against the FDR.",
    status: "Needs Review",
    fileName: "PNB_NonEncumbrance_Draft.pdf",
    date: "Requires branch re-attestation"
  },
  {
    id: "chk-3",
    name: "Society Resolution for FDR Release / Refund Account Mandate",
    clause: "APH 2024-27 Clause 1.6",
    reason: "Authorized resolution by trust board nominating signatory and official refund bank account.",
    status: "Complete",
    fileName: "Trust_Resolution_2026_09.pdf",
    date: "Submitted 05 Oct 2026"
  },
  {
    id: "chk-4",
    name: "Affidavit on Non-Judicial Stamp Paper (Form 1)",
    clause: "APH 2024-27 Appendix 14",
    reason: "Sworn legal undertaking affirming no pending student dues, fee disputes or court stay.",
    status: "Missing",
    fileName: null,
    date: "Pending upload"
  },
  {
    id: "chk-5",
    name: "Copy of Latest Extension of Approval (EOA) Letter",
    clause: "APH 2024-27 Section 2",
    reason: "Confirmation that the institute maintained compliant operational standing through tenure.",
    status: "Complete",
    fileName: "AICTE_EOA_2026_27_Apex.pdf",
    date: "Auto-synced from Council Portal"
  }
];

export const RULEBOOK_VERSIONS: RulebookVersion[] = [
  {
    version: "APH 2024-27 (Current Active)",
    approvedDate: "2024-03-01",
    mandatoryTenureYears: 8,
    retentionPolicy: "Full term till final cohort passes out or autonomous status verified.",
    digitalBankGuaranteeAllowed: true,
    jointHoldingRequirement: "Mandatory joint lien with Regional Officer",
    transitionalClause: "Existing FDRs valid until natural maturity; renewals must adhere to digital lien register."
  },
  {
    version: "APH 2020-23 (Superseded)",
    approvedDate: "2020-02-15",
    mandatoryTenureYears: 10,
    retentionPolicy: "Physical FDR safe custody at Regional Office with manual pledge endorsement.",
    digitalBankGuaranteeAllowed: false,
    jointHoldingRequirement: "Physical FDR deposited in council treasury.",
    transitionalClause: "Legacy physical safe deposit rules apply."
  }
];

export const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: "notif-1",
    title: "Maturity Alert: FDR-2018-9941",
    message: "Maturing in 22 days (15 Nov 2026). Immediate diagnostic scan recommended.",
    type: "urgent",
    time: "10 mins ago",
    targetPage: "readiness"
  },
  {
    id: "notif-2",
    title: "Verification Query Recorded",
    message: "Council requested attested bank confirmation statement for REQ-2026-8812.",
    type: "info",
    time: "2 hours ago",
    targetPage: "verification"
  },
  {
    id: "notif-3",
    title: "Clearance Granted (Bureau VI)",
    message: "Finance Cell recorded preliminary clearance for Apex Institute.",
    type: "success",
    time: "Yesterday",
    targetPage: "tracking"
  }
];
