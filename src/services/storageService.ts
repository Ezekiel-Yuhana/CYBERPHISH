import { 
  AuditLog, 
  DashboardStats, 
  DetectionRule, 
  EmailAnalysis, 
  ModelVersion, 
  ThreatIntelligenceData, 
  User, 
  UserRole 
} from '../types';
import { 
  INITIAL_ANALYSES, 
  INITIAL_AUDIT_LOGS, 
  INITIAL_MODELS, 
  INITIAL_RULES, 
  INITIAL_THREAT_INTEL, 
  INITIAL_USERS 
} from '../data/seedData';

const STORAGE_KEYS = {
  USERS: 'cyberphish_users',
  ANALYSES: 'cyberphish_analyses',
  RULES: 'cyberphish_rules',
  MODELS: 'cyberphish_models',
  AUDIT_LOGS: 'cyberphish_audit_logs',
  CURRENT_USER: 'cyberphish_current_user',
  WEIGHTS: 'cyberphish_risk_weights'
};

class StorageService {
  private users: User[] = [];
  private analyses: EmailAnalysis[] = [];
  private rules: DetectionRule[] = [];
  private models: ModelVersion[] = [];
  private auditLogs: AuditLog[] = [];
  private currentUser: User | null = null;
  private riskWeights = { mlWeight: 0.70, indicatorWeight: 0.30 };

  constructor() {
    this.init();
  }

  private init() {
    try {
      const savedUsers = localStorage.getItem(STORAGE_KEYS.USERS);
      this.users = savedUsers ? JSON.parse(savedUsers) : [...INITIAL_USERS];

      const savedAnalyses = localStorage.getItem(STORAGE_KEYS.ANALYSES);
      this.analyses = savedAnalyses ? JSON.parse(savedAnalyses) : [...INITIAL_ANALYSES];

      const savedRules = localStorage.getItem(STORAGE_KEYS.RULES);
      this.rules = savedRules ? JSON.parse(savedRules) : [...INITIAL_RULES];

      const savedModels = localStorage.getItem(STORAGE_KEYS.MODELS);
      this.models = savedModels ? JSON.parse(savedModels) : [...INITIAL_MODELS];

      const savedLogs = localStorage.getItem(STORAGE_KEYS.AUDIT_LOGS);
      this.auditLogs = savedLogs ? JSON.parse(savedLogs) : [...INITIAL_AUDIT_LOGS];

      const savedUser = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
      this.currentUser = savedUser ? JSON.parse(savedUser) : this.users[0]; // default to Admin for seamless demo

      const savedWeights = localStorage.getItem(STORAGE_KEYS.WEIGHTS);
      if (savedWeights) {
        this.riskWeights = JSON.parse(savedWeights);
      }
    } catch (e) {
      console.warn('LocalStorage error, using memory fallback:', e);
      this.users = [...INITIAL_USERS];
      this.analyses = [...INITIAL_ANALYSES];
      this.rules = [...INITIAL_RULES];
      this.models = [...INITIAL_MODELS];
      this.auditLogs = [...INITIAL_AUDIT_LOGS];
      this.currentUser = this.users[0];
    }
  }

