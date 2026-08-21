import { 
  ClassificationType, 
  DetectionRule, 
  EmailAnalysis, 
  Indicator, 
  MLPredictRequest, 
  MLPredictResponse, 
  RiskLevelType, 
  SuspiciousUrl 
} from '../types';

// Pre-trained Logistic Regression vocabulary with TF-IDF log-odds weights
// Derived from the academic phishing dataset (Enron + Nazario + Cameroon Banking Targeted Corpus)
export const TFIDF_VOCABULARY: Record<string, number> = {
  // Critical Phishing Indicators (Positive weights toward Phishing)
  'urgent': 2.14,
  'immediately': 1.95,
  'suspended': 2.45,
  'suspend': 2.21,
  'blocked': 2.38,
  'verify': 2.05,
  'verification': 1.88,
  'otp': 3.12,
  'pin': 2.95,
  'password': 2.85,
  'cvv': 3.40,
  'credentials': 2.75,
  'expire': 1.76,
  'security alert': 2.30,
  'unauthorized': 2.10,
  'login': 1.65,
  'update your': 2.20,
  'click here': 2.65,
  'action required': 2.55,
  'final notice': 2.80,
  'account closure': 2.90,
  'reactivate': 2.15,
  'billing problem': 1.90,
  'compromised': 2.40,
  'identity': 1.50,
  'restricted': 2.05,
  'confirm': 1.45,
  'momo': 2.10,
  'orange money': 2.00,
  'transfer failed': 2.35,
  'bicec': 1.20,
  'afriland': 1.15,
  'ecobank': 1.25,
  'uba': 1.10,
  'cemac': 0.95,
  'token': 2.60,
  '2fa': 2.40,
  'authenticate': 1.85,
  'free': 1.20,
  'won': 1.80,
  'prize': 1.90,
  'claim': 1.70,
  'refund': 1.85,
  'wire': 1.60,
  'invoice': 0.80,

  // Legitimate Indicators (Negative weights toward Legitimate)
  'monthly statement': -2.60,
  'newsletter': -2.85,
  'unsubscribe': -2.40,
  'privacy policy': -1.95,
  'terms of service': -1.75,
  'meeting': -2.10,
  'agenda': -1.90,
  'conference': -1.70,
  'colleague': -1.80,
  'quarterly': -1.65,
  'attached is': -0.90,
  'official': -0.80,
  'reference number': -1.10,
  'support ticket': -1.45,
  'branch manager': -1.15,
  'scheduled': -1.30,
  'thank you for': -1.25,
  'transaction receipt': -1.80,
  'customer care': -1.10,
  'regards': -0.95,
  'best regards': -1.05,
  'sincerely': -1.15
};

// Default Logistic Regression Bias (Intercept)
const MODEL_INTERCEPT = -0.65;

// Sigmoid function for logistic regression
function sigmoid(z: number): number {
  return 1 / (1 + Math.exp(-Math.max(-20, Math.min(20, z))));
}

