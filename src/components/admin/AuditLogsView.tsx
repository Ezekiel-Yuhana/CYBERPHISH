import React, { useState, useMemo } from 'react';
import { 
  ShieldAlert, 
  Search, 
  Filter, 
  FileDown, 
  Calendar, 
  User as UserIcon, 
  Activity,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { AuditLog } from '../../types';
import { storageService } from '../../services/storageService';

export const AuditLogsView: React.FC = () => {
  const [logs] = useState<AuditLog[]>(storageService.getAuditLogs());
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredLogs = useMemo(() => {
    return logs.filter(log => {
      const term = searchTerm.toLowerCase();
      const matchesSearch = 
        log.userEmail.toLowerCase().includes(term) ||
        log.details.toLowerCase().includes(term) ||
        log.ipAddress.toLowerCase().includes(term);

      if (!matchesSearch) return false;

      if (actionFilter !== 'ALL' && log.action !== actionFilter) {
        return false;
      }

      return true;
    });
  }, [logs, searchTerm, actionFilter]);

  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage) || 1;
  const paginatedLogs = filteredLogs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const exportAuditCsv = () => {
    const headers = ['Log ID', 'Action', 'User ID', 'User Email', 'IP Address', 'Details', 'Timestamp'];
    const rows = filteredLogs.map(l => [
      l.id,
      l.action,
      l.userId,
      l.userEmail,
      l.ipAddress,
      `"${l.details.replace(/"/g, '""')}"`,
      new Date(l.timestamp).toISOString()
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `cyberphish-audit-logs-${Date.now()}.csv`);
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
              Security Audit Trail
            </span>
            <span className="text-xs text-[#94A3B8]">• Immutable Security Operations Log</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight mt-1 font-sans">
            System Compliance & <span className="text-[#38BDF8]">Audit Logging</span>
          </h1>
        </div>

        <button
          onClick={exportAuditCsv}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#111C35] hover:bg-[#1A2A4E] text-white border border-[#1E2D4D] text-xs font-semibold transition-colors cursor-pointer shadow-md"
        >
          <FileDown className="w-4 h-4 text-[#38BDF8]" />
          <span>Export Audit CSV</span>
        </button>
      </div>

      {/* Filter and Search */}
      <div className="bg-[#0F172A]/85 backdrop-blur-md border border-[#1E2D4D] p-4 rounded-2xl shadow-xl flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-[#94A3B8]" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            placeholder="Search email, details, IP address..."
            className="w-full pl-10 pr-3 py-2 bg-[#0B1222] border border-[#1E2D4D] rounded-xl text-xs text-white placeholder-[#94A3B8] focus:outline-none focus:border-[#38BDF8] focus:ring-1 focus:ring-[#38BDF8]"
          />
        </div>

        <select
          value={actionFilter}
          onChange={(e) => { setActionFilter(e.target.value); setCurrentPage(1); }}
          className="px-3.5 py-2 bg-[#0B1222] border border-[#1E2D4D] rounded-xl text-xs text-white focus:outline-none focus:border-[#38BDF8] font-mono cursor-pointer"
        >
          <option value="ALL">All Audit Actions</option>
          <option value="LOGIN">LOGIN</option>
          <option value="LOGOUT">LOGOUT</option>
          <option value="EMAIL_ANALYSIS">EMAIL_ANALYSIS</option>
          <option value="USER_CREATE">USER_CREATE</option>
          <option value="USER_UPDATE">USER_UPDATE</option>
          <option value="RULE_CREATE">RULE_CREATE</option>
          <option value="RULE_UPDATE">RULE_UPDATE</option>
          <option value="MODEL_UPDATE">MODEL_UPDATE</option>
          <option value="REPORT_DOWNLOAD">REPORT_DOWNLOAD</option>
        </select>
      </div>

      {/* Logs Table */}
      <div className="bg-[#0F172A]/85 backdrop-blur-md border border-[#1E2D4D] rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#111C35] text-[#94A3B8] font-mono uppercase text-[10px] border-b border-[#1E2D4D]">
              <tr>
                <th className="px-5 py-3.5">ID</th>
                <th className="px-5 py-3.5">Action Type</th>
                <th className="px-5 py-3.5">Operator Account</th>
                <th className="px-5 py-3.5">IP Address</th>
                <th className="px-5 py-3.5">Event Details</th>
                <th className="px-5 py-3.5 text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E2D4D] text-[#F8FAFC]">
              {paginatedLogs.map(log => (
                <tr key={log.id} className="hover:bg-[#111C35]/60 transition-colors">
                  <td className="px-5 py-3.5 font-mono font-bold text-[#38BDF8]">
                    #{log.id}
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#111C35] border border-[#1E2D4D] text-[#38BDF8]">
                      {log.action}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 font-mono text-white">
                    {log.userEmail}
                  </td>
                  <td className="px-5 py-3.5 font-mono text-[#94A3B8]">
                    {log.ipAddress}
                  </td>
                  <td className="px-5 py-3.5 text-[#F8FAFC] max-w-[320px] truncate" title={log.details}>
                    {log.details}
                  </td>
                  <td className="px-5 py-3.5 text-right font-mono text-[#94A3B8] text-[11px] whitespace-nowrap">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="bg-[#111C35] px-5 py-3.5 border-t border-[#1E2D4D] flex items-center justify-between text-xs text-[#94A3B8]">
          <div>
            Showing <span className="text-white font-semibold">{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
            <span className="text-white font-semibold">{Math.min(currentPage * itemsPerPage, filteredLogs.length)}</span> of{' '}
            <span className="text-white font-semibold">{filteredLogs.length}</span> logs
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg bg-[#0F172A] border border-[#1E2D4D] hover:bg-[#1A2A4E] disabled:opacity-40 text-white transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-mono text-white">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg bg-[#0F172A] border border-[#1E2D4D] hover:bg-[#1A2A4E] disabled:opacity-40 text-white transition-colors cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
