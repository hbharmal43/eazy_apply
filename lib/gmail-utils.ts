// website/lib/gmail-utils.ts
// Gmail compose URL generation with proper encoding and safety checks

const GMAIL_COMPOSE_BASE = 'https://mail.google.com/mail/u';
const MAX_URL_LENGTH = 8192; // Browser URL length limit
const MAX_BODY_LENGTH_FOR_URL = 1800; // Conservative limit for Gmail URLs

export interface GmailComposeOptions {
  to: string[];
  cc?: string[];
  bcc?: string[];
  subject: string;
  body: string;
  accountIndex?: number; // 0, 1, 2... for multiple Gmail accounts
}

export interface EmailProvider {
  name: string;
  icon: string;
  buildUrl: (options: GmailComposeOptions) => string;
  maxBodyLength: number;
}

// Sanitize email addresses
function sanitizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

// Sanitize and truncate text for URLs
function sanitizeForUrl(text: string, maxLength?: number): string {
  let sanitized = text
    .replace(/[\r\n]/g, '\n') // Normalize line breaks
    .replace(/\n{3,}/g, '\n\n') // Limit consecutive line breaks
    .trim();
  
  if (maxLength && sanitized.length > maxLength) {
    sanitized = sanitized.substring(0, maxLength - 3) + '...';
  }
  
  return sanitized;
}

// Build Gmail compose URL with proper encoding
export function buildGmailComposeUrl(options: GmailComposeOptions): string {
  const {
    to = [],
    cc = [],
    bcc = [],
    subject = '',
    body = '',
    accountIndex = 0
  } = options;

  // Validate inputs
  if (to.length === 0) {
    throw new Error('At least one recipient is required');
  }

  // Sanitize email addresses
  const sanitizedTo = to.map(sanitizeEmail).filter(Boolean);
  const sanitizedCc = cc?.map(sanitizeEmail).filter(Boolean) || [];
  const sanitizedBcc = bcc?.map(sanitizeEmail).filter(Boolean) || [];

  // Sanitize text content
  const sanitizedSubject = sanitizeForUrl(subject, 200);
  const sanitizedBody = sanitizeForUrl(body, MAX_BODY_LENGTH_FOR_URL);

  // Build URL with URLSearchParams for proper encoding
  const baseUrl = `${GMAIL_COMPOSE_BASE}/${accountIndex}/`;
  const params = new URLSearchParams();

  // Set Gmail-specific parameters
  params.set('fs', '1'); // Full screen
  params.set('tf', 'cm'); // Compose mode

  // Add recipients
  if (sanitizedTo.length > 0) {
    params.set('to', sanitizedTo.join(','));
  }
  
  if (sanitizedCc.length > 0) {
    params.set('cc', sanitizedCc.join(','));
  }
  
  if (sanitizedBcc.length > 0) {
    params.set('bcc', sanitizedBcc.join(','));
  }

  // Add subject and body
  if (sanitizedSubject) {
    params.set('su', sanitizedSubject);
  }
  
  if (sanitizedBody) {
    params.set('body', sanitizedBody);
  }

  const finalUrl = `${baseUrl}?${params.toString()}`;

  // Check URL length
  if (finalUrl.length > MAX_URL_LENGTH) {
    throw new Error(`Generated URL too long: ${finalUrl.length} chars (max ${MAX_URL_LENGTH})`);
  }

  return finalUrl;
}

// Build Outlook compose URL
export function buildOutlookComposeUrl(options: GmailComposeOptions): string {
  const {
    to = [],
    cc = [],
    bcc = [],
    subject = '',
    body = ''
  } = options;

  const sanitizedTo = to.map(sanitizeEmail).filter(Boolean);
  const sanitizedCc = cc?.map(sanitizeEmail).filter(Boolean) || [];
  const sanitizedBcc = bcc?.map(sanitizeEmail).filter(Boolean) || [];
  const sanitizedSubject = sanitizeForUrl(subject, 200);
  const sanitizedBody = sanitizeForUrl(body, MAX_BODY_LENGTH_FOR_URL);

  const params = new URLSearchParams();
  
  if (sanitizedTo.length > 0) {
    params.set('to', sanitizedTo.join(';'));
  }
  
  if (sanitizedCc.length > 0) {
    params.set('cc', sanitizedCc.join(';'));
  }
  
  if (sanitizedBcc.length > 0) {
    params.set('bcc', sanitizedBcc.join(';'));
  }
  
  if (sanitizedSubject) {
    params.set('subject', sanitizedSubject);
  }
  
  if (sanitizedBody) {
    params.set('body', sanitizedBody);
  }

  return `https://outlook.live.com/mail/0/deeplink/compose?${params.toString()}`;
}

