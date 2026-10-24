import React, { useState, useEffect } from 'react';
import { 
  Role, 
  NavPage, 
  Institution, 
  FdrRecord, 
  ReleaseRequest, 
  ChecklistItem, 
  AppNotification 
} from './types';
import { 
  INITIAL_INSTITUTIONS, 
  INITIAL_FDRS, 
  INITIAL_RELEASE_REQUESTS, 
  INITIAL_CHECKLIST_ITEMS, 
  INITIAL_NOTIFICATIONS 
} from './data/mockData';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { Toast } from './components/Toast';
import { LoginPage } from './pages/LoginPage';

// Modals
import { WalkthroughModal } from './components/modals/WalkthroughModal';
import { GlobalSearchModal } from './components/modals/GlobalSearchModal';
import { FdrDossierModal } from './components/modals/FdrDossierModal';
import { DocumentModal } from './components/modals/DocumentModal';
import { TimelineModal } from './components/modals/TimelineModal';
import { CouncilActionModal } from './components/modals/CouncilActionModal';
import { AddFdrModal } from './components/modals/AddFdrModal';

// Views
import { InstitutionDashboard } from './views/InstitutionDashboard';
import { ClassificationProfileView } from './views/ClassificationProfileView';
import { TailoredChecklist } from './views/TailoredChecklist';
import { FdrRegisterView } from './views/FdrRegisterView';
import { VerificationWorkspace } from './views/VerificationWorkspace';
import { PreliminaryReadinessView } from './views/PreliminaryReadinessView';
import { FormalReleaseWizard } from './views/FormalReleaseWizard';
import { ReleaseTrackingView } from './views/ReleaseTrackingView';
import { CouncilDashboard } from './views/CouncilDashboard';
import { CasePrioritisationView } from './views/CasePrioritisationView';
import { ExplorerView } from './views/ExplorerView';
import { CouncilVerificationView } from './views/CouncilVerificationView';
import { CrossBureauIntelligence } from './views/CrossBureauIntelligence';
import { AuthorisedDecisionView } from './views/AuthorisedDecisionView';
import { RuleImpactChecker } from './views/RuleImpactChecker';

const LOCAL_STORAGE_KEY = 'AICTE_FDR_APP_STATE_V2';

