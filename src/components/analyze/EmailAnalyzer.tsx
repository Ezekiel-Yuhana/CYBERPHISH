import React, { useState, useRef } from 'react';
import { 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle, 
  Upload, 
  RotateCcw, 
  Sparkles, 
  FileDown, 
  Printer, 
  Info, 
  ExternalLink, 
  Layers, 
  CheckCircle2, 
  AlertOctagon,
  FileText,
  HelpCircle,
  Database,
  Search,
  X,
  Zap
} from 'lucide-react';
import { EmailAnalysis, User } from '../../types';
import { performFullEmailAnalysis } from '../../services/mlEngine';
import { parseEmlContent } from '../../services/emailParser';
import { storageService } from '../../services/storageService';
import { generatePdfReport } from '../../services/pdfReportGenerator';
import { SAMPLE_TEST_CASES } from '../../data/seedData';
import { BANKING_CORPUS_ITEMS, BankingDatasetItem } from '../../data/bankingCorpusDataset';

interface EmailAnalyzerProps {
  currentUser: User | null;
  initialSampleIndex?: number | null;
  onAnalysisComplete: (analysis: EmailAnalysis) => void;
  onViewForensics: (analysis: EmailAnalysis) => void;
}

export const EmailAnalyzer: React.FC<EmailAnalyzerProps> = ({
  currentUser,
  initialSampleIndex,
  onAnalysisComplete,
  onViewForensics
}) => {
  // Form State
  const [sender, setSender] = useState('security-alerts@bicec-auth-portal.net');
  const [recipient, setRecipient] = useState('corporate.client@bank.cm');
  const [subject, setSubject] = useState('URGENT: Your BICEC Bank account will be suspended within 24 hours');
  const [body, setBody] = useState(
    'Dear customer, We detected an unauthorized transaction attempt on your account. To prevent full suspension of your account, please verify your account immediately using the link below: http://194.26.29.112/bicec/login-verify. Enter your password and mobile OTP to authenticate.'
  );
  const [urlsInput, setUrlsInput] = useState('http://194.26.29.112/bicec/login-verify');

  // Corpus dataset modal state
  const [isDatasetModalOpen, setIsDatasetModalOpen] = useState(false);
  const [datasetSearch, setDatasetSearch] = useState('');
  const [datasetFilter, setDatasetFilter] = useState<'ALL' | '1' | '0'>('ALL');

  // Load sample on mount or initialSampleIndex change
  React.useEffect(() => {
    if (initialSampleIndex !== undefined && initialSampleIndex !== null) {
      loadTestCase(initialSampleIndex);
    }
  }, [initialSampleIndex]);

  // Analysis result state
  const [currentResult, setCurrentResult] = useState<EmailAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load sample test case
  const loadTestCase = (index: number) => {
    const tc = SAMPLE_TEST_CASES[index];
    if (!tc) return;
    setSender(tc.sender);
    setRecipient(tc.recipient);
    setSubject(tc.subject);
    setBody(tc.body);
    setUrlsInput(tc.urls);
  };

  // Load from real banking corpus dataset item
  const loadFromCorpusItem = (item: BankingDatasetItem) => {
    const senderMatch = item.text.match(/sender:\s*([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/i);
    const extractedSender = senderMatch ? senderMatch[1] : (item.label === 1 ? 'security-alert@cameroon-bank-support.com' : 'support@officialbank.example');
    
    const urlMatches = item.text.match(/(https?:\/\/[^\s]+)/gi) || [];
    const extractedUrls = Array.from(new Set(urlMatches)).join('\n');

    setSender(extractedSender);
    setRecipient('corporate.banking@bank.cm');
    setSubject(item.label === 1 ? `SECURITY ALERT: Action Required on Account #${item.id}` : `Official Banking Notification #${item.id}`);
    setBody(item.text);
    setUrlsInput(extractedUrls);
    setIsDatasetModalOpen(false);
  };

  const filteredCorpus = BANKING_CORPUS_ITEMS.filter(item => {
    const matchesSearch = item.id.toLowerCase().includes(datasetSearch.toLowerCase()) ||
      item.text.toLowerCase().includes(datasetSearch.toLowerCase());
    const matchesFilter = datasetFilter === 'ALL' || (datasetFilter === '1' && item.label === 1) || (datasetFilter === '0' && item.label === 0);
    return matchesSearch && matchesFilter;
  });

  const handleClear = () => {
    setSender('');
    setRecipient('');
    setSubject('');
    setBody('');
    setUrlsInput('');
    setCurrentResult(null);
  };

  const handleAnalyze = () => {
    if (!subject.trim() || !body.trim()) {
      alert('Please provide at least an email subject and body to analyze.');
      return;
    }

    setIsAnalyzing(true);

    setTimeout(() => {
      const explicitUrls = urlsInput
        .split('\n')
        .map(u => u.trim())
        .filter(Boolean);

      const rules = storageService.getRules();
      const weights = storageService.getRiskWeights();

      const analysis = performFullEmailAnalysis(
        {
          userId: currentUser ? currentUser.id : 1,
          userName: currentUser ? currentUser.fullName : 'Security Operator',
          userEmail: currentUser ? currentUser.email : 'soc-analyst@bank.cm',
          senderEmail: sender.trim() || 'unknown-sender@domain.com',
          recipientEmail: recipient.trim() || 'recipient@bank.cm',
          subject: subject.trim(),
          emailBody: body.trim(),
          urls: explicitUrls
        },
        rules,
        weights
      );

      storageService.saveAnalysis(analysis);
      setCurrentResult(analysis);
      onAnalysisComplete(analysis);
      setIsAnalyzing(false);
    }, 450);
  };

  // EML File Upload & Drag-and-drop
  const handleFileUpload = (file: File) => {
    if (!file.name.toLowerCase().endsWith('.eml') && !file.type.includes('message') && !file.type.includes('text')) {
      alert('Please upload a valid RFC 822 .eml email file.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('File size exceeds the 5 MB maximum limit.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      if (content) {
        const parsed = parseEmlContent(content);
        setSender(parsed.from);
        setRecipient(parsed.to);
        setSubject(parsed.subject);
        setBody(parsed.body);
        setUrlsInput(parsed.urls.join('\n'));
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="bg-[#0F172A]/90 backdrop-blur-md border border-[#1E2D4D] p-6 rounded-2xl shadow-xl flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-950/60 text-emerald-400 border border-emerald-500/30 text-[10px] uppercase font-mono font-semibold tracking-wider flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Live Production Engine
            </span>
            <span className="text-xs text-[#94A3B8]">• Active Banking Corpus Loaded</span>
          </div>
          <h1 className="text-xl font-bold text-white tracking-tight mt-1 font-sans">
            Email Threat & <span className="text-[#38BDF8]">Phishing Detection Terminal</span>
          </h1>
        </div>

        {/* Quick Presets & Corpus Modal Trigger */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setIsDatasetModalOpen(true)}
            className="px-3.5 py-1.5 text-xs rounded-xl bg-gradient-to-r from-[#0284C7] to-[#1D4ED8] hover:from-[#0369A1] hover:to-[#1E40AF] text-white transition-all font-semibold cursor-pointer flex items-center gap-1.5 shadow-md shadow-sky-950/40"
          >
            <Database className="w-3.5 h-3.5" />
            <span>Browse Corpus Dataset</span>
          </button>

          <span className="text-xs text-[#94A3B8] font-mono hidden lg:inline">Quick Presets:</span>
          {SAMPLE_TEST_CASES.map((tc, idx) => (
            <button
              key={idx}
              onClick={() => loadTestCase(idx)}
              className="px-3 py-1.5 text-xs rounded-xl bg-[#111C35] hover:bg-[#1A2A4E] text-[#38BDF8] border border-[#1E2D4D] transition-colors font-medium cursor-pointer font-mono"
              title={tc.title}
            >
              Preset #{idx + 1}
            </button>
          ))}
        </div>
      </div>

      {/* Dataset Picker Modal */}
      {isDatasetModalOpen && (
        <div className="fixed inset-0 bg-[#080D1A]/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#0F172A] border border-[#1E2D4D] rounded-2xl max-w-3xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-[#1E2D4D] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#0284C7]/20 border border-[#0284C7]/40 text-[#38BDF8] flex items-center justify-center">
                  <Database className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Select from Active Banking Corpus</h3>
                  <p className="text-xs text-[#94A3B8]">Click any record to populate into the live analyzer</p>
                </div>
              </div>
              <button
                onClick={() => setIsDatasetModalOpen(false)}
                className="p-1.5 rounded-lg text-[#94A3B8] hover:text-white hover:bg-[#1E2D4D] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Filter Bar */}
            <div className="p-4 bg-[#0B1222] border-b border-[#1E2D4D] flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-[#94A3B8]" />
                <input
                  type="text"
                  value={datasetSearch}
                  onChange={(e) => setDatasetSearch(e.target.value)}
                  placeholder="Filter by ID (e.g. E00758) or words (e.g. otp, password, salary)..."
                  className="w-full pl-9 pr-3 py-1.5 bg-[#070D18] border border-[#1E2D4D] rounded-xl text-xs text-white placeholder-[#94A3B8] focus:outline-none focus:border-[#38BDF8]"
                />
              </div>

              <select
                value={datasetFilter}
                onChange={(e) => setDatasetFilter(e.target.value as any)}
                className="px-3 py-1.5 bg-[#070D18] border border-[#1E2D4D] rounded-xl text-xs text-white focus:outline-none focus:border-[#38BDF8] font-mono cursor-pointer"
              >
                <option value="ALL">All Categories</option>
                <option value="1">Phishing Vectors (Label 1)</option>
                <option value="0">Legitimate Emails (Label 0)</option>
              </select>
            </div>

            {/* List */}
            <div className="p-4 overflow-y-auto space-y-2.5 flex-1 max-h-[50vh]">
              {filteredCorpus.slice(0, 40).map(item => (
                <div
                  key={item.id}
                  onClick={() => loadFromCorpusItem(item)}
                  className="p-3 rounded-xl bg-[#111C35]/80 hover:bg-[#1A2A4E] border border-[#1E2D4D] hover:border-[#38BDF8] transition-all cursor-pointer flex items-start justify-between gap-3 group"
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-xs text-[#38BDF8]">#{item.id}</span>
                      <span className={`px-2 py-0.2 rounded text-[9px] font-mono font-bold border ${
                        item.label === 1 
                          ? 'bg-red-950/50 border-red-500/40 text-red-400' 
                          : 'bg-emerald-950/50 border-emerald-500/40 text-emerald-400'
                      }`}>
                        {item.labelName}
                      </span>
                    </div>
                    <p className="text-xs text-[#94A3B8] line-clamp-2 font-mono text-[11px] leading-relaxed">
                      {item.text}
                    </p>
                  </div>

                  <button className="shrink-0 px-3 py-1 rounded-lg bg-[#0284C7]/20 group-hover:bg-[#0284C7] text-[#38BDF8] group-hover:text-white border border-[#0284C7]/40 text-xs font-semibold flex items-center gap-1 transition-all">
                    <Zap className="w-3 h-3" />
                    <span>Select</span>
                  </button>
                </div>
              ))}
            </div>

            <div className="p-3.5 border-t border-[#1E2D4D] bg-[#070D18] text-[11px] text-[#94A3B8] flex items-center justify-between">
              <span>Showing top matching records from 500+ banking emails</span>
              <button
                onClick={() => setIsDatasetModalOpen(false)}
                className="text-xs text-[#38BDF8] hover:underline font-semibold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Dual Pane Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT PANE: Email Submission Form (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-[#0F172A]/85 backdrop-blur-md border border-[#1E2D4D] rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#1E2D4D] pb-3">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#38BDF8]" />
                <span>Email Telemetry Input</span>
              </h2>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-1.5 text-xs text-[#38BDF8] hover:text-white font-semibold cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload .EML</span>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".eml,message/rfc822,text/plain"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleFileUpload(e.target.files[0]);
                  }
                }}
              />
            </div>

            {/* Drag & Drop Box */}
            <div
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setIsDragging(false);
                if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                  handleFileUpload(e.dataTransfer.files[0]);
                }
              }}
              className={`border-2 border-dashed rounded-xl p-4 text-center transition-all cursor-pointer ${
                isDragging
                  ? 'border-[#38BDF8] bg-[#0C4A6E]/30'
                  : 'border-[#1E2D4D] hover:border-[#38BDF8]/60 bg-[#0B1222]/80'
              }`}
              onClick={() => fileInputRef.current?.click()}
            >
              <p className="text-xs text-[#F8FAFC]">
                Drag & drop raw <span className="text-[#38BDF8] font-mono font-semibold">.eml</span> file here or click to browse
              </p>
              <p className="text-[10px] text-[#94A3B8] mt-0.5">Maximum size: 5MB (Passive parsing only)</p>
            </div>

            {/* Form Fields */}
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-[#94A3B8] mb-1">
                  Sender Address (From) <span className="text-[#EF4444]">*</span>
                </label>
                <input
                  type="email"
                  value={sender}
                  onChange={(e) => setSender(e.target.value)}
                  placeholder="e.g. security@bank-auth.com"
                  className="w-full px-3 py-2 bg-[#0B1222] border border-[#1E2D4D] rounded-xl text-xs text-[#F8FAFC] focus:outline-none focus:border-[#38BDF8] focus:ring-1 focus:ring-[#38BDF8] transition-all font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#94A3B8] mb-1">
                  Recipient Address (To)
                </label>
                <input
                  type="email"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  placeholder="e.g. client@bank.cm"
                  className="w-full px-3 py-2 bg-[#0B1222] border border-[#1E2D4D] rounded-xl text-xs text-[#F8FAFC] focus:outline-none focus:border-[#38BDF8] focus:ring-1 focus:ring-[#38BDF8] transition-all font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#94A3B8] mb-1">
                  Subject Line <span className="text-[#EF4444]">*</span>
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. Urgent Account Verification Required"
                  className="w-full px-3 py-2 bg-[#0B1222] border border-[#1E2D4D] rounded-xl text-xs text-[#F8FAFC] focus:outline-none focus:border-[#38BDF8] focus:ring-1 focus:ring-[#38BDF8] transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#94A3B8] mb-1">
                  Email Body Content <span className="text-[#EF4444]">*</span>
                </label>
                <textarea
                  rows={6}
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  placeholder="Paste the plain-text or sanitized content of the email..."
                  className="w-full px-3 py-2 bg-[#0B1222] border border-[#1E2D4D] rounded-xl text-xs text-[#F8FAFC] focus:outline-none focus:border-[#38BDF8] focus:ring-1 focus:ring-[#38BDF8] transition-all leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#94A3B8] mb-1">
                  Contained URLs / Hyperlinks (One per line)
                </label>
                <textarea
                  rows={2}
                  value={urlsInput}
                  onChange={(e) => setUrlsInput(e.target.value)}
                  placeholder="e.g. http://194.26.29.112/verify"
                  className="w-full px-3 py-1.5 bg-[#0B1222] border border-[#1E2D4D] rounded-xl text-xs text-[#F8FAFC] focus:outline-none focus:border-[#38BDF8] focus:ring-1 focus:ring-[#38BDF8] transition-all font-mono"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={handleAnalyze}
                disabled={isAnalyzing}
                className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-[#0284C7] to-[#2563EB] hover:from-[#0369A1] hover:to-[#1D4ED8] text-white font-semibold text-xs shadow-lg shadow-[#0284C7]/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
              >
                {isAnalyzing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>EXTRACTING & PREDICTING...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-[#38BDF8]" />
                    <span>ANALYSE EMAIL</span>
                  </>
                )}
              </button>

              <button
                onClick={handleClear}
                className="px-4 py-3 rounded-xl bg-[#111C35] hover:bg-[#1A2A4E] text-[#94A3B8] hover:text-white text-xs font-semibold border border-[#1E2D4D] transition-colors flex items-center gap-1.5 cursor-pointer"
                title="Clear all fields"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Clear</span>
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT PANE: Live Threat Analysis Results (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          {currentResult ? (
            <div className="bg-[#0F172A]/85 backdrop-blur-md border border-[#1E2D4D] rounded-2xl p-6 shadow-xl space-y-6">
              {/* Header Result Banner */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#1E2D4D] pb-5">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-[#38BDF8]">ANALYSIS ID: #{currentResult.id}</span>
                    <span className="text-xs text-[#94A3B8]">• {new Date(currentResult.createdAt).toLocaleTimeString()}</span>
                  </div>
                  <h2 className="text-xl font-bold text-white tracking-tight mt-0.5 font-sans">
                    Threat Forensics Evaluation
                  </h2>
                </div>

                {/* Main Classification Badge */}
                <div className="flex items-center gap-3">
                  <div className={`px-4 py-2 rounded-xl border flex items-center gap-2 shadow-md ${
                    currentResult.classification === 'PHISHING'
                      ? 'bg-[#450A0A] text-[#F87171] border-[#DC2626]/60'
                      : currentResult.classification === 'SUSPICIOUS'
                      ? 'bg-[#451A03] text-[#FBBF24] border-[#D97706]/60'
                      : 'bg-[#064E3B] text-[#34D399] border-[#059669]/60'
                  }`}>
                    {currentResult.classification === 'PHISHING' && <ShieldAlert className="w-5 h-5 text-[#EF4444]" />}
                    {currentResult.classification === 'SUSPICIOUS' && <AlertTriangle className="w-5 h-5 text-[#F59E0B]" />}
                    {currentResult.classification === 'LEGITIMATE' && <ShieldCheck className="w-5 h-5 text-[#10B981]" />}
                    <div>
                      <div className="text-[10px] uppercase font-mono font-semibold opacity-80">CLASSIFICATION</div>
                      <div className="text-base font-bold tracking-wider font-mono">{currentResult.classification}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Risk Scoring & Math Breakdown Section */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Risk Score Meter */}
                <div className="bg-[#111C35] border border-[#1E2D4D] p-4 rounded-xl text-center flex flex-col justify-center">
                  <div className="text-[11px] font-mono text-[#94A3B8] uppercase font-semibold">Overall Risk Score</div>
                  <div className={`text-4xl font-bold font-mono my-1 ${
                    currentResult.riskScore >= 80 ? 'text-[#DC2626]' :
                    currentResult.riskScore >= 60 ? 'text-[#EF4444]' :
                    currentResult.riskScore >= 30 ? 'text-[#F59E0B]' : 'text-[#10B981]'
                  }`}>
                    {currentResult.riskScore}<span className="text-base text-[#94A3B8]">/100</span>
                  </div>
                  <div className="inline-block mx-auto">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider font-mono ${
                      currentResult.riskLevel === 'CRITICAL' ? 'bg-[#450A0A] text-[#F87171] border border-[#DC2626]/50' :
                      currentResult.riskLevel === 'HIGH' ? 'bg-[#450A0A] text-[#EF4444] border border-[#DC2626]/50' :
                      currentResult.riskLevel === 'MEDIUM' ? 'bg-[#451A03] text-[#FBBF24] border border-[#D97706]/50' :
                      'bg-[#064E3B] text-[#34D399] border border-[#059669]/50'
                    }`}>
                      {currentResult.riskLevel} RISK
                    </span>
                  </div>
                </div>

                {/* ML Probability */}
                <div className="bg-[#111C35] border border-[#1E2D4D] p-4 rounded-xl text-center flex flex-col justify-center">
                  <div className="text-[11px] font-mono text-[#94A3B8] uppercase font-semibold">ML Phishing Probability</div>
                  <div className="text-3xl font-bold font-mono text-[#38BDF8] my-1">
                    {(currentResult.probability * 100).toFixed(1)}%
                  </div>
                  <div className="text-[10px] text-[#94A3B8]">
                    Model: <span className="text-white font-medium">Logistic Regression</span>
                  </div>
                </div>

                {/* Heuristics Indicator Score */}
                <div className="bg-[#111C35] border border-[#1E2D4D] p-4 rounded-xl text-center flex flex-col justify-center">
                  <div className="text-[11px] font-mono text-[#94A3B8] uppercase font-semibold">Rule Indicator Score</div>
                  <div className="text-3xl font-bold font-mono text-[#F59E0B] my-1">
                    {currentResult.indicatorScore}<span className="text-base text-[#94A3B8]">/100</span>
                  </div>
                  <div className="text-[10px] text-[#94A3B8]">
                    {currentResult.indicators.length} Threat Indicators Detected
                  </div>
                </div>
              </div>

              {/* Transparent Formula Display */}
              <div className="p-3.5 bg-[#0B1222] border border-[#1E2D4D] rounded-xl text-xs font-mono text-[#F8FAFC] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Info className="w-4 h-4 text-[#38BDF8] shrink-0" />
                  <span>
                    Formula: <span className="text-[#38BDF8] font-semibold">({(currentResult.probability * 100).toFixed(0)} × 0.70)</span> + <span className="text-[#F59E0B] font-semibold">({currentResult.indicatorScore} × 0.30)</span> = <span className="text-white font-bold">{currentResult.riskScore}</span>
                  </span>
                </div>
                <span className="text-[11px] text-[#64748B]">Configurable in Admin</span>
              </div>

              {/* Detected Indicators List */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center justify-between">
                  <span>Detected Threat Indicators ({currentResult.indicators.length})</span>
                  <span className="text-[10px] text-[#94A3B8] font-normal">Cyber Rule Matches</span>
                </h3>

                {currentResult.indicators.length === 0 ? (
                  <div className="p-3.5 bg-[#064E3B]/60 border border-[#059669]/50 rounded-xl text-xs text-[#34D399] flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#34D399]" />
                    <span>No malicious heuristics or phishing indicators flagged.</span>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {currentResult.indicators.map((ind) => (
                      <div
                        key={ind.id}
                        className="p-3.5 bg-[#111C35] border border-[#1E2D4D] rounded-xl flex items-start justify-between gap-3 text-xs"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold font-mono ${
                              ind.severity === 'CRITICAL' ? 'bg-[#450A0A] text-[#F87171] border border-[#DC2626]/50' :
                              ind.severity === 'HIGH' ? 'bg-[#450A0A] text-[#EF4444] border border-[#DC2626]/50' :
                              'bg-[#451A03] text-[#FBBF24] border border-[#D97706]/50'
                            }`}>
                              {ind.severity}
                            </span>
                            <span className="font-semibold text-white">{ind.indicatorName}</span>
                          </div>
                          <p className="text-[#94A3B8] text-[11px]">{ind.description}</p>
                          {ind.matchedText && (
                            <div className="text-[10px] font-mono text-[#38BDF8]">
                              Matched keyword: <span className="bg-[#0B1222] px-1.5 py-0.5 rounded text-white font-semibold border border-[#1E2D4D]">"{ind.matchedText}"</span>
                            </div>
                          )}
                        </div>
                        <span className="text-xs font-mono font-bold text-[#38BDF8] shrink-0">
                          +{ind.scoreContribution} pts
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Passive URL Forensics */}
              {currentResult.urls && currentResult.urls.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                    Passive URL Forensics ({currentResult.urls.length})
                  </h3>
                  <div className="space-y-1.5">
                    {currentResult.urls.map((u) => (
                      <div
                        key={u.id}
                        className={`p-3 rounded-xl border text-xs font-mono flex items-center justify-between gap-2 ${
                          u.isSuspicious
                            ? 'bg-[#450A0A]/80 border-[#DC2626]/50 text-[#F87171]'
                            : 'bg-[#111C35] border-[#1E2D4D] text-[#34D399]'
                        }`}
                      >
                        <div className="truncate max-w-[340px]">
                          <span className="font-semibold">{u.isSuspicious ? '⚠ SUSPICIOUS: ' : '✓ SAFE: '}</span>
                          <span className="text-white">{u.url}</span>
                          <div className="text-[10px] text-[#94A3B8] font-sans mt-0.5">{u.indicator}</div>
                        </div>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-[#0B1222] border border-[#1E2D4D] text-[#38BDF8] shrink-0">
                          {u.protocol.toUpperCase()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Security Recommendations */}
              <div className="p-5 bg-[#111C35] border border-[#1E2D4D] rounded-2xl space-y-2">
                <div className="text-xs font-bold uppercase tracking-wider text-[#EF4444] font-mono flex items-center gap-1.5">
                  <AlertOctagon className="w-4 h-4" />
                  <span>Security Recommendations & Guidance</span>
                </div>
                <ul className="space-y-1.5 text-xs text-[#F8FAFC]">
                  {currentResult.recommendations.map((rec, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-[#38BDF8] font-bold">•</span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Forensic & Report Export Actions */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#1E2D4D]">
                <button
                  onClick={() => onViewForensics(currentResult)}
                  className="px-4 py-2.5 rounded-xl bg-[#111C35] hover:bg-[#1A2A4E] border border-[#1E2D4D] text-xs font-semibold text-[#38BDF8] flex items-center gap-1.5 cursor-pointer"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Full Forensics Dossier</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => generatePdfReport(currentResult)}
                    className="px-4 py-2.5 rounded-xl bg-[#DC2626] hover:bg-[#B91C1C] text-white text-xs font-semibold shadow-lg shadow-[#DC2626]/20 flex items-center gap-1.5 cursor-pointer"
                  >
                    <FileDown className="w-3.5 h-3.5" />
                    <span>Download PDF Report</span>
                  </button>

                  <button
                    onClick={() => window.print()}
                    className="p-2.5 rounded-xl bg-[#111C35] hover:bg-[#1A2A4E] text-[#94A3B8] hover:text-white border border-[#1E2D4D] cursor-pointer"
                    title="Print Report"
                  >
                    <Printer className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* Empty State */
            <div className="bg-[#0F172A]/80 border border-[#1E2D4D] rounded-2xl p-12 text-center flex flex-col items-center justify-center min-h-[460px] shadow-xl">
              <div className="w-16 h-16 rounded-2xl bg-[#111C35] border border-[#1E2D4D] flex items-center justify-center mb-4 text-[#38BDF8] shadow-md shadow-[#0284C7]/15">
                <Sparkles className="w-8 h-8 text-[#38BDF8]" />
              </div>
              <h3 className="text-lg font-bold text-white font-sans">Awaiting Email Telemetry</h3>
              <p className="text-xs text-[#94A3B8] max-w-sm mt-1 mb-6 leading-relaxed">
                Fill the form on the left or select an academic test case to trigger the AI-powered feature extraction and risk scoring pipeline.
              </p>
              <button
                onClick={() => loadTestCase(0)}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#0284C7] to-[#2563EB] hover:from-[#0369A1] hover:to-[#1D4ED8] text-white text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer shadow-md shadow-[#0284C7]/20"
              >
                <Layers className="w-3.5 h-3.5 text-[#38BDF8]" />
                <span>Load Test Case #1 (Urgent Phishing)</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
