import React, { useState } from 'react';
import { 
  Shield, 
  Zap, 
  ArrowRight, 
  Lock, 
  Cpu, 
  Sliders, 
  FileCheck2, 
  CheckCircle2, 
  AlertTriangle, 
  Building2, 
  Database, 
  Radio, 
  Key, 
  Search, 
  ChevronRight, 
  Sparkles,
  Server,
  Layers,
  BarChart3,
  Globe2,
  FileCode2
} from 'lucide-react';
import { NavigationTab } from '../../types';

interface HomePageProps {
  onNavigate: (tab: NavigationTab) => void;
  onOpenAuth: (tab?: 'login' | 'register') => void;
  onQuickAnalyzeSample?: (sampleType: 'phishing' | 'bec' | 'legitimate') => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onNavigate,
  onOpenAuth,
  onQuickAnalyzeSample
}) => {
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  const sampleAttacks = [
    {
      id: 'phishing',
      title: 'Commercial Bank of Cameroon - Impersonation',
      type: 'PHISHING',
      risk: 'CRITICAL (94%)',
      summary: 'Urgent KYC password renewal with lookalike domain `cm-banque-verify.net`',
      color: 'border-red-500/40 bg-red-950/20 text-red-400'
    },
    {
      id: 'bec',
      title: 'SWIFT Urgent Wire Authorization #9921',
      type: 'BEC FRAUD',
      risk: 'HIGH (86%)',
      summary: 'CEO impersonation requesting an unverified offshore payment transfer',
      color: 'border-amber-500/40 bg-amber-950/20 text-amber-400'
    },
    {
      id: 'legitimate',
      title: 'Monthly Treasury Liquidity Report',
      type: 'LEGITIMATE',
      risk: 'SAFE (4%)',
      summary: 'Internal encrypted transaction report with valid SPF/DKIM digital signatures',
      color: 'border-emerald-500/40 bg-emerald-950/20 text-emerald-400'
    }
  ];

  return (
    <div className="space-y-16 -mt-4 -mx-4 sm:-mx-6 lg:-mx-8">
      {/* ========================================================================= */}
      {/* 1. HERO SECTION (Identical to requested design with high-tech cyber theme) */}
      {/* ========================================================================= */}
      <section className="relative min-h-[580px] sm:min-h-[640px] flex items-center justify-center overflow-hidden px-4 sm:px-6 lg:px-8 py-16 bg-[#080D1A] border-b border-[#1E2D4D]/80">
        {/* Cyber Digital Circuit Grid & Glowing Nodes Background */}
        <div className="absolute inset-0 pointer-events-none select-none">
          {/* Radial Glow Core */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] sm:w-[850px] h-[400px] bg-gradient-to-r from-[#0284C7]/20 via-[#0369A1]/15 to-[#38BDF8]/10 blur-3xl rounded-full"></div>
          
          {/* Hexagonal / Shield Cyber Watermark in Center */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] sm:w-[480px] h-[340px] sm:h-[480px] opacity-[0.14] flex items-center justify-center">
            <Shield className="w-full h-full text-[#38BDF8]" strokeWidth={1} />
          </div>

          {/* Circuit Trace SVG Lines & Digital Graph Nodes */}
          <svg className="absolute inset-0 w-full h-full opacity-35" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="cyberGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#0284C7" stopOpacity="0.2" />
              </linearGradient>
            </defs>

            {/* Horizontal and Connecting Traces */}
            <path d="M 0 160 L 250 160 L 320 220 L 600 220" fill="none" stroke="url(#cyberGrad)" strokeWidth="1" strokeDasharray="4,4" />
            <path d="M 1000 120 L 850 120 L 780 190 L 550 190" fill="none" stroke="url(#cyberGrad)" strokeWidth="1" strokeDasharray="3,3" />
            <path d="M 120 480 L 300 480 L 400 420 L 800 420" fill="none" stroke="url(#cyberGrad)" strokeWidth="1" />
            <path d="M 950 500 L 780 500 L 700 450 L 500 450" fill="none" stroke="url(#cyberGrad)" strokeWidth="1" strokeDasharray="5,5" />

            {/* Glowing Connection Dots */}
            <circle cx="250" cy="160" r="3" fill="#38BDF8" />
            <circle cx="320" cy="220" r="4" fill="#38BDF8" />
            <circle cx="850" cy="120" r="3" fill="#38BDF8" />
            <circle cx="780" cy="190" r="4" fill="#38BDF8" />
            <circle cx="400" cy="420" r="3.5" fill="#38BDF8" />
            <circle cx="700" cy="450" r="3.5" fill="#38BDF8" />
          </svg>

          {/* Cyber Watermarks & Node Markers (as shown in visual) */}
          <div className="absolute top-8 left-1/2 -translate-x-1/2 text-[10px] sm:text-[11px] font-mono tracking-[0.25em] text-[#38BDF8]/40 font-bold uppercase flex items-center gap-1.5">
            <Radio className="w-3 h-3 text-[#38BDF8]/60 animate-pulse" />
            <span>CYBERSECURITY ACTIVE</span>
          </div>

          <div className="absolute top-16 left-6 sm:left-16 text-[9px] sm:text-[10px] font-mono tracking-widest text-[#38BDF8]/30 font-semibold flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5" />
            <span>BANKING SYSTEMS</span>
          </div>

          <div className="absolute top-14 right-6 sm:right-20 text-[9px] sm:text-[10px] font-mono tracking-widest text-[#38BDF8]/30 font-semibold flex items-center gap-1.5">
            <Database className="w-3.5 h-3.5" />
            <span>DATA CENTERS</span>
          </div>

          <div className="absolute top-1/2 -translate-y-1/2 left-4 sm:left-12 text-[9px] sm:text-[10px] font-mono tracking-widest text-[#38BDF8]/30 font-semibold">
            NETWORK MONITORING
          </div>

          <div className="absolute top-1/2 -translate-y-1/2 right-4 sm:right-12 text-[9px] sm:text-[10px] font-mono tracking-widest text-[#38BDF8]/30 font-semibold">
            ENCRYPTION LAYER
          </div>

          <div className="absolute bottom-16 left-6 sm:left-24 text-[8px] sm:text-[9px] font-mono text-[#38BDF8]/20 tracking-widest">
            010101000010010110101100
          </div>

          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-[10px] sm:text-[11px] font-mono tracking-[0.2em] text-[#38BDF8]/40 font-semibold uppercase">
            FINANCIAL DATA SECURED
          </div>

          <div className="absolute bottom-12 right-6 sm:right-20 text-[9px] sm:text-[10px] font-mono tracking-widest text-[#38BDF8]/30 font-semibold flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5" />
            <span>BANKING SYSTEMS</span>
          </div>
        </div>

        {/* Center Content Box */}
        <div className="relative z-10 max-w-3xl mx-auto text-center space-y-6">
          {/* Pill Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0C4A6E]/40 border border-[#0284C7]/50 text-[#38BDF8] text-xs font-semibold tracking-wide backdrop-blur-md shadow-lg shadow-sky-950/40">
            <Shield className="w-3.5 h-3.5 text-[#38BDF8]" />
            <span>Commercial Banking Security</span>
          </div>

          {/* Main Brand Title */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-[#38BDF8] drop-shadow-[0_0_25px_rgba(56,189,248,0.45)] uppercase font-sans">
            CYBERPHISH
          </h1>

          {/* Subtitle */}
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white tracking-tight">
            AI-Powered Phishing Email Detection
          </h2>

          {/* Paragraph */}
          <p className="text-sm sm:text-base text-[#94A3B8] max-w-xl mx-auto leading-relaxed font-sans">
            Detect, analyse and understand phishing threats before they compromise banking users.
          </p>

          {/* Action Buttons */}
          <div className="pt-3 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => onNavigate('analyze')}
              className="inline-flex items-center justify-center gap-2 px-7 py-3 rounded-xl bg-[#0284C7] hover:bg-[#0369A1] text-white font-semibold text-sm shadow-xl shadow-sky-900/50 hover:shadow-sky-800/70 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
            >
              <Zap className="w-4 h-4 fill-white" />
              <span>Analyze Email</span>
            </button>

            <button
              onClick={() => onOpenAuth('login')}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#111C35]/80 hover:bg-[#1A2A4E] border border-[#1E2D4D] text-[#F8FAFC] font-semibold text-sm hover:border-[#38BDF8]/50 transition-all cursor-pointer backdrop-blur-md"
            >
              <span>Login</span>
              <ArrowRight className="w-4 h-4 text-[#38BDF8]" />
            </button>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. REAL-TIME THREAT METRICS BAR */}
      {/* ========================================================================= */}
      <section className="px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-[#0F172A]/80 backdrop-blur-md border border-[#1E2D4D] rounded-2xl p-5 shadow-lg text-center space-y-1">
            <div className="text-2xl sm:text-3xl font-extrabold text-[#34D399] font-mono">91.70%</div>
            <div className="text-xs font-semibold text-white">Model Detection Accuracy</div>
            <div className="text-[11px] text-[#94A3B8]">TF-IDF + Logistic Regression</div>
          </div>

          <div className="bg-[#0F172A]/80 backdrop-blur-md border border-[#1E2D4D] rounded-2xl p-5 shadow-lg text-center space-y-1">
            <div className="text-2xl sm:text-3xl font-extrabold text-[#38BDF8] font-mono">&lt; 120ms</div>
            <div className="text-xs font-semibold text-white">Real-Time Latency</div>
            <div className="text-[11px] text-[#94A3B8]">Instant REST inference</div>
          </div>

          <div className="bg-[#0F172A]/80 backdrop-blur-md border border-[#1E2D4D] rounded-2xl p-5 shadow-lg text-center space-y-1">
            <div className="text-2xl sm:text-3xl font-extrabold text-[#FBBF24] font-mono">2,450+</div>
            <div className="text-xs font-semibold text-white">Banking Signatures</div>
            <div className="text-[11px] text-[#94A3B8]">Cameroon & CEMAC corpora</div>
          </div>

          <div className="bg-[#0F172A]/80 backdrop-blur-md border border-[#1E2D4D] rounded-2xl p-5 shadow-lg text-center space-y-1">
            <div className="text-2xl sm:text-3xl font-extrabold text-[#A78BFA] font-mono">Dual-Engine</div>
            <div className="text-xs font-semibold text-white">Hybrid Heuristics</div>
            <div className="text-[11px] text-[#94A3B8]">ML + Deterministic Rules</div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. 1-CLICK INSTANT TEST SCENARIOS */}
      {/* ========================================================================= */}
      <section className="px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto bg-[#0F172A]/90 backdrop-blur-md border border-[#1E2D4D] rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#1E2D4D] pb-5">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-mono text-[#38BDF8] uppercase font-bold tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Interactive Demonstration</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight mt-1">
                Try Live Banking Phishing Scenarios
              </h2>
              <p className="text-xs text-[#94A3B8] mt-0.5">
                Select a simulated attack vector to launch the full AI detection pipeline and forensic report.
              </p>
            </div>

            <button
              onClick={() => onNavigate('analyze')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#111C35] hover:bg-[#1A2A4E] border border-[#1E2D4D] text-xs font-semibold text-[#38BDF8] transition-colors self-start sm:self-auto cursor-pointer"
            >
              <span>Custom Analysis Input</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {sampleAttacks.map((sample) => (
              <div
                key={sample.id}
                onClick={() => {
                  if (onQuickAnalyzeSample) {
                    onQuickAnalyzeSample(sample.id as any);
                  }
                  onNavigate('analyze');
                }}
                className={`p-5 rounded-2xl border transition-all cursor-pointer hover:scale-[1.01] hover:border-[#38BDF8]/60 flex flex-col justify-between space-y-3 ${sample.color}`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-md bg-black/40 border border-white/10">
                      {sample.type}
                    </span>
                    <span className="text-[10px] font-mono font-semibold">
                      {sample.risk}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-white mt-2.5">
                    {sample.title}
                  </h3>
                  <p className="text-xs text-[#94A3B8] mt-1 line-clamp-2">
                    {sample.summary}
                  </p>
                </div>

                <div className="pt-2 flex items-center justify-between text-xs font-semibold text-[#38BDF8]">
                  <span>Analyze This Scenario</span>
                  <Zap className="w-3.5 h-3.5" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. FEATURES SECTION (Anchor: #features) */}
      {/* ========================================================================= */}
      <section id="features" className="px-4 sm:px-6 lg:px-8 space-y-8 scroll-mt-20">
        <div className="max-w-7xl mx-auto text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0C4A6E]/40 border border-[#0284C7]/40 text-[#38BDF8] text-xs font-mono font-semibold">
            <span>CORE ARCHITECTURE</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Engineered for Commercial Banking Resilience
          </h2>
          <p className="text-xs sm:text-sm text-[#94A3B8] max-w-2xl mx-auto">
            Combining statistical machine learning inference with specialized heuristic rules tailored to Central & West African banking threat vectors.
          </p>
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Feature 1 */}
          <div className="bg-[#0F172A]/85 backdrop-blur-md border border-[#1E2D4D] hover:border-[#38BDF8]/50 rounded-2xl p-6 shadow-xl transition-all space-y-3 group">
            <div className="w-10 h-10 rounded-xl bg-[#0C4A6E]/60 text-[#38BDF8] flex items-center justify-center border border-[#0284C7]/30 group-hover:scale-105 transition-transform">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Machine Learning Classification</h3>
            <p className="text-xs text-[#94A3B8] leading-relaxed">
              TF-IDF natural language extraction trained with Logistic Regression, Random Forest, and Naive Bayes benchmarks reaching 91.70% validated accuracy.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-[#0F172A]/85 backdrop-blur-md border border-[#1E2D4D] hover:border-[#38BDF8]/50 rounded-2xl p-6 shadow-xl transition-all space-y-3 group">
            <div className="w-10 h-10 rounded-xl bg-[#0C4A6E]/60 text-[#38BDF8] flex items-center justify-center border border-[#0284C7]/30 group-hover:scale-105 transition-transform">
              <Sliders className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Heuristic Cybersecurity Rules</h3>
            <p className="text-xs text-[#94A3B8] leading-relaxed">
              Configurable regex indicators flagging urgency pressure, credential harvesting, typosquatting domains, and fraudulent banking keywords.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-[#0F172A]/85 backdrop-blur-md border border-[#1E2D4D] hover:border-[#38BDF8]/50 rounded-2xl p-6 shadow-xl transition-all space-y-3 group">
            <div className="w-10 h-10 rounded-xl bg-[#0C4A6E]/60 text-[#38BDF8] flex items-center justify-center border border-[#0284C7]/30 group-hover:scale-105 transition-transform">
              <FileCheck2 className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Explainable Forensic Dossier</h3>
            <p className="text-xs text-[#94A3B8] leading-relaxed">
              Transparent SHAP-inspired token contribution scores, extracted risk indicators, and clear remediation instructions for banking operators.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="bg-[#0F172A]/85 backdrop-blur-md border border-[#1E2D4D] hover:border-[#38BDF8]/50 rounded-2xl p-6 shadow-xl transition-all space-y-3 group">
            <div className="w-10 h-10 rounded-xl bg-[#0C4A6E]/60 text-[#38BDF8] flex items-center justify-center border border-[#0284C7]/30 group-hover:scale-105 transition-transform">
              <Key className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Multi-Role SOC Governance</h3>
            <p className="text-xs text-[#94A3B8] leading-relaxed">
              Granular role-based access control (Admin, Security Analyst, User) with tamper-resistant immutable compliance audit logs.
            </p>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. HOW IT WORKS SECTION (Anchor: #how-it-works) */}
      {/* ========================================================================= */}
      <section id="how-it-works" className="px-4 sm:px-6 lg:px-8 space-y-8 scroll-mt-20">
        <div className="max-w-7xl mx-auto bg-[#0B1222]/90 border border-[#1E2D4D] rounded-3xl p-6 sm:p-10 shadow-2xl space-y-8">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0C4A6E]/40 border border-[#0284C7]/40 text-[#38BDF8] text-xs font-mono font-semibold">
              <span>WORKFLOW PIPELINE</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              How CyberPhish Defends Your Banking Email Stream
            </h2>
            <p className="text-xs sm:text-sm text-[#94A3B8] max-w-2xl mx-auto">
              From incoming email headers to ML feature extraction and automated incident containment.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
            {/* Step 1 */}
            <div className="bg-[#0F172A] border border-[#1E2D4D] p-6 rounded-2xl space-y-3 relative shadow-lg">
              <div className="w-8 h-8 rounded-full bg-[#0284C7] text-white font-bold font-mono text-xs flex items-center justify-center shadow-md">
                01
              </div>
              <h3 className="text-base font-bold text-white">Ingestion & Token Extraction</h3>
              <p className="text-xs text-[#94A3B8] leading-relaxed">
                Extracts raw email bodies, sender DKIM/SPF headers, and embedded URLs. Normalizes text and runs n-gram vectorization.
              </p>
              <div className="pt-2 text-[11px] font-mono text-[#38BDF8] flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#34D399]" />
                <span>URL & Lookalike Domain Analysis</span>
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-[#0F172A] border border-[#1E2D4D] p-6 rounded-2xl space-y-3 relative shadow-lg">
              <div className="w-8 h-8 rounded-full bg-[#0284C7] text-white font-bold font-mono text-xs flex items-center justify-center shadow-md">
                02
              </div>
              <h3 className="text-base font-bold text-white">Dual-Engine Hybrid Scoring</h3>
              <p className="text-xs text-[#94A3B8] leading-relaxed">
                Calculates ML statistical probability (60% weight) and heuristic rule indicators (40% weight) to derive a unified 0–100 risk score.
              </p>
              <div className="pt-2 text-[11px] font-mono text-[#38BDF8] flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#34D399]" />
                <span>Low False-Positive Tolerance</span>
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-[#0F172A] border border-[#1E2D4D] p-6 rounded-2xl space-y-3 relative shadow-lg">
              <div className="w-8 h-8 rounded-full bg-[#0284C7] text-white font-bold font-mono text-xs flex items-center justify-center shadow-md">
                03
              </div>
              <h3 className="text-base font-bold text-white">Automated Triage & Forensics</h3>
              <p className="text-xs text-[#94A3B8] leading-relaxed">
                Classifies as Legitimate, Suspicious, or Phishing. Generates SOC alerts, quarantine recommendations, and compliance logs.
              </p>
              <div className="pt-2 text-[11px] font-mono text-[#38BDF8] flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#34D399]" />
                <span>Executive & Analyst Reports</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. CALL TO ACTION / BOTTOM BANNER */}
      {/* ========================================================================= */}
      <section className="px-4 sm:px-6 lg:px-8 pb-8">
        <div className="max-w-7xl mx-auto bg-gradient-to-r from-[#0C4A6E] via-[#075985] to-[#1E3A8A] border border-[#38BDF8]/40 rounded-3xl p-8 sm:p-12 text-center text-white shadow-2xl relative overflow-hidden space-y-6">
          <div className="relative z-10 max-w-2xl mx-auto space-y-4">
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              Ready to Protect Your Banking Operations?
            </h2>
            <p className="text-xs sm:text-sm text-sky-100 leading-relaxed">
              Explore the full interactive SOC dashboard, examine live threat indicators, or review the Java 21 / Spring Boot 3 enterprise backend reference implementation.
            </p>

            <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
              <button
                onClick={() => onNavigate('dashboard')}
                className="px-6 py-3 rounded-xl bg-white text-[#0B1222] hover:bg-slate-100 font-bold text-xs shadow-lg hover:scale-105 transition-all cursor-pointer"
              >
                Open SOC Executive Dashboard
              </button>

              <button
                onClick={() => onNavigate('java-source')}
                className="px-6 py-3 rounded-xl bg-[#0B1222]/80 hover:bg-[#0B1222] border border-white/20 text-white font-semibold text-xs transition-all cursor-pointer"
              >
                Inspect Spring Boot 3 Codebase
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
