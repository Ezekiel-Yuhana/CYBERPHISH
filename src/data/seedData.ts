import { 
  AuditLog, 
  DetectionRule, 
  EmailAnalysis, 
  ModelVersion, 
  ThreatIntelligenceData, 
  User 
} from '../types';

export const INITIAL_USERS: User[] = [
  {
    id: 1,
    fullName: 'System Administrator',
    email: 'admin@cyberphish.ai',
    role: 'ADMIN',
    status: 'ACTIVE',
    mustChangePassword: true, // As specified in requirement #29
    createdAt: '2026-01-15T08:30:00Z',
    updatedAt: '2026-08-20T04:00:00Z',
    lastLogin: '2026-08-20T04:15:00Z'
  },
  {
    id: 2,
    fullName: 'Dr. Alain Mbarga (Lead SOC Analyst)',
    email: 'analyst@bank.cm',
    role: 'SECURITY_ANALYST',
    status: 'ACTIVE',
    mustChangePassword: false,
    createdAt: '2026-02-01T09:00:00Z',
    updatedAt: '2026-08-19T14:20:00Z',
    lastLogin: '2026-08-20T03:50:00Z'
  },
  {
    id: 3,
    fullName: 'Esther Tagne (Bank Operations Officer)',
    email: 'user@bank.cm',
    role: 'USER',
    status: 'ACTIVE',
    mustChangePassword: false,
    createdAt: '2026-02-10T11:15:00Z',
    updatedAt: '2026-08-18T10:00:00Z',
    lastLogin: '2026-08-19T16:30:00Z'
  }
];

export const INITIAL_RULES: DetectionRule[] = [
  {
    id: 101,
    ruleName: 'Urgent Action & Threat of Account Suspension',
    ruleType: 'URGENCY',
    pattern: '(urgent|immediately|immediately action|account will be suspended|account blocked|final warning|within 24 hours|within 12 hours|act now|compte suspendu|action requise)',
    weight: 25,
    severity: 'HIGH',
    description: 'Email uses psychological pressure and fear of loss/suspension to force hasty user action.',
    enabled: true,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z'
  },
  {
    id: 102,
    ruleName: 'Sensitive Credential & Financial Key Solicitation',
    ruleType: 'CREDENTIAL_REQUEST',
    pattern: '(password|mot de passe|otp|pin|cvv|security code|login credentials|identifiants|card number|carte bancaire|verification code)',
    weight: 30,
    severity: 'CRITICAL',
    description: 'Direct or indirect solicitation of private banking authentication secrets or one-time tokens.',
    enabled: true,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z'
  },
  {
    id: 103,
    ruleName: 'Cameroon Commercial Banking Institution Impersonation',
    ruleType: 'BANKING_IMPERSONATION',
    pattern: '(bicec|afriland first bank|ecobank|uba|societe generale cameroun|express union|mtn mobile money|orange money|momo|beac|cemac)',
    weight: 20,
    severity: 'HIGH',
    description: 'References Cameroon commercial banking brand names or regional electronic wallet gateways.',
    enabled: true,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z'
  },
  {
    id: 104,
    ruleName: 'Social Engineering & Coercive Framing',
    ruleType: 'SOCIAL_ENGINEERING',
    pattern: '(unauthorized access|security alert|fraud detected|locked out|compromised|prize|won|reward|heritage|remboursement)',
    weight: 15,
    severity: 'MEDIUM',
    description: 'Manufactures an artificial crisis or unearned financial incentive to bypass critical thinking.',
    enabled: true,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z'
  },
  {
    id: 105,
    ruleName: 'Sender Domain & Free-Webmail Mismatch',
    ruleType: 'DOMAIN_MISMATCH',
    pattern: '(@gmail\\.com|@yahoo\\.com|@hotmail\\.com|@outlook\\.com|@yopmail\\.com)',
    weight: 20,
    severity: 'HIGH',
    description: 'Claimed corporate financial communication originates from a generic public webmail domain.',
    enabled: true,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z'
  },
  {
    id: 106,
    ruleName: 'Malicious / Macro-Enabled File Attachments',
    ruleType: 'ATTACHMENT_RISK',
    pattern: '(\\.exe|\\.scr|\\.vbs|\\.bat|\\.docm|\\.xlsm|\\.iso|\\.zip)',
    weight: 25,
    severity: 'HIGH',
    description: 'Detection of executable binaries, scripts or macro-enabled documents masquerading as financial reports.',
    enabled: true,
    createdAt: '2026-01-10T00:00:00Z',
    updatedAt: '2026-01-10T00:00:00Z'
  }
];

