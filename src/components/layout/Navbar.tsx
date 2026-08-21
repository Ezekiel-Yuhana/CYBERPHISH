import React, { useState } from 'react';
import { 
  Shield, 
  ShieldAlert, 
  User, 
  LogOut, 
  Key, 
  UserCheck, 
  AlertTriangle,
  Layers,
  ChevronDown,
  Menu,
  X
} from 'lucide-react';
import { User as UserType, UserRole, NavigationTab } from '../../types';
import { storageService } from '../../services/storageService';

interface NavbarProps {
  currentUser: UserType | null;
  onOpenAuthModal?: (tab?: 'login' | 'register' | 'profile' | 'change-password') => void;
  onOpenAuth?: (tab?: 'login' | 'register' | 'profile' | 'change-password') => void;
  onLogout?: () => void;
  onUserChange?: (user: UserType | null) => void;
  activeTab?: NavigationTab | string;
  currentView?: string;
  onNavigate: (view: NavigationTab | any) => void;
  isMobileMenuOpen?: boolean;
  onToggleMobileMenu?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  onOpenAuthModal,
  onOpenAuth,
  onLogout,
  onUserChange,
  activeTab,
  currentView,
  onNavigate,
  isMobileMenuOpen,
  onToggleMobileMenu
}) => {
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  const handleOpenAuth = (tab?: 'login' | 'register' | 'profile' | 'change-password') => {
    if (onOpenAuthModal) onOpenAuthModal(tab);
    else if (onOpenAuth) onOpenAuth(tab);
  };

  const handleRoleSwitch = (role: UserRole) => {
    const allUsers = storageService.getUsers();
    let targetUser = allUsers.find(u => u.role === role);
    if (!targetUser) {
      targetUser = storageService.addUser({
        fullName: role === 'ADMIN' ? 'System Administrator' : role === 'SECURITY_ANALYST' ? 'Lead SOC Analyst' : 'Bank Operations Officer',
        email: `${role.toLowerCase()}@cyberphish.ai`,
        role: role,
        status: 'ACTIVE'
      });
    }
    storageService.setCurrentUser(targetUser);
    if (onUserChange) onUserChange(targetUser);
    setShowRoleDropdown(false);
  };

  const handleLogoutAction = () => {
    if (onLogout) {
      onLogout();
    } else {
      storageService.setCurrentUser(null);
      if (onUserChange) onUserChange(null);
    }
    setShowUserDropdown(false);
  };

  return (
    <header className="bg-[#0B1222]/95 backdrop-blur-md border-b border-[#1E2D4D] sticky top-0 z-40 text-[#F8FAFC] shadow-lg">
      {/* Top Security Banner */}
      <div className="bg-[#070B16] px-4 py-1 text-xs border-b border-[#1E2D4D]/60 flex items-center justify-between text-[#94A3B8]">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#38BDF8] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#38BDF8]"></span>
          </span>
          <span className="font-mono text-[11px] text-[#38BDF8] font-medium">
            SOC STATUS: <span className="font-semibold text-[#34D399]">ACTIVE</span> | CEMAC THREAT LEVEL: <span className="text-[#FBBF24] font-bold">ELEVATED</span>
          </span>
        </div>
        <div className="hidden sm:flex items-center gap-4 text-[11px]">
          <span className="text-[#64748B]">Commercial Banking Cameroon</span>
          <span className="text-[#38BDF8] font-mono font-medium">LR-TFIDF v1.0.4 (91.70% Acc)</span>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left Side: Mobile Menu Button + Brand */}
        <div className="flex items-center gap-3">
          {onToggleMobileMenu && (
            <button
              onClick={onToggleMobileMenu}
              className="lg:hidden p-2 rounded-lg text-[#38BDF8] hover:bg-[#1E2D4D]/60 transition-colors"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          )}

          <div 
            className="flex items-center gap-2.5 cursor-pointer select-none group"
            onClick={() => onNavigate('home')}
          >
            <div className="w-8 h-8 rounded-xl bg-[#0284C7]/20 border border-[#0284C7]/50 text-[#38BDF8] flex items-center justify-center shadow-md shadow-[#0284C7]/20 group-hover:scale-105 transition-all">
              <Shield className="w-4.5 h-4.5 text-[#38BDF8]" />
            </div>
            <div>
              <span className="text-lg font-extrabold tracking-tight font-sans text-white group-hover:text-[#38BDF8] transition-colors">
                CYBER<span className="text-[#38BDF8]">PHISH</span>
              </span>
            </div>
          </div>
        </div>

        {/* Center Links (Matching Landing Page Navigation) */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-[#94A3B8]">
          <button
            onClick={() => {
              onNavigate('home');
              setTimeout(() => {
                const el = document.getElementById('features');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }, 100);
            }}
            className="hover:text-white transition-colors cursor-pointer"
          >
            Features
          </button>

          <button
            onClick={() => {
              onNavigate('home');
              setTimeout(() => {
                const el = document.getElementById('how-it-works');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }, 100);
            }}
            className="hover:text-white transition-colors cursor-pointer"
          >
            How It Works
          </button>

          <button
            onClick={() => onNavigate('dataset')}
            className={`transition-colors cursor-pointer ${
              activeTab === 'dataset' ? 'text-[#38BDF8] font-semibold' : 'hover:text-white'
            }`}
          >
            Corpus Dataset
          </button>

          <button
            onClick={() => onNavigate('dashboard')}
            className={`transition-colors cursor-pointer ${
              activeTab === 'dashboard' ? 'text-[#38BDF8] font-semibold' : 'hover:text-white'
            }`}
          >
            SOC Workspace
          </button>

          {!currentUser && (
            <button
              onClick={() => handleOpenAuth('login')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Login
            </button>
          )}
        </nav>

        {/* Right Side: Analyze Email Button + Role Switcher & User Menu */}
        <div className="flex items-center gap-3">
          {/* Analyze Email Pill Button (Matching Screenshot) */}
          <button
            onClick={() => onNavigate('analyze')}
            className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0284C7] hover:bg-[#0369A1] text-white font-semibold text-xs shadow-lg shadow-sky-950/40 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
          >
            <span>Analyze Email</span>
          </button>

          {/* Quick Role Switcher Badge */}
          <div className="relative">
            <button
              onClick={() => setShowRoleDropdown(!showRoleDropdown)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs rounded-xl bg-[#111C35] hover:bg-[#162444] border border-[#1E2D4D] text-[#F8FAFC] transition-colors shadow-xs cursor-pointer"
              title="Switch roles for enterprise access control and permission enforcement"
            >
              <Layers className="w-3.5 h-3.5 text-[#38BDF8]" />
              <span className="hidden lg:inline text-[#94A3B8]">Role:</span>
              <span className="font-mono font-semibold text-[#38BDF8] text-[11px]">
                {currentUser ? currentUser.role : 'GUEST'}
              </span>
              <ChevronDown className="w-3 h-3 text-[#94A3B8]" />
            </button>

            {showRoleDropdown && (
              <div className="absolute right-0 mt-2 w-56 bg-[#111C35] border border-[#1E2D4D] rounded-2xl shadow-2xl py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                <div className="px-3 py-1.5 border-b border-[#1E2D4D] text-[10px] uppercase tracking-widest text-[#94A3B8] font-semibold flex items-center justify-between">
                  <span>Role-Based Access</span>
                  <span className="text-emerald-400 font-mono text-[9px]">LIVE</span>
                </div>
                <button
                  onClick={() => handleRoleSwitch('ADMIN')}
                  className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-[#1A2A4E] ${currentUser?.role === 'ADMIN' ? 'text-[#38BDF8] font-semibold bg-[#1A2A4E]' : 'text-[#F1F5F9]'}`}
                >
                  <div className="flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-[#F59E0B]" />
                    <span>ADMINISTRATOR</span>
                  </div>
                  <span className="text-[10px] text-[#94A3B8]">Full Access</span>
                </button>
                <button
                  onClick={() => handleRoleSwitch('SECURITY_ANALYST')}
                  className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-[#1A2A4E] ${currentUser?.role === 'SECURITY_ANALYST' ? 'text-[#38BDF8] font-semibold bg-[#1A2A4E]' : 'text-[#F1F5F9]'}`}
                >
                  <div className="flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-[#38BDF8]" />
                    <span>SECURITY ANALYST</span>
                  </div>
                  <span className="text-[10px] text-[#94A3B8]">SOC Ops</span>
                </button>
                <button
                  onClick={() => handleRoleSwitch('USER')}
                  className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-[#1A2A4E] ${currentUser?.role === 'USER' ? 'text-[#38BDF8] font-semibold bg-[#1A2A4E]' : 'text-[#F1F5F9]'}`}
                >
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-[#94A3B8]" />
                    <span>STANDARD USER</span>
                  </div>
                  <span className="text-[10px] text-[#94A3B8]">Banking Staff</span>
                </button>
              </div>
            )}
          </div>

          {/* User Menu / Auth Button */}
          {currentUser ? (
            <div className="relative">
              <button
                onClick={() => setShowUserDropdown(!showUserDropdown)}
                className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-[#111C35] hover:bg-[#162444] border border-[#1E2D4D] text-[#F8FAFC] transition-all text-xs shadow-xs"
              >
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#0284C7] to-[#2563EB] text-white flex items-center justify-center font-bold text-xs">
                  {currentUser.fullName.charAt(0)}
                </div>
                <div className="text-left hidden sm:block">
                  <div className="font-semibold text-[#F8FAFC] truncate max-w-[130px]">
                    {currentUser.fullName}
                  </div>
                  <div className="text-[10px] text-[#94A3B8]">{currentUser.email}</div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-[#94A3B8]" />
              </button>

              {showUserDropdown && (
                <div className="absolute right-0 mt-2 w-64 bg-[#111C35] border border-[#1E2D4D] rounded-2xl shadow-2xl py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                  <div className="px-4 py-2.5 border-b border-[#1E2D4D] bg-[#0B1222]/80">
                    <div className="font-semibold text-xs text-[#F8FAFC]">{currentUser.fullName}</div>
                    <div className="text-[11px] text-[#94A3B8]">{currentUser.email}</div>
                    <div className="mt-1.5 flex items-center gap-1.5">
                      <span className="px-2 py-0.5 text-[9px] uppercase tracking-wider rounded-full bg-[#0C4A6E]/50 text-[#38BDF8] border border-[#0284C7]/30 font-mono font-semibold">
                        {currentUser.role}
                      </span>
                      {currentUser.mustChangePassword && (
                        <span className="px-2 py-0.5 text-[9px] rounded-full bg-[#451A03]/60 text-[#FBBF24] border border-[#B45309]/50 flex items-center gap-1">
                          <AlertTriangle className="w-2.5 h-2.5" /> Pwd Change Required
                        </span>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      handleOpenAuth('profile');
                      setShowUserDropdown(false);
                    }}
                    className="w-full text-left px-4 py-2.5 text-xs text-[#F1F5F9] hover:bg-[#1A2A4E] flex items-center gap-2"
                  >
                    <User className="w-3.5 h-3.5 text-[#38BDF8]" />
                    <span>My Profile & Settings</span>
                  </button>

                  <button
                    onClick={() => {
                      handleOpenAuth('change-password');
                      setShowUserDropdown(false);
                    }}
                    className="w-full text-left px-4 py-2.5 text-xs text-[#F1F5F9] hover:bg-[#1A2A4E] flex items-center gap-2"
                  >
                    <Key className="w-3.5 h-3.5 text-[#F59E0B]" />
                    <span>Change Password</span>
                  </button>

                  <div className="border-t border-[#1E2D4D] my-1"></div>

                  <button
                    onClick={handleLogoutAction}
                    className="w-full text-left px-4 py-2.5 text-xs text-[#F87171] hover:bg-[#450A0A]/40 flex items-center gap-2 font-medium"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleOpenAuth('login')}
                className="px-3.5 py-1.5 text-xs font-semibold text-[#F8FAFC] bg-[#111C35] hover:bg-[#162444] border border-[#1E2D4D] rounded-xl transition-colors shadow-xs"
              >
                Sign In
              </button>
              <button
                onClick={() => handleOpenAuth('register')}
                className="px-3.5 py-1.5 text-xs font-semibold text-white bg-gradient-to-r from-[#0284C7] to-[#2563EB] hover:from-[#0369A1] hover:to-[#1D4ED8] rounded-xl shadow-md shadow-[#0284C7]/20 transition-all"
              >
                Register
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
