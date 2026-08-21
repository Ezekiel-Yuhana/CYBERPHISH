import React, { useState } from 'react';
import { 
  Sliders, 
  Plus, 
  Edit3, 
  Trash2, 
  Play, 
  Check, 
  X, 
  AlertTriangle, 
  Code, 
  ToggleLeft, 
  ToggleRight 
} from 'lucide-react';
import { DetectionRule, IndicatorCategory, IndicatorSeverity } from '../../types';
import { storageService } from '../../services/storageService';

export const RuleManagement: React.FC = () => {
  const [rules, setRules] = useState<DetectionRule[]>(storageService.getRules());
  const [showModal, setShowModal] = useState(false);
  const [editingRule, setEditingRule] = useState<DetectionRule | null>(null);

  // Form Fields
  const [ruleName, setRuleName] = useState('');
  const [ruleType, setRuleType] = useState<IndicatorCategory>('URGENCY');
  const [pattern, setPattern] = useState('');
  const [weight, setWeight] = useState(25);
  const [severity, setSeverity] = useState<IndicatorSeverity>('HIGH');
  const [description, setDescription] = useState('');
  const [enabled, setEnabled] = useState(true);

  // Live Regex Sandbox Tester
  const [testString, setTestString] = useState('URGENT: Please verify your bank OTP and password immediately.');
  const [sandboxResult, setSandboxResult] = useState<{ matched: boolean; matchText?: string } | null>(null);

  const testRegex = (patternStr: string, text: string) => {
    try {
      const regex = new RegExp(patternStr, 'i');
      const match = text.match(regex);
      if (match) {
        setSandboxResult({ matched: true, matchText: match[0] });
      } else {
        setSandboxResult({ matched: false });
      }
    } catch (e) {
      setSandboxResult({ matched: false });
    }
  };

  const handleOpenCreate = () => {
    setEditingRule(null);
    setRuleName('');
    setRuleType('URGENCY');
    setPattern('(urgent|immediate|action required)');
    setWeight(20);
    setSeverity('HIGH');
    setDescription('');
    setEnabled(true);
    setShowModal(true);
    testRegex('(urgent|immediate|action required)', testString);
  };

  const handleOpenEdit = (rule: DetectionRule) => {
    setEditingRule(rule);
    setRuleName(rule.ruleName);
    setRuleType(rule.ruleType);
    setPattern(rule.pattern);
    setWeight(rule.weight);
    setSeverity(rule.severity);
    setDescription(rule.description);
    setEnabled(rule.enabled);
    setShowModal(true);
    testRegex(rule.pattern, testString);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ruleName.trim() || !pattern.trim()) {
      alert('Rule Name and Regex Pattern are required.');
      return;
    }

    try {
      new RegExp(pattern, 'i'); // Validate regex syntax
    } catch (err) {
      alert('Invalid Regular Expression pattern. Please correct the syntax.');
      return;
    }

    storageService.saveRule({
      id: editingRule ? editingRule.id : undefined,
      ruleName,
      ruleType,
      pattern,
      weight,
      severity,
      description,
      enabled
    });

    setRules(storageService.getRules());
    setShowModal(false);
  };

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this detection rule?')) {
      storageService.deleteRule(id);
      setRules(storageService.getRules());
    }
  };

  const handleToggleEnable = (rule: DetectionRule) => {
    storageService.saveRule({ ...rule, enabled: !rule.enabled });
    setRules(storageService.getRules());
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-[#0F172A]/90 backdrop-blur-md border border-[#1E2D4D] p-6 rounded-2xl shadow-xl flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-[#0C4A6E]/60 text-[#38BDF8] border border-[#0284C7]/30 text-[10px] uppercase font-mono font-semibold tracking-wider">
              Heuristic Engine
            </span>
            <span className="text-xs text-[#94A3B8]">• {rules.length} Configured Rules</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight mt-1 font-sans">
            Cybersecurity Detection Rules & <span className="text-[#38BDF8]">Heuristics</span>
          </h1>
        </div>

        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0284C7] hover:bg-[#0369A1] text-white text-xs font-semibold shadow-lg shadow-sky-950/40 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Custom Detection Rule</span>
        </button>
      </div>

      {/* Rules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {rules.map(rule => (
          <div
            key={rule.id}
            className={`bg-[#0F172A]/85 backdrop-blur-md border rounded-2xl p-5 shadow-xl flex flex-col justify-between transition-all ${
              rule.enabled ? 'border-[#1E2D4D] hover:border-[#38BDF8]/50' : 'border-[#1E2D4D]/40 opacity-60'
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono ${
                  rule.severity === 'CRITICAL' ? 'bg-[#450A0A] text-[#F87171] border border-[#DC2626]/50' :
                  rule.severity === 'HIGH' ? 'bg-[#451A03] text-[#FB923C] border border-[#EA580C]/50' :
                  'bg-[#451A03] text-[#FBBF24] border border-[#D97706]/50'
                }`}>
                  {rule.severity}
                </span>

                <button
                  onClick={() => handleToggleEnable(rule)}
                  className={`flex items-center gap-1 text-xs font-mono font-bold cursor-pointer ${
                    rule.enabled ? 'text-[#34D399]' : 'text-[#94A3B8]'
                  }`}
                  title={rule.enabled ? 'Enabled' : 'Disabled'}
                >
                  {rule.enabled ? <ToggleRight className="w-5 h-5" /> : <ToggleLeft className="w-5 h-5" />}
                  <span>{rule.enabled ? 'ENABLED' : 'DISABLED'}</span>
                </button>
              </div>

              <div>
                <h3 className="font-bold text-base text-white">{rule.ruleName}</h3>
                <div className="text-[10px] text-[#38BDF8] font-mono mt-0.5">{rule.ruleType}</div>
              </div>

              <div className="p-2.5 bg-[#111C35] rounded-xl border border-[#1E2D4D] font-mono text-[11px] text-[#FBBF24] break-all">
                {rule.pattern}
              </div>

              <p className="text-xs text-[#94A3B8] leading-relaxed">
                {rule.description}
              </p>
            </div>

            <div className="pt-4 mt-4 border-t border-[#1E2D4D] flex items-center justify-between">
              <div className="font-mono text-xs text-[#F8FAFC]">
                Weight: <span className="font-bold text-[#38BDF8]">+{rule.weight} pts</span>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleOpenEdit(rule)}
                  className="p-1.5 rounded-lg hover:bg-[#111C35] text-[#94A3B8] hover:text-[#38BDF8] transition-colors cursor-pointer"
                  title="Edit Rule"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(rule.id)}
                  className="p-1.5 rounded-lg hover:bg-[#450A0A] text-[#94A3B8] hover:text-[#EF4444] transition-colors cursor-pointer"
                  title="Delete Rule"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Rule Create/Edit Modal with Interactive Test Bench */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-[#0F172A] border border-[#1E2D4D] rounded-2xl w-full max-w-xl p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto text-white">
            <div className="flex items-center justify-between border-b border-[#1E2D4D] pb-3">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Code className="w-4 h-4 text-[#38BDF8]" />
                <span>{editingRule ? 'Edit Detection Rule' : 'Create Custom Heuristic Rule'}</span>
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-1.5 rounded-lg hover:bg-[#111C35] text-[#94A3B8] hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-[#94A3B8] mb-1">Rule Name</label>
                <input
                  type="text"
                  required
                  value={ruleName}
                  onChange={(e) => setRuleName(e.target.value)}
                  placeholder="e.g. Credential Harvesting Pattern"
                  className="w-full px-3 py-2 bg-[#0B1222] border border-[#1E2D4D] rounded-xl text-white focus:outline-none focus:border-[#38BDF8] focus:ring-1 focus:ring-[#38BDF8]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#94A3B8] mb-1">Indicator Category</label>
                  <select
                    value={ruleType}
                    onChange={(e) => setRuleType(e.target.value as IndicatorCategory)}
                    className="w-full px-3 py-2 bg-[#0B1222] border border-[#1E2D4D] rounded-xl text-white focus:outline-none focus:border-[#38BDF8] font-mono"
                  >
                    <option value="URGENCY">URGENCY</option>
                    <option value="CREDENTIAL_REQUEST">CREDENTIAL_REQUEST</option>
                    <option value="BANKING_IMPERSONATION">BANKING_IMPERSONATION</option>
                    <option value="SOCIAL_ENGINEERING">SOCIAL_ENGINEERING</option>
                    <option value="DOMAIN_MISMATCH">DOMAIN_MISMATCH</option>
                    <option value="SUSPICIOUS_URL">SUSPICIOUS_URL</option>
                    <option value="ATTACHMENT_RISK">ATTACHMENT_RISK</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-[#94A3B8] mb-1">Severity</label>
                  <select
                    value={severity}
                    onChange={(e) => setSeverity(e.target.value as IndicatorSeverity)}
                    className="w-full px-3 py-2 bg-[#0B1222] border border-[#1E2D4D] rounded-xl text-white focus:outline-none focus:border-[#38BDF8] font-mono"
                  >
                    <option value="CRITICAL">CRITICAL</option>
                    <option value="HIGH">HIGH</option>
                    <option value="MEDIUM">MEDIUM</option>
                    <option value="LOW">LOW</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#94A3B8] mb-1">Score Contribution Weight (1–50)</label>
                  <input
                    type="number"
                    min={1}
                    max={50}
                    value={weight}
                    onChange={(e) => setWeight(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-[#0B1222] border border-[#1E2D4D] rounded-xl text-white focus:outline-none focus:border-[#38BDF8] font-mono"
                  />
                </div>

                <div className="flex items-center gap-2 pt-5">
                  <input
                    type="checkbox"
                    id="ruleEnabled"
                    checked={enabled}
                    onChange={(e) => setEnabled(e.target.checked)}
                    className="w-4 h-4 rounded text-[#0284C7] focus:ring-[#38BDF8] bg-[#0B1222] border-[#1E2D4D]"
                  />
                  <label htmlFor="ruleEnabled" className="font-semibold text-white">Rule Enabled</label>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#94A3B8] mb-1">Regular Expression Pattern (Regex)</label>
                <input
                  type="text"
                  required
                  value={pattern}
                  onChange={(e) => {
                    setPattern(e.target.value);
                    testRegex(e.target.value, testString);
                  }}
                  placeholder="e.g. (password|otp|pin|cvv)"
                  className="w-full px-3 py-2 bg-[#0B1222] border border-[#1E2D4D] rounded-xl text-[#FBBF24] font-mono focus:outline-none focus:border-[#38BDF8] focus:ring-1 focus:ring-[#38BDF8]"
                />
              </div>

              {/* Live Sandbox Pattern Tester */}
              <div className="p-3.5 bg-[#111C35] rounded-xl border border-[#1E2D4D] space-y-2">
                <div className="text-[11px] font-mono text-[#38BDF8] font-semibold uppercase flex items-center justify-between">
                  <span>Live Regex Sandbox Tester</span>
                  {sandboxResult?.matched ? (
                    <span className="text-[#34D399] flex items-center gap-1 font-bold">
                      <Check className="w-3.5 h-3.5" /> MATCH FOUND: "{sandboxResult.matchText}"
                    </span>
                  ) : (
                    <span className="text-[#94A3B8]">NO MATCH</span>
                  )}
                </div>
                <input
                  type="text"
                  value={testString}
                  onChange={(e) => {
                    setTestString(e.target.value);
                    testRegex(pattern, e.target.value);
                  }}
                  placeholder="Type test text here to verify regex..."
                  className="w-full px-3 py-2 bg-[#0B1222] border border-[#1E2D4D] rounded-lg text-white text-xs focus:outline-none focus:border-[#38BDF8]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#94A3B8] mb-1">Description</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Explain why this rule flags potential security risk..."
                  className="w-full px-3 py-2 bg-[#0B1222] border border-[#1E2D4D] rounded-xl text-white focus:outline-none focus:border-[#38BDF8]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#1E2D4D]">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl bg-[#111C35] hover:bg-[#1A2A4E] text-[#94A3B8] font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#0284C7] hover:bg-[#0369A1] text-white font-semibold cursor-pointer shadow-md"
                >
                  {editingRule ? 'Save Rule' : 'Create Rule'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