export const INITIAL_MODELS: ModelVersion[] = [
  {
    id: 1,
    modelName: 'Logistic Regression (TF-IDF N-Gram Vectorizer)',
    version: '1.0.4-academic-release',
    algorithm: 'Logistic Regression with L2 Regularization',
    accuracy: 91.70,
    precisionScore: 91.42,
    recallScore: 90.83,
    f1Score: 91.12,
    rocAuc: 0.925,
    trainingDate: '2026-07-15',
    status: 'ACTIVE',
    description: 'Primary thesis academic model trained on Enron, Nazario Phishing Corpus, and Cameroon Commercial Banking targeted emails.'
  },
  {
    id: 2,
    modelName: 'Random Forest Ensemble',
    version: '2.1.0-benchmark',
    algorithm: 'Random Forest (150 Estimators, max_depth=25)',
    accuracy: 92.40,
    precisionScore: 92.10,
    recallScore: 91.80,
    f1Score: 91.95,
    rocAuc: 0.938,
    trainingDate: '2026-07-20',
    status: 'BENCHMARK',
    description: 'Comparative thesis benchmark model providing high tree diversity and non-linear decision boundary.'
  },
  {
    id: 3,
    modelName: 'Multinomial Naive Bayes',
    version: '1.0.0-baseline',
    algorithm: 'Multinomial Naive Bayes (Alpha=1.0)',
    accuracy: 88.50,
    precisionScore: 87.20,
    recallScore: 89.10,
    f1Score: 88.14,
    rocAuc: 0.892,
    trainingDate: '2026-06-30',
    status: 'ARCHIVED',
    description: 'Academic baseline model for probabilistic word frequency distribution.'
  },
  {
    id: 4,
    modelName: 'Linear Support Vector Machine (Linear SVM)',
    version: '1.2.0-experimental',
    algorithm: 'LinearSVC (C=1.0, hinge loss)',
    accuracy: 91.10,
    precisionScore: 90.95,
    recallScore: 90.50,
    f1Score: 90.72,
    rocAuc: 0.919,
    trainingDate: '2026-07-05',
    status: 'BENCHMARK',
    description: 'Maximal margin hyper-plane classifier evaluated in Chapter Four.'
  }
];

