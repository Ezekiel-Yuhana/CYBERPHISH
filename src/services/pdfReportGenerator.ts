import { jsPDF } from 'jspdf';
import { EmailAnalysis } from '../types';

export function generatePdfReport(analysis: EmailAnalysis): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 18;
  const contentWidth = pageWidth - (margin * 2);
  let y = 20;

  // Header Bar (Deep Navy)
  doc.setFillColor(11, 19, 43); // #0b132b
  doc.rect(0, 0, pageWidth, 32, 'F');

  // Accent Cyber Line (Cyan)
  doc.setFillColor(14, 165, 233); // #0ea5e9
  doc.rect(0, 32, pageWidth, 2, 'F');

  // Title Text
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.text('CYBERPHISH ANALYTICS', margin, 15);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(203, 213, 225);
  doc.text('AI-Powered Phishing Threat Forensics & Cyber Risk Report', margin, 22);
  doc.text(`CONFIDENTIAL - COMMERCIAL BANKING SECTOR`, margin, 27);

  // Right Top Metadata
  doc.setFontSize(8);
  doc.text(`REPORT REF: CP-${analysis.id}`, pageWidth - margin - 50, 15);
  doc.text(`DATE: ${new Date(analysis.createdAt).toLocaleString()}`, pageWidth - margin - 50, 21);
  doc.text(`ANALYST ID: #${analysis.userId}`, pageWidth - margin - 50, 27);

  y = 44;

  // Executive Summary Box
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin, y, contentWidth, 38, 3, 3, 'FD');

  // Classification Badge
  const isPhishing = analysis.classification === 'PHISHING';
  const isSuspicious = analysis.classification === 'SUSPICIOUS';
  
  if (isPhishing) {
    doc.setFillColor(239, 68, 68); // Red
  } else if (isSuspicious) {
    doc.setFillColor(245, 158, 11); // Amber
  } else {
    doc.setFillColor(16, 185, 129); // Green
  }

  doc.roundedRect(margin + 6, y + 6, 45, 26, 2, 2, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text(analysis.classification, margin + 8, y + 18);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text(`RISK: ${analysis.riskLevel}`, margin + 8, y + 26);

  // Risk Score Metrics
  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text(`Overall Threat Risk Score: ${analysis.riskScore} / 100`, margin + 58, y + 12);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(71, 85, 105);
  doc.text(`Machine Learning Probability: ${(analysis.probability * 100).toFixed(1)}%`, margin + 58, y + 19);
  doc.text(`Heuristic Indicator Score: ${analysis.indicatorScore} / 100`, margin + 58, y + 25);
  doc.text(`Scoring Formula: Risk = (ML Prob × 70%) + (Indicator Score × 30%)`, margin + 58, y + 31);

  y += 46;

  // Email Forensics Metadata Section
  doc.setTextColor(11, 19, 43);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('1. EMAIL METADATA & TELEMETRY', margin, y);

  y += 4;
  doc.setDrawColor(203, 213, 225);
  doc.line(margin, y, margin + contentWidth, y);
  y += 6;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(51, 65, 85);
  doc.text('Sender Address:', margin, y);
  doc.setFont('helvetica', 'normal');
  doc.text(analysis.senderEmail, margin + 35, y);

  y += 6;
  doc.setFont('helvetica', 'bold');
  doc.text('Recipient Target:', margin, y);
  doc.setFont('helvetica', 'normal');
  doc.text(analysis.recipientEmail, margin + 35, y);

  y += 6;
  doc.setFont('helvetica', 'bold');
  doc.text('Email Subject:', margin, y);
  doc.setFont('helvetica', 'normal');
  const splitSubject = doc.splitTextToSize(analysis.subject, contentWidth - 36);
  doc.text(splitSubject, margin + 35, y);
  y += Math.max(6, splitSubject.length * 5);

  // Email Body Snippet
  doc.setFont('helvetica', 'bold');
  doc.text('Body Summary:', margin, y);
  y += 5;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  const snippet = analysis.emailBody.length > 280 ? analysis.emailBody.slice(0, 280) + '...' : analysis.emailBody;
  const splitBody = doc.splitTextToSize(`"${snippet}"`, contentWidth - 10);
  doc.setFillColor(241, 245, 249);
  doc.rect(margin, y - 3, contentWidth, splitBody.length * 4 + 6, 'F');
  doc.text(splitBody, margin + 3, y + 2);
  y += splitBody.length * 4 + 10;

  // Indicators Section
  doc.setTextColor(11, 19, 43);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text(`2. DETECTED THREAT INDICATORS (${analysis.indicators.length})`, margin, y);
  y += 4;
  doc.line(margin, y, margin + contentWidth, y);
  y += 6;

  if (analysis.indicators.length === 0) {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(16, 185, 129);
    doc.text('âœ“ No suspicious heuristic threat indicators detected.', margin, y);
    y += 8;
  } else {
    analysis.indicators.forEach((ind, index) => {
      if (y > 250) {
        doc.addPage();
        y = 20;
      }

      doc.setFillColor(ind.severity === 'CRITICAL' ? 254 : 255, ind.severity === 'CRITICAL' ? 242 : 247, ind.severity === 'CRITICAL' ? 242 : 237);
      doc.roundedRect(margin, y, contentWidth, 14, 2, 2, 'F');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(ind.severity === 'CRITICAL' ? 185 : 180, ind.severity === 'CRITICAL' ? 28 : 83, ind.severity === 'CRITICAL' ? 28 : 9);
      doc.text(`[${ind.severity}] ${ind.indicatorName} (+${ind.scoreContribution} pts)`, margin + 4, y + 5);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(71, 85, 105);
      const indDesc = doc.splitTextToSize(ind.description + (ind.matchedText ? ` (Matched: "${ind.matchedText}")` : ''), contentWidth - 8);
      doc.text(indDesc, margin + 4, y + 10);

      y += 17;
    });
  }

  // URLs Analysis Section
  if (analysis.urls && analysis.urls.length > 0) {
    if (y > 230) {
      doc.addPage();
      y = 20;
    }
    y += 4;
    doc.setTextColor(11, 19, 43);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text(`3. PASSIVE URL FORENSICS (${analysis.urls.length})`, margin, y);
    y += 4;
    doc.line(margin, y, margin + contentWidth, y);
    y += 6;

    analysis.urls.forEach(u => {
      if (y > 260) {
        doc.addPage();
        y = 20;
      }
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(u.isSuspicious ? 220 : 16, u.isSuspicious ? 38 : 185, u.isSuspicious ? 38 : 129);
      doc.text(u.isSuspicious ? 'âš  SUSPICIOUS URL' : 'âœ“ SAFE STRUCTURE', margin, y);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(30, 41, 59);
      doc.text(u.url.length > 70 ? u.url.slice(0, 70) + '...' : u.url, margin + 35, y);
      y += 5;
      doc.setTextColor(100, 116, 139);
      doc.text(`Domain: ${u.domain} | Flags: ${u.indicator}`, margin + 5, y);
      y += 7;
    });
  }

  // Security Recommendations Section
  if (y > 230) {
    doc.addPage();
    y = 20;
  }
  y += 4;
  doc.setTextColor(11, 19, 43);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('4. SECURITY RECOMMENDATIONS & INCIDENT RESPONSE', margin, y);
  y += 4;
  doc.line(margin, y, margin + contentWidth, y);
  y += 6;

  analysis.recommendations.forEach(rec => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(220, 38, 38);
    doc.text('â€¢', margin + 2, y);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(30, 41, 59);
    const splitRec = doc.splitTextToSize(rec, contentWidth - 10);
    doc.text(splitRec, margin + 8, y);
    y += splitRec.length * 4 + 3;
  });

  // Footer / Academic Disclaimer
  const footerY = doc.internal.pageSize.getHeight() - 15;
  doc.setDrawColor(226, 232, 240);
  doc.line(margin, footerY - 4, pageWidth - margin, footerY - 4);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(148, 163, 184);
  doc.text('Generated by CYBERPHISH Cyber Analytics Platform | Model: Logistic Regression (TF-IDF N-Gram Vectorizer)', margin, footerY);
  doc.text('Page 1 of 1', pageWidth - margin - 20, footerY);

  // Save PDF file
  doc.save(`CyberPhish_Threat_Report_${analysis.id}.pdf`);
}

export function exportAnalysesToCsv(analyses: EmailAnalysis[]): void {
  const headers = [
    'Analysis ID',
    'Date',
    'Sender',
    'Recipient',
    'Subject',
    'Classification',
    'Probability (%)',
    'Risk Score',
    'Risk Level',
    'Indicator Count',
    'Suspicious URLs Count'
  ];

  const rows = analyses.map(a => [
    a.id,
    `"${new Date(a.createdAt).toISOString()}"`,
    `"${a.senderEmail.replace(/"/g, '""')}"`,
    `"${a.recipientEmail.replace(/"/g, '""')}"`,
    `"${a.subject.replace(/"/g, '""')}"`,
    a.classification,
    (a.probability * 100).toFixed(1),
    a.riskScore,
    a.riskLevel,
    a.indicators.length,
    a.urls.filter(u => u.isSuspicious).length
  ]);

  const csvContent = 'data:text/csv;charset=utf-8,' 
    + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `CyberPhish_Analyses_Export_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
