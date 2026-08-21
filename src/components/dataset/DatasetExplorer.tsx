import React, { useState, useMemo } from 'react';
import { 
  Database, 
  Search, 
  Filter, 
  Zap, 
  ShieldAlert, 
  ShieldCheck, 
  BarChart3, 
  Download, 
  ExternalLink, 
  CheckCircle2, 
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Layers
} from 'lucide-react';
import { 
  BANKING_CORPUS_ITEMS, 
  DATASET_STATS, 
  BankingDatasetItem 
} from '../../data/bankingCorpusDataset';
import { NavigationTab } from '../../types';

interface DatasetExplorerProps {
  onSelectSampleForAnalysis?: (text: string, id: string) => void;
  onNavigate?: (tab: NavigationTab) => void;
}

export const DatasetExplorer: React.FC<DatasetExplorerProps> = ({
  onSelectSampleForAnalysis,
  onNavigate
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [labelFilter, setLabelFilter] = useState<'ALL' | '1' | '0'>('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedItem, setSelectedItem] = useState<BankingDatasetItem | null>(BANKING_CORPUS_ITEMS[0]);
  const itemsPerPage = 12;

  const filteredItems = useMemo(() => {
    return BANKING_CORPUS_ITEMS.filter(item => {
      const matchesSearch = 
        item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.topKeywords.some(k => k.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesLabel = 
        labelFilter === 'ALL' || 
        (labelFilter === '1' && item.label === 1) || 
        (labelFilter === '0' && item.label === 0);

      return matchesSearch && matchesLabel;
    });
  }, [searchTerm, labelFilter]);

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage) || 1;
  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredItems.slice(start, start + itemsPerPage);
  }, [filteredItems, currentPage]);

  const exportDatasetCsv = () => {
    const headers = ['id', 'label', 'text', 'source'];
    const rows = filteredItems.map(item => [
      item.id,
      item.label,
      `"${item.text.replace(/"/g, '""')}"`,
      item.source
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `cyberphish_live_banking_corpus_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-[#0F172A]/90 backdrop-blur-md border border-[#1E2D4D] p-6 rounded-2xl shadow-xl flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-[#0C4A6E]/60 text-[#38BDF8] border border-[#0284C7]/30 text-[10px] uppercase font-mono font-semibold tracking-wider">
              Live Production Dataset
            </span>
            <span className="text-xs text-[#94A3B8]">• Active Banking Corpus with 8% Label Noise Benchmark</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight mt-1 font-sans">
            Banking Threat Intelligence & <span className="text-[#38BDF8]">Corpus Explorer</span>
          </h1>
          <p className="text-xs text-[#94A3B8] mt-1 max-w-2xl leading-relaxed">
            Loaded active corpus from real commercial banking attack vectors and legitimate corporate communications. Use this live dataset to test the detection pipeline or inspect NLP feature distributions.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={exportDatasetCsv}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#111C35] hover:bg-[#1A2A4E] text-white border border-[#1E2D4D] text-xs font-semibold transition-colors cursor-pointer shadow-md"
          >
            <Download className="w-4 h-4 text-[#38BDF8]" />
            <span>Export CSV Dataset</span>
          </button>

          {onNavigate && (
            <button
              onClick={() => onNavigate('analyze')}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#0284C7] hover:bg-[#0369A1] text-white text-xs font-semibold shadow-lg shadow-sky-950/40 transition-all cursor-pointer"
            >
              <Zap className="w-4 h-4" />
              <span>Go to Live Analyzer</span>
            </button>
          )}
        </div>
      </div>

      {/* Dataset Statistics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-[#0F172A]/85 backdrop-blur-md border border-[#1E2D4D] rounded-2xl p-4 shadow-lg text-center">
          <div className="text-2xl font-bold text-white font-mono">{DATASET_STATS.totalRecords}</div>
          <div className="text-xs font-semibold text-[#94A3B8] mt-0.5">Total Corpus Emails</div>
          <div className="text-[10px] text-[#38BDF8] mt-1 font-mono">100% Loaded in Engine</div>
        </div>

        <div className="bg-[#0F172A]/85 backdrop-blur-md border border-[#1E2D4D] rounded-2xl p-4 shadow-lg text-center">
          <div className="text-2xl font-bold text-[#F87171] font-mono">{DATASET_STATS.phishingCount}</div>
          <div className="text-xs font-semibold text-[#94A3B8] mt-0.5">Phishing Vectors (Label 1)</div>
          <div className="text-[10px] text-[#F87171] mt-1 font-mono">{DATASET_STATS.phishingRatio.toFixed(1)}% Ratio</div>
        </div>

        <div className="bg-[#0F172A]/85 backdrop-blur-md border border-[#1E2D4D] rounded-2xl p-4 shadow-lg text-center">
          <div className="text-2xl font-bold text-[#34D399] font-mono">{DATASET_STATS.legitimateCount}</div>
          <div className="text-xs font-semibold text-[#94A3B8] mt-0.5">Legitimate Emails (Label 0)</div>
          <div className="text-[10px] text-[#34D399] mt-1 font-mono">{(100 - DATASET_STATS.phishingRatio).toFixed(1)}% Ratio</div>
        </div>

        <div className="bg-[#0F172A]/85 backdrop-blur-md border border-[#1E2D4D] rounded-2xl p-4 shadow-lg text-center">
          <div className="text-2xl font-bold text-[#FBBF24] font-mono">{DATASET_STATS.noisePercentage}%</div>
          <div className="text-xs font-semibold text-[#94A3B8] mt-0.5">Label Noise Benchmark</div>
          <div className="text-[10px] text-[#94A3B8] mt-1 font-mono">Robust ML Boundary</div>
        </div>

        <div className="bg-[#0F172A]/85 backdrop-blur-md border border-[#1E2D4D] rounded-2xl p-4 shadow-lg text-center col-span-2 md:col-span-1">
          <div className="text-2xl font-bold text-[#A78BFA] font-mono">{DATASET_STATS.domainsTracked}</div>
          <div className="text-xs font-semibold text-[#94A3B8] mt-0.5">Simulated Attack Domains</div>
          <div className="text-[10px] text-[#38BDF8] mt-1 font-mono">Cameroon & Global IOCs</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#0F172A]/85 backdrop-blur-md border border-[#1E2D4D] p-4 rounded-2xl shadow-xl flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-[#94A3B8]" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            placeholder="Search email text, ID (e.g. E03407, E00758), keyword or sender domain..."
            className="w-full pl-10 pr-3 py-2 bg-[#0B1222] border border-[#1E2D4D] rounded-xl text-xs text-white placeholder-[#94A3B8] focus:outline-none focus:border-[#38BDF8] focus:ring-1 focus:ring-[#38BDF8]"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={labelFilter}
            onChange={(e) => { setLabelFilter(e.target.value as any); setCurrentPage(1); }}
            className="px-3.5 py-2 bg-[#0B1222] border border-[#1E2D4D] rounded-xl text-xs text-white focus:outline-none focus:border-[#38BDF8] font-mono cursor-pointer"
          >
            <option value="ALL">All Labels (Phishing & Legitimate)</option>
            <option value="1">Phishing Only (Label = 1)</option>
            <option value="0">Legitimate Only (Label = 0)</option>
          </select>
        </div>
      </div>

      {/* Main Grid: Item List + Selected Details View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: Cards / Table List (7 Cols) */}
        <div className="lg:col-span-7 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {paginatedItems.map((item) => {
              const isSelected = selectedItem?.id === item.id;
              const isPhishing = item.label === 1;

              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedItem(item)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                    isSelected
                      ? 'bg-[#111C35] border-[#38BDF8] shadow-lg shadow-sky-950/50 scale-[1.01]'
                      : 'bg-[#0F172A]/80 border-[#1E2D4D] hover:border-[#38BDF8]/40 hover:bg-[#111C35]/60'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-mono font-bold text-[#38BDF8]">
                        #{item.id}
                      </span>
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-bold border ${
                        isPhishing 
                          ? 'bg-red-950/40 border-red-500/40 text-red-400' 
                          : 'bg-emerald-950/40 border-emerald-500/40 text-emerald-400'
                      }`}>
                        {item.labelName} (Label: {item.label})
                      </span>
                    </div>

                    <p className="text-xs text-[#94A3B8] mt-2 line-clamp-3 leading-relaxed font-sans">
                      {item.text}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-[#1E2D4D]/60 flex items-center justify-between">
                    <div className="flex flex-wrap gap-1">
                      {item.topKeywords.slice(0, 3).map((kw, kIdx) => (
                        <span key={kIdx} className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[#0B1222] text-[#94A3B8] border border-[#1E2D4D]">
                          {kw}
                        </span>
                      ))}
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onSelectSampleForAnalysis) {
                          onSelectSampleForAnalysis(item.text, item.id);
                        }
                      }}
                      className="text-[10px] font-mono text-[#38BDF8] hover:text-white flex items-center gap-1 font-semibold cursor-pointer"
                      title="Analyze this email in live terminal"
                    >
                      <Zap className="w-3 h-3" />
                      <span>Analyze</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredItems.length === 0 && (
            <div className="p-8 text-center bg-[#0F172A]/60 border border-[#1E2D4D] rounded-2xl text-[#94A3B8] text-xs">
              No dataset records matched your search query.
            </div>
          )}

          {/* Pagination */}
          <div className="bg-[#0F172A]/85 backdrop-blur-md border border-[#1E2D4D] px-5 py-3.5 rounded-2xl flex items-center justify-between text-xs text-[#94A3B8]">
            <div>
              Showing <span className="text-white font-semibold">{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
              <span className="text-white font-semibold">{Math.min(currentPage * itemsPerPage, filteredItems.length)}</span> of{' '}
              <span className="text-white font-semibold">{filteredItems.length}</span> records
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-1.5 rounded-lg bg-[#0B1222] border border-[#1E2D4D] hover:bg-[#1A2A4E] disabled:opacity-40 text-white transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="font-mono text-white text-xs">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-1.5 rounded-lg bg-[#0B1222] border border-[#1E2D4D] hover:bg-[#1A2A4E] disabled:opacity-40 text-white transition-colors cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Side: Selected Email Inspector & Direct Analysis Launcher (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          {selectedItem ? (
            <div className="bg-[#0F172A]/90 backdrop-blur-md border border-[#1E2D4D] rounded-2xl p-6 shadow-xl space-y-5 sticky top-4">
              <div className="flex items-center justify-between border-b border-[#1E2D4D] pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-white font-mono">Corpus Record #{selectedItem.id}</span>
                </div>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-bold border ${
                  selectedItem.label === 1 
                    ? 'bg-red-950/50 border-red-500/50 text-red-400' 
                    : 'bg-emerald-950/50 border-emerald-500/50 text-emerald-400'
                }`}>
                  {selectedItem.labelName} (y={selectedItem.label})
                </span>
              </div>

              <div>
                <label className="text-[10px] font-mono uppercase font-bold text-[#94A3B8] block mb-1">
                  Full Email Token Sequence / Raw Body
                </label>
                <div className="p-4 rounded-xl bg-[#070D18] border border-[#1E2D4D] text-xs font-mono leading-relaxed text-[#E2E8F0] max-h-[260px] overflow-y-auto whitespace-pre-wrap">
                  {selectedItem.text}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-[#0B1222] border border-[#1E2D4D]">
                  <span className="text-[10px] font-mono uppercase text-[#94A3B8] block">Dataset Source</span>
                  <span className="text-white font-mono text-[11px] truncate block mt-0.5">{selectedItem.source}</span>
                </div>

                <div className="p-3 rounded-xl bg-[#0B1222] border border-[#1E2D4D]">
                  <span className="text-[10px] font-mono uppercase text-[#94A3B8] block">Token Word Count</span>
                  <span className="text-[#38BDF8] font-mono text-sm font-bold block mt-0.5">
                    {selectedItem.text.split(/\s+/).length} tokens
                  </span>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-mono uppercase font-bold text-[#94A3B8] block mb-1.5">
                  Top Salient Keywords in this Record
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {selectedItem.topKeywords.map((kw, i) => (
                    <span key={i} className="px-2.5 py-1 rounded-lg bg-[#111C35] text-xs font-mono text-[#38BDF8] border border-[#1E2D4D]">
                      {kw}
                    </span>
                  ))}
                </div>
              </div>

              <button
                onClick={() => {
                  if (onSelectSampleForAnalysis) {
                    onSelectSampleForAnalysis(selectedItem.text, selectedItem.id);
                  }
                }}
                className="w-full py-3 px-4 rounded-xl bg-[#0284C7] hover:bg-[#0369A1] text-white font-semibold text-xs shadow-lg shadow-sky-950/40 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Zap className="w-4 h-4 fill-white" />
                <span>Load & Predict in Live Detection Terminal</span>
              </button>
            </div>
          ) : (
            <div className="p-8 text-center bg-[#0F172A]/85 border border-[#1E2D4D] rounded-2xl text-[#94A3B8] text-xs">
              Select an email from the left to inspect its telemetry.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
