import React from 'react';
import {
  LayoutDashboard,
  FileSpreadsheet,
  CheckSquare2,
  FolderArchive,
  FileCheck2,
  Sparkles,
  Send,
  GitPullRequest,
  BarChart3,
  Flame,
  Building,
  Microscope,
  Network,
  ShieldCheck,
  GitBranch,
  Info,
  Building2,
  Landmark
} from 'lucide-react';
import { Role, NavPage, Institution } from '../types';

interface SidebarProps {
  currentRole: Role;
  activePage: NavPage;
  onNavigate: (page: NavPage) => void;
  institutions: Institution[];
  activeInstitutionId: string;
  onInstitutionChange: (id: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentRole,
  activePage,
  onNavigate,
  institutions,
  activeInstitutionId,
  onInstitutionChange,
}) => {
  const institutionNav = [
    { id: 'dashboard' as NavPage, label: 'Dashboard Overview', icon: LayoutDashboard, badge: null },
    { id: 'classification' as NavPage, label: 'Classification & Profile', icon: FileSpreadsheet, badge: null },
    { id: 'checklist' as NavPage, label: 'Tailored Requirements', icon: CheckSquare2, badge: 'Rules' },
    { id: 'register' as NavPage, label: 'FDR Lifecycle Register', icon: FolderArchive, badge: null },
    { id: 'verification' as NavPage, label: 'Document Verification', icon: FileCheck2, badge: null },
    { id: 'readiness' as NavPage, label: 'Release Readiness Check', icon: Sparkles, badge: 'Star Feature' },
    { id: 'formalRequest' as NavPage, label: 'Submit Release Request', icon: Send, badge: null },
    { id: 'tracking' as NavPage, label: 'Release Request Tracking', icon: GitPullRequest, badge: '6 Stages' },
  ];

  const councilNav = [
    { id: 'councilDashboard' as NavPage, label: 'Council Overview', icon: BarChart3, badge: null },
    { id: 'casePrioritisation' as NavPage, label: 'Priority Case Queue', icon: Flame, badge: 'Urgent' },
    { id: 'explorer' as NavPage, label: 'Record & Entity Explorer', icon: Building, badge: null },
    { id: 'councilVerification' as NavPage, label: 'Verification Workspace', icon: Microscope, badge: null },
    { id: 'crossBureau' as NavPage, label: 'Cross-Bureau Intelligence', icon: Network, badge: 'Bottlenecks' },
    { id: 'decision' as NavPage, label: 'Authorised Decisioning', icon: ShieldCheck, badge: 'Action Req' },
  ];

  const navItems = currentRole === 'institution' ? institutionNav : councilNav;

  return (
    <aside className="w-full lg:w-64 shrink-0">
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-4 sticky top-24">
        {/* Active Mode Banner */}
        <div
          className={`mb-4 p-2.5 rounded-lg border text-xs ${
            currentRole === 'institution'
              ? 'bg-blue-50/70 border-blue-200 text-blue-900'
              : 'bg-indigo-50/70 border-indigo-200 text-indigo-900'
          }`}
        >
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
            Current Workspace Persona
          </span>
          <span className="font-bold text-sm flex items-center gap-1.5 mt-0.5">
            {currentRole === 'institution' ? (
              <>
                <Building2 className="w-4 h-4 text-blue-700" />
                Institution Portal
              </>
            ) : (
              <>
                <Landmark className="w-4 h-4 text-indigo-700" />
                AICTE Council Desk
              </>
            )}
          </span>
        </div>

        {/* Navigation Links */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const isActive = activePage === item.id;
            const Icon = item.icon;

            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2 text-xs rounded-lg transition group ${
                  isActive
                    ? 'bg-blue-50 text-blue-900 font-bold border-l-4 border-blue-700 -ml-1 pl-2'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 font-medium'
                }`}
              >
                <div className="flex items-center space-x-2.5 min-w-0">
                  <Icon
                    className={`w-4 h-4 shrink-0 ${
                      isActive ? 'text-blue-700' : 'text-slate-400 group-hover:text-slate-600'
                    }`}
                  />
                  <span className="truncate">{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[9px] px-1.5 py-0.5 rounded font-bold shrink-0 ${
                      item.badge === 'Star Feature'
                        ? 'bg-amber-100 text-amber-900 border border-amber-300'
                        : item.badge === 'Urgent'
                        ? 'bg-rose-100 text-rose-700'
                        : item.badge === 'Bottlenecks'
                        ? 'bg-rose-50 text-rose-700 border border-rose-200'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        <hr className="my-4 border-slate-100" />

        {/* Cross-Workflow Feature Link */}
        <div className="pt-0.5">
          <button
            onClick={() => onNavigate('ruleImpact')}
            className={`w-full flex items-center justify-between px-3 py-2 text-xs font-semibold rounded-lg transition border ${
              activePage === 'ruleImpact'
                ? 'bg-purple-100 text-purple-900 border-purple-300'
                : 'text-purple-700 bg-purple-50/70 hover:bg-purple-100/70 border-purple-200/80'
            }`}
          >
            <div className="flex items-center space-x-2">
              <GitBranch className="w-4 h-4 text-purple-700 shrink-0" />
              <span>Rule Impact Checker</span>
            </div>
            <span className="text-[9px] bg-purple-200 text-purple-900 font-bold px-1.5 py-0.5 rounded uppercase">
              Sandbox
            </span>
          </button>
        </div>

        {/* Institution Selector (Simulated Context Switching) */}
        <div className="mt-4 pt-3 border-t border-slate-100">
          <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1.5">
            Active College Context
          </label>
          <select
            value={activeInstitutionId}
            onChange={(e) => onInstitutionChange(e.target.value)}
            className="w-full text-xs py-1.5 px-2 bg-slate-50 border border-slate-200 rounded-md focus:ring-2 focus:ring-blue-600 focus:outline-none font-medium text-slate-800"
          >
            {institutions.map((inst) => (
              <option key={inst.id} value={inst.id}>
                {inst.name}
              </option>
            ))}
          </select>
        </div>

        {/* Footnote / Context Badge */}
        <div className="mt-4 p-2 bg-slate-50 rounded text-[10px] text-slate-500 leading-tight border border-slate-200/60">
          <Info className="w-3 h-3 inline mr-1 text-slate-400" />
          Prototype for SIH26265. Simulated requirements, bank confirmation gateways, and APH 2024-27 norms.
        </div>
      </div>
    </aside>
  );
};
