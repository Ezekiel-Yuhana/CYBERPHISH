import React from 'react';
import { 
  Home,
  LayoutDashboard, 
  SearchCode, 
  Database,
  History, 
  Globe, 
  GraduationCap, 
  Code2, 
  Users, 
  Sliders, 
  Cpu, 
  FileText,
  X
} from 'lucide-react';
import { User, NavigationTab, UserRole } from '../../types';

interface SidebarProps {
  activeTab?: NavigationTab | string;
  onTabChange?: (tab: NavigationTab) => void;
  currentView?: string;
  onNavigate?: (view: any) => void;
  currentUser?: User | null;
  userRole?: UserRole;
  analysisCount?: number;
  isMobileMenuOpen?: boolean;
  onCloseMobileMenu?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onTabChange,
  currentView,
  onNavigate,
  currentUser,
  userRole,
  analysisCount = 0,
  isMobileMenuOpen = false,
  onCloseMobileMenu
}) => {
  const currentActive = activeTab || currentView || 'dashboard';
  const role = currentUser?.role || userRole || 'USER';
  const isAdmin = role === 'ADMIN';

  const handleSelect = (tabId: string) => {
    if (onTabChange) onTabChange(tabId as NavigationTab);
    else if (onNavigate) onNavigate(tabId);
    if (onCloseMobileMenu) onCloseMobileMenu();
  };

  const generalNavItems = [
    { id: 'home', label: 'Home / Overview', icon: Home, badge: null },
    { id: 'dashboard', label: 'SOC Dashboard', icon: LayoutDashboard, badge: null },
    { id: 'analyze', label: 'Analyse Email', icon: SearchCode, badge: 'Live AI' },
    { id: 'dataset', label: 'Banking Corpus Data', icon: Database, badge: 'Live' },
    { id: 'history', label: 'Analysis History', icon: History, badge: analysisCount > 0 ? String(analysisCount) : null },
    { id: 'threat-intel', label: 'Threat Intelligence', icon: Globe, badge: 'CEMAC' },
    { id: 'academic', label: 'Thesis & Model Lab', icon: GraduationCap, badge: '91.7%' },
    { id: 'java-source', label: 'Spring Boot Codebase', icon: Code2, badge: 'Java 21' }
  ];

  const adminNavItems = [
    { id: 'users', label: 'User Management', icon: Users, badge: null },
    { id: 'rules', label: 'Detection Rules Engine', icon: Sliders, badge: null },
    { id: 'models', label: 'Model Tuning & ML API', icon: Cpu, badge: 'REST' },
    { id: 'audit-logs', label: 'System Audit Logs', icon: FileText, badge: null },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-[#080D1A]/80 backdrop-blur-xs z-40 lg:hidden"
          onClick={onCloseMobileMenu}
        />
      )}

      <aside className={`
        fixed lg:static top-0 left-0 bottom-0 z-50 lg:z-auto
        w-64 bg-[#0B1222]/90 backdrop-blur-md border-r border-[#1E2D4D] flex flex-col shrink-0 min-h-[calc(100vh-4rem)]
        transform transition-transform duration-200 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Mobile Header */}
        <div className="lg:hidden p-4 border-b border-[#1E2D4D] flex items-center justify-between">
          <span className="font-sans font-bold text-lg text-white">Navigation Menu</span>
          <button 
            onClick={onCloseMobileMenu}
            className="p-1 rounded-lg text-[#94A3B8] hover:bg-[#1E2D4D]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 space-y-6 flex-1 overflow-y-auto">
          {/* Core Operations Section */}
          <div>
            <div className="px-3 mb-2 text-[10px] font-bold uppercase tracking-widest text-[#64748B] font-mono">
              Cyber Operations
            </div>
            <nav className="space-y-1">
              {generalNavItems.map(item => {
                const Icon = item.icon;
                const isActive = currentActive === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelect(item.id)}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                      isActive
                        ? 'bg-gradient-to-r from-[#0284C7] to-[#2563EB] text-white shadow-md shadow-[#0284C7]/20 font-semibold'
                        : 'text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#111C35]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[#64748B]'}`} />
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className={`px-2 py-0.5 text-[9px] font-mono rounded-full font-semibold ${
                        isActive 
                          ? 'bg-white/20 text-white' 
                          : 'bg-[#1E2D4D] text-[#38BDF8]'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Administration Section */}
          {isAdmin && (
            <div>
              <div className="px-3 mb-2 flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-[#38BDF8] font-mono">
                <span>Administration</span>
                <span className="px-1.5 py-0.2 rounded-full bg-[#0C4A6E]/50 text-[#38BDF8] border border-[#0284C7]/30 text-[8px] font-mono">RBAC</span>
              </div>
              <nav className="space-y-1">
                {adminNavItems.map(item => {
                  const Icon = item.icon;
                  const isActive = currentActive === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleSelect(item.id)}
                      className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                        isActive
                          ? 'bg-[#0284C7] text-white shadow-md shadow-[#0284C7]/20 font-semibold'
                          : 'text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#111C35]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[#64748B]'}`} />
                        <span>{item.label}</span>
                      </div>
                      {item.badge && (
                        <span className={`px-2 py-0.2 text-[9px] font-mono rounded-full ${
                          isActive
                            ? 'bg-white/20 text-white'
                            : 'bg-[#1E2D4D] text-[#38BDF8]'
                        }`}>
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>
          )}

          {/* Operational Security Status Box */}
          <div className="p-4 rounded-2xl bg-[#111C35] border border-[#1E2D4D] text-[#F8FAFC] shadow-xs">
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="font-semibold text-[#38BDF8] text-xs font-sans">Full Production System</span>
              </div>
              <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-emerald-950/60 text-emerald-400 font-mono border border-emerald-500/30">LIVE</span>
            </div>
            <p className="text-[11px] text-[#94A3B8] leading-relaxed">
              Real-time active protection for Commercial Banking environments across Cameroon & CEMAC zone.
            </p>
          </div>
        </div>

        {/* Footer Info */}
        <div className="p-3.5 border-t border-[#1E2D4D] text-[10px] text-[#64748B] font-mono flex items-center justify-between bg-[#070B16]">
          <span>CYBERPHISH Enterprise</span>
          <span className="text-[#38BDF8] font-semibold">Live Operational Gateway</span>
        </div>
      </aside>
    </>
  );
};