// Build Yahoo Mail compose URL
export function buildYahooComposeUrl(options: GmailComposeOptions): string {
  const {
    to = [],
    cc = [],
    bcc = [],
    subject = '',
    body = ''
  } = options;

  const sanitizedTo = to.map(sanitizeEmail).filter(Boolean);
  const sanitizedCc = cc?.map(sanitizeEmail).filter(Boolean) || [];
  const sanitizedBcc = bcc?.map(sanitizeEmail).filter(Boolean) || [];
  const sanitizedSubject = sanitizeForUrl(subject, 200);
  const sanitizedBody = sanitizeForUrl(body, MAX_BODY_LENGTH_FOR_URL);

  const params = new URLSearchParams();
  
  if (sanitizedTo.length > 0) {
    params.set('to', sanitizedTo.join(','));
  }
  
  if (sanitizedCc.length > 0) {
    params.set('cc', sanitizedCc.join(','));
  }
  
  if (sanitizedBcc.length > 0) {
    params.set('bcc', sanitizedBcc.join(','));
  }
  
  if (sanitizedSubject) {
    params.set('subject', sanitizedSubject);
  }
  
  if (sanitizedBody) {
    params.set('body', sanitizedBody);
  }

  return `https://compose.mail.yahoo.com/?${params.toString()}`;
}

// Available email providers
export const EMAIL_PROVIDERS: EmailProvider[] = [
  {
    name: 'Gmail',
    icon: '📧',
    buildUrl: buildGmailComposeUrl,
    maxBodyLength: MAX_BODY_LENGTH_FOR_URL,
  },
  {
    name: 'Outlook',
    icon: '📨',
    buildUrl: buildOutlookComposeUrl,
    maxBodyLength: MAX_BODY_LENGTH_FOR_URL,
  },
  {
    name: 'Yahoo Mail',
    icon: '📮',
    buildUrl: buildYahooComposeUrl,
    maxBodyLength: MAX_BODY_LENGTH_FOR_URL,
  },
];

// Get provider by name
export function getEmailProvider(name: string): EmailProvider | undefined {
  return EMAIL_PROVIDERS.find(provider => 
    provider.name.toLowerCase() === name.toLowerCase()
  );
}

// Open email compose in new tab/window
export function openEmailCompose(url: string, openInNewTab: boolean = true): void {
  if (typeof window === 'undefined') {
    throw new Error('openEmailCompose can only be called in browser environment');
  }

  if (openInNewTab) {
    const newWindow = window.open(url, '_blank', 'noopener,noreferrer');
    // Don't throw error for popup blockers - Gmail might still open
    if (!newWindow) {
      console.warn('Popup might be blocked, but Gmail may still open');
    }
  } else {
    window.location.href = url;
  }
}

// Validate email addresses
export function validateEmailAddresses(emails: string[]): { valid: string[], invalid: string[] } {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const valid: string[] = [];
  const invalid: string[] = [];

  emails.forEach(email => {
    const cleaned = email.trim();
    if (emailRegex.test(cleaned)) {
      valid.push(cleaned);
    } else {
      invalid.push(cleaned);
    }
  });

  return { valid, invalid };
}

// Calculate estimated deliverability score
export function calculateDeliverabilityScore(
  subject: string,
  body: string,
  recipientEmails: string[]
): number {
  let score = 100;

  // Check subject line
  const spamWords = [
    'urgent', 'free', 'guarantee', 'limited time', 'act now', 'exclusive',
    'amazing', 'incredible', 'unbelievable', 'winner', 'congratulations'
  ];
  
  const subjectLower = subject.toLowerCase();
  spamWords.forEach(word => {
    if (subjectLower.includes(word)) {
      score -= 10;
    }
  });

  // Check subject length
  if (subject.length > 60) {
    score -= 5;
  }
  if (subject.length < 10) {
    score -= 10;
  }

  // Check body length
  if (body.length > 2000) {
    score -= 10;
  }
  if (body.length < 100) {
    score -= 15;
  }

  // Check for excessive capitalization
  const capsCount = (body.match(/[A-Z]/g) || []).length;
  const totalLetters = (body.match(/[a-zA-Z]/g) || []).length;
  if (totalLetters > 0 && (capsCount / totalLetters) > 0.3) {
    score -= 20;
  }

  // Check for excessive exclamation marks
  const exclamationCount = (body.match(/!/g) || []).length;
  if (exclamationCount > 3) {
    score -= 10;
  }

  // Check recipient count (avoid bulk sending appearance)
  if (recipientEmails.length > 5) {
    score -= 15;
  }

  return Math.max(0, Math.min(100, score));
}

// Generate mailto link as fallback
export function buildMailtoUrl(options: GmailComposeOptions): string {
  const {
    to = [],
    cc = [],
    bcc = [],
    subject = '',
    body = ''
  } = options;

  const sanitizedTo = to.map(sanitizeEmail).filter(Boolean);
  const sanitizedCc = cc?.map(sanitizeEmail).filter(Boolean) || [];
  const sanitizedBcc = bcc?.map(sanitizeEmail).filter(Boolean) || [];
  const sanitizedSubject = sanitizeForUrl(subject, 200);
  const sanitizedBody = sanitizeForUrl(body, 1000); // Shorter for mailto

  let mailtoUrl = `mailto:${sanitizedTo.join(',')}`;
  const params = new URLSearchParams();

  if (sanitizedCc.length > 0) {
    params.set('cc', sanitizedCc.join(','));
  }
  
  if (sanitizedBcc.length > 0) {
    params.set('bcc', sanitizedBcc.join(','));
  }
  
  if (sanitizedSubject) {
    params.set('subject', sanitizedSubject);
  }
  
  if (sanitizedBody) {
    params.set('body', sanitizedBody);
  }

  if (params.toString()) {
    mailtoUrl += `?${params.toString()}`;
  }

  return mailtoUrl;
}
