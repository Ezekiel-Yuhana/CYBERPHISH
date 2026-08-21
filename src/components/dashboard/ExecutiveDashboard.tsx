import React, { useState } from 'react';
import { 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle, 
  Mail, 
  TrendingUp, 
  Activity, 
  FileDown, 
  Eye, 
  ArrowRight,
  Sparkles,
  Search,
  Filter
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  Tooltip, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  AreaChart, 
  Area 
} from 'recharts';
import { DashboardStats, EmailAnalysis } from '../../types';
import { generatePdfReport } from '../../services/pdfReportGenerator';

interface ExecutiveDashboardProps {
  stats: DashboardStats;
  onSelectAnalysis?: (analysis: EmailAnalysis) => void;
  onSelectRecentAnalysis?: (analysis: EmailAnalysis) => void;
  onNavigateToAnalyze: () => void;
  onNavigateToHistory?: () => void;
}

export const ExecutiveDashboard: React.FC<ExecutiveDashboardProps> = ({
  stats,
  onSelectAnalysis,
  onSelectRecentAnalysis,
  onNavigateToAnalyze,
  onNavigateToHistory
}) => {
  const [filterType, setFilterType] = useState<string>('ALL');

  const handleSelect = (analysis: EmailAnalysis) => {
    if (onSelectRecentAnalysis) onSelectRecentAnalysis(analysis);
    else if (onSelectAnalysis) onSelectAnalysis(analysis);
  };

  const filteredRecent = stats.recentAnalyses.filter(a => {
    if (filterType === 'ALL') return true;
    return a.classification === filterType;
  });

  // Cyber dark chart palette
  const pieColors = ['#EF4444', '#F59E0B', '#10B981'];

  return (
    <div className="space-y-6">
      {/* Top Welcome / Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 bg-[#0F172A]/90 backdrop-blur-md border border-[#1E2D4D] p-8 rounded-[24px] shadow-xl relative overflow-hidden">
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-[#0284C7]/10 rounded-full blur-3xl pointer-events-none"></div>
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full bg-[#0C4A6E]/60 text-[#38BDF8] border border-[#0284C7]/30 text-[10px] uppercase font-mono font-semibold tracking-wider">
              Security Operations Center
            </span>
            <span className="text-xs text-[#94A3B8]">• Commercial Banking Telemetry</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight font-sans">
            Threat Intelligence & <span className="text-[#38BDF8]">Phishing Analytics</span>
          </h1>
          <p className="text-sm text-[#94A3B8] mt-2 max-w-2xl leading-relaxed">
            Real-time hybrid machine learning (Logistic Regression TF-IDF) and heuristic risk scoring protecting commercial banking assets.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onNavigateToAnalyze}
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-[#0284C7] to-[#2563EB] hover:from-[#0369A1] hover:to-[#1D4ED8] text-white text-xs font-semibold shadow-lg shadow-[#0284C7]/25 transition-all cursor-pointer hover:scale-[1.02]"
          >
            <Sparkles className="w-4 h-4 text-[#38BDF8]" />
            <span>ANALYSE NEW EMAIL</span>
          </button>
        </div>
      </div>

      {/* 6 Key KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* Total Analysed */}
        <div className="bg-[#0F172A]/80 border border-[#1E2D4D] p-5 rounded-2xl shadow-md relative overflow-hidden group hover:border-[#38BDF8]/50 transition-colors">
          <div className="flex items-center justify-between text-[#94A3B8] mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider font-mono">Total Analysed</span>
            <Mail className="w-4 h-4 text-[#38BDF8]" />
          </div>
          <div className="text-2xl font-bold text-white font-mono">{stats.totalAnalyses}</div>
          <div className="text-[10px] text-[#64748B] mt-1 flex items-center gap-1">
            <TrendingUp className="w-3 h-3 text-[#38BDF8]" />
            <span>Live telemetry</span>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#0284C7]"></div>
        </div>

        {/* Phishing Detected */}
        <div className="bg-[#0F172A]/80 border border-[#1E2D4D] p-5 rounded-2xl shadow-md relative overflow-hidden group hover:border-[#EF4444]/50 transition-colors">
          <div className="flex items-center justify-between text-[#94A3B8] mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider font-mono text-[#EF4444]">Phishing</span>
            <ShieldAlert className="w-4 h-4 text-[#EF4444]" />
          </div>
          <div className="text-2xl font-bold text-[#EF4444] font-mono">{stats.phishingCount}</div>
          <div className="text-[10px] text-[#94A3B8] mt-1">
            {stats.totalAnalyses > 0 ? Math.round((stats.phishingCount / stats.totalAnalyses) * 100) : 0}% of all traffic
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#EF4444]"></div>
        </div>

        {/* Suspicious Emails */}
        <div className="bg-[#0F172A]/80 border border-[#1E2D4D] p-5 rounded-2xl shadow-md relative overflow-hidden group hover:border-[#F59E0B]/50 transition-colors">
          <div className="flex items-center justify-between text-[#94A3B8] mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider font-mono text-[#F59E0B]">Suspicious</span>
            <AlertTriangle className="w-4 h-4 text-[#F59E0B]" />
          </div>
          <div className="text-2xl font-bold text-[#F59E0B] font-mono">{stats.suspiciousCount}</div>
          <div className="text-[10px] text-[#94A3B8] mt-1">Requires SOC Review</div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#F59E0B]"></div>
        </div>

        {/* Legitimate Emails */}
        <div className="bg-gradient-to-br from-[#064E3B]/80 to-[#0F172A] border border-[#059669]/40 text-white p-5 rounded-2xl shadow-md relative overflow-hidden group">
          <div className="flex items-center justify-between text-[#34D399] mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider font-mono text-[#34D399]">Legitimate</span>
            <ShieldCheck className="w-4 h-4 text-[#34D399]" />
          </div>
          <div className="text-2xl font-bold text-[#34D399] font-mono">{stats.legitimateCount}</div>
          <div className="text-[10px] text-[#94A3B8] mt-1">Safe communications</div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#10B981]"></div>
        </div>

        {/* Critical Threats */}
        <div className="bg-[#0F172A]/80 border border-[#1E2D4D] p-5 rounded-2xl shadow-md relative overflow-hidden group hover:border-[#DC2626]/50 transition-colors">
          <div className="flex items-center justify-between text-[#94A3B8] mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider font-mono text-[#DC2626]">Critical</span>
            <Activity className="w-4 h-4 text-[#DC2626]" />
          </div>
          <div className="text-2xl font-bold text-[#DC2626] font-mono">{stats.criticalCount}</div>
          <div className="text-[10px] text-[#94A3B8] mt-1">Risk Score ≥ 80</div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#DC2626]"></div>
        </div>

        {/* Average Risk Score */}
        <div className="bg-[#0F172A]/80 border border-[#1E2D4D] p-5 rounded-2xl shadow-md relative overflow-hidden group hover:border-[#38BDF8]/50 transition-colors">
          <div className="flex items-center justify-between text-[#94A3B8] mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider font-mono">Avg Risk</span>
            <span className="text-xs font-mono font-bold text-[#38BDF8]">/100</span>
          </div>
          <div className="text-2xl font-bold text-[#38BDF8] font-mono">{stats.averageRiskScore}</div>
          <div className="text-[10px] text-[#64748B] mt-1">Normalized index</div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#38BDF8]"></div>
        </div>
      </div>

      {/* Visual Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Daily Analysis Traffic Volume */}
        <div className="bg-[#0F172A]/80 border border-[#1E2D4D] p-6 rounded-2xl shadow-md">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                Daily Email Analysis Volume
              </h3>
              <p className="text-xs text-[#94A3B8]">Timeline of processed banking communication vectors</p>
            </div>
            <span className="px-2.5 py-0.5 text-[10px] bg-[#111C35] border border-[#1E2D4D] rounded-full text-[#38BDF8] font-mono">
              7-Day Window
            </span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.dailyVolume} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="phishGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#EF4444" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#EF4444" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="legitGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E2D4D" />
                <XAxis dataKey="date" stroke="#64748B" fontSize={11} />
                <YAxis stroke="#64748B" fontSize={11} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0F172A', borderColor: '#1E2D4D', borderRadius: '12px', fontSize: '12px', color: '#F8FAFC', boxShadow: '0 8px 24px rgba(0,0,0,0.5)' }}
                  itemStyle={{ color: '#F8FAFC' }}
                />
                <Area type="monotone" dataKey="phishing" name="Phishing" stroke="#EF4444" strokeWidth={2} fillOpacity={1} fill="url(#phishGrad)" />
                <Area type="monotone" dataKey="legitimate" name="Legitimate" stroke="#10B981" strokeWidth={2} fillOpacity={1} fill="url(#legitGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Threat Classification Distribution */}
        <div className="bg-[#0F172A]/80 border border-[#1E2D4D] p-6 rounded-2xl shadow-md">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                Threat Classification Ratio
              </h3>
              <p className="text-xs text-[#94A3B8]">Categorical breakdown of analyzed corpus</p>
            </div>
            <div className="flex items-center gap-3 text-[11px]">
              <span className="flex items-center gap-1.5 text-[#EF4444]"><span className="w-2.5 h-2.5 rounded-full bg-[#EF4444]"></span> Phishing</span>
              <span className="flex items-center gap-1.5 text-[#F59E0B]"><span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]"></span> Suspicious</span>
              <span className="flex items-center gap-1.5 text-[#10B981]"><span className="w-2.5 h-2.5 rounded-full bg-[#10B981]"></span> Legitimate</span>
            </div>
          </div>
          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.threatDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {stats.threatDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} stroke="#0F172A" strokeWidth={2} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0F172A', borderColor: '#1E2D4D', borderRadius: '12px', fontSize: '12px', color: '#F8FAFC', boxShadow: '0 8px 24px rgba(0,0,0,0.5)' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: Top Threat Indicator Categories */}
        <div className="bg-[#0F172A]/80 border border-[#1E2D4D] p-6 rounded-2xl shadow-md">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                Heuristic Indicator Triggers
              </h3>
              <p className="text-xs text-[#94A3B8]">Most frequent cyber rule and pattern matches</p>
            </div>
            <span className="text-xs font-mono text-[#38BDF8] font-semibold">{stats.activeRulesCount} Rules Active</span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.indicatorFrequency} layout="vertical" margin={{ top: 5, right: 20, left: 40, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E2D4D" horizontal={false} />
                <XAxis type="number" stroke="#64748B" fontSize={11} />
                <YAxis dataKey="category" type="category" stroke="#64748B" fontSize={11} width={110} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0F172A', borderColor: '#1E2D4D', borderRadius: '12px', fontSize: '12px', color: '#F8FAFC', boxShadow: '0 8px 24px rgba(0,0,0,0.5)' }}
                />
                <Bar dataKey="count" name="Detections" fill="#0284C7" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 4: Risk Level Distribution */}
        <div className="bg-[#0F172A]/80 border border-[#1E2D4D] p-6 rounded-2xl shadow-md">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                Risk Score Severity Spectrum
              </h3>
              <p className="text-xs text-[#94A3B8]">Distribution across 0–100 risk score bands</p>
            </div>
            <span className="text-xs font-mono text-[#38BDF8] font-semibold">Formula: 70% ML + 30% Rules</span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.riskDistribution} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E2D4D" />
                <XAxis dataKey="name" stroke="#64748B" fontSize={10} />
                <YAxis stroke="#64748B" fontSize={11} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0F172A', borderColor: '#1E2D4D', borderRadius: '12px', fontSize: '12px', color: '#F8FAFC', boxShadow: '0 8px 24px rgba(0,0,0,0.5)' }}
                />
                <Bar dataKey="count" name="Analyses" fill="#0284C7" radius={[6, 6, 0, 0]}>
                  {stats.riskDistribution.map((entry, index) => {
                    const barColor = index === 0 ? '#10B981' : index === 1 ? '#F59E0B' : index === 2 ? '#EF4444' : '#DC2626';
                    return <Cell key={`cell-risk-${index}`} fill={barColor} />;
                  })}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Analysis Table Section */}
      <div className="bg-[#0F172A]/80 border border-[#1E2D4D] rounded-2xl shadow-md overflow-hidden">
        <div className="p-6 border-b border-[#1E2D4D] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2 font-sans">
              <Activity className="w-4 h-4 text-[#38BDF8]" />
              <span>Recent Email Threat Analyses</span>
            </h3>
            <p className="text-xs text-[#94A3B8] mt-0.5">Live forensic records from the local repository</p>
          </div>

          <div className="flex items-center gap-2">
            {/* Filter Chips */}
            <div className="flex items-center bg-[#0B1222] p-1 rounded-xl border border-[#1E2D4D] text-xs">
              {['ALL', 'PHISHING', 'SUSPICIOUS', 'LEGITIMATE'].map(type => (
                <button
                  key={type}
                  onClick={() => setFilterType(type)}
                  className={`px-3 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                    filterType === type 
                      ? 'bg-[#0284C7] text-white shadow-sm' 
                      : 'text-[#94A3B8] hover:text-white'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>

            {onNavigateToHistory && (
              <button
                onClick={onNavigateToHistory}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#111C35] hover:bg-[#162444] border border-[#1E2D4D] text-xs text-[#F8FAFC] transition-colors"
              >
                <span>Full History</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#070B16] text-[#94A3B8] font-mono uppercase text-[10px] border-b border-[#1E2D4D]">
              <tr>
                <th className="px-5 py-3">ID</th>
                <th className="px-5 py-3">Sender</th>
                <th className="px-5 py-3">Subject</th>
                <th className="px-5 py-3">Classification</th>
                <th className="px-5 py-3">Risk Score</th>
                <th className="px-5 py-3">Risk Level</th>
                <th className="px-5 py-3">Date</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E2D4D] text-[#F8FAFC]">
              {filteredRecent.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-5 py-8 text-center text-[#94A3B8]">
                    No recent analyses match the current filter.
                  </td>
                </tr>
              ) : (
                filteredRecent.map(analysis => {
                  const isPhish = analysis.classification === 'PHISHING';
                  const isSusp = analysis.classification === 'SUSPICIOUS';
                  return (
                    <tr key={analysis.id} className="hover:bg-[#111C35]/60 transition-colors">
                      <td className="px-5 py-3.5 font-mono font-semibold text-[#38BDF8]">
                        #{analysis.id}
                      </td>
                      <td className="px-5 py-3.5 max-w-[160px] truncate text-[#94A3B8]" title={analysis.senderEmail}>
                        {analysis.senderEmail}
                      </td>
                      <td className="px-5 py-3.5 max-w-[220px] truncate font-medium text-white" title={analysis.subject}>
                        {analysis.subject}
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider font-mono ${
                          isPhish
                            ? 'bg-[#450A0A] text-[#F87171] border border-[#DC2626]/50'
                            : isSusp
                            ? 'bg-[#451A03] text-[#FBBF24] border border-[#D97706]/50'
                            : 'bg-[#064E3B] text-[#34D399] border border-[#059669]/50'
                        }`}>
                          {analysis.classification}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 font-mono font-bold">
                        <span className={
                          analysis.riskScore >= 80 ? 'text-[#DC2626]' :
                          analysis.riskScore >= 60 ? 'text-[#EF4444]' :
                          analysis.riskScore >= 30 ? 'text-[#F59E0B]' : 'text-[#10B981]'
                        }>
                          {analysis.riskScore}/100
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={`text-[10px] font-semibold ${
                          analysis.riskLevel === 'CRITICAL' ? 'text-[#DC2626]' :
                          analysis.riskLevel === 'HIGH' ? 'text-[#EF4444]' :
                          analysis.riskLevel === 'MEDIUM' ? 'text-[#F59E0B]' : 'text-[#10B981]'
                        }`}>
                          {analysis.riskLevel}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-[#94A3B8] text-[11px]">
                        {new Date(analysis.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleSelect(analysis)}
                            className="p-1.5 rounded-lg hover:bg-[#1E2D4D] text-[#94A3B8] hover:text-[#38BDF8] transition-colors"
                            title="View Forensic Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => generatePdfReport(analysis)}
                            className="p-1.5 rounded-lg hover:bg-[#1E2D4D] text-[#94A3B8] hover:text-[#EF4444] transition-colors"
                            title="Download PDF Threat Report"
                          >
                            <FileDown className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