export const INITIAL_ANALYSES: EmailAnalysis[] = [
  {
    id: 948210,
    userId: 2,
    userName: 'Dr. Alain Mbarga',
    userEmail: 'analyst@bank.cm',
    senderEmail: 'security-alerts@bicec-auth-portal.net',
    recipientEmail: 'client.service@bank.cm',
    subject: 'URGENT: Your BICEC Bank account will be suspended within 24 hours',
    emailBody: 'Dear customer, We detected an unauthorized transaction attempt on your account. To prevent full suspension of your account, please verify your account immediately using the link below: http://194.26.29.112/bicec/login-verify. Enter your password and mobile OTP.',
    urls: [
      {
        id: 1,
        url: 'http://194.26.29.112/bicec/login-verify',
        domain: '194.26.29.112',
        protocol: 'http',
        hasIpAddress: true,
        isShortened: false,
        excessiveSubdomains: false,
        lookalikeDomain: true,
        isSuspicious: true,
        indicator: 'IP-based URL; Insecure HTTP; Lookalike domain targeting BICEC'
      }
    ],
    indicators: [
      {
        id: 1,
        indicatorType: 'URGENCY',
        indicatorName: 'Urgent Action & Threat of Account Suspension',
        description: 'Email uses psychological pressure and fear of suspension.',
        severity: 'HIGH',
        scoreContribution: 25,
        detected: true,
        matchedText: 'URGENT'
      },
      {
        id: 2,
        indicatorType: 'CREDENTIAL_REQUEST',
        indicatorName: 'Sensitive Credential & Financial Key Solicitation',
        description: 'Solicits password and mobile OTP.',
        severity: 'CRITICAL',
        scoreContribution: 30,
        detected: true,
        matchedText: 'password'
      },
      {
        id: 3,
        indicatorType: 'BANKING_IMPERSONATION',
        indicatorName: 'Cameroon Commercial Banking Institution Impersonation',
        description: 'Impersonates BICEC Bank.',
        severity: 'HIGH',
        scoreContribution: 20,
        detected: true,
        matchedText: 'BICEC'
      },
      {
        id: 4,
        indicatorType: 'SUSPICIOUS_URL',
        indicatorName: 'Malicious / Obfuscated Link Architecture',
        description: 'Raw IP address used instead of official registered bank domain.',
        severity: 'CRITICAL',
        scoreContribution: 35,
        detected: true,
        matchedText: 'http://194.26.29.112/bicec/login-verify'
      }
    ],
    classification: 'PHISHING',
    probability: 0.94,
    indicatorScore: 95,
    riskScore: 94,
    riskLevel: 'CRITICAL',
    analysisMethod: 'HYBRID_ML_RULES',
    modelUsed: 'Logistic Regression (TF-IDF N-Gram Vectorizer)',
    modelVersion: '1.0.4-academic-release',
    recommendations: [
      'DO NOT CLICK any links or open attachments.',
      'DO NOT PROVIDE your Password, PIN, OTP, or CVV.',
      'IMMEDIATELY REPORT this message to BICEC CSIRT (cert@bicec.com).',
      'Block the sender domain and host IP 194.26.29.112 on edge firewalls.'
    ],
    featuresExtracted: {
      wordCount: 38,
      urlCount: 1,
      suspiciousKeywordsFound: ['urgent', 'suspended', 'verify', 'password', 'otp', 'unauthorized'],
      urgencyKeywordsFound: ['URGENT', 'suspended'],
      bankingKeywordsFound: ['BICEC', 'account'],
      tfidfTopTerms: [
        { term: 'otp', weight: 3.12 },
        { term: 'password', weight: 2.85 },
        { term: 'suspended', weight: 2.45 },
        { term: 'urgent', weight: 2.14 }
      ]
    },
    createdAt: '2026-08-20T03:15:00Z'
  },
  {
    id: 948209,
    userId: 3,
    userName: 'Esther Tagne',
    userEmail: 'user@bank.cm',
    senderEmail: 'statements@official.afrilandfirstbank.com',
    recipientEmail: 'user@bank.cm',
    subject: 'Monthly Account Statement - July 2026',
    emailBody: 'Dear Valued Client, Your monthly account statement for July 2026 is now available in your official Afriland First Bank mobile application. For security reasons, we never ask for your PIN or password by email. Best regards, Afriland First Bank Customer Care.',
    urls: [
      {
        id: 2,
        url: 'https://www.afrilandfirstbank.com/portal',
        domain: 'afrilandfirstbank.com',
        protocol: 'https',
        hasIpAddress: false,
        isShortened: false,
        excessiveSubdomains: false,
        lookalikeDomain: false,
        isSuspicious: false,
        indicator: 'Official verified SSL domain'
      }
    ],
    indicators: [],
    classification: 'LEGITIMATE',
    probability: 0.05,
    indicatorScore: 0,
    riskScore: 4,
    riskLevel: 'LOW',
    analysisMethod: 'HYBRID_ML_RULES',
    modelUsed: 'Logistic Regression (TF-IDF N-Gram Vectorizer)',
    modelVersion: '1.0.4-academic-release',
    recommendations: [
      'This email does not exhibit common phishing indicators or signature patterns.',
      'Maintain standard cyber awareness when accessing e-banking services.'
    ],
    featuresExtracted: {
      wordCount: 42,
      urlCount: 1,
      suspiciousKeywordsFound: [],
      urgencyKeywordsFound: [],
      bankingKeywordsFound: ['Afriland First Bank'],
      tfidfTopTerms: [
        { term: 'monthly statement', weight: -2.60 },
        { term: 'customer care', weight: -1.10 },
        { term: 'best regards', weight: -1.05 }
      ]
    },
    createdAt: '2026-08-19T14:40:00Z'
  },
  {
    id: 948208,
    userId: 2,
    userName: 'Dr. Alain Mbarga',
    userEmail: 'analyst@bank.cm',
    senderEmail: 'mtn-momo-security@promos-cameroun.xyz',
    recipientEmail: 'merchant.finance@bank.cm',
    subject: 'Action Required: MTN MoMo Business Wallet PIN Renewal',
    emailBody: 'Your MTN Mobile Money merchant account has been flagged for compliance check. Send your current PIN and OTP to confirm identity or your wallet will be restricted. Click here: http://bit.ly/momo-cm-verify',
    urls: [
      {
        id: 3,
        url: 'http://bit.ly/momo-cm-verify',
        domain: 'bit.ly',
        protocol: 'http',
        hasIpAddress: false,
        isShortened: true,
        excessiveSubdomains: false,
        lookalikeDomain: false,
        isSuspicious: true,
        indicator: 'URL Shortener masked destination; Insecure HTTP'
      }
    ],
    indicators: [
      {
        id: 5,
        indicatorType: 'CREDENTIAL_REQUEST',
        indicatorName: 'Sensitive Credential & Financial Key Solicitation',
        description: 'Solicits merchant PIN and OTP tokens.',
        severity: 'CRITICAL',
        scoreContribution: 30,
        detected: true,
        matchedText: 'PIN and OTP'
      },
      {
        id: 6,
        indicatorType: 'URGENCY',
        indicatorName: 'Urgent Action & Threat of Account Suspension',
        description: 'Threatens wallet restriction.',
        severity: 'HIGH',
        scoreContribution: 25,
        detected: true,
        matchedText: 'Action Required'
      },
      {
        id: 7,
        indicatorType: 'SUSPICIOUS_URL',
        indicatorName: 'Malicious / Obfuscated Link Architecture',
        description: 'Bitly shortener hiding fraudulent gateway.',
        severity: 'HIGH',
        scoreContribution: 25,
        detected: true,
        matchedText: 'http://bit.ly/momo-cm-verify'
      }
    ],
    classification: 'PHISHING',
    probability: 0.91,
    indicatorScore: 80,
    riskScore: 88,
    riskLevel: 'CRITICAL',
    analysisMethod: 'HYBRID_ML_RULES',
    modelUsed: 'Logistic Regression (TF-IDF N-Gram Vectorizer)',
    modelVersion: '1.0.4-academic-release',
    recommendations: [
      'DO NOT submit Mobile Money PIN or OTPs.',
      'Report fraud attempt to MTN Cameroon (111 / fraud@mtn.cm).'
    ],
    createdAt: '2026-08-19T09:20:00Z'
  },
  {
    id: 948207,
    userId: 3,
    userName: 'Esther Tagne',
    userEmail: 'user@bank.cm',
    senderEmail: 'notifications@ecobank-support-desk.com',
    recipientEmail: 'user@bank.cm',
    subject: 'Ecobank Omni Lite: New Payment Batch Pending Confirmation',
    emailBody: 'A new wire transfer of 4,850,000 XAF has been scheduled. If you did not initiate this transaction, review the batch immediately at http://ecobank-cm-auth.click/batch/view.',
    urls: [
      {
        id: 4,
        url: 'http://ecobank-cm-auth.click/batch/view',
        domain: 'ecobank-cm-auth.click',
        protocol: 'http',
        hasIpAddress: false,
        isShortened: false,
        excessiveSubdomains: false,
        lookalikeDomain: true,
        isSuspicious: true,
        indicator: 'Lookalike Ecobank domain with suspicious .click TLD'
      }
    ],
    indicators: [
      {
        id: 8,
        indicatorType: 'BANKING_IMPERSONATION',
        indicatorName: 'Cameroon Commercial Banking Institution Impersonation',
        description: 'Impersonates Ecobank Cameroon Omni Lite e-banking system.',
        severity: 'HIGH',
        scoreContribution: 20,
        detected: true,
        matchedText: 'Ecobank'
      },
      {
        id: 9,
        indicatorType: 'SUSPICIOUS_URL',
        indicatorName: 'Malicious / Obfuscated Link Architecture',
        description: 'Unregistered domain ecobank-cm-auth.click with .click TLD.',
        severity: 'CRITICAL',
        scoreContribution: 35,
        detected: true,
        matchedText: 'http://ecobank-cm-auth.click/batch/view'
      }
    ],
    classification: 'PHISHING',
    probability: 0.86,
    indicatorScore: 65,
    riskScore: 80,
    riskLevel: 'CRITICAL',
    analysisMethod: 'HYBRID_ML_RULES',
    modelUsed: 'Logistic Regression (TF-IDF N-Gram Vectorizer)',
    modelVersion: '1.0.4-academic-release',
    recommendations: [
      'Do not click the transaction link.',
      'Log into the official Ecobank Omni portal independently via saved bookmarks.'
    ],
    createdAt: '2026-08-18T16:10:00Z'
  },
  {
    id: 948206,
    userId: 2,
    userName: 'Dr. Alain Mbarga',
    userEmail: 'analyst@bank.cm',
    senderEmail: 'internal-memo@bank.cm',
    recipientEmail: 'all-staff@bank.cm',
    subject: 'Quarterly Cybersecurity Training Schedule & Guidelines',
    emailBody: 'Team, Please find the schedule for next week’s internal cybersecurity workshop on defending against spear phishing attacks. Attendance is mandatory for all branches. Regards, IT Security Division.',
    urls: [],
    indicators: [],
    classification: 'LEGITIMATE',
    probability: 0.02,
    indicatorScore: 0,
    riskScore: 2,
    riskLevel: 'LOW',
    analysisMethod: 'HYBRID_ML_RULES',
    modelUsed: 'Logistic Regression (TF-IDF N-Gram Vectorizer)',
    modelVersion: '1.0.4-academic-release',
    recommendations: [
      'Authentic internal corporate communication.'
    ],
    createdAt: '2026-08-18T11:00:00Z'
  },
  {
    id: 948205,
    userId: 3,
    userName: 'Esther Tagne',
    userEmail: 'user@bank.cm',
    senderEmail: 'service@sgcameroun-reclamations.work',
    recipientEmail: 'user@bank.cm',
    subject: 'SG Cameroun: Unresolved Complaint & Compensation',
    emailBody: 'You have been awarded a refund of 85,000 XAF for automated ATM service disruption. Claim your voucher within 12 hours.',
    urls: [
      {
        id: 5,
        url: 'http://sgcameroun-reclamations.work/claim',
        domain: 'sgcameroun-reclamations.work',
        protocol: 'http',
        hasIpAddress: false,
        isShortened: false,
        excessiveSubdomains: false,
        lookalikeDomain: true,
        isSuspicious: true,
        indicator: 'Impersonates Société Générale Cameroun with .work TLD'
      }
    ],
    indicators: [
      {
        id: 10,
        indicatorType: 'SOCIAL_ENGINEERING',
        indicatorName: 'Social Engineering & Coercive Framing',
        description: 'Lures victim with false compensation claim.',
        severity: 'MEDIUM',
        scoreContribution: 15,
        detected: true,
        matchedText: 'awarded a refund'
      },
      {
        id: 11,
        indicatorType: 'URGENCY',
        indicatorName: 'Urgent Action & Threat of Account Suspension',
        description: '12 hours scarcity trigger.',
        severity: 'MEDIUM',
        scoreContribution: 15,
        detected: true,
        matchedText: 'within 12 hours'
      }
    ],
    classification: 'SUSPICIOUS',
    probability: 0.58,
    indicatorScore: 45,
    riskScore: 54,
    riskLevel: 'MEDIUM',
    analysisMethod: 'HYBRID_ML_RULES',
    modelUsed: 'Logistic Regression (TF-IDF N-Gram Vectorizer)',
    modelVersion: '1.0.4-academic-release',
    recommendations: [
      'Verify compensation with official Société Générale Cameroun branch before interacting.'
    ],
    createdAt: '2026-08-17T15:30:00Z'
  }
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 1,
    userId: 1,
    userName: 'System Administrator',
    userRole: 'ADMIN',
    action: 'USER_LOGIN',
    description: 'Admin user logged in successfully from secure IP subnet.',
    ipAddress: '197.239.67.42',
    createdAt: '2026-08-20T04:15:00Z'
  },
  {
    id: 2,
    userId: 2,
    userName: 'Dr. Alain Mbarga',
    userRole: 'SECURITY_ANALYST',
    action: 'EMAIL_ANALYSIS',
    description: 'Analyzed incoming email targeting BICEC banking clients (Score: 94/100, CRITICAL).',
    ipAddress: '197.239.67.55',
    createdAt: '2026-08-20T03:15:00Z'
  },
  {
    id: 3,
    userId: 1,
    userName: 'System Administrator',
    userRole: 'ADMIN',
    action: 'RULE_MODIFICATION',
    description: 'Updated pattern weights on "Cameroon Commercial Banking Institution Impersonation" rule.',
    ipAddress: '197.239.67.42',
    createdAt: '2026-08-19T18:00:00Z'
  },
  {
    id: 4,
    userId: 2,
    userName: 'Dr. Alain Mbarga',
    userRole: 'SECURITY_ANALYST',
    action: 'REPORT_GENERATION',
    description: 'Generated and exported forensic PDF report for Analysis #948208.',
    ipAddress: '197.239.67.55',
    createdAt: '2026-08-19T09:30:00Z'
  },
  {
    id: 5,
    userId: 1,
    userName: 'System Administrator',
    userRole: 'ADMIN',
    action: 'MODEL_EVALUATION',
    description: 'Evaluated Logistic Regression model metrics against validation test set (Accuracy: 91.70%).',
    ipAddress: '197.239.67.42',
    createdAt: '2026-08-18T14:00:00Z'
  }
];

