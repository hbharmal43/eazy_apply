// website/lib/snov-api.ts
// Snov.io API integration with cost controls and location filtering

// Use local API route to proxy requests and avoid CORS
const SNOV_BASE_URL = '/api/snov-proxy';
const MAX_CONTACTS_TO_RESOLVE = 20; // Show more contacts for better selection

// Company name search functions

// Start company domain search by name
async function startCompanyDomainSearch(companyName: string, accessToken: string): Promise<string> {
  console.log(`🔍 Starting company domain search for: ${companyName}`);
  
  const response = await fetch(`${SNOV_BASE_URL}?endpoint=/v2/company-domain-by-name/start`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      'names[]': companyName,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Company domain search failed: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  console.log('🔍 Company domain search started:', data);
  
  if (!data.data?.task_hash) {
    throw new Error('No task hash returned from company domain search');
  }
  
  return data.data.task_hash;
}

// Get company domain search results
async function getCompanyDomainResults(taskHash: string, accessToken: string): Promise<any> {
  console.log(`🔍 Getting company domain results for task: ${taskHash}`);
  
  const response = await fetch(`${SNOV_BASE_URL}?endpoint=/v2/company-domain-by-name/result&task_hash=${taskHash}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Get company domain results failed: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  console.log('🔍 Company domain results:', data);
  
  return data;
}

export interface FoundContact {
  email: string;
  fullName?: string;
  firstName?: string;
  lastName?: string;
  position?: string;
  confidence?: number;
  location?: string;
  linkedinUrl?: string;
  searchEmailsUrl?: string; // URL to resolve email (used only when email is empty)
  companyDomain?: string; // Company domain for email fallback generation
}

export interface SnovAuthResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

export interface SnovUsageStats {
  creditsUsed: number;
  totalFound: number;
  locationFiltered: number;
  finalSelected: number;
}

// Get Snov access token
export async function getSnovAccessToken(clientId: string, clientSecret: string): Promise<string> {
  const response = await fetch(`${SNOV_BASE_URL}?endpoint=/v1/oauth/access_token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: clientId,
      client_secret: clientSecret,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Snov auth failed: ${response.status} - ${errorText}`);
  }

  const data: SnovAuthResponse = await response.json();
  return data.access_token;
}

// Start domain search for prospects
async function startDomainProspectsSearch(domain: string, positions: string[], accessToken: string): Promise<string> {
  console.log('🔍 Starting domain prospects search:', { domain, positions });
  
  const formData = new FormData();
  formData.append('domain', domain);
  formData.append('page', '1');
  positions.forEach(position => {
    formData.append('positions[]', position);
  });

  console.log('🔍 Making request to:', `${SNOV_BASE_URL}/v2/domain-search/prospects/start`);

  const response = await fetch(`${SNOV_BASE_URL}?endpoint=/v2/domain-search/prospects/start`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
    body: formData,
  });

  console.log('🔍 Response status:', response.status);
  console.log('🔍 Response headers:', Object.fromEntries(response.headers.entries()));

  if (!response.ok) {
    const errorText = await response.text();
    console.error('❌ Prospects search failed:', { status: response.status, errorText });
    throw new Error(`Prospects search failed: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  console.log('🔍 Prospects search response:', data);
  return data.meta.task_hash;
}

// Get prospects search results
async function getProspectsResults(taskHash: string, accessToken: string): Promise<any> {
  const response = await fetch(`${SNOV_BASE_URL}?endpoint=/v2/domain-search/prospects/result/${taskHash}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Get prospects results failed: ${response.status} - ${errorText}`);
  }

  return await response.json();
}

// Find email for specific prospect
async function findProspectEmail(searchEmailsUrl: string, accessToken: string): Promise<string> {
  // Extract the prospect hash from the URL
  const urlParts = searchEmailsUrl.split('/');
  const prospectHash = urlParts[urlParts.length - 1];

  const response = await fetch(`${SNOV_BASE_URL}?endpoint=/v2/domain-search/prospects/search-emails/start/${prospectHash}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({}),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Find prospect email failed: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  return data.meta.task_hash;
}

// Get email search results
async function getEmailResults(taskHash: string, accessToken: string): Promise<any> {
  const response = await fetch(`${SNOV_BASE_URL}?endpoint=/v2/domain-search/prospects/search-emails/result/${taskHash}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Get email results failed: ${response.status} - ${errorText}`);
  }

  return await response.json();
}

// Email normalization helper - handles all possible Snov email data shapes
type SnovEmail = {
  email?: string;
  address?: string;
  value?: string;
  emailAddress?: string;
  smtp_status?: string;   // 'valid' | 'unknown' | ...
  status?: string;        // sometimes appears as 'valid'
  verification_status?: string;
  type?: string;          // 'work' | 'personal' | etc.
} | string | null | undefined;

function normalizeProspectEmails(raw: any): Array<{ email: string; status?: string; type?: string }> {
  if (!raw) return [];

  // If the server occasionally nests as { emails: [...] } or { data: { emails: [...] } }
  if (typeof raw === 'object' && !Array.isArray(raw)) {
    if (Array.isArray(raw.emails)) return normalizeProspectEmails(raw.emails);
    if (raw.data && Array.isArray(raw.data.emails)) return normalizeProspectEmails(raw.data.emails);
  }

  if (Array.isArray(raw)) {
    return raw.flatMap(item => normalizeProspectEmails(item));
  }

  if (typeof raw === 'string') {
    return [{ email: raw, status: 'unknown' }];
  }

  if (typeof raw === 'object') {
    const e = raw.email ?? raw.address ?? raw.value ?? raw.emailAddress;
    const st = raw.smtp_status ?? raw.status ?? raw.verification_status ?? 'unknown';
    const tp = raw.type ?? 'unknown';
    return e ? [{ email: e, status: st, type: tp }] : [];
  }

  return [];
}

// Extract best email from prospect data
export function extractEmailFromProspect(prospect: any): { email?: string; confidence?: number } {
  const normalized = normalizeProspectEmails(prospect?.emails);
  if (!normalized.length) return {};

  // Prefer verified/valid first, then work emails, then first available
  const best = normalized.find(x => (x.status || '').toLowerCase() === 'valid') 
    ?? normalized.find(x => (x.type || '').toLowerCase() === 'work') 
    ?? normalized[0];
  
  const confidence = (best.status === 'valid' ? 0.95 : 0.8);
  
  console.log('✅ Extracted email for', prospect.first_name, prospect.last_name, ':', best.email, 'status:', best.status);
  
  return { email: best.email, confidence };
}

// Enhanced location matching with scoring
function calculateLocationScore(prospectLocation: string, jobLocation: string): number {
  if (!prospectLocation || !jobLocation) return 0;
  
  const locationFilters: { [key: string]: { keywords: string[]; metro: string[] } } = {
    "san francisco": { 
      keywords: ["san francisco", "sf", "bay area", "california", "ca"],
      metro: ["sf", "bay area", "silicon valley"]
    },
    "new york": { 
      keywords: ["new york", "nyc", "manhattan", "brooklyn", "ny"],
      metro: ["nyc", "manhattan", "brooklyn", "queens"]
    },
    "remote": { 
      keywords: ["remote", "anywhere", "global", "worldwide"],
      metro: ["remote", "anywhere"]
    },
    "london": { 
      keywords: ["london", "uk", "united kingdom", "england"],
      metro: ["london", "uk"]
    },
    "seattle": { 
      keywords: ["seattle", "washington", "wa"],
      metro: ["seattle", "bellevue", "redmond"]
    },
    "austin": { 
      keywords: ["austin", "texas", "tx"],
      metro: ["austin", "round rock"]
    },
    "chicago": { 
      keywords: ["chicago", "illinois", "il"],
      metro: ["chicago", "evanston", "oak park"]
    },
    "boston": { 
      keywords: ["boston", "massachusetts", "ma"],
      metro: ["boston", "cambridge", "somerville"]
    },
    "los angeles": { 
      keywords: ["los angeles", "la", "california", "ca"],
      metro: ["la", "santa monica", "beverly hills"]
    },
    "denver": { 
      keywords: ["denver", "colorado", "co"],
      metro: ["denver", "boulder", "aurora"]
    },
  };

  const jobLocationLower = jobLocation.toLowerCase();
  const prospectLocationLower = prospectLocation.toLowerCase();

  // Exact match (highest score)
  if (prospectLocationLower === jobLocationLower) {
    return 100;
  }

  // Metro nickname match (high score)
  for (const [key, data] of Object.entries(locationFilters)) {
    if (jobLocationLower.includes(key)) {
      // Check metro nicknames first
      if (data.metro.some(metro => prospectLocationLower.includes(metro))) {
        return 90;
      }
      // Check keywords
      if (data.keywords.some(keyword => prospectLocationLower.includes(keyword))) {
        return 80;
      }
    }
  }

  // Country match fallback (low score)
  const countryMatch = prospectLocationLower.includes(jobLocationLower) || 
                      jobLocationLower.includes(prospectLocationLower);
  if (countryMatch) {
    return 30;
  }

  // Remote neutrality - don't penalize if job is remote
  if (jobLocationLower.includes('remote') || jobLocationLower.includes('anywhere')) {
    return 50; // Neutral score for remote jobs
  }

  return 0;
}

// Enhanced title understanding with function and seniority detection
function calculateTitleScore(prospectTitle: string, jobTitle: string): number {
  if (!prospectTitle) return 0;
  
  const title = prospectTitle.toLowerCase();
  
  // Function matching - if job is technical, prefer technical roles
  const isTechnicalJob = jobTitle.toLowerCase().includes('engineer') || 
                        jobTitle.toLowerCase().includes('developer') ||
                        jobTitle.toLowerCase().includes('programmer') ||
                        jobTitle.toLowerCase().includes('architect');
  
  // Seniority tiers (higher = more senior)
  const seniorityTiers: { [key: string]: number } = {
    // C-level
    'ceo': 100, 'cto': 95, 'cfo': 90, 'coo': 85, 'cmo': 80, 'cpo': 75,
    // VP level
    'vp': 70, 'vice president': 70, 'head of': 65, 'director': 60,
    // Manager level
    'manager': 50, 'lead': 45, 'senior': 40, 'principal': 35,
    // Individual contributor
    'engineer': 30, 'developer': 25, 'analyst': 20, 'specialist': 15,
    // Hiring roles
    'hiring manager': 55, 'talent acquisition': 35, 'recruiter': 25, 'hr': 15,
    // Agency/staffing (penalty)
    'agency': -20, 'staffing': -20, 'talent solutions': -20, 'consultant': -10
  };
  
  // Check for outdated titles
  const isOutdated = title.includes('former') || title.includes('ex-') || 
                    title.includes('seeking') || title.includes('unemployed');
  if (isOutdated) return -50;
  
  // Calculate seniority score
  let seniorityScore = 0;
  for (const [keyword, score] of Object.entries(seniorityTiers)) {
    if (title.includes(keyword)) {
      seniorityScore = Math.max(seniorityScore, score);
    }
  }
  
  // Function match bonus for technical jobs
  let functionBonus = 0;
  if (isTechnicalJob) {
    const technicalRoles = ['engineer', 'developer', 'architect', 'cto', 'engineering manager', 'tech lead'];
    if (technicalRoles.some(role => title.includes(role))) {
      functionBonus = 20;
    }
  }
  
  // Agency penalty
  const isAgency = title.includes('agency') || title.includes('staffing') || 
                   title.includes('talent solutions') || title.includes('consultant');
  const agencyPenalty = isAgency ? -30 : 0;
  
  return seniorityScore + functionBonus + agencyPenalty;
}

// Calculate confidence and freshness score
function calculateConfidenceScore(prospect: any): number {
  let score = 0;
  
  // Valid email bonus
  if (prospect.email && prospect.confidence && prospect.confidence > 0.9) {
    score += 20;
  }
  
  // LinkedIn URL bonus
  if (prospect.linkedinUrl && prospect.linkedinUrl.includes('linkedin.com')) {
    score += 10;
  }
  
  // Email status bonus
  if (prospect.emailStatus === 'valid') {
    score += 15;
  }
  
  return score;
}

// Company match guard - penalize cross-domain prospects
function calculateCompanyMatchScore(prospect: any, targetCompany: string, targetDomain: string): number {
  if (!targetCompany && !targetDomain) return 0;
  
  const prospectCompany = (prospect.company || '').toLowerCase();
  const prospectDomain = (prospect.domain || '').toLowerCase();
  
  // Exact company match
  if (targetCompany && prospectCompany.includes(targetCompany.toLowerCase())) {
    return 20;
  }
  
  // Domain match
  if (targetDomain && prospectDomain.includes(targetDomain.toLowerCase())) {
    return 15;
  }
  
  // Cross-domain penalty
  if (prospectCompany && targetCompany && 
      !prospectCompany.includes(targetCompany.toLowerCase()) &&
      !targetCompany.toLowerCase().includes(prospectCompany)) {
    return -10;
  }
  
  return 0;
}

// Calculate overall prospect score
function calculateProspectScore(prospect: any, jobLocation?: string, jobTitle?: string, targetCompany?: string, targetDomain?: string): number {
  const locationScore = jobLocation ? calculateLocationScore(prospect.location || '', jobLocation) : 50;
  const titleScore = calculateTitleScore(prospect.position || '', jobTitle || '');
  const confidenceScore = calculateConfidenceScore(prospect);
  const companyScore = calculateCompanyMatchScore(prospect, targetCompany || '', targetDomain || '');
  
  // Weighted total (location is most important, then title, then confidence)
  const totalScore = (locationScore * 0.4) + (titleScore * 0.35) + (confidenceScore * 0.15) + (companyScore * 0.1);
  
  return Math.round(totalScore);
}

// Enhanced contact selection with diversity and anti-tunnel
function selectBestContacts(contacts: any[], jobLocation?: string, jobTitle?: string, targetCompany?: string, targetDomain?: string): any[] {
  // Calculate scores for all contacts
  const scoredContacts = contacts.map(contact => ({
    ...contact,
    score: calculateProspectScore(contact, jobLocation, jobTitle, targetCompany, targetDomain)
  }));
  
  // Sort by score (highest first)
  const sortedContacts = scoredContacts.sort((a, b) => b.score - a.score);
  
  // Diversity & anti-tunnel: ensure mix of decision makers and gatekeepers
  const managers = sortedContacts.filter(c => 
    c.position && (c.position.toLowerCase().includes('manager') || 
                   c.position.toLowerCase().includes('director') ||
                   c.position.toLowerCase().includes('vp') ||
                   c.position.toLowerCase().includes('head of'))
  );
  
  const gatekeepers = sortedContacts.filter(c => 
    c.position && (c.position.toLowerCase().includes('recruiter') || 
                   c.position.toLowerCase().includes('talent acquisition') ||
                   c.position.toLowerCase().includes('hr'))
  );
  
  const others = sortedContacts.filter(c => 
    !managers.includes(c) && !gatekeepers.includes(c)
  );
  
  // Build diverse selection
  const selectedContacts: any[] = [];
  const maxPerType = Math.ceil(MAX_CONTACTS_TO_RESOLVE / 3); // Roughly equal distribution
  
  // Add managers (decision makers)
  selectedContacts.push(...managers.slice(0, maxPerType));
  
  // Add gatekeepers (screening)
  selectedContacts.push(...gatekeepers.slice(0, maxPerType));
  
  // Add others to fill remaining slots
  const remaining = MAX_CONTACTS_TO_RESOLVE - selectedContacts.length;
  selectedContacts.push(...others.slice(0, remaining));
  
  // If we still need more, fill from highest scored remaining
  if (selectedContacts.length < MAX_CONTACTS_TO_RESOLVE) {
    const remaining = sortedContacts.filter(c => !selectedContacts.includes(c));
    selectedContacts.push(...remaining.slice(0, MAX_CONTACTS_TO_RESOLVE - selectedContacts.length));
  }
  
  console.log(`🎯 Selected ${selectedContacts.length} contacts: ${managers.slice(0, maxPerType).length} managers, ${gatekeepers.slice(0, maxPerType).length} gatekeepers, ${others.slice(0, remaining).length} others`);
  
  return selectedContacts.slice(0, MAX_CONTACTS_TO_RESOLVE);
}

// Wait for task completion with timeout
async function waitForTaskCompletion(
  getResultsFn: () => Promise<any>, 
  maxAttempts: number = 10, 
  delayMs: number = 2000
): Promise<any> {
  console.log(`🔄 Starting task completion polling (max ${maxAttempts} attempts, ${delayMs}ms delay)`);
  
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      console.log(`🔄 Polling attempt ${attempt + 1}/${maxAttempts}`);
      const results = await getResultsFn();
      
      console.log(`🔄 Poll result:`, { status: results.status, hasData: !!results.data });
      
      if (results.status === 'completed') {
        console.log('✅ Task completed successfully');
        return results;
      }
      
      if (results.status === 'failed') {
        console.log('❌ Task failed');
        throw new Error('Task failed');
      }
      
      if (results.status === 'in_progress') {
        console.log(`⏳ Task still in progress, waiting ${delayMs}ms...`);
        // Wait before next attempt
        await new Promise(resolve => setTimeout(resolve, delayMs));
      } else {
        console.log(`⚠️ Unknown task status: ${results.status}`);
        // Wait before next attempt even for unknown status
        await new Promise(resolve => setTimeout(resolve, delayMs));
      }
    } catch (error) {
      console.log(`❌ Polling attempt ${attempt + 1} failed:`, error);
      if (attempt === maxAttempts - 1) {
        throw error;
      }
      await new Promise(resolve => setTimeout(resolve, delayMs));
    }
  }
  
  console.log('⏰ Task timeout - results not ready after maximum attempts');
  throw new Error('Task timeout - results not ready');
}

// Main function to find contacts with cost control
export async function snovFindContacts({
  domain,
  company,
  jobLocation,
  positions = ["recruiter", "talent acquisition", "hr", "hiring manager", "engineering manager"],
  accessToken
}: {
  domain?: string;
  company?: string;
  jobLocation?: string;
  positions?: string[];
  accessToken: string;
}): Promise<{ contacts: FoundContact[]; usage: SnovUsageStats }> {
  
  if (!domain && !company) {
    throw new Error('Either domain or company must be provided');
  }

  // Resolve domain using Snov's company name search
  let searchDomain = domain;
  console.log(`🔍 Domain resolution check: domain=${domain}, company=${company}`);
  
  if (!searchDomain && company) {
    console.log(`🔍 Resolving domain using Snov company name search for: ${company}`);
    try {
      // Step 1: Start company domain search (1 credit)
      const domainTaskHash = await startCompanyDomainSearch(company, accessToken);
      
      // Step 2: Wait for domain search results
      const domainResults = await waitForTaskCompletion(
        () => getCompanyDomainResults(domainTaskHash, accessToken),
        10, // 10 attempts max (20 seconds total)
        2000 // 2 second delay between attempts
      );
      
      if (domainResults.status === 'completed' && domainResults.data?.length > 0) {
        const companyResult = domainResults.data.find((item: any) => 
          item.name?.toLowerCase() === company.toLowerCase()
        );
        
        if (companyResult?.result?.domain) {
          searchDomain = companyResult.result.domain;
          console.log(`✅ Resolved domain via Snov: ${searchDomain}`);
        } else {
          throw new Error('No domain found for company in Snov results');
        }
      } else {
        throw new Error('Company domain search did not complete successfully');
      }
    } catch (error) {
      console.error(`❌ Snov domain resolution failed:`, error);
      // Fallback to guessing
      searchDomain = `${company.toLowerCase().replace(/[^a-z0-9]/g, '').replace(/inc|llc|corp|ltd|company|co$/i, '')}.com`;
      console.log(`⚠️ Using fallback domain: ${searchDomain}`);
    }
  }
  
  if (!searchDomain) {
    throw new Error('Could not resolve domain for company');
  }
  
  let creditsUsed = 0;
  
  // Add credit for company domain search if we used it
  if (!domain && company) {
    creditsUsed++; // 1 credit for company domain search
    console.log(`💰 Credits used so far: ${creditsUsed} (company domain search)`);
  }
  
  try {
    console.log('🔍 Starting cold email search for:', { searchDomain, positions, jobLocation });
    
    // Step 1: Start prospects search (1 credit) - temporarily removing position filters for testing
    creditsUsed++;
    console.log('🔍 Starting prospects search (credit #2)... [NO POSITION FILTERS FOR TESTING]');
    const taskHash = await startDomainProspectsSearch(searchDomain, [], accessToken);
    
    // Step 2: Wait for and get prospects results
    const prospectsResults = await waitForTaskCompletion(
      () => getProspectsResults(taskHash, accessToken)
    );
    
    const allProspects = prospectsResults.data || [];
    console.log('🔍 Raw prospects from API:', allProspects.length, allProspects);
    
    // Step 3: Convert ALL prospects to contacts
    console.log('🔍 Converting prospects to contacts...');
    const contacts: FoundContact[] = [];
    
    for (const prospect of allProspects) {
      console.log('🔍 Adding prospect:', prospect.first_name, prospect.last_name, prospect.position);
      
      // Special debugging for LN Konda with better logging
      if (prospect.first_name === 'LN' && prospect.last_name === 'Konda') {
        console.log('🎯 DEBUG LN KONDA:');
        console.dir({ emails: prospect.emails }, { depth: null });
        console.log('emails JSON =>', JSON.stringify(prospect.emails, null, 2));
      }
      
      // Use the new extractor function
      const { email, confidence } = extractEmailFromProspect(prospect);
      let finalEmail = email;

      const newContact = {
        email: finalEmail || '', // Use extracted email if available
        fullName: `${prospect.first_name || ''} ${prospect.last_name || ''}`.trim(),
        firstName: prospect.first_name || '',
        lastName: prospect.last_name || '',
        position: prospect.position || 'Unknown Position',
        location: prospect.location || '',
        linkedinUrl: prospect.source_page || '',
        confidence: confidence || 0.8,
        searchEmailsUrl: !finalEmail && prospect.search_emails_start && typeof prospect.search_emails_start === 'string' ? prospect.search_emails_start : undefined, // Only store search URL if no direct email
        companyDomain: searchDomain, // Store the resolved company domain for fallback email generation
        company: prospect.company || company, // Store company name for matching
        domain: prospect.domain || searchDomain, // Store domain for matching
      };
      
      console.log('🔍 Prospect data:', {
        name: newContact.fullName,
        email: newContact.email,
        hasSearchUrl: !!newContact.searchEmailsUrl,
        searchUrl: newContact.searchEmailsUrl,
        rawProspect: {
          search_emails_start: prospect.search_emails_start,
          emails: prospect.emails,
          has_emails: prospect.has_emails,
          full_prospect: prospect // Show the entire prospect object
        }
      });
      
      contacts.push(newContact);
      console.log('✅ Added contact:', newContact.fullName, newContact.position);
    }
    
    console.log(`✅ Found ${contacts.length} contacts total`);
    
    // Step 4: Select best contacts using the new smart selection with diversity
    const bestContacts = selectBestContacts(contacts, jobLocation, positions[0], company, searchDomain);
    console.log(`🎯 Selected ${bestContacts.length} best contacts using smart scoring`);
    
    const usage: SnovUsageStats = {
      creditsUsed,
      totalFound: allProspects.length,
      locationFiltered: allProspects.length, // No filtering applied
      finalSelected: bestContacts.length,
    };
    
    return { contacts: bestContacts, usage };
    
  } catch (error) {
    console.error('Snov API error:', error);
    throw new Error(`Failed to find contacts: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Resolve email for a selected contact (costs 1 credit)
export async function resolveContactEmail(contact: FoundContact, accessToken: string): Promise<FoundContact> {
  if (contact.email) {
    // Email already resolved
    return contact;
  }
  
  if (!contact.searchEmailsUrl) {
    console.log('⚠️ No search URL available for contact:', contact.fullName || 'Unknown');
    
    // Try to generate fallback email using firstname.lastname@companydomain pattern
    if (contact.firstName && contact.lastName && contact.companyDomain) {
      const fallbackEmail = generateFallbackEmail(contact.firstName, contact.lastName, contact.companyDomain);
      console.log('🔄 Generated fallback email:', fallbackEmail);
      
      return {
        ...contact,
        email: fallbackEmail,
        confidence: 0.6, // Medium confidence for generated email
      };
    }
    
    // If we can't generate a fallback email, use a generic placeholder
    return {
      ...contact,
      email: `contact@${(contact.fullName || 'unknown').toLowerCase().replace(/\s+/g, '')}.com`, // Placeholder
      confidence: 0.3,
    };
  }
  
  try {
    console.log('🔍 Resolving email for selected contact:', contact.fullName);
    console.log('🔍 This may take up to 60 seconds...');
    
    const emailTaskHash = await findProspectEmail(contact.searchEmailsUrl, accessToken);
    
    const emailResults = await waitForTaskCompletion(
      () => getEmailResults(emailTaskHash, accessToken),
      30, // 30 attempts max (60 seconds total)
      2000 // 2 second delay between attempts
    );
    
    console.log('🔍 Email search completed with status:', emailResults.status);
    console.log('🔍 Email search data:', emailResults.data);
    
    if (emailResults.status === 'completed') {
      if (emailResults.data?.emails?.length > 0) {
        // Use the normalizer to handle the email results
        const normalized = normalizeProspectEmails(emailResults.data.emails);
        if (normalized.length > 0) {
          const best = normalized.find(x => (x.status || '').toLowerCase() === 'valid') ?? normalized[0];
          console.log('✅ Resolved email:', best.email, 'status:', best.status);
          
          return {
            ...contact,
            email: best.email,
            confidence: best.status === 'valid' ? 0.95 : 0.75,
            searchEmailsUrl: undefined, // Remove since email is now resolved
          };
        } else {
          console.log('⚠️ No valid emails found in normalized results');
        }
      } else {
        console.log('⚠️ No emails found in search results');
      }
    } else {
      console.log('⚠️ Email search did not complete, status:', emailResults.status);
    }
    
    // If we get here, email resolution failed - try fallback email generation
    console.log('⚠️ Email resolution failed, trying fallback email generation for:', contact.fullName);
    
    // Try to generate fallback email using firstname.lastname@companydomain pattern
    if (contact.firstName && contact.lastName && contact.companyDomain) {
      const fallbackEmail = generateFallbackEmail(contact.firstName, contact.lastName, contact.companyDomain);
      console.log('🔄 Generated fallback email after failed resolution:', fallbackEmail);
      
      return {
        ...contact,
        email: fallbackEmail,
        confidence: 0.6, // Medium confidence for generated email
        searchEmailsUrl: undefined, // Remove since we're not using it anymore
      };
    }
    
    // If we can't generate a fallback email, use a generic placeholder
    return {
      ...contact,
      email: `contact@${(contact.fullName || 'unknown').toLowerCase().replace(/\s+/g, '')}.com`,
      confidence: 0.3,
      searchEmailsUrl: undefined, // Remove since we're not using it anymore
    };
  } catch (error) {
    console.error('Failed to resolve contact email:', error);
    throw new Error(`Failed to resolve email: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Utility function to extract domain from URL
export function extractDomainFromUrl(url: string): string | null {
  try {
    const urlObj = new URL(url.startsWith('http') ? url : `https://${url}`);
    return urlObj.hostname.replace('www.', '');
  } catch {
    return null;
  }
}

// Utility function to guess domain from company name
export function guessDomainFromCompany(companyName: string): string {
  return `${companyName.toLowerCase()
    .replace(/[^a-z0-9]/g, '')
    .replace(/inc|llc|corp|ltd|company|co$/i, '')}.com`;
}

// Generate fallback email using firstname.lastname@companydomain pattern
export function generateFallbackEmail(firstName: string, lastName: string, companyDomain: string): string {
  if (!firstName || !lastName || !companyDomain) {
    return '';
  }
  
  // Clean names: remove special characters, convert to lowercase
  const cleanFirstName = firstName.toLowerCase().replace(/[^a-z0-9]/g, '');
  const cleanLastName = lastName.toLowerCase().replace(/[^a-z0-9]/g, '');
  
  // Clean domain: remove www. prefix if present
  const cleanDomain = companyDomain.replace(/^www\./, '');
  
  return `${cleanFirstName}.${cleanLastName}@${cleanDomain}`;
}
