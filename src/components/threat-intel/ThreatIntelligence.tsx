import React from 'react';
import { 
  Globe, 
  ShieldAlert, 
  Target, 
  AlertTriangle, 
  TrendingUp, 
  ExternalLink, 
  Server, 
  Building2, 
  Terminal,
  Activity
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend 
} from 'recharts';
import { ThreatIntelligenceData } from '../../types';

interface ThreatIntelligenceProps {
  data: ThreatIntelligenceData;
}

export const ThreatIntelligence: React.FC<ThreatIntelligenceProps> = ({ data }) => {
  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-[#0F172A]/90 backdrop-blur-md border border-[#1E2D4D] p-6 rounded-2xl shadow-xl flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-[#0C4A6E]/60 text-[#38BDF8] border border-[#0284C7]/30 text-[10px] uppercase font-mono font-semibold tracking-wider">
              Local Threat Observatory
            </span>
            <span className="text-xs text-[#94A3B8]">• Commercial Banking Context (Cameroon)</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight mt-1 font-sans">
            Aggregated Banking <span className="text-[#38BDF8]">Threat Intelligence</span>
          </h1>
          <p className="text-xs text-[#94A3B8] mt-1 max-w-2xl leading-relaxed">
            Derived analytics tracking emerging spear-phishing attack signatures, targeted commercial banking institutions, and lookalike domain vectors.
          </p>
        </div>

        <div className="px-4 py-2.5 rounded-xl bg-[#111C35] border border-[#1E2D4D] text-xs font-mono text-[#94A3B8]">
          Source: <span className="text-[#38BDF8] font-semibold">Application-derived threat analytics</span>
        </div>
      </div>

      {/* 2 Column Highlights: Targeted Institutions & Attack Techniques */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Targeted Institutions */}
        <div className="bg-[#0F172A]/85 backdrop-blur-md border border-[#1E2D4D] p-6 rounded-2xl shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
              <Building2 className="w-4 h-4 text-[#38BDF8]" />
              <span>Targeted Financial Institutions</span>
            </h2>
            <span className="text-[10px] text-[#94A3B8] font-mono">CEMAC Zone</span>
          </div>

          <div className="space-y-2.5">
            {data.targetedInstitutions.map((inst, i) => (
              <div
                key={i}
                className="p-3.5 bg-[#111C35] border border-[#1E2D4D] rounded-xl flex items-center justify-between text-xs"
              >
                <div>
                  <div className="font-semibold text-white">{inst.name}</div>
                  <div className="text-[10px] text-[#94A3B8] mt-0.5">{inst.country}</div>
                </div>
                <div className="text-right">
                  <div className="font-mono font-bold text-[#EF4444]">{inst.attacksBlocked} Attacks</div>
                  <span className={`text-[9px] px-2 py-0.5 rounded-full font-mono font-bold uppercase ${
                    inst.risk === 'CRITICAL' ? 'bg-[#450A0A] text-[#F87171] border border-[#DC2626]/50' :
                    inst.risk === 'HIGH' ? 'bg-[#450A0A] text-[#EF4444] border border-[#DC2626]/50' :
                    'bg-[#451A03] text-[#FBBF24] border border-[#D97706]/50'
                  }`}>
                    {inst.risk} RISK
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* MITRE ATT&CK Techniques */}
        <div className="bg-[#0F172A]/85 backdrop-blur-md border border-[#1E2D4D] p-6 rounded-2xl shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
              <Terminal className="w-4 h-4 text-[#38BDF8]" />
              <span>Identified Adversary Techniques</span>
            </h2>
            <span className="text-[10px] text-[#94A3B8] font-mono">MITRE ATT&CK Matrix</span>
          </div>

          <div className="space-y-2.5">
            {data.attackTechniques.map((tech, i) => (
              <div
                key={i}
                className="p-3.5 bg-[#111C35] border border-[#1E2D4D] rounded-xl flex items-center justify-between text-xs"
              >
                <div className="space-y-0.5">
                  <div className="font-semibold text-white">{tech.technique}</div>
                  <span className="inline-block px-2 py-0.5 rounded-md bg-[#0B1222] text-[#38BDF8] font-mono text-[9px] border border-[#1E2D4D] font-medium">
                    {tech.mitreAttckId}
                  </span>
                </div>
                <div className="text-right">
                  <div className="font-mono font-bold text-[#38BDF8]">{tech.frequency}% Share</div>
                  <span className="text-[10px] text-[#94A3B8]">{tech.severity} Severity</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Weekly Threat Evolution Chart */}
      <div className="bg-[#0F172A]/85 backdrop-blur-md border border-[#1E2D4D] p-6 rounded-2xl shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#38BDF8]" />
              <span>Attack Vectors Evolution (August 2026)</span>
            </h2>
            <p className="text-xs text-[#94A3B8]">Weekly trajectory of phishing vector categories</p>
          </div>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data.recentTrends} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E2D4D" vertical={false} />
              <XAxis dataKey="week" stroke="#94A3B8" fontSize={11} tickLine={false} axisLine={{ stroke: '#1E2D4D' }} />
              <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} axisLine={{ stroke: '#1E2D4D' }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0B1222', borderColor: '#1E2D4D', borderRadius: '12px', fontSize: '12px', boxShadow: '0 8px 24px rgba(0,0,0,0.5)', color: '#F8FAFC' }}
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              <Line type="monotone" dataKey="credentialHarvesting" name="Credential Harvesting" stroke="#EF4444" strokeWidth={2} dot={{ r: 4, fill: '#EF4444' }} />
              <Line type="monotone" dataKey="urgencyScams" name="Urgency & Coercion" stroke="#F59E0B" strokeWidth={2} dot={{ r: 4, fill: '#F59E0B' }} />
              <Line type="monotone" dataKey="maliciousLinks" name="Lookalike Links" stroke="#38BDF8" strokeWidth={2} dot={{ r: 4, fill: '#38BDF8' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 2 Column Breakdown: Keywords & Suspicious Domains */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Phishing Keywords */}
        <div className="bg-[#0F172A]/85 backdrop-blur-md border border-[#1E2D4D] p-6 rounded-2xl shadow-xl space-y-3">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
            <Target className="w-4 h-4 text-[#EF4444]" />
            <span>High-Risk Phishing Trigger Keywords</span>
          </h2>
          <div className="space-y-2">
            {data.topKeywords.map((kw, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-[#111C35] rounded-xl border border-[#1E2D4D] text-xs">
                <span className="font-mono text-white font-semibold">{kw.keyword}</span>
                <div className="flex items-center gap-3">
                  <span className="font-mono font-bold text-[#38BDF8]">{kw.count} hits</span>
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-mono font-bold ${
                    kw.riskLevel === 'CRITICAL' ? 'bg-[#450A0A] text-[#F87171] border border-[#DC2626]/50' : 'bg-[#451A03] text-[#FBBF24] border border-[#D97706]/50'
                  }`}>
                    {kw.riskLevel}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Lookalike & Suspicious Domains Table */}
        <div className="bg-[#0F172A]/85 backdrop-blur-md border border-[#1E2D4D] p-6 rounded-2xl shadow-xl space-y-3">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
            <Globe className="w-4 h-4 text-[#38BDF8]" />
            <span>Detected Lookalike Domain Signatures</span>
          </h2>
          <div className="space-y-2">
            {data.suspiciousDomains.map((dom, i) => (
              <div key={i} className="p-3 bg-[#111C35] rounded-xl border border-[#1E2D4D] flex items-center justify-between text-xs">
                <div>
                  <div className="font-mono font-bold text-[#EF4444]">{dom.domain}</div>
                  <div className="text-[10px] text-[#94A3B8]">{dom.category}</div>
                </div>
                <div className="text-right">
                  <div className="font-mono text-white font-semibold">{dom.detectedCount} blocks</div>
                  <div className="text-[10px] text-[#94A3B8]">Seen: {dom.firstSeen}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
