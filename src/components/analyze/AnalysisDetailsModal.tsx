import React from 'react';
import { 
  X, 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle, 
  FileDown, 
  Printer, 
  Calendar, 
  User, 
  Cpu, 
  Globe, 
  CheckCircle2,
  Terminal,
  Activity,
  Layers
} from 'lucide-react';
import { EmailAnalysis } from '../../types';
import { generatePdfReport } from '../../services/pdfReportGenerator';

interface AnalysisDetailsModalProps {
  analysis: EmailAnalysis | null;
  onClose: () => void;
}

export const AnalysisDetailsModal: React.FC<AnalysisDetailsModalProps> = ({
  analysis,
  onClose
}) => {
  if (!analysis) return null;

  const isPhish = analysis.classification === 'PHISHING';
  const isSusp = analysis.classification === 'SUSPICIOUS';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#050B17]/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-[#0F172A] border border-[#1E2D4D] rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden my-auto">
        {/* Modal Header */}
        <div className="bg-[#111C35] px-6 py-4 border-b border-[#1E2D4D] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#0C4A6E]/50 border border-[#0284C7]/40 flex items-center justify-center text-[#38BDF8]">
              <Terminal className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white font-sans">
                  Forensic Dossier <span className="font-mono text-xs font-semibold text-[#38BDF8]">#CP-{analysis.id}</span>
                </h2>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase font-mono ${
                  isPhish ? 'bg-[#450A0A] text-[#F87171] border border-[#DC2626]/50' :
                  isSusp ? 'bg-[#451A03] text-[#FBBF24] border border-[#D97706]/50' :
                  'bg-[#064E3B] text-[#34D399] border border-[#059669]/50'
                }`}>
                  {analysis.classification}
                </span>
              </div>
              <p className="text-xs text-[#94A3B8]">Cybersecurity Incident Response Forensics</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => generatePdfReport(analysis)}
              className="px-3.5 py-2 rounded-xl bg-[#DC2626] hover:bg-[#B91C1C] text-white text-xs font-semibold shadow-lg shadow-[#DC2626]/20 flex items-center gap-1.5 cursor-pointer"
            >
              <FileDown className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Export PDF</span>
            </button>
            <button
              onClick={() => window.print()}
              className="p-2 rounded-xl bg-[#111C35] hover:bg-[#1A2A4E] text-[#94A3B8] hover:text-white border border-[#1E2D4D] cursor-pointer"
              title="Print"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-[#111C35] hover:bg-[#1A2A4E] text-[#94A3B8] hover:text-white border border-[#1E2D4D] transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Content */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1 text-xs text-[#F8FAFC]">
          {/* Executive Overview Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#111C35] p-4 rounded-xl border border-[#1E2D4D] font-mono">
            <div>
              <div className="text-[10px] text-[#94A3B8] uppercase">Risk Score</div>
              <div className="text-xl font-bold text-white mt-0.5">{analysis.riskScore}/100</div>
              <div className={`text-[10px] font-semibold ${isPhish ? 'text-[#F87171]' : isSusp ? 'text-[#FBBF24]' : 'text-[#34D399]'}`}>{analysis.riskLevel}</div>
            </div>
            <div>
              <div className="text-[10px] text-[#94A3B8] uppercase">ML Probability</div>
              <div className="text-xl font-bold text-[#38BDF8] mt-0.5">{(analysis.probability * 100).toFixed(1)}%</div>
              <div className="text-[10px] text-[#94A3B8]">Logistic Regression</div>
            </div>
            <div>
              <div className="text-[10px] text-[#94A3B8] uppercase">Indicator Score</div>
              <div className="text-xl font-bold text-[#F59E0B] mt-0.5">{analysis.indicatorScore}/100</div>
              <div className="text-[10px] text-[#94A3B8]">{analysis.indicators.length} Triggers</div>
            </div>
            <div>
              <div className="text-[10px] text-[#94A3B8] uppercase">Analysis Date</div>
              <div className="text-xs font-semibold text-white mt-1">{new Date(analysis.createdAt).toLocaleDateString()}</div>
              <div className="text-[10px] text-[#94A3B8]">{new Date(analysis.createdAt).toLocaleTimeString()}</div>
            </div>
          </div>

          {/* Email Telemetry Metadata */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-[#38BDF8]" />
              <span>1. Email Headers & Metadata</span>
            </h3>
            <div className="bg-[#111C35] p-4 rounded-xl border border-[#1E2D4D] space-y-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <span className="text-[11px] font-semibold text-[#94A3B8]">From (Sender):</span>
                  <div className="font-mono text-white bg-[#0B1222] border border-[#1E2D4D] px-2.5 py-1 rounded-lg mt-0.5 truncate">{analysis.senderEmail}</div>
                </div>
                <div>
                  <span className="text-[11px] font-semibold text-[#94A3B8]">To (Target Recipient):</span>
                  <div className="font-mono text-white bg-[#0B1222] border border-[#1E2D4D] px-2.5 py-1 rounded-lg mt-0.5 truncate">{analysis.recipientEmail}</div>
                </div>
              </div>
              <div>
                <span className="text-[11px] font-semibold text-[#94A3B8]">Subject:</span>
                <div className="font-semibold text-white bg-[#0B1222] border border-[#1E2D4D] px-2.5 py-1.5 rounded-lg mt-0.5">{analysis.subject}</div>
              </div>
              <div>
                <span className="text-[11px] font-semibold text-[#94A3B8]">Email Body:</span>
                <div className="bg-[#0B1222] border border-[#1E2D4D] p-3 rounded-lg text-[#F8FAFC] font-sans leading-relaxed mt-0.5 max-h-40 overflow-y-auto whitespace-pre-wrap">
                  {analysis.emailBody}
                </div>
              </div>
            </div>
          </div>

          {/* TF-IDF Features Extracted */}
          {analysis.featuresExtracted?.tfidfTopTerms && analysis.featuresExtracted.tfidfTopTerms.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center gap-1.5">
                <Cpu className="w-4 h-4 text-[#38BDF8]" />
                <span>2. Machine Learning TF-IDF Feature Weights</span>
              </h3>
              <div className="bg-[#111C35] p-3 rounded-xl border border-[#1E2D4D] flex flex-wrap gap-2">
                {analysis.featuresExtracted.tfidfTopTerms.map((t, idx) => (
                  <span
                    key={idx}
                    className={`px-2.5 py-1 rounded-lg font-mono text-[11px] font-semibold border flex items-center gap-1.5 ${
                      t.weight > 0
                        ? 'bg-[#450A0A] text-[#F87171] border-[#DC2626]/50'
                        : 'bg-[#064E3B] text-[#34D399] border-[#059669]/50'
                    }`}
                  >
                    <span>{t.term}</span>
                    <span className="opacity-75 text-[10px]">({t.weight > 0 ? `+${t.weight}` : t.weight})</span>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Detected Threat Indicators */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-[#38BDF8]" />
              <span>3. Detected Threat Indicators ({analysis.indicators.length})</span>
            </h3>
            {analysis.indicators.length === 0 ? (
              <div className="p-3.5 bg-[#064E3B]/60 border border-[#059669]/50 rounded-xl text-[#34D399] flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#34D399]" />
                <span>No security rule indicators triggered.</span>
              </div>
            ) : (
              <div className="space-y-2">
                {analysis.indicators.map(ind => (
                  <div key={ind.id} className="p-3.5 bg-[#111C35] border border-[#1E2D4D] rounded-xl flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-mono font-bold ${
                          ind.severity === 'CRITICAL' ? 'bg-[#450A0A] text-[#F87171] border border-[#DC2626]/50' :
                          ind.severity === 'HIGH' ? 'bg-[#450A0A] text-[#EF4444] border border-[#DC2626]/50' :
                          'bg-[#451A03] text-[#FBBF24] border border-[#D97706]/50'
                        }`}>
                          {ind.severity}
                        </span>
                        <span className="font-semibold text-white">{ind.indicatorName}</span>
                      </div>
                      <p className="text-[#94A3B8] text-[11px] mt-1">{ind.description}</p>
                      {ind.matchedText && (
                        <div className="text-[10px] font-mono text-[#38BDF8] mt-0.5">
                          Trigger matched: "{ind.matchedText}"
                        </div>
                      )}
                    </div>
                    <span className="font-mono text-xs font-bold text-[#38BDF8]">
                      +{ind.scoreContribution} pts
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* URLs Forensics */}
          {analysis.urls && analysis.urls.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center gap-1.5">
                <Globe className="w-4 h-4 text-[#38BDF8]" />
                <span>4. Passive URL Inspections ({analysis.urls.length})</span>
              </h3>
              <div className="space-y-1.5">
                {analysis.urls.map(u => (
                  <div key={u.id} className="p-3 bg-[#111C35] border border-[#1E2D4D] rounded-xl font-mono text-xs">
                    <div className="flex items-center justify-between">
                      <span className={u.isSuspicious ? 'text-[#F87171] font-bold' : 'text-[#34D399] font-bold'}>
                        {u.isSuspicious ? '⚠ SUSPICIOUS DESTINATION' : '✓ VERIFIED STRUCTURE'}
                      </span>
                      <span className="text-[#94A3B8] text-[10px]">{u.domain}</span>
                    </div>
                    <div className="text-white truncate mt-0.5">{u.url}</div>
                    <div className="text-[#94A3B8] text-[10px] font-sans mt-1">{u.indicator}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Security Recommendations */}
          <div className="p-5 bg-[#111C35] border border-[#1E2D4D] rounded-2xl space-y-2">
            <h3 className="text-xs font-bold text-[#EF4444] uppercase tracking-wider font-mono">
              Security Action Plan & Mitigations
            </h3>
            <ul className="space-y-1 text-[#F8FAFC]">
              {analysis.recommendations.map((r, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-[#38BDF8] font-bold">•</span>
                  <span>{r}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-[#111C35] px-6 py-3.5 border-t border-[#1E2D4D] flex items-center justify-between text-xs text-[#94A3B8] font-mono">
          <span>Model: {analysis.modelUsed} ({analysis.modelVersion})</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[#0B1222] hover:bg-[#1A2A4E] border border-[#1E2D4D] text-[#38BDF8] font-semibold transition-colors cursor-pointer"
          >
            Close Dossier
          </button>
        </div>
      </div>
    </div>
  );
};