export default function App() {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Global State
  const [currentRole, setCurrentRole] = useState<Role>('institution');
  const [activePage, setActivePage] = useState<NavPage>('dashboard');
  const [activeInstitutionId, setActiveInstitutionId] = useState<string>('INST-01');
  const [institutions, setInstitutions] = useState<Institution[]>(INITIAL_INSTITUTIONS);
  const [fdrs, setFdrs] = useState<FdrRecord[]>(INITIAL_FDRS);
  const [requests, setRequests] = useState<ReleaseRequest[]>(INITIAL_RELEASE_REQUESTS);
  const [checklistItems, setChecklistItems] = useState<ChecklistItem[]>(INITIAL_CHECKLIST_ITEMS);
  const [notifications] = useState<AppNotification[]>(INITIAL_NOTIFICATIONS);
  const [selectedFdrForReadiness, setSelectedFdrForReadiness] = useState<string>('FDR-2018-9941');

  // Modal States
  const [isWalkthroughOpen, setIsWalkthroughOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [dossierFdrId, setDossierFdrId] = useState<string | null>(null);
  const [docPreview, setDocPreview] = useState<{ title: string; fileName: string } | null>(null);
  const [timelineReqId, setTimelineReqId] = useState<string | null>(null);
  const [councilActionReqId, setCouncilActionReqId] = useState<string | null>(null);
  const [isAddFdrOpen, setIsAddFdrOpen] = useState(false);

  // Toast State
  const [toast, setToast] = useState<{ show: boolean; title: string; message: string }>({
    show: false,
    title: '',
    message: ''
  });

  // Check authentication on mount
  useEffect(() => {
    const checkAuth = () => {
      try {
        const token = localStorage.getItem('nidhi_token');
        const userStr = localStorage.getItem('nidhi_user');
        
        if (token && userStr) {
          const user = JSON.parse(userStr);
          setCurrentUser(user);
          setIsAuthenticated(true);
          
          // Set role based on user
          if (user.role === 'institution') {
            setCurrentRole('institution');
            setActivePage('dashboard');
            window.history.pushState({}, '', '/dashboard');
            // Set institution ID if available
            if (user.institutionId) {
              // Find the institution by MongoDB _id
              const userInstitution = institutions.find(inst => 
                inst.id === user.institutionId || inst.id === 'INST-01'
              );
              if (userInstitution) {
                setActiveInstitutionId(userInstitution.id);
              }
            }
          } else {
            setCurrentRole('council');
            setActivePage('councilDashboard');
            window.history.pushState({}, '', '/councilDashboard');
          }
        } else {
          window.history.pushState({}, '', '/login');
        }
      } catch (e) {
        console.error('Auth check failed:', e);
        window.history.pushState({}, '', '/login');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Load from localStorage on initial mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.fdrs) setFdrs(parsed.fdrs);
        if (parsed.requests) setRequests(parsed.requests);
        if (parsed.checklistItems) setChecklistItems(parsed.checklistItems);
        if (parsed.activeInstitutionId) setActiveInstitutionId(parsed.activeInstitutionId);
      }
    } catch (e) {
      console.warn('Failed to parse saved state from local storage', e);
    }
  }, []);

  // Sync state to localStorage
  const saveState = (updatedFdrs: FdrRecord[], updatedRequests: ReleaseRequest[], updatedChecklist?: ChecklistItem[]) => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify({
        fdrs: updatedFdrs,
        requests: updatedRequests,
        checklistItems: updatedChecklist || checklistItems,
        activeInstitutionId
      }));
    } catch (e) {
      console.warn('Failed to save state to local storage', e);
    }
  };

  const showToast = (title: string, message: string) => {
    setToast({ show: true, title, message });
    setTimeout(() => {
      setToast((prev) => ({ ...prev, show: false }));
    }, 3500);
  };

  const activeInstitution = institutions.find((i) => i.id === activeInstitutionId) || institutions[0];

  const handleLoginSuccess = (user: any, token: string) => {
    setCurrentUser(user);
    setIsAuthenticated(true);
    
    // Set role and default page based on user
    if (user.role === 'institution') {
      setCurrentRole('institution');
      setActivePage('dashboard');
      window.history.pushState({}, '', '/dashboard');
      showToast('Welcome!', `Logged in as ${user.name}`);
    } else {
      setCurrentRole('council');
      setActivePage('councilDashboard');
      window.history.pushState({}, '', '/councilDashboard');
      showToast('Welcome!', `Logged in as ${user.role === 'admin' ? 'Administrator' : 'Council Officer'}`);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('nidhi_token');
    localStorage.removeItem('nidhi_user');
    setIsAuthenticated(false);
    setCurrentUser(null);
    window.history.pushState({}, '', '/login');
    showToast('Logged Out', 'You have been logged out successfully');
  };

  const handleRoleChange = (role: Role) => {
    // Only allow role switching for council/admin users
    if (currentUser?.role === 'institution') {
      showToast('Access Denied', 'Institution users cannot switch portals');
      return;
    }
    
    setCurrentRole(role);
    if (role === 'institution') {
      setActivePage('dashboard');
    } else {
      setActivePage('councilDashboard');
    }
    showToast('Switched View', `Active view changed to: ${role === 'institution' ? 'Institution Portal' : 'AICTE Portal'}`);
  };

  const handleNavigate = (page: NavPage) => {
    setActivePage(page);
    window.history.pushState({}, '', `/${page}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRunDiagnostic = (fdrId: string) => {
    setSelectedFdrForReadiness(fdrId);
    handleNavigate('readiness');
  };

  const handleAddFdr = (newFdr: FdrRecord) => {
    const updated = [newFdr, ...fdrs];
    setFdrs(updated);
    saveState(updated, requests);
    showToast('FDR Recorded in Master Ledger', `Instrument ${newFdr.fdrNumber} successfully registered.`);
  };

  const handleSubmitRequest = (newReq: ReleaseRequest) => {
    const updated = [newReq, ...requests];
    setRequests(updated);
    saveState(fdrs, updated);
    showToast('Application Submitted', `Application ${newReq.id} transmitted to Regional Office.`);
    handleNavigate('tracking');
  };

  const handleSendClarification = (reqId: string, note: string) => {
    const updated = requests.map((r) => {
      if (r.id === reqId) {
        return {
          ...r,
          status: 'Clarification Requested',
          notes: [
            { role: 'Council Scrutiny Officer', date: '2026-10-24', text: note },
            ...r.notes
          ]
        };
      }
      return r;
    });
    setRequests(updated);
    saveState(fdrs, updated);
    showToast('Clarification Sent to Institution', `Case ${reqId} marked: Clarification Requested.`);
  };

  const handleGrantClearance = (reqId: string, note: string) => {
    const updated = requests.map((r) => {
      if (r.id === reqId) {
        const nextStages = [...r.stages];
        if (nextStages[2]) {
          nextStages[2].status = 'completed';
          nextStages[2].date = '2026-10-24';
        }
        if (nextStages[3]) {
          nextStages[3].status = 'in-progress';
          nextStages[3].date = '2026-10-24';
        }
        return {
          ...r,
          status: 'Under Cross-Bureau Review',
          currentStage: 'Stage 4: Approval Bureau Clearance',
          stages: nextStages,
          notes: [
            { role: 'Regional Verification Officer', date: '2026-10-24', text: note },
            ...r.notes
          ]
        };
      }
      return r;
    });
    setRequests(updated);
    saveState(fdrs, updated);
    showToast('Stage Clearance Recorded', `Case ${reqId} advanced to Cross-Bureau Clearance.`);
  };

  const handleExecuteDecision = (reqId: string, outcomeType: 'noc' | 'rtgs' | 'withhold', memo: string) => {
    const nocNumber = `AICTE/WR/NOC/2026/${Math.floor(1000 + Math.random() * 9000)}`;

    const updated = requests.map((r) => {
      if (r.id === reqId) {
        const nextStages = [...r.stages];
        if (nextStages[4]) {
          nextStages[4].status = 'completed';
          nextStages[4].date = '2026-10-24';
        }
        if (nextStages[5]) {
          nextStages[5].status = 'completed';
          nextStages[5].date = '2026-10-24';
          nextStages[5].note = outcomeType === 'noc' ? `NOC Issued: ${nocNumber}` : 'RTGS Refund Dispatched';
        }
        return {
          ...r,
          status: outcomeType === 'noc' ? 'Release NOC Issued (Closed)' : (outcomeType === 'rtgs' ? 'RTGS Refund Sanctioned (Closed)' : 'Withheld / Review Pending'),
          currentStage: 'Stage 6: Outcome Recorded',
          stages: nextStages,
          notes: [
            { role: 'Member Secretary AICTE', date: '2026-10-24', text: `${memo} (Ref: ${nocNumber})` },
            ...r.notes
          ]
        };
      }
      return r;
    });
    setRequests(updated);
    saveState(fdrs, updated);
    showToast('Statutory Decision Executed', `Form-F NOC ${nocNumber} issued. Lien released.`);
    handleNavigate('tracking');
  };

  const handleUploadSimulate = (chkId: string, docName: string) => {
    const updated = checklistItems.map((item) => {
      if (item.id === chkId) {
        return {
          ...item,
          status: 'Complete' as const,
          fileName: `${docName.replace(/[^a-zA-Z0-9]/g, '_').slice(0, 20)}_Attested.pdf`,
          date: 'Uploaded & Verified Just Now'
        };
      }
      return item;
    });
    setChecklistItems(updated);
    saveState(fdrs, requests, updated);
    showToast('Document Uploaded & Verified', `OCR validated for ${docName}.`);
  };

  // Show loading spinner while checking auth
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Nidhi Track...</p>
        </div>
      </div>
    );
  }

  // Show login page if not authenticated
  if (!isAuthenticated) {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />;
  }

  // Filter data based on user role and access
  const filteredFdrs = currentUser?.role === 'institution'
    ? fdrs.filter(fdr => fdr.institutionId === activeInstitutionId)
    : fdrs;

  const filteredRequests = currentUser?.role === 'institution'
    ? requests.filter(req => req.institutionId === activeInstitutionId)
    : requests;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      {/* Top Header */}
      <Header
        currentRole={currentRole}
        onRoleChange={handleRoleChange}
        activeInstitution={activeInstitution}
        notifications={notifications}
        onOpenWalkthrough={() => setIsWalkthroughOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
        onNavigate={handleNavigate}
        currentUser={currentUser}
        onLogout={handleLogout}
      />

      {/* Main Layout Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full flex-1">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Navigation Sidebar */}
          <Sidebar
            currentRole={currentRole}
            activePage={activePage}
            onNavigate={handleNavigate}
            institutions={institutions}
            activeInstitutionId={activeInstitutionId}
            onInstitutionChange={(id) => {
              setActiveInstitutionId(id);
              showToast('College Context Switched', `Viewing records for ${institutions.find(i => i.id === id)?.name}`);
            }}
          />

          {/* Main Viewport Content */}
          <main className="flex-1 min-w-0">
            {/* Institution Views */}
            {activePage === 'dashboard' && (
              <InstitutionDashboard
                institution={activeInstitution}
                fdrs={fdrs}
                requests={requests}
                onNavigate={handleNavigate}
                onRunDiagnostic={handleRunDiagnostic}
                onOpenFdrDossier={(id) => setDossierFdrId(id)}
              />
            )}

            {activePage === 'classification' && (
              <ClassificationProfileView
                institution={activeInstitution}
                onNavigate={handleNavigate}
              />
            )}

            {activePage === 'checklist' && (
              <TailoredChecklist
                institution={activeInstitution}
                checklistItems={checklistItems}
                onUploadSimulate={handleUploadSimulate}
                onPreviewDocument={(title, fileName) => setDocPreview({ title, fileName })}
                onNavigate={handleNavigate}
              />
            )}

            {activePage === 'register' && (
              <FdrRegisterView
                institution={activeInstitution}
                fdrs={fdrs}
                onOpenAddFdr={() => setIsAddFdrOpen(true)}
                onOpenFdrDossier={(id) => setDossierFdrId(id)}
                onRunDiagnostic={handleRunDiagnostic}
              />
            )}

            {activePage === 'verification' && (
              <VerificationWorkspace
                institution={activeInstitution}
                fdrs={fdrs}
                onOpenDocumentPreview={(title, fileName) => setDocPreview({ title, fileName })}
                onShowToast={showToast}
              />
            )}

            {activePage === 'readiness' && (
              <PreliminaryReadinessView
                institution={activeInstitution}
                fdrs={fdrs}
                selectedFdrId={selectedFdrForReadiness}
                onSelectFdr={(id) => setSelectedFdrForReadiness(id)}
                onNavigate={handleNavigate}
                onShowToast={showToast}
              />
            )}

            {activePage === 'formalRequest' && (
              <FormalReleaseWizard
                institution={activeInstitution}
                fdrs={fdrs}
                selectedFdrId={selectedFdrForReadiness}
                onSelectFdr={(id) => setSelectedFdrForReadiness(id)}
                onSubmitRequest={handleSubmitRequest}
                onNavigate={handleNavigate}
              />
            )}

            {activePage === 'tracking' && (
              <ReleaseTrackingView
                institution={activeInstitution}
                requests={requests}
                fdrs={fdrs}
                onOpenTimeline={(id) => setTimelineReqId(id)}
                onNavigate={handleNavigate}
              />
            )}

            {/* Council Views */}
            {activePage === 'councilDashboard' && (
              <CouncilDashboard
                institutions={institutions}
                fdrs={fdrs}
                requests={requests}
                onNavigate={handleNavigate}
                onOpenCouncilAction={(id) => setCouncilActionReqId(id)}
              />
            )}

            {activePage === 'casePrioritisation' && (
              <CasePrioritisationView
                institutions={institutions}
                requests={requests}
                fdrs={fdrs}
                onOpenCouncilAction={(id) => setCouncilActionReqId(id)}
              />
            )}

            {activePage === 'explorer' && (
              <ExplorerView
                institutions={institutions}
                activeInstitutionId={activeInstitutionId}
                onInstitutionChange={(id) => setActiveInstitutionId(id)}
                fdrs={fdrs}
                requests={requests}
                onOpenFdrDossier={(id) => setDossierFdrId(id)}
              />
            )}

            {activePage === 'councilVerification' && (
              <CouncilVerificationView
                requests={requests}
                institutions={institutions}
                fdrs={fdrs}
                onPreviewDocument={(title, fileName) => setDocPreview({ title, fileName })}
                onSendClarification={handleSendClarification}
                onGrantClearance={handleGrantClearance}
                onShowToast={showToast}
              />
            )}

            {activePage === 'crossBureau' && (
              <CrossBureauIntelligence
                requests={requests}
                onShowToast={showToast}
              />
            )}

            {activePage === 'decision' && (
              <AuthorisedDecisionView
                requests={requests}
                institutions={institutions}
                fdrs={fdrs}
                onExecuteDecision={handleExecuteDecision}
              />
            )}

            {/* Cross-Workflow */}
            {activePage === 'ruleImpact' && (
              <RuleImpactChecker
                requests={requests}
                institutions={institutions}
                fdrs={fdrs}
                onShowToast={showToast}
              />
            )}
          </main>
        </div>
      </div>

      {/* Global Interactive Modals */}
      <WalkthroughModal
        isOpen={isWalkthroughOpen}
        onClose={() => setIsWalkthroughOpen(false)}
        onNavigate={handleNavigate}
        onRoleChange={handleRoleChange}
      />

      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        fdrs={fdrs}
        institutions={institutions}
        requests={requests}
        onSelectFdr={(id) => {
          setSelectedFdrForReadiness(id);
          setDossierFdrId(id);
        }}
        onSelectInstitution={(id) => setActiveInstitutionId(id)}
        onSelectRequest={(id) => setTimelineReqId(id)}
        onNavigate={handleNavigate}
      />

      <FdrDossierModal
        fdr={fdrs.find((f) => f.id === dossierFdrId) || null}
        institution={institutions.find((i) => i.id === activeInstitutionId)}
        allFdrs={fdrs}
        onClose={() => setDossierFdrId(null)}
        onRunDiagnostic={handleRunDiagnostic}
      />

      <DocumentModal
        isOpen={!!docPreview}
        onClose={() => setDocPreview(null)}
        documentTitle={docPreview?.title || ''}
        fileName={docPreview?.fileName || ''}
      />

      <TimelineModal
        request={requests.find((r) => r.id === timelineReqId) || null}
        institution={institutions.find((i) => i.id === requests.find((r) => r.id === timelineReqId)?.institutionId)}
        fdr={fdrs.find((f) => f.id === requests.find((r) => r.id === timelineReqId)?.fdrId)}
        onClose={() => setTimelineReqId(null)}
      />

      <CouncilActionModal
        request={requests.find((r) => r.id === councilActionReqId) || null}
        institution={institutions.find((i) => i.id === requests.find((r) => r.id === councilActionReqId)?.institutionId)}
        fdr={fdrs.find((f) => f.id === requests.find((r) => r.id === councilActionReqId)?.fdrId)}
        onClose={() => setCouncilActionReqId(null)}
        onSendClarification={handleSendClarification}
        onGrantClearance={handleGrantClearance}
      />

      <AddFdrModal
        isOpen={isAddFdrOpen}
        onClose={() => setIsAddFdrOpen(false)}
        activeInstitution={activeInstitution}
        existingFdrs={fdrs}
        onAddFdr={handleAddFdr}
      />

      {/* Global Toast */}
      <Toast show={toast.show} title={toast.title} message={toast.message} />
    </div>
  );
}