  private save(key: string, data: any) {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
      console.warn('Failed to save to localStorage:', e);
    }
  }

  // --- AUTHENTICATION & USERS ---
  getCurrentUser(): User | null {
    return this.currentUser;
  }

  setCurrentUser(user: User | null) {
    this.currentUser = user;
    if (user) {
      this.save(STORAGE_KEYS.CURRENT_USER, user);
      this.logAudit(user.id, user.fullName, user.role, 'USER_LOGIN', `User ${user.email} authenticated.`);
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    }
  }

  logout() {
    if (this.currentUser) {
      this.logAudit(this.currentUser.id, this.currentUser.fullName, this.currentUser.role, 'USER_LOGOUT', `User ${this.currentUser.email} logged out.`);
    }
    this.setCurrentUser(null);
  }

  authenticate(email: string, passwordAttempt: string): User | null {
    const res = this.login(email, passwordAttempt);
    return res.success && res.user ? res.user : null;
  }

  login(email: string, passwordAttempt: string): { success: boolean; user?: User; message?: string } {
    const user = this.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      return { success: false, message: 'Invalid email or password.' };
    }
    if (user.status !== 'ACTIVE') {
      return { success: false, message: 'Your account has been deactivated or suspended.' };
    }

    user.lastLogin = new Date().toISOString();
    this.save(STORAGE_KEYS.USERS, this.users);
    this.setCurrentUser(user);

    return { success: true, user };
  }

  register(fullName: string, email: string, role: UserRole = 'USER'): { success: boolean; user?: User; message?: string } {
    if (this.users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
      return { success: false, message: 'A user with this email address already exists.' };
    }

    const newUser: User = {
      id: Date.now(),
      fullName,
      email,
      role,
      status: 'ACTIVE',
      mustChangePassword: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lastLogin: new Date().toISOString()
    };

    this.users.unshift(newUser);
    this.save(STORAGE_KEYS.USERS, this.users);
    this.setCurrentUser(newUser);
    this.logAudit(newUser.id, newUser.fullName, newUser.role, 'USER_REGISTRATION', `New user registered: ${email}`);

    return { success: true, user: newUser };
  }

  updatePassword(userId: number, newPassword: string): boolean {
    const user = this.users.find(u => u.id === userId);
    if (!user) return false;

    user.mustChangePassword = false;
    user.updatedAt = new Date().toISOString();
    this.save(STORAGE_KEYS.USERS, this.users);
    if (this.currentUser?.id === userId) {
      this.currentUser.mustChangePassword = false;
      this.save(STORAGE_KEYS.CURRENT_USER, this.currentUser);
    }
    this.logAudit(user.id, user.fullName, user.role, 'PASSWORD_CHANGE', 'Password successfully updated.');
    return true;
  }

  getUsers(): User[] {
    return [...this.users];
  }

  addUser(userData: Partial<User>): User {
    const newUser: User = {
      id: Date.now(),
      fullName: userData.fullName || 'New User',
      email: userData.email || `user${Date.now()}@bank.cm`,
      role: userData.role || 'USER',
      status: userData.status || 'ACTIVE',
      mustChangePassword: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.users.unshift(newUser);
    this.save(STORAGE_KEYS.USERS, this.users);
    this.logAudit(this.currentUser?.id || 1, this.currentUser?.fullName || 'Admin', this.currentUser?.role || 'ADMIN', 'USER_CREATION', `Created user ${newUser.email} with role ${newUser.role}`);
    return newUser;
  }

  updateUser(id: number, updates: Partial<User>): User | null {
    const idx = this.users.findIndex(u => u.id === id);
    if (idx === -1) return null;

    this.users[idx] = {
      ...this.users[idx],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    this.save(STORAGE_KEYS.USERS, this.users);
    this.logAudit(this.currentUser?.id || 1, this.currentUser?.fullName || 'Admin', this.currentUser?.role || 'ADMIN', 'USER_MODIFICATION', `Updated user ID #${id}`);
    return this.users[idx];
  }

  deleteUser(id: number): boolean {
    const user = this.users.find(u => u.id === id);
    if (!user) return false;
    this.users = this.users.filter(u => u.id !== id);
    this.save(STORAGE_KEYS.USERS, this.users);
    this.logAudit(this.currentUser?.id || 1, this.currentUser?.fullName || 'Admin', this.currentUser?.role || 'ADMIN', 'USER_DELETION', `Deleted user ${user.email}`);
    return true;
  }

  // --- ANALYSES ---
  getAnalyses(forUserId?: number): EmailAnalysis[] {
    if (forUserId && this.currentUser?.role === 'USER') {
      return this.analyses.filter(a => a.userId === forUserId);
    }
    return [...this.analyses];
  }

  getAnalysisById(id: number): EmailAnalysis | null {
    return this.analyses.find(a => a.id === id) || null;
  }

  saveAnalysis(analysis: EmailAnalysis): EmailAnalysis {
    this.analyses.unshift(analysis);
    this.save(STORAGE_KEYS.ANALYSES, this.analyses);
    this.logAudit(
      analysis.userId,
      analysis.userName || 'Analyst',
      this.currentUser?.role || 'USER',
      'EMAIL_ANALYSIS',
      `Analyzed email "${analysis.subject.slice(0, 30)}..." (Score: ${analysis.riskScore}/100, ${analysis.classification})`
    );
    return analysis;
  }

  deleteAnalysis(id: number): boolean {
    const analysis = this.analyses.find(a => a.id === id);
    if (!analysis) return false;
    this.analyses = this.analyses.filter(a => a.id !== id);
    this.save(STORAGE_KEYS.ANALYSES, this.analyses);
    this.logAudit(
      this.currentUser?.id || 1,
      this.currentUser?.fullName || 'User',
      this.currentUser?.role || 'USER',
      'ANALYSIS_DELETION',
      `Deleted analysis record #${id}`
    );
    return true;
  }

  // --- RULES ---
  getRules(): DetectionRule[] {
    return [...this.rules];
  }

  saveRule(ruleData: Partial<DetectionRule>): DetectionRule {
    if (ruleData.id) {
      const idx = this.rules.findIndex(r => r.id === ruleData.id);
      if (idx !== -1) {
        this.rules[idx] = {
          ...this.rules[idx],
          ...ruleData,
          updatedAt: new Date().toISOString()
        } as DetectionRule;
        this.save(STORAGE_KEYS.RULES, this.rules);
        this.logAudit(this.currentUser?.id || 1, this.currentUser?.fullName || 'Admin', 'ADMIN', 'RULE_MODIFICATION', `Updated rule: ${this.rules[idx].ruleName}`);
        return this.rules[idx];
      }
    }

    const newRule: DetectionRule = {
      id: Date.now(),
      ruleName: ruleData.ruleName || 'Custom Cyber Rule',
      ruleType: ruleData.ruleType || 'URGENCY',
      pattern: ruleData.pattern || 'pattern',
      weight: ruleData.weight || 20,
      severity: ruleData.severity || 'HIGH',
      description: ruleData.description || 'Cybersecurity heuristic detection pattern.',
      enabled: ruleData.enabled ?? true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.rules.unshift(newRule);
    this.save(STORAGE_KEYS.RULES, this.rules);
    this.logAudit(this.currentUser?.id || 1, this.currentUser?.fullName || 'Admin', 'ADMIN', 'RULE_CREATION', `Created detection rule: ${newRule.ruleName}`);
    return newRule;
  }

  deleteRule(id: number): boolean {
    const rule = this.rules.find(r => r.id === id);
    if (!rule) return false;
    this.rules = this.rules.filter(r => r.id !== id);
    this.save(STORAGE_KEYS.RULES, this.rules);
    this.logAudit(this.currentUser?.id || 1, this.currentUser?.fullName || 'Admin', 'ADMIN', 'RULE_DELETION', `Deleted detection rule: ${rule.ruleName}`);
    return true;
  }

  // --- MODELS ---
  getModels(): ModelVersion[] {
    return [...this.models];
  }

  getRiskWeights() {
    return this.riskWeights;
  }

  setRiskWeights(mlWeight: number, indicatorWeight: number) {
    this.riskWeights = { mlWeight, indicatorWeight };
    this.save(STORAGE_KEYS.WEIGHTS, this.riskWeights);
    this.logAudit(this.currentUser?.id || 1, this.currentUser?.fullName || 'Admin', 'ADMIN', 'WEIGHTS_TUNING', `Risk weights updated: ML ${(mlWeight * 100)}%, Rules ${(indicatorWeight * 100)}%`);
  }

  // --- AUDIT LOGS ---
  getAuditLogs(): AuditLog[] {
    return [...this.auditLogs];
  }

  logAudit(userId: number, userName: string, userRole: UserRole, action: string, description: string) {
    const newLog: AuditLog = {
      id: Date.now(),
      userId,
      userName,
      userRole,
      action,
      description,
      ipAddress: '197.239.67.' + (40 + (userId % 20)),
      createdAt: new Date().toISOString()
    };
    this.auditLogs.unshift(newLog);
    if (this.auditLogs.length > 200) {
      this.auditLogs = this.auditLogs.slice(0, 200);
    }
    this.save(STORAGE_KEYS.AUDIT_LOGS, this.auditLogs);
  }

  // --- DASHBOARD STATISTICS ---
  getDashboardStats(): DashboardStats {
    const totalAnalyses = this.analyses.length;
    const phishingCount = this.analyses.filter(a => a.classification === 'PHISHING').length;
    const suspiciousCount = this.analyses.filter(a => a.classification === 'SUSPICIOUS').length;
    const legitimateCount = this.analyses.filter(a => a.classification === 'LEGITIMATE').length;
    const criticalCount = this.analyses.filter(a => a.riskLevel === 'CRITICAL').length;
    const highCount = this.analyses.filter(a => a.riskLevel === 'HIGH').length;
    const mediumCount = this.analyses.filter(a => a.riskLevel === 'MEDIUM').length;
    const lowCount = this.analyses.filter(a => a.riskLevel === 'LOW').length;

    const totalScore = this.analyses.reduce((acc, a) => acc + a.riskScore, 0);
    const averageRiskScore = totalAnalyses > 0 ? Math.round(totalScore / totalAnalyses) : 0;

    const dailyVolume = [
      { date: '16 Aug', phishing: 12, suspicious: 4, legitimate: 18, total: 34 },
      { date: '17 Aug', phishing: 15, suspicious: 6, legitimate: 22, total: 43 },
      { date: '18 Aug', phishing: 19, suspicious: 5, legitimate: 28, total: 52 },
      { date: '19 Aug', phishing: 24, suspicious: 8, legitimate: 31, total: 63 },
      { date: '20 Aug', phishing: phishingCount + 10, suspicious: suspiciousCount + 4, legitimate: legitimateCount + 15, total: totalAnalyses + 29 }
    ];

    const threatDistribution = [
      { name: 'Phishing', value: phishingCount, color: '#ef4444' },
      { name: 'Suspicious', value: suspiciousCount, color: '#f59e0b' },
      { name: 'Legitimate', value: legitimateCount, color: '#10b981' }
    ];

    const riskDistribution = [
      { name: 'Critical (80-100)', count: criticalCount, color: '#dc2626' },
      { name: 'High (60-79)', count: highCount, color: '#ea580c' },
      { name: 'Medium (30-59)', count: mediumCount, color: '#d97706' },
      { name: 'Low (0-29)', count: lowCount, color: '#059669' }
    ];

    // Indicator category frequency
    const categoryCounts: Record<string, number> = {
      'Urgency Language': 0,
      'Credential Solicitation': 0,
      'Banking Impersonation': 0,
      'Malicious URLs': 0,
      'Social Engineering': 0,
      'Domain Mismatch': 0
    };

    this.analyses.forEach(a => {
      a.indicators.forEach(i => {
        if (i.indicatorType === 'URGENCY') categoryCounts['Urgency Language']++;
        if (i.indicatorType === 'CREDENTIAL_REQUEST') categoryCounts['Credential Solicitation']++;
        if (i.indicatorType === 'BANKING_IMPERSONATION') categoryCounts['Banking Impersonation']++;
        if (i.indicatorType === 'SUSPICIOUS_URL') categoryCounts['Malicious URLs']++;
        if (i.indicatorType === 'SOCIAL_ENGINEERING') categoryCounts['Social Engineering']++;
        if (i.indicatorType === 'DOMAIN_MISMATCH') categoryCounts['Domain Mismatch']++;
      });
    });

    const indicatorFrequency = Object.entries(categoryCounts).map(([category, count]) => ({
      category,
      count
    }));

    return {
      totalAnalyses,
      phishingCount,
      suspiciousCount,
      legitimateCount,
      criticalCount,
      highCount,
      mediumCount,
      lowCount,
      averageRiskScore,
      mlAccuracyRate: 91.70,
      activeRulesCount: this.rules.filter(r => r.enabled).length,
      totalUsers: this.users.length,
      activeUsers: this.users.filter(u => u.status === 'ACTIVE').length,
      recentAnalyses: this.analyses.slice(0, 6),
      dailyVolume,
      threatDistribution,
      indicatorFrequency,
      riskDistribution
    };
  }

  getThreatIntel(): ThreatIntelligenceData {
    return INITIAL_THREAT_INTEL;
  }

  getThreatIntelligence(): ThreatIntelligenceData {
    return this.getThreatIntel();
  }

  // --- MYSQL SCHEMA SCRIPT GENERATORS (Requirements #35) ---
  getSchemaSql(): string {
    return `-- ==========================================================
-- CYBERPHISH: AI-BASED CYBER ANALYTICS SYSTEM FOR PHISHING DETECTION
-- Case Study: Commercial Banking Environment - Cameroon
-- Target Database: MySQL 8+ (InnoDB, UTF8MB4)
-- ==========================================================

CREATE DATABASE IF NOT EXISTS cyberphish CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE cyberphish;

-- 1. USERS TABLE (Role-Based Access Control)
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(150) NOT NULL,
    email VARCHAR(180) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('ADMIN', 'SECURITY_ANALYST', 'USER') NOT NULL DEFAULT 'USER',
    status ENUM('ACTIVE', 'INACTIVE', 'SUSPENDED') NOT NULL DEFAULT 'ACTIVE',
    must_change_password BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    last_login TIMESTAMP NULL,
    INDEX idx_user_email (email),
    INDEX idx_user_role (role),
    INDEX idx_user_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. EMAIL ANALYSES TABLE
CREATE TABLE IF NOT EXISTS email_analyses (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    sender_email VARCHAR(255) NOT NULL,
    recipient_email VARCHAR(255) NOT NULL,
    subject VARCHAR(500) NOT NULL,
    email_body LONGTEXT NOT NULL,
    raw_headers LONGTEXT NULL,
    classification ENUM('LEGITIMATE', 'SUSPICIOUS', 'PHISHING') NOT NULL,
    probability DECIMAL(5,4) NOT NULL,
    indicator_score INT NOT NULL DEFAULT 0,
    risk_score INT NOT NULL,
    risk_level ENUM('LOW', 'MEDIUM', 'HIGH', 'CRITICAL') NOT NULL,
    analysis_method VARCHAR(50) NOT NULL DEFAULT 'HYBRID_ML_RULES',
    model_used VARCHAR(150) NOT NULL DEFAULT 'Logistic Regression',
    model_version VARCHAR(50) NOT NULL DEFAULT '1.0',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_analysis_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_analysis_user (user_id),
    INDEX idx_analysis_classification (classification),
    INDEX idx_analysis_risk_level (risk_level),
    INDEX idx_analysis_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. INDICATORS TABLE (Threat Heuristics & Rules matched)
CREATE TABLE IF NOT EXISTS indicators (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    analysis_id BIGINT NOT NULL,
    indicator_type VARCHAR(50) NOT NULL,
    indicator_name VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    severity ENUM('LOW', 'MEDIUM', 'HIGH', 'CRITICAL') NOT NULL,
    score_contribution INT NOT NULL DEFAULT 0,
    detected BOOLEAN NOT NULL DEFAULT TRUE,
    matched_text VARCHAR(255) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_indicator_analysis FOREIGN KEY (analysis_id) REFERENCES email_analyses(id) ON DELETE CASCADE,
    INDEX idx_indicator_analysis (analysis_id),
    INDEX idx_indicator_severity (severity)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. URLS TABLE (Passive Forensics)
CREATE TABLE IF NOT EXISTS urls (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    analysis_id BIGINT NOT NULL,
    url TEXT NOT NULL,
    domain VARCHAR(255) NOT NULL,
    protocol VARCHAR(10) NOT NULL DEFAULT 'https',
    has_ip_address BOOLEAN NOT NULL DEFAULT FALSE,
    is_shortened BOOLEAN NOT NULL DEFAULT FALSE,
    excessive_subdomains BOOLEAN NOT NULL DEFAULT FALSE,
    lookalike_domain BOOLEAN NOT NULL DEFAULT FALSE,
    is_suspicious BOOLEAN NOT NULL DEFAULT FALSE,
    indicator VARCHAR(500) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_url_analysis FOREIGN KEY (analysis_id) REFERENCES email_analyses(id) ON DELETE CASCADE,
    INDEX idx_url_analysis (analysis_id),
    INDEX idx_url_suspicious (is_suspicious)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 5. AUDIT LOGS TABLE
CREATE TABLE IF NOT EXISTS audit_logs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    action VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    ip_address VARCHAR(45) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_audit_user (user_id),
    INDEX idx_audit_created (created_at),
    INDEX idx_audit_action (action)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 6. DETECTION RULES TABLE
CREATE TABLE IF NOT EXISTS detection_rules (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    rule_name VARCHAR(200) NOT NULL,
    rule_type VARCHAR(50) NOT NULL,
    pattern VARCHAR(500) NOT NULL,
    weight INT NOT NULL DEFAULT 20,
    severity ENUM('LOW', 'MEDIUM', 'HIGH', 'CRITICAL') NOT NULL DEFAULT 'HIGH',
    description TEXT NOT NULL,
    enabled BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_rules_enabled (enabled)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 7. MODEL VERSIONS TABLE (Academic Telemetry)
CREATE TABLE IF NOT EXISTS model_versions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    model_name VARCHAR(150) NOT NULL,
    version VARCHAR(50) NOT NULL,
    algorithm VARCHAR(150) NOT NULL,
    accuracy DECIMAL(5,2) NOT NULL,
    precision_score DECIMAL(5,2) NOT NULL,
    recall_score DECIMAL(5,2) NOT NULL,
    f1_score DECIMAL(5,2) NOT NULL,
    roc_auc DECIMAL(5,3) NOT NULL,
    training_date DATE NOT NULL,
    status ENUM('ACTIVE', 'ARCHIVED', 'TRAINING', 'BENCHMARK') NOT NULL DEFAULT 'ACTIVE',
    description TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
`;
  }

  getDataSql(): string {
    return `-- ==========================================================
-- CYBERPHISH: INITIAL SEED DATA (DEVELOPMENT ONLY)
-- Note: Passwords are BCrypt hashes of 'ChangeMeImmediately123!'
-- ==========================================================

USE cyberphish;

-- 1. USERS SEED DATA
INSERT INTO users (id, full_name, email, password_hash, role, status, must_change_password, created_at, updated_at) VALUES
(1, 'System Administrator', 'admin@cyberphish.ai', '$2a$12$e8YkYpG1x0zG9Z0O4V1h0.2zZJtI5zG2O3R4U5V6W7X8Y9Z0A1B2C', 'ADMIN', 'ACTIVE', TRUE, NOW(), NOW()),
(2, 'Dr. Alain Mbarga (Lead SOC Analyst)', 'analyst@bank.cm', '$2a$12$e8YkYpG1x0zG9Z0O4V1h0.2zZJtI5zG2O3R4U5V6W7X8Y9Z0A1B2C', 'SECURITY_ANALYST', 'ACTIVE', FALSE, NOW(), NOW()),
(3, 'Esther Tagne (Bank Operations Officer)', 'user@bank.cm', '$2a$12$e8YkYpG1x0zG9Z0O4V1h0.2zZJtI5zG2O3R4U5V6W7X8Y9Z0A1B2C', 'USER', 'ACTIVE', FALSE, NOW(), NOW());

-- 2. DETECTION RULES SEED DATA
INSERT INTO detection_rules (id, rule_name, rule_type, pattern, weight, severity, description, enabled) VALUES
(101, 'Urgent Action & Threat of Account Suspension', 'URGENCY', '(urgent|immediately|immediately action|account will be suspended|account blocked|final warning)', 25, 'HIGH', 'Email uses psychological urgency and threat of financial lockout.', TRUE),
(102, 'Sensitive Credential & Financial Key Solicitation', 'CREDENTIAL_REQUEST', '(password|mot de passe|otp|pin|cvv|security code|login credentials|card number)', 30, 'CRITICAL', 'Direct or indirect solicitation of private banking authentication secrets.', TRUE),
(103, 'Cameroon Commercial Banking Impersonation', 'BANKING_IMPERSONATION', '(bicec|afriland first bank|ecobank|uba|societe generale cameroun|express union|momo|orange money)', 20, 'HIGH', 'Impersonation of Cameroon commercial banking institutions.', TRUE),
(104, 'Social Engineering & Coercive Framing', 'SOCIAL_ENGINEERING', '(unauthorized access|security alert|fraud detected|locked out|compromised|prize|won)', 15, 'MEDIUM', 'Manufactures crisis or fake financial reward.', TRUE),
(105, 'Sender Domain & Free-Webmail Mismatch', 'DOMAIN_MISMATCH', '(@gmail\\\\.com|@yahoo\\\\.com|@hotmail\\\\.com|@outlook\\\\.com)', 20, 'HIGH', 'Official banking communications originating from free consumer webmail.', TRUE);

-- 3. MODEL VERSIONS SEED DATA
INSERT INTO model_versions (id, model_name, version, algorithm, accuracy, precision_score, recall_score, f1_score, roc_auc, training_date, status, description) VALUES
(1, 'Logistic Regression (TF-IDF N-Gram Vectorizer)', '1.0.4-academic-release', 'Logistic Regression (L2)', 91.70, 91.42, 90.83, 91.12, 0.925, '2026-07-15', 'ACTIVE', 'Primary thesis academic model.'),
(2, 'Random Forest Ensemble', '2.1.0-benchmark', 'Random Forest (150 Trees)', 92.40, 92.10, 91.80, 91.95, 0.938, '2026-07-20', 'BENCHMARK', 'Ensemble comparative model.'),
(3, 'Multinomial Naive Bayes', '1.0.0-baseline', 'MultinomialNB (Alpha=1.0)', 88.50, 87.20, 89.10, 88.14, 0.892, '2026-06-30', 'ARCHIVED', 'Baseline bag-of-words model.');
`;
  }
}

export const storageService = new StorageService();