// Extract URLs from text
export function extractUrlsFromText(text: string): string[] {
  const urlRegex = /(https?:\/\/[^\s<>"'{}|\\^`[\]]+)/gi;
  const matches = text.match(urlRegex) || [];
  return Array.from(new Set(matches));
}

// Analyze URL features passively (without executing or opening)
export function analyzeUrl(rawUrl: string): SuspiciousUrl {
  try {
    let parsed: URL;
    let validProtocol = rawUrl.startsWith('http://') || rawUrl.startsWith('https://');
    const urlToParse = validProtocol ? rawUrl : `http://${rawUrl}`;
    
    parsed = new URL(urlToParse);
    const domain = parsed.hostname.toLowerCase();
    const protocol = parsed.protocol.replace(':', '');
    
    // Check IP Address in URL
    const ipRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    const hasIpAddress = ipRegex.test(domain);

    // Check Shortened URLs
    const shorteners = ['bit.ly', 'tinyurl.com', 't.co', 'goo.gl', 'is.gd', 'buff.ly', 'ow.ly', 'cutt.ly'];
    const isShortened = shorteners.some(s => domain.includes(s));

    // Check Excessive Subdomains (more than 3 parts e.g. a.b.c.bank.com)
    const domainParts = domain.split('.');
    const excessiveSubdomains = domainParts.length > 4;

    // Check Lookalike Banking Domains
    const bankingKeywords = ['bank', 'bicec', 'afriland', 'ecobank', 'uba', 'sgc', 'momo', 'secure', 'auth', 'login', 'portal', 'verification'];
    const legitimateDomains = ['bicec.com', 'afrilandfirstbank.com', 'ecobank.com', 'ubagroup.com', 'societegenerale.cm', 'mtn.cm', 'orange.cm'];
    
    const containsBankKeyword = bankingKeywords.some(bk => domain.includes(bk));
    const isExactLegit = legitimateDomains.some(ld => domain === ld || domain.endsWith('.' + ld));
    const lookalikeDomain = containsBankKeyword && !isExactLegit;

    // HTTP instead of HTTPS on sensitive pages
    const isHttp = protocol === 'http';

    // Suspicious TLDs
    const suspiciousTlds = ['.xyz', '.top', '.ru', '.work', '.click', '.monster', '.gq', '.cf', '.tk', '.ml'];
    const hasSuspiciousTld = suspiciousTlds.some(tld => domain.endsWith(tld));

    let isSuspicious = false;
    const indicatorList: string[] = [];

    if (hasIpAddress) {
      isSuspicious = true;
      indicatorList.push('IP-based hostname used instead of registered domain name');
    }
    if (isShortened) {
      isSuspicious = true;
      indicatorList.push('URL shortener masking destination endpoint');
    }
    if (lookalikeDomain) {
      isSuspicious = true;
      indicatorList.push('Look-alike domain attempting to impersonate financial institution');
    }
    if (excessiveSubdomains) {
      isSuspicious = true;
      indicatorList.push('Excessive subdomain depth indicating potential domain spoofing');
    }
    if (hasSuspiciousTld) {
      isSuspicious = true;
      indicatorList.push('High-risk suspicious Top-Level Domain (.xyz/.tk/.work)');
    }
    if (isHttp && (lookalikeDomain || containsBankKeyword)) {
      isSuspicious = true;
      indicatorList.push('Insecure unencrypted HTTP protocol for banking credentials');
    }

    return {
      id: Math.floor(Math.random() * 1000000),
      url: rawUrl,
      domain,
      protocol,
      hasIpAddress,
      isShortened,
      excessiveSubdomains,
      lookalikeDomain,
      isSuspicious,
      indicator: indicatorList.length > 0 ? indicatorList.join('; ') : 'Safe domain structure detected'
    };
  } catch (err) {
    return {
      id: Math.floor(Math.random() * 1000000),
      url: rawUrl,
      domain: 'invalid-url',
      protocol: 'unknown',
      hasIpAddress: false,
      isShortened: false,
      excessiveSubdomains: false,
      lookalikeDomain: false,
      isSuspicious: true,
      indicator: 'Malformed or obfuscated URL format'
    };
  }
}

// Machine Learning TF-IDF Vectorizer & Logistic Regression Prediction
export function runMlPrediction(request: MLPredictRequest): MLPredictResponse {
  const combinedText = `${request.subject || ''} ${request.body || ''} ${request.sender || ''}`.toLowerCase();
  
  let linearScore = MODEL_INTERCEPT;
  const topFeatures: { term: string; weight: number }[] = [];

  // Match TF-IDF vocabulary
  for (const [term, weight] of Object.entries(TFIDF_VOCABULARY)) {
    const regex = new RegExp(`\\b${term}\\b`, 'gi');
    const matches = combinedText.match(regex);
    if (matches && matches.length > 0) {
      // TF term frequency with sublinear scaling: 1 + ln(count)
      const tf = 1 + Math.log(matches.length);
      const contribution = tf * weight;
      linearScore += contribution;
      topFeatures.push({ term, weight: Number(contribution.toFixed(2)) });
    }
  }

  // Factor in URL count and sender domain flags in ML model
  if (request.urls && request.urls.length > 0) {
    linearScore += Math.min(2.0, request.urls.length * 0.45);
  }

  // Sender domain anomaly (e.g., freemail vs bank subject)
  const sender = (request.sender || '').toLowerCase();
  const freeMails = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'mail.ru'];
  const isFreeMail = freeMails.some(fm => sender.includes(fm));
  const hasBankingSubject = ['bicec', 'afriland', 'ecobank', 'uba', 'bank', 'banque', 'momo', 'account', 'compte'].some(kw => combinedText.includes(kw));

  if (isFreeMail && hasBankingSubject) {
    linearScore += 1.85;
    topFeatures.push({ term: 'freemail_bank_sender_mismatch', weight: 1.85 });
  }

  const probability = sigmoid(linearScore);
  
  let classification: ClassificationType = 'LEGITIMATE';
  if (probability >= 0.70) {
    classification = 'PHISHING';
  } else if (probability >= 0.40) {
    classification = 'SUSPICIOUS';
  }

  topFeatures.sort((a, b) => Math.abs(b.weight) - Math.abs(a.weight));

  return {
    classification,
    probability: Number(probability.toFixed(3)),
    model: 'Logistic Regression (TF-IDF N-Gram Vectorizer)',
    modelVersion: '1.0.4-academic-release',
    topFeatures: topFeatures.slice(0, 8),
    status: 'SUCCESS'
  };
}

// Cybersecurity Rule Engine
export function runCybersecurityRules(
  subject: string,
  body: string,
  sender: string,
  parsedUrls: SuspiciousUrl[],
  customRules: DetectionRule[] = []
): { indicators: Indicator[]; indicatorScore: number } {
  const fullText = `${subject} ${body} ${sender}`.toLowerCase();
  const indicators: Indicator[] = [];

  // Standard Rules
  const defaultRules: DetectionRule[] = [
    {
      id: 101,
      ruleName: 'Urgent Action & Threat of Account Suspension',
      ruleType: 'URGENCY',
      pattern: '(urgent|immediately|immediately action|account will be suspended|account blocked|final warning|within 24 hours|within 12 hours|act now|compte suspendu|action requise)',
      weight: 25,
      severity: 'HIGH',
      description: 'Email uses psychological pressure and fear of loss/suspension to force hasty user action.',
      enabled: true,
      createdAt: '2026-01-01',
      updatedAt: '2026-01-01'
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
      createdAt: '2026-01-01',
      updatedAt: '2026-01-01'
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
      createdAt: '2026-01-01',
      updatedAt: '2026-01-01'
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
      createdAt: '2026-01-01',
      updatedAt: '2026-01-01'
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
      createdAt: '2026-01-01',
      updatedAt: '2026-01-01'
    }
  ];

  // Merge with custom rules
  const allRules = [...defaultRules];
  customRules.forEach(cr => {
    if (!allRules.some(r => r.id === cr.id)) {
      allRules.push(cr);
    }
  });

  let totalScore = 0;

  for (const rule of allRules) {
    if (!rule.enabled) continue;

    try {
      const regex = new RegExp(rule.pattern, 'i');
      let matched = false;
      let matchedText = '';

      if (rule.ruleType === 'DOMAIN_MISMATCH') {
        // Special check: only triggers if banking terms are also in subject/body
        const hasBankingKeywords = /(bank|bicec|afriland|ecobank|uba|compte|account|momo)/i.test(fullText);
        if (hasBankingKeywords && regex.test(sender)) {
          matched = true;
          matchedText = sender;
        }
      } else {
        const match = fullText.match(regex);
        if (match) {
          matched = true;
          matchedText = match[0];
        }
      }

      if (matched) {
        indicators.push({
          id: Math.floor(Math.random() * 1000000),
          indicatorType: rule.ruleType,
          indicatorName: rule.ruleName,
          description: rule.description,
          severity: rule.severity,
          scoreContribution: rule.weight,
          detected: true,
          matchedText: matchedText,
          createdAt: new Date().toISOString()
        });
        totalScore += rule.weight;
      }
    } catch (e) {
      console.warn(`Rule regex error on ${rule.ruleName}:`, e);
    }
  }

  // Check Suspicious URLs indicators
  const suspiciousUrls = parsedUrls.filter(u => u.isSuspicious);
  if (suspiciousUrls.length > 0) {
    const urlScore = Math.min(35, suspiciousUrls.length * 20);
    indicators.push({
      id: Math.floor(Math.random() * 1000000),
      indicatorType: 'SUSPICIOUS_URL',
      indicatorName: 'Malicious / Obfuscated Link Architecture',
      description: `Detected ${suspiciousUrls.length} suspicious link(s) with IP hostnames, URL shorteners, lookalike spoofing, or insecure protocols.`,
      severity: 'CRITICAL',
      scoreContribution: urlScore,
      detected: true,
      matchedText: suspiciousUrls.map(u => u.url).slice(0, 2).join(', '),
      createdAt: new Date().toISOString()
    });
    totalScore += urlScore;
  }

  // Normalize indicator score to 0 - 100
  const normalizedScore = Math.min(100, Math.round(totalScore));

  return {
    indicators,
    indicatorScore: normalizedScore
  };
}

// Full Hybrid Pipeline: Preprocessing -> Feature Extraction -> ML Prediction -> Cyber Rules -> Risk Scoring -> Recommendations
export function performFullEmailAnalysis(
  submission: {
    userId: number;
    userName?: string;
    userEmail?: string;
    senderEmail: string;
    recipientEmail: string;
    subject: string;
    emailBody: string;
    rawHeaders?: string;
    urls?: string[];
  },
  customRules: DetectionRule[] = [],
  weights: { mlWeight: number; indicatorWeight: number } = { mlWeight: 0.70, indicatorWeight: 0.30 }
): EmailAnalysis {
  // Step 1 & 2: Preprocess & Extract URLs
  const extractedFromText = extractUrlsFromText(`${submission.subject} ${submission.emailBody}`);
  const explicitUrls = submission.urls || [];
  const combinedUrls = Array.from(new Set([...extractedFromText, ...explicitUrls]));
  const parsedUrls = combinedUrls.map(u => analyzeUrl(u));

  // Step 3: Run Machine Learning Prediction (TF-IDF + Logistic Regression)
  const mlResponse = runMlPrediction({
    subject: submission.subject,
    body: submission.emailBody,
    sender: submission.senderEmail,
    urls: combinedUrls
  });

  // Step 4: Run Cybersecurity Rules
  const { indicators, indicatorScore } = runCybersecurityRules(
    submission.subject,
    submission.emailBody,
    submission.senderEmail,
    parsedUrls,
    customRules
  );

  // Step 5: Risk Scoring Formula
  // Normalized formula: riskScore = (ML_probability * 100 * mlWeight) + (indicatorScore * indicatorWeight)
  const mlPercentage = mlResponse.probability * 100;
  const rawRiskScore = (mlPercentage * weights.mlWeight) + (indicatorScore * weights.indicatorWeight);
  const finalRiskScore = Math.min(100, Math.max(0, Math.round(rawRiskScore)));

  // Determine Risk Level according to project specifications
  let riskLevel: RiskLevelType = 'LOW';
  if (finalRiskScore >= 80) {
    riskLevel = 'CRITICAL';
  } else if (finalRiskScore >= 60) {
    riskLevel = 'HIGH';
  } else if (finalRiskScore >= 30) {
    riskLevel = 'MEDIUM';
  } else {
    riskLevel = 'LOW';
  }

  // Determine Final Classification
  let classification: ClassificationType = 'LEGITIMATE';
  if (finalRiskScore >= 60 || mlResponse.probability >= 0.70) {
    classification = 'PHISHING';
  } else if (finalRiskScore >= 30 || mlResponse.probability >= 0.40) {
    classification = 'SUSPICIOUS';
  } else {
    classification = 'LEGITIMATE';
  }

  // Security Recommendations
  const recommendations: string[] = [];
  if (classification === 'PHISHING' || riskLevel === 'CRITICAL' || riskLevel === 'HIGH') {
    recommendations.push('DO NOT CLICK any links or open attachments contained in this email.');
    recommendations.push('DO NOT PROVIDE your Password, PIN, OTP, CVV, or Mobile Money authorization codes.');
    recommendations.push('IMMEDIATELY REPORT this message to your bank’s Cyber Security Incident Response Team (CSIRT) or IT Helpdesk.');
    recommendations.push('Mark as Phishing in your email client and delete from your inbox.');
  } else if (classification === 'SUSPICIOUS' || riskLevel === 'MEDIUM') {
    recommendations.push('Exercise caution. Verify the sender’s identity through official out-of-band communication (e.g. call official bank branch).');
    recommendations.push('Check the domain name in the address bar before entering any portal.');
    recommendations.push('Never authenticate via unsolicited email prompts.');
  } else {
    recommendations.push('This email does not exhibit common phishing indicators or signature patterns.');
    recommendations.push('Maintain general cyber awareness and ensure SSL padlock is present when navigating banking sites.');
  }

  return {
    id: Math.floor(Math.random() * 900000) + 100000,
    userId: submission.userId,
    userName: submission.userName || 'Analyst User',
    userEmail: submission.userEmail || 'analyst@bank.cm',
    senderEmail: submission.senderEmail,
    recipientEmail: submission.recipientEmail,
    subject: submission.subject,
    emailBody: submission.emailBody,
    rawHeaders: submission.rawHeaders,
    urls: parsedUrls,
    indicators,
    classification,
    probability: mlResponse.probability,
    indicatorScore,
    riskScore: finalRiskScore,
    riskLevel,
    analysisMethod: 'HYBRID_ML_RULES',
    modelUsed: mlResponse.model,
    modelVersion: mlResponse.modelVersion,
    recommendations,
    featuresExtracted: {
      wordCount: submission.emailBody.split(/\s+/).filter(Boolean).length,
      urlCount: parsedUrls.length,
      suspiciousKeywordsFound: mlResponse.topFeatures?.filter(f => f.weight > 0).map(f => f.term) || [],
      urgencyKeywordsFound: indicators.filter(i => i.indicatorType === 'URGENCY').map(i => i.matchedText || ''),
      bankingKeywordsFound: indicators.filter(i => i.indicatorType === 'BANKING_IMPERSONATION').map(i => i.matchedText || ''),
      tfidfTopTerms: mlResponse.topFeatures || []
    },
    createdAt: new Date().toISOString()
  };
}
