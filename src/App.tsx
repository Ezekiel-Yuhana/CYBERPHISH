import React, { useState, useEffect } from 'react';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { HomePage } from './components/home/HomePage';
import { ExecutiveDashboard } from './components/dashboard/ExecutiveDashboard';
import { EmailAnalyzer } from './components/analyze/EmailAnalyzer';
import { AnalysisHistory } from './components/history/AnalysisHistory';
import { ThreatIntelligence } from './components/threat-intel/ThreatIntelligence';
import { AcademicResearch } from './components/academic/AcademicResearch';
import { UserManagement } from './components/admin/UserManagement';
import { RuleManagement } from './components/admin/RuleManagement';
import { ModelManagement } from './components/admin/ModelManagement';
import { AuditLogsView } from './components/admin/AuditLogsView';
import { JavaSourceViewer } from './components/admin/JavaSourceViewer';
import { AnalysisDetailsModal } from './components/analyze/AnalysisDetailsModal';
import { AuthModal } from './components/auth/AuthModal';
import { storageService } from './services/storageService';
import { EmailAnalysis, User, NavigationTab } from './types';

export default function App() {
  // Navigation and user state - Defaults to the new Home Page
  const [activeTab, setActiveTab] = useState<NavigationTab>('home');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [initialSampleIndex, setInitialSampleIndex] = useState<number | null>(null);

  // Analysis telemetry and modal state
  const [analyses, setAnalyses] = useState<EmailAnalysis[]>([]);
  const [stats, setStats] = useState(storageService.getDashboardStats());
  const [threatIntel, setThreatIntel] = useState(storageService.getThreatIntelligence());
  const [selectedAnalysisForModal, setSelectedAnalysisForModal] = useState<EmailAnalysis | null>(null);

  // Refresh data from storage
  const refreshAppData = () => {
    const loadedAnalyses = storageService.getAnalyses();
    setAnalyses(loadedAnalyses);
    setStats(storageService.getDashboardStats());
    setThreatIntel(storageService.getThreatIntelligence());
    setCurrentUser(storageService.getCurrentUser());
  };

  useEffect(() => {
    refreshAppData();
  }, []);

  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    refreshAppData();
  };

  const handleLogout = () => {
    storageService.logout();
    setCurrentUser(null);
    refreshAppData();
  };

  const handleNewAnalysisComplete = (newAnalysis: EmailAnalysis) => {
    refreshAppData();
  };

  const handleSelectAnalysisFromHistory = (analysis: EmailAnalysis) => {
    setSelectedAnalysisForModal(analysis);
  };

  const handleQuickAnalyzeScenario = (sampleType: 'phishing' | 'bec' | 'legitimate') => {
    if (sampleType === 'phishing') {
      setInitialSampleIndex(0);
    } else if (sampleType === 'bec') {
      setInitialSampleIndex(1);
    } else {
      setInitialSampleIndex(2);
    }
    setActiveTab('analyze');
  };

  return (
    <div className="min-h-screen bg-[#080D1A] cyberphish-bg text-[#F8FAFC] flex flex-col font-sans selection:bg-[#38BDF8] selection:text-[#080D1A]">
      {/* Top Main Navigation Bar */}
      <Navbar
        currentUser={currentUser}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onLogout={handleLogout}
        onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        isMobileMenuOpen={isMobileMenuOpen}
        activeTab={activeTab}
        onNavigate={(tab) => {
          setActiveTab(tab);
          setIsMobileMenuOpen(false);
        }}
      />

      {/* Main Body Workspace */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Desktop Sidebar Navigation */}
        <Sidebar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          currentUser={currentUser}
          isMobileMenuOpen={isMobileMenuOpen}
          onCloseMobileMenu={() => setIsMobileMenuOpen(false)}
        />

        {/* Dynamic Main Workspace Container */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6 bg-transparent">
          {/* Main Views Routing Switcher */}
          {activeTab === 'home' && (
            <HomePage
              onNavigate={(tab) => setActiveTab(tab)}
              onOpenAuth={() => setIsAuthModalOpen(true)}
              onQuickAnalyzeSample={handleQuickAnalyzeScenario}
            />
          )}

          {activeTab === 'dashboard' && (
            <ExecutiveDashboard
              stats={stats}
              onNavigateToAnalyze={() => setActiveTab('analyze')}
              onSelectRecentAnalysis={handleSelectAnalysisFromHistory}
            />
          )}

          {activeTab === 'analyze' && (
            <EmailAnalyzer
              currentUser={currentUser}
              initialSampleIndex={initialSampleIndex}
              onAnalysisComplete={handleNewAnalysisComplete}
              onViewForensics={(analysis) => setSelectedAnalysisForModal(analysis)}
            />
          )}

          {activeTab === 'history' && (
            <AnalysisHistory
              currentUser={currentUser}
              analyses={analyses}
              onSelectAnalysis={handleSelectAnalysisFromHistory}
              onRefresh={refreshAppData}
            />
          )}

          {activeTab === 'threat-intel' && (
            <ThreatIntelligence data={threatIntel} />
          )}

          {activeTab === 'academic' && (
            <AcademicResearch />
          )}

          {activeTab === 'users' && (
            <UserManagement />
          )}

          {activeTab === 'rules' && (
            <RuleManagement />
          )}

          {activeTab === 'models' && (
            <ModelManagement />
          )}

          {activeTab === 'audit-logs' && (
            <AuditLogsView />
          )}

          {activeTab === 'java-source' && (
            <JavaSourceViewer />
          )}

          {/* Academic Attribution Footer */}
          <footer className="pt-8 pb-4 text-center text-xs text-[#94A3B8] border-t border-[#1E2D4D] flex flex-col sm:flex-row items-center justify-between gap-2 font-mono">
            <div>
              <span className="text-[#38BDF8] font-semibold">CyberPhish AI Analytics</span> • Commercial Banking Threat Intelligence Engine
            </div>
            <div className="text-[11px] text-[#64748B]">
              Cameroon & CEMAC Financial Sector Focus • Logistic Regression ML (91.70% Acc)
            </div>
          </footer>
        </main>
      </div>

      {/* Forensic Dossier Modal */}
      <AnalysisDetailsModal
        analysis={selectedAnalysisForModal}
        onClose={() => setSelectedAnalysisForModal(null)}
      />

      {/* Security Gateway Authentication Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />
    </div>
  );
}
