export type UserRole = 'ADMIN' | 'SECURITY_ANALYST' | 'USER';

export type NavigationTab = 
  | 'home'
  | 'dashboard' 
  | 'analyze' 
  | 'dataset'
  | 'history' 
  | 'threat-intel' 
  | 'academic' 
  | 'users' 
  | 'rules' 
  | 'models' 
  | 'audit-logs' 
  | 'java-source';

export type UserStatus = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';

export type ClassificationType = 'LEGITIMATE' | 'SUSPICIOUS' | 'PHISHING';

export type RiskLevelType = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type IndicatorSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type IndicatorCategory = 
  | 'URGENCY'
  | 'CREDENTIAL_REQUEST'
  | 'BANKING_IMPERSONATION'
  | 'SOCIAL_ENGINEERING'
  | 'SUSPICIOUS_URL'
  | 'ATTACHMENT_RISK'
  | 'DOMAIN_MISMATCH'
  | 'HEADER_ANOMALY';

export interface User {
  id: number;
  fullName: string;
  email: string;
  passwordHash?: string;
  role: UserRole;
  status: UserStatus;
  mustChangePassword?: boolean;
  createdAt: string;
  updatedAt: string;
  lastLogin?: string;
}

export interface Indicator {
  id: number;
  analysisId?: number;
  indicatorType: IndicatorCategory;
  indicatorName: string;
  description: string;
  severity: IndicatorSeverity;
  scoreContribution: number;
  detected: boolean;
  matchedText?: string;
  createdAt?: string;
}

export interface SuspiciousUrl {
  id: number;
  analysisId?: number;
  url: string;
  domain: string;
  isSuspicious: boolean;
  indicator: string;
  details?: string;
  protocol: string;
  hasIpAddress: boolean;
  isShortened: boolean;
  excessiveSubdomains: boolean;
  lookalikeDomain: boolean;
  createdAt?: string;
}

export interface EmailAnalysis {
  id: number;
  userId: number;
  userName?: string;
  userEmail?: string;
  senderEmail: string;
  recipientEmail: string;
  subject: string;
  emailBody: string;
  rawHeaders?: string;
  urls: SuspiciousUrl[];
  indicators: Indicator[];
  classification: ClassificationType;
  probability: number; // 0.0 to 1.0 (ML probability)
  indicatorScore: number; // 0 to 100
  riskScore: number; // 0 to 100 combined
  riskLevel: RiskLevelType;
  analysisMethod: 'HYBRID_ML_RULES' | 'ML_ONLY' | 'RULE_ENGINE';
  modelUsed: string;
  modelVersion: string;
  recommendations: string[];
  featuresExtracted?: {
    wordCount: number;
    urlCount: number;
    suspiciousKeywordsFound: string[];
    urgencyKeywordsFound: string[];
    bankingKeywordsFound: string[];
    tfidfTopTerms: { term: string; weight: number }[];
  };
  attachments?: {
    fileName: string;
    fileSize: number;
    fileType: string;
    isSuspicious: boolean;
  }[];
  createdAt: string;
}

export interface DetectionRule {
  id: number;
  ruleName: string;
  ruleType: IndicatorCategory;
  pattern: string;
  weight: number; // e.g. 10 - 30
  severity: IndicatorSeverity;
  description: string;
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ModelVersion {
  id: number;
  modelName: string;
  version: string;
  algorithm: string;
  accuracy: number;
  precisionScore: number;
  recallScore: number;
  f1Score: number;
  rocAuc: number;
  trainingDate: string;
  status: 'ACTIVE' | 'ARCHIVED' | 'TRAINING' | 'BENCHMARK';
  description?: string;
}

export interface AuditLog {
  id: number;
  userId: number;
  userName: string;
  userRole: UserRole;
  action: string;
  description: string;
  ipAddress: string;
  createdAt: string;
}

export interface MLPredictRequest {
  subject: string;
  body: string;
  sender: string;
  recipient?: string;
  urls?: string[];
}

export interface MLPredictResponse {
  classification: ClassificationType;
  probability: number;
  model: string;
  modelVersion: string;
  topFeatures?: { term: string; weight: number }[];
  status: 'SUCCESS' | 'ERROR';
  message?: string;
}

export interface DashboardStats {
  totalAnalyses: number;
  phishingCount: number;
  suspiciousCount: number;
  legitimateCount: number;
  criticalCount: number;
  highCount: number;
  mediumCount: number;
  lowCount: number;
  averageRiskScore: number;
  mlAccuracyRate: number;
  activeRulesCount: number;
  totalUsers: number;
  activeUsers: number;
  recentAnalyses: EmailAnalysis[];
  dailyVolume: { date: string; phishing: number; suspicious: number; legitimate: number; total: number }[];
  threatDistribution: { name: string; value: number; color: string }[];
  indicatorFrequency: { category: string; count: number }[];
  riskDistribution: { name: string; count: number; color: string }[];
}

export interface ThreatIntelligenceData {
  topKeywords: { keyword: string; count: number; riskLevel: string }[];
  targetedInstitutions: { name: string; attacksBlocked: number; country: string; risk: string }[];
  suspiciousDomains: { domain: string; detectedCount: number; category: string; firstSeen: string }[];
  attackTechniques: { technique: string; frequency: number; severity: string; mitreAttckId: string }[];
  recentTrends: { week: string; credentialHarvesting: number; urgencyScams: number; maliciousLinks: number }[];
}