export const INITIAL_THREAT_INTEL: ThreatIntelligenceData = {
  topKeywords: [
    { keyword: 'OTP / Verification Code', count: 184, riskLevel: 'CRITICAL' },
    { keyword: 'Account Suspended / Blocked', count: 142, riskLevel: 'HIGH' },
    { keyword: 'PIN / Password Request', count: 128, riskLevel: 'CRITICAL' },
    { keyword: 'Afriland / BICEC Impersonation', count: 96, riskLevel: 'HIGH' },
    { keyword: 'MTN MoMo / Orange Money Transfer', count: 88, riskLevel: 'HIGH' },
    { keyword: 'Unrecognized Wire Transfer', count: 64, riskLevel: 'MEDIUM' }
  ],
  targetedInstitutions: [
    { name: 'BICEC (Banque Internationale du Cameroun)', attacksBlocked: 142, country: 'Cameroon (CEMAC)', risk: 'CRITICAL' },
    { name: 'Afriland First Bank Cameroon', attacksBlocked: 128, country: 'Cameroon (CEMAC)', risk: 'HIGH' },
    { name: 'Ecobank Cameroon', attacksBlocked: 94, country: 'Cameroon / Pan-Africa', risk: 'HIGH' },
    { name: 'Société Générale Cameroun (SGC)', attacksBlocked: 76, country: 'Cameroon', risk: 'MEDIUM' },
    { name: 'UBA Cameroon (United Bank for Africa)', attacksBlocked: 62, country: 'Cameroon', risk: 'MEDIUM' },
    { name: 'Express Union & Mobile Wallets', attacksBlocked: 110, country: 'Cameroon & Regional', risk: 'CRITICAL' }
  ],
  suspiciousDomains: [
    { domain: 'bicec-auth-portal.net', detectedCount: 38, category: 'Lookalike Phishing Domain', firstSeen: '2026-08-01' },
    { domain: 'afriland-portal-securite.com', detectedCount: 29, category: 'Credential Harvester', firstSeen: '2026-08-05' },
    { domain: '194.26.29.112', detectedCount: 44, category: 'Direct IP Phishing Host', firstSeen: '2026-07-28' },
    { domain: 'ecobank-cm-auth.click', detectedCount: 19, category: 'Malicious Subdomain/TLD', firstSeen: '2026-08-10' },
    { domain: 'momo-cameroun-validation.xyz', detectedCount: 52, category: 'Mobile Money Interception', firstSeen: '2026-08-12' }
  ],
  attackTechniques: [
    { technique: 'Credential Harvesting via Lookalike Portals', frequency: 46, severity: 'CRITICAL', mitreAttckId: 'T1566.002' },
    { technique: 'Social Engineering Urgency & Account Threat', frequency: 32, severity: 'HIGH', mitreAttckId: 'T1566.001' },
    { technique: 'URL Shorteners & Direct IP Redirection', frequency: 28, severity: 'HIGH', mitreAttckId: 'T1027' },
    { technique: 'Free Webmail Sender Domain Spoofing', frequency: 22, severity: 'MEDIUM', mitreAttckId: 'T1585.002' }
  ],
  recentTrends: [
    { week: 'Week 1 (Aug)', credentialHarvesting: 32, urgencyScams: 25, maliciousLinks: 18 },
    { week: 'Week 2 (Aug)', credentialHarvesting: 45, urgencyScams: 38, maliciousLinks: 29 },
    { week: 'Week 3 (Aug)', credentialHarvesting: 58, urgencyScams: 42, maliciousLinks: 36 },
    { week: 'Week 4 (Aug)', credentialHarvesting: 49, urgencyScams: 31, maliciousLinks: 24 }
  ]
};

