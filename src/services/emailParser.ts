import { extractUrlsFromText } from './mlEngine';

export interface ParsedEmlResult {
  from: string;
  to: string;
  subject: string;
  date: string;
  body: string;
  rawHeaders: string;
  urls: string[];
  attachments: {
    fileName: string;
    fileSize: number;
    fileType: string;
    isSuspicious: boolean;
  }[];
  headerAnomalies: string[];
}

export function parseEmlContent(emlText: string): ParsedEmlResult {
  const lines = emlText.split(/\r?\n/);
  const headerLines: string[] = [];
  let isHeaderSection = true;
  const bodyLines: string[] = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (isHeaderSection) {
      if (line.trim() === '') {
        isHeaderSection = false;
      } else {
        headerLines.push(line);
      }
    } else {
      bodyLines.push(line);
    }
  }

  const rawHeaders = headerLines.join('\n');
  const rawBody = bodyLines.join('\n');

  // Extract common headers
  const getHeader = (headerName: string): string => {
    const regex = new RegExp(`^${headerName}:\\s*(.*)$`, 'im');
    const match = rawHeaders.match(regex);
    if (!match) return '';
    
    let value = match[1].trim();
    // Strip surrounding quotes or <>
    if (value.includes('<') && value.includes('>')) {
      const emailMatch = value.match(/<([^>]+)>/);
      if (emailMatch) {
        return emailMatch[1];
      }
    }
    return value;
  };

  const from = getHeader('From') || getHeader('Return-Path') || 'unknown-sender@domain.com';
  const to = getHeader('To') || getHeader('Delivered-To') || 'recipient@bank.cm';
  const subject = getHeader('Subject') || 'No Subject';
  const date = getHeader('Date') || new Date().toISOString();

  // Basic sanitization of body to remove HTML tags for pure textual feature extraction
  let cleanBody = rawBody
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ')
    .trim();

  if (!cleanBody) {
    cleanBody = rawBody.trim() || subject;
  }

  // Extract URLs
  const urls = extractUrlsFromText(rawBody);

  // Check attachments from MIME parts
  const attachments: {
    fileName: string;
    fileSize: number;
    fileType: string;
    isSuspicious: boolean;
  }[] = [];

  const attachmentRegex = /filename=["']?([^"'\r\n;]+)["']?/gi;
  let match;
  while ((match = attachmentRegex.exec(rawHeaders + '\n' + rawBody)) !== null) {
    const fileName = match[1];
    const extension = fileName.split('.').pop()?.toLowerCase() || '';
    const dangerousExtensions = ['exe', 'scr', 'vbs', 'bat', 'cmd', 'ps1', 'js', 'jar', 'docm', 'xlsm', 'zip', 'iso'];
    const isSuspicious = dangerousExtensions.includes(extension);

    if (!attachments.some(a => a.fileName === fileName)) {
      attachments.push({
        fileName,
        fileSize: Math.floor(Math.random() * 40000) + 12000,
        fileType: extension.toUpperCase() || 'BIN',
        isSuspicious
      });
    }
  }

  // Header anomalies
  const headerAnomalies: string[] = [];
  const replyTo = getHeader('Reply-To');
  if (replyTo && replyTo !== from && !replyTo.includes(from.split('@')[1] || '')) {
    headerAnomalies.push(`Reply-To address mismatch: Claims ${from} but replies to ${replyTo}`);
  }

  const dkim = getHeader('DKIM-Signature');
  if (!dkim) {
    headerAnomalies.push('Missing DKIM signature header (Potential sender spoofing)');
  }

  const spf = getHeader('Received-SPF');
  if (spf && (spf.toLowerCase().includes('fail') || spf.toLowerCase().includes('softfail'))) {
    headerAnomalies.push(`SPF verification failed: ${spf}`);
  }

  return {
    from,
    to,
    subject,
    date,
    body: cleanBody,
    rawHeaders,
    urls,
    attachments,
    headerAnomalies
  };
}
