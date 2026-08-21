import React, { useState, useMemo } from 'react';
import { 
  History as HistoryIcon, 
  Search, 
  Filter, 
  FileDown, 
  Eye, 
  Trash2, 
  ArrowUpDown, 
  ChevronLeft, 
  ChevronRight,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';
import { EmailAnalysis, User } from '../../types';
import { storageService } from '../../services/storageService';
import { generatePdfReport, exportAnalysesToCsv } from '../../services/pdfReportGenerator';

interface AnalysisHistoryProps {
  currentUser: User | null;
  analyses: EmailAnalysis[];
  onSelectAnalysis: (analysis: EmailAnalysis) => void;
  onRefresh: () => void;
}

export const AnalysisHistory: React.FC<AnalysisHistoryProps> = ({
  currentUser,
  analyses,
  onSelectAnalysis,
  onRefresh
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [classificationFilter, setClassificationFilter] = useState('ALL');
  const [riskFilter, setRiskFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState<'date' | 'score'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const isAdmin = currentUser?.role === 'ADMIN';

  // Filter and sort analyses
  const filteredAnalyses = useMemo(() => {
    return analyses
      .filter(a => {
        // User role check: regular users only see their own analyses
        if (currentUser?.role === 'USER' && a.userId !== currentUser.id) {
          return false;
        }

        // Search matching
        const term = searchTerm.toLowerCase();
        const matchesSearch = 
          a.subject.toLowerCase().includes(term) ||
          a.senderEmail.toLowerCase().includes(term) ||
          a.recipientEmail.toLowerCase().includes(term) ||
          String(a.id).includes(term);

        if (!matchesSearch) return false;

        // Classification filter
        if (classificationFilter !== 'ALL' && a.classification !== classificationFilter) {
          return false;
        }

        // Risk Level filter
        if (riskFilter !== 'ALL' && a.riskLevel !== riskFilter) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'date') {
          const diff = new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          return sortOrder === 'desc' ? diff : -diff;
        } else {
          const diff = b.riskScore - a.riskScore;
          return sortOrder === 'desc' ? diff : -diff;
        }
      });
  }, [analyses, currentUser, searchTerm, classificationFilter, riskFilter, sortBy, sortOrder]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredAnalyses.length / itemsPerPage) || 1;
  const paginatedAnalyses = filteredAnalyses.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleDelete = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm(`Are you sure you want to permanently delete analysis record #${id}?`)) {
      storageService.deleteAnalysis(id);
      onRefresh();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-[#0F172A]/90 backdrop-blur-md border border-[#1E2D4D] p-6 rounded-2xl shadow-xl flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-[#0C4A6E]/60 text-[#38BDF8] border border-[#0284C7]/30 text-[10px] uppercase font-mono font-semibold tracking-wider">
              Historical Telemetry
            </span>
            <span className="text-xs text-[#94A3B8]">• {filteredAnalyses.length} Records Found</span>
          </div>
          <h1 className="text-xl font-bold text-white tracking-tight mt-1 font-sans">
            Email Threat Analysis <span className="text-[#38BDF8]">Audit Log & History</span>
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => exportAnalysesToCsv(filteredAnalyses)}
            disabled={filteredAnalyses.length === 0}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#111C35] hover:bg-[#1A2A4E] text-[#38BDF8] border border-[#1E2D4D] text-xs font-semibold transition-colors disabled:opacity-50 cursor-pointer shadow-md"
          >
            <FileDown className="w-4 h-4 text-[#38BDF8]" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div className="bg-[#0F172A]/85 backdrop-blur-md border border-[#1E2D4D] p-4 rounded-2xl shadow-xl space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-[#94A3B8]" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              placeholder="Search sender, subject, ID..."
              className="w-full pl-9 pr-3 py-2 bg-[#0B1222] border border-[#1E2D4D] rounded-xl text-xs text-[#F8FAFC] focus:outline-none focus:border-[#38BDF8] focus:ring-1 focus:ring-[#38BDF8]"
            />
          </div>

          {/* Classification Filter */}
          <div>
            <select
              value={classificationFilter}
              onChange={(e) => { setClassificationFilter(e.target.value); setCurrentPage(1); }}
              className="w-full px-3 py-2 bg-[#0B1222] border border-[#1E2D4D] rounded-xl text-xs text-[#F8FAFC] focus:outline-none focus:border-[#38BDF8] font-mono"
            >
              <option value="ALL">All Classifications</option>
              <option value="PHISHING">Phishing Only</option>
              <option value="SUSPICIOUS">Suspicious Only</option>
              <option value="LEGITIMATE">Legitimate Only</option>
            </select>
          </div>

          {/* Risk Level Filter */}
          <div>
            <select
              value={riskFilter}
              onChange={(e) => { setRiskFilter(e.target.value); setCurrentPage(1); }}
              className="w-full px-3 py-2 bg-[#0B1222] border border-[#1E2D4D] rounded-xl text-xs text-[#F8FAFC] focus:outline-none focus:border-[#38BDF8] font-mono"
            >
              <option value="ALL">All Risk Levels</option>
              <option value="CRITICAL">Critical Risk (80-100)</option>
              <option value="HIGH">High Risk (60-79)</option>
              <option value="MEDIUM">Medium Risk (30-59)</option>
              <option value="LOW">Low Risk (0-29)</option>
            </select>
          </div>

          {/* Sort Control */}
          <div className="flex items-center gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'date' | 'score')}
              className="flex-1 px-3 py-2 bg-[#0B1222] border border-[#1E2D4D] rounded-xl text-xs text-[#F8FAFC] focus:outline-none focus:border-[#38BDF8]"
            >
              <option value="date">Sort by Date</option>
              <option value="score">Sort by Risk Score</option>
            </select>
            <button
              onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
              className="p-2 bg-[#0B1222] border border-[#1E2D4D] rounded-xl text-[#38BDF8] hover:bg-[#1A2A4E] transition-colors"
              title={`Toggle ${sortOrder === 'asc' ? 'Descending' : 'Ascending'}`}
            >
              <ArrowUpDown className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Analyses Data Table */}
      <div className="bg-[#0F172A]/85 backdrop-blur-md border border-[#1E2D4D] rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#111C35] text-[#94A3B8] font-mono uppercase text-[10px] border-b border-[#1E2D4D]">
              <tr>
                <th className="px-4 py-3.5">ID</th>
                <th className="px-4 py-3.5">Sender Address</th>
                <th className="px-4 py-3.5">Subject Line</th>
                <th className="px-4 py-3.5">Classification</th>
                <th className="px-4 py-3.5">Risk Score</th>
                <th className="px-4 py-3.5">Risk Level</th>
                <th className="px-4 py-3.5">Indicators</th>
                <th className="px-4 py-3.5">Date</th>
                <th className="px-4 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E2D4D] text-[#F8FAFC]">
              {paginatedAnalyses.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-12 text-center text-[#94A3B8]">
                    No email analysis records matched your filter criteria.
                  </td>
                </tr>
              ) : (
                paginatedAnalyses.map(analysis => {
                  const isPhish = analysis.classification === 'PHISHING';
                  const isSusp = analysis.classification === 'SUSPICIOUS';
                  return (
                    <tr
                      key={analysis.id}
                      onClick={() => onSelectAnalysis(analysis)}
                      className="hover:bg-[#111C35]/60 transition-colors cursor-pointer"
                    >
                      <td className="px-4 py-3.5 font-mono font-bold text-[#38BDF8]">
                        #{analysis.id}
                      </td>
                      <td className="px-4 py-3.5 font-mono text-white max-w-[170px] truncate" title={analysis.senderEmail}>
                        {analysis.senderEmail}
                      </td>
                      <td className="px-4 py-3.5 font-medium text-white max-w-[240px] truncate" title={analysis.subject}>
                        {analysis.subject}
                      </td>
                      <td className="px-4 py-3.5">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono ${
                          isPhish ? 'bg-[#450A0A] text-[#F87171] border border-[#DC2626]/50' :
                          isSusp ? 'bg-[#451A03] text-[#FBBF24] border border-[#D97706]/50' :
                          'bg-[#064E3B] text-[#34D399] border border-[#059669]/50'
                        }`}>
                          {analysis.classification}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 font-mono font-bold">
                        <span className={
                          analysis.riskScore >= 80 ? 'text-[#DC2626]' :
                          analysis.riskScore >= 60 ? 'text-[#EF4444]' :
                          analysis.riskScore >= 30 ? 'text-[#F59E0B]' : 'text-[#10B981]'
                        }>
                          {analysis.riskScore}/100
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className={`text-[10px] font-semibold ${
                          analysis.riskLevel === 'CRITICAL' ? 'text-[#DC2626]' :
                          analysis.riskLevel === 'HIGH' ? 'text-[#EF4444]' :
                          analysis.riskLevel === 'MEDIUM' ? 'text-[#F59E0B]' : 'text-[#10B981]'
                        }`}>
                          {analysis.riskLevel}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 font-mono text-[#94A3B8]">
                        {analysis.indicators.length}
                      </td>
                      <td className="px-4 py-3.5 text-[#94A3B8] text-[11px] whitespace-nowrap">
                        {new Date(analysis.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={(e) => { e.stopPropagation(); onSelectAnalysis(analysis); }}
                            className="p-1.5 rounded-lg hover:bg-[#111C35] text-[#38BDF8] transition-colors"
                            title="View Forensic Details"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); generatePdfReport(analysis); }}
                            className="p-1.5 rounded-lg hover:bg-[#111C35] text-[#EF4444] transition-colors"
                            title="Download PDF"
                          >
                            <FileDown className="w-3.5 h-3.5" />
                          </button>
                          {isAdmin && (
                            <button
                              onClick={(e) => handleDelete(analysis.id, e)}
                              className="p-1.5 rounded-lg hover:bg-[#450A0A] text-[#94A3B8] hover:text-[#EF4444] transition-colors"
                              title="Delete Record (Admin)"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="bg-[#111C35] px-4 py-3 border-t border-[#1E2D4D] flex items-center justify-between text-xs text-[#94A3B8]">
          <div>
            Showing <span className="text-white font-semibold">{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
            <span className="text-white font-semibold">{Math.min(currentPage * itemsPerPage, filteredAnalyses.length)}</span> of{' '}
            <span className="text-white font-semibold">{filteredAnalyses.length}</span> entries
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg bg-[#0B1222] hover:bg-[#1A2A4E] border border-[#1E2D4D] disabled:opacity-40 text-[#38BDF8] transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-mono text-white">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg bg-[#0B1222] hover:bg-[#1A2A4E] border border-[#1E2D4D] disabled:opacity-40 text-[#38BDF8] transition-colors cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