// Academic Sample Test Cases for One-Click Demonstration
export const SAMPLE_TEST_CASES = [
  {
    title: 'Test Case 1 (Phishing - Urgent Account Suspension)',
    sender: 'security-service@bank-alert-verify.com',
    recipient: 'client@bank.cm',
    subject: 'URGENT: Your bank account will be suspended',
    body: 'Dear customer, We have observed irregular login activities on your bank account. Verify your account immediately using the link below to avoid permanent suspension: http://185.193.64.22/verify/account. Provide your access codes.',
    urls: 'http://185.193.64.22/verify/account'
  },
  {
    title: 'Test Case 2 (Legitimate - Monthly Account Statement)',
    sender: 'statements@official.afrilandfirstbank.com',
    recipient: 'client@bank.cm',
    subject: 'Monthly Account Statement',
    body: 'Your monthly statement is now available in your official banking application. Please log in to your authenticated mobile banking portal to review your transaction summary. Best regards, Customer Service Team.',
    urls: 'https://www.afrilandfirstbank.com'
  },
  {
    title: 'Test Case 3 (Phishing - OTP and PIN Request)',
    sender: 'auth-manager@security-cemac.xyz',
    recipient: 'finance@bank.cm',
    subject: 'Your OTP is required immediately',
    body: 'Send your OTP and PIN to prevent your account from being blocked. A debit of 350,000 XAF is currently on hold. Confirm transaction authorization code now at http://bit.ly/cemac-otp-gate.',
    urls: 'http://bit.ly/cemac-otp-gate'
  },
  {
    title: 'Test Case 4 (Cameroon Banking - Ecobank Omni Wire Scam)',
    sender: 'operations@ecobank-cm-auth.click',
    recipient: 'merchant.treasury@bank.cm',
    subject: 'Ecobank Omni: Unauthorized International Wire Detected',
    emailBody: 'Attention: An unauthorized international wire of 12,500,000 XAF has been triggered on your corporate account. Log into the Ecobank cancellation server at http://194.26.29.112/ecobank/cancel within 15 minutes or funds will clear.',
    urls: 'http://194.26.29.112/ecobank/cancel'
  }
];
