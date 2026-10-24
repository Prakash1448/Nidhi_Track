import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Institution from '../models/Institution.js';
import FDR from '../models/FDR.js';
import ReleaseRequest from '../models/ReleaseRequest.js';
import ChecklistItem from '../models/ChecklistItem.js';
import Notification from '../models/Notification.js';

dotenv.config();

// Mock Data (from mockData.ts)
const institutions = [
  {
    institutionId: "INST-01",
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
    institutionId: "INST-02",
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
    institutionId: "INST-03",
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
    institutionId: "INST-04",
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
    institutionId: "INST-05",
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

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB Connected');
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error);
    process.exit(1);
  }
};

const seedDatabase = async () => {
  try {
    await connectDB();

    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await User.deleteMany({});
    await Institution.deleteMany({});
    await FDR.deleteMany({});
    await ReleaseRequest.deleteMany({});
    await ChecklistItem.deleteMany({});
    await Notification.deleteMany({});
    console.log('✅ Data cleared');

    // Create Institutions
    console.log('📚 Creating institutions...');
    const createdInstitutions = await Institution.insertMany(institutions);
    console.log(`✅ ${createdInstitutions.length} institutions created`);

    // Create Users (using .create() instead of .insertMany() to trigger pre-save hooks)
    console.log('👥 Creating users...');
    const users = [
      {
        email: 'admin@aicte.gov.in',
        password: 'admin123',
        role: 'admin',
        name: 'AICTE Administrator'
      },
      {
        email: 'council@aicte.gov.in',
        password: 'council123',
        role: 'council',
        name: 'Council Officer'
      }
    ];

    // Create institution users
    for (const inst of createdInstitutions) {
      users.push({
        email: inst.contactEmail,
        password: 'password123',
        role: 'institution',
        institutionId: inst._id,
        name: inst.nodalOfficer,
        phone: inst.phone
      });
    }

    // Create users one by one to trigger password hashing
    const createdUsers = [];
    for (const userData of users) {
      const user = await User.create(userData);
      createdUsers.push(user);
    }
    console.log(`✅ ${createdUsers.length} users created`);

    // Create FDRs
    console.log('💰 Creating FDRs...');
    const fdrs = [
      {
        fdrId: "FDR-2018-9941",
        institutionId: createdInstitutions[0]._id,
        fdrNumber: "PUNB00291048201",
        bankName: "Punjab National Bank",
        branch: "Nariman Point, Mumbai",
        amount: 3500000,
        issueDate: new Date("2018-11-15"),
        maturityDate: new Date("2026-11-15"),
        tenureYears: 8,
        depositType: "Mandatory Security Deposit (Establishment)",
        jointHolding: "Joint with Regional Officer, AICTE Western Region",
        status: "Maturing Soon",
        verificationStatus: "Verified in Demo",
        extractedBankRef: "PNB-MUM-CONF-9844",
        discrepancyFlag: false,
        documents: [
          { name: "Original FDR Copy", status: "Verified", date: "2018-11-20" },
          { name: "Bank Joint Pledge Letter", status: "Verified", date: "2018-11-22" }
        ]
      },
      {
        fdrId: "FDR-2015-4421",
        institutionId: createdInstitutions[0]._id,
        fdrNumber: "SBI00192837411",
        bankName: "State Bank of India",
        branch: "Chembur, Mumbai",
        amount: 1500000,
        issueDate: new Date("2015-06-10"),
        maturityDate: new Date("2023-06-10"),
        tenureYears: 8,
        depositType: "Additional Course Deposit (Electronics)",
        jointHolding: "Joint with Member Secretary, AICTE New Delhi",
        status: "Matured",
        verificationStatus: "Inconsistent — Review Required",
        extractedBankRef: "SBI-REC-MISMATCH-12",
        discrepancyFlag: true,
        discrepancyNotes: "Bank statement reports branch IFSC changed due to SBI associate merger; pledge confirmation letter not re-validated.",
        documents: [
          { name: "Original FDR Copy", status: "Verified", date: "2015-06-15" },
          { name: "Bank Confirmation Letter", status: "Inconsistent", date: "2023-07-01" }
        ]
      },
      {
        fdrId: "FDR-2016-7731",
        institutionId: createdInstitutions[1]._id,
        fdrNumber: "CNRB000109281",
        bankName: "Canara Bank",
        branch: "Malleshwaram, Bengaluru",
        amount: 5000000,
        issueDate: new Date("2016-08-20"),
        maturityDate: new Date("2026-08-20"),
        tenureYears: 10,
        depositType: "Autonomous College Security Reserve",
        jointHolding: "Joint with RO AICTE South-Western",
        status: "Matured",
        verificationStatus: "Verified in Demo",
        extractedBankRef: "CAN-BLR-88219",
        discrepancyFlag: false,
        documents: []
      }
    ];

    const createdFDRs = await FDR.insertMany(fdrs);
    console.log(`✅ ${createdFDRs.length} FDRs created`);

    // Create Release Requests
    console.log('📝 Creating release requests...');
    const requests = [
      {
        requestId: "REQ-2026-8812",
        institutionId: createdInstitutions[0]._id,
        fdrId: createdFDRs[0]._id,
        submissionDate: new Date("2026-10-02"),
        targetCompletionDate: new Date("2026-11-01"),
        fdrAmount: 3500000,
        status: "Clarification Requested",
        currentStage: "Stage 3: Regional Office Verification",
        waitingDays: 22,
        priority: "Urgent",
        priorityReason: "FDR matures within 22 days; awaiting institution reply to bank encumbrance certificate query.",
        nextResponsibleDesk: "Institution / Regional Officer (Western)",
        stages: [
          { name: "Request Submitted", status: "completed", date: new Date("2026-10-02"), note: "Online request generated with checklist." },
          { name: "Document Completeness Check", status: "completed", date: new Date("2026-10-06"), note: "Basic completeness verified by Finance Desk." },
          { name: "Regional Verification & Clarification", status: "in-progress", date: new Date("2026-10-12"), note: "Awaiting uploaded attested bank non-encumbrance letter." },
          { name: "Cross-Bureau Clearance", status: "pending", date: null, note: "Approval Cell & Legal Cell clearances required." },
          { name: "Authorised Council Review", status: "pending", date: null, note: "Finance Officer / Member Secretary review." },
          { name: "Final Outcome & NOC", status: "pending", date: null, note: "Issue of Form-F FDR Discharge NOC." }
        ],
        notes: [
          { role: "Council Reviewer (Finance)", date: new Date("2026-10-12"), text: "Discrepancy noted in branch IFSC code on bank certificate. Institution requested to re-upload clear confirmation from PNB." }
        ]
      }
    ];

    const createdRequests = await ReleaseRequest.insertMany(requests);
    console.log(`✅ ${createdRequests.length} release requests created`);

    // Create Checklist Items
    console.log('✅ Creating checklist items...');
    const checklistItems = [
      {
        institutionId: createdInstitutions[0]._id,
        itemId: "chk-1",
        name: "Original Fixed Deposit Receipt (FDR) / Joint Pledge Deed",
        clause: "APH 2024-27 Clause 1.4(b)",
        reason: "Proof of lock-in deposit creation under joint lien with Regional Officer.",
        status: "Complete",
        fileName: "PUNB_Original_FDR_35L.pdf",
        date: "Verified 15 Nov 2018"
      },
      {
        institutionId: createdInstitutions[0]._id,
        itemId: "chk-2",
        name: "Attested Bank Confirmation / Non-Encumbrance Certificate",
        clause: "APH 2024-27 Clause 1.4(g)",
        reason: "Bank branch manager verification that no loan/overdraft exists against the FDR.",
        status: "Needs Review",
        fileName: "PNB_NonEncumbrance_Draft.pdf",
        date: "Requires branch re-attestation"
      }
    ];

    await ChecklistItem.insertMany(checklistItems);
    console.log(`✅ Checklist items created`);

    console.log('\n🎉 Database seeded successfully!');
    console.log('\n📊 Summary:');
    console.log(`   - Institutions: ${createdInstitutions.length}`);
    console.log(`   - Users: ${createdUsers.length}`);
    console.log(`   - FDRs: ${createdFDRs.length}`);
    console.log(`   - Requests: ${createdRequests.length}`);
    console.log('\n🔐 Login Credentials:');
    console.log('   Admin: admin@aicte.gov.in / admin123');
    console.log('   Council: council@aicte.gov.in / council123');
    console.log('   Institution: principal@apextech.edu.in / password123');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

// Run seed
seedDatabase();
