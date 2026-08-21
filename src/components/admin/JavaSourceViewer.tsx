import React, { useState } from 'react';
import { 
  Code2, 
  Folder, 
  FileText, 
  Copy, 
  Check, 
  Download, 
  FileDown, 
  Terminal, 
  Database, 
  Layers,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { JAVA_PROJECT_FILES } from '../../data/javaSourceFiles';

export const JavaSourceViewer: React.FC = () => {
  const [selectedFileIndex, setSelectedFileIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  const selectedFile = JAVA_PROJECT_FILES[selectedFileIndex] || JAVA_PROJECT_FILES[0];

  const handleCopyCode = () => {
    navigator.clipboard.writeText(selectedFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadSingleFile = () => {
    const blob = new Blob([selectedFile.content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = selectedFile.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleDownloadAllFiles = () => {
    // Download an aggregated script/bundle file containing all Java sources and schemas
    const projectBundle = JAVA_PROJECT_FILES.map(f => (
      `================================================================================\n` +
      `FILE: ${f.path}\n` +
      `PACKAGE / DIRECTORY: ${f.category}\n` +
      `================================================================================\n\n` +
      f.content + `\n\n\n`
    )).join('\n');

    const blob = new Blob([projectBundle], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `CyberPhish-Java21-SpringBoot3-Complete-Architecture-${Date.now()}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Group files by category
  const categories = Array.from(new Set(JAVA_PROJECT_FILES.map(f => f.category)));

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-[#0F172A]/90 backdrop-blur-md border border-[#1E2D4D] p-6 rounded-2xl shadow-xl flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-[#0C4A6E]/60 text-[#38BDF8] border border-[#0284C7]/30 text-[10px] uppercase font-mono font-semibold tracking-wider">
              Java 21 & Spring Boot 3 Architecture
            </span>
            <span className="text-xs text-[#94A3B8]">• Production-Ready Enterprise Backend</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight mt-1 font-sans">
            Enterprise Backend Codebase & <span className="text-[#38BDF8]">Schema Architecture</span>
          </h1>
          <p className="text-xs text-[#94A3B8] mt-1 max-w-2xl leading-relaxed">
            Full reference implementation complying with Java 21 LTS, Spring Boot 3.2.x, Spring Security (JWT), Spring Data JPA, Hibernate, MySQL 8.0, and Docker containerization.
          </p>
        </div>

        <button
          onClick={handleDownloadAllFiles}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0284C7] hover:bg-[#0369A1] text-white text-xs font-semibold shadow-lg shadow-sky-950/40 transition-all cursor-pointer"
        >
          <FileDown className="w-4 h-4" />
          <span>Export All Java Backend Sources</span>
        </button>
      </div>

      {/* Code Browser Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 bg-[#0F172A]/85 backdrop-blur-md border border-[#1E2D4D] rounded-2xl overflow-hidden shadow-xl">
        {/* Left Sidebar: File Tree (4 Cols) */}
        <div className="lg:col-span-4 bg-[#0B1222]/90 border-r border-[#1E2D4D] p-4 space-y-4 max-h-[700px] overflow-y-auto">
          <div className="text-xs font-bold uppercase font-mono text-[#38BDF8] flex items-center gap-2 pb-2 border-b border-[#1E2D4D]">
            <Folder className="w-4 h-4 text-[#38BDF8]" />
            <span>Project Explorer (Maven / Java 21)</span>
          </div>

          <div className="space-y-4">
            {categories.map((cat) => (
              <div key={cat} className="space-y-1">
                <div className="text-[10px] font-bold uppercase font-mono text-[#94A3B8] px-2 py-0.5">
                  {cat}
                </div>
                {JAVA_PROJECT_FILES.map((file, idx) => {
                  if (file.category !== cat) return null;
                  const isSelected = selectedFileIndex === idx;
                  return (
                    <button
                      key={idx}
                      onClick={() => setSelectedFileIndex(idx)}
                      className={`w-full text-left px-2.5 py-1.5 rounded-xl text-xs font-mono flex items-center justify-between transition-colors cursor-pointer ${
                        isSelected
                          ? 'bg-[#0C4A6E]/60 text-[#38BDF8] border border-[#0284C7]/40 font-semibold'
                          : 'text-[#94A3B8] hover:text-white hover:bg-[#111C35]'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <FileText className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-[#38BDF8]' : 'text-[#94A3B8]'}`} />
                        <span className="truncate">{file.name}</span>
                      </div>
                      <span className="text-[9px] uppercase px-1.5 py-0.5 rounded bg-[#111C35] text-[#94A3B8] shrink-0 border border-[#1E2D4D]">
                        {file.path.split('.').pop()}
                      </span>
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Right Pane: Code Viewer & Actions (8 Cols) */}
        <div className="lg:col-span-8 flex flex-col max-h-[700px] bg-[#0B1222]">
          {/* File Header Bar */}
          <div className="bg-[#111C35] px-4 py-3 border-b border-[#1E2D4D] flex items-center justify-between">
            <div className="font-mono text-xs text-white flex items-center gap-2 truncate">
              <span className="text-[#38BDF8] font-bold">{selectedFile.name}</span>
              <span className="text-[#94A3B8] text-[11px] truncate hidden sm:inline font-sans">
                — {selectedFile.description}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyCode}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0F172A] border border-[#1E2D4D] hover:bg-[#1A2A4E] text-white text-xs font-mono transition-colors cursor-pointer shadow-md"
                title="Copy source code"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-[#34D399]" /> : <Copy className="w-3.5 h-3.5 text-[#94A3B8]" />}
                <span>{copied ? 'Copied!' : 'Copy'}</span>
              </button>

              <button
                onClick={handleDownloadSingleFile}
                className="p-1.5 rounded-xl bg-[#0F172A] border border-[#1E2D4D] hover:bg-[#1A2A4E] text-white text-xs font-mono transition-colors cursor-pointer shadow-md"
                title="Download this file"
              >
                <Download className="w-3.5 h-3.5 text-[#94A3B8]" />
              </button>
            </div>
          </div>

          {/* Code Viewer Container */}
          <div className="p-4 flex-1 overflow-auto bg-[#070D18] font-mono text-xs leading-relaxed text-[#E2E8F0]">
            <pre className="whitespace-pre">
              <code>{selectedFile.content}</code>
            </pre>
          </div>

          {/* Path Footer */}
          <div className="bg-[#111C35] px-4 py-2.5 border-t border-[#1E2D4D] text-[11px] font-mono text-[#94A3B8] flex items-center justify-between">
            <span className="truncate">File Path: <strong className="text-white">{selectedFile.path}</strong></span>
            <span className="text-[10px] text-[#34D399] font-semibold">Java 21 / Spring Boot 3.2</span>
          </div>
        </div>
      </div>
    </div>
  );
};
