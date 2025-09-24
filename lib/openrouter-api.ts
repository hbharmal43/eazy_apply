// website/lib/openrouter-api.ts
// OpenRouter API integration for personalized cold email generation

const OPENROUTER_BASE_URL = 'https://openrouter.ai/api/v1';
const MAX_BODY_LENGTH = 1400; // Keep under Gmail URL limits
const MAX_SUBJECT_LENGTH = 60; // Avoid spam filters

export interface UserProfile {
  full_name: string;
  title?: string;
  email?: string;
  location?: string;
  bio?: string;
  skills?: Array<{ skill_name: string }> | string[];
  projects?: Array<{
    name: string;
    description?: string;
    technologies?: string;
    impact?: string;
  }>;
  work_experiences?: Array<{
    company: string;
    position: string;
    start_year?: number;
    end_year?: number;
    description?: string;
  }>;
}

export interface EmailDraft {
  subject: string;
  body: string;
  metadata: {
    model: string;
    tokensUsed?: number;
    generatedAt: string;
  };
}

export interface EmailGenerationOptions {
  model?: string;
  apiKey: string;
  jobTitle: string;
  company: string;
  companyUrl?: string;
  jobLocation?: string;
  user: UserProfile;
  tone?: 'professional' | 'warm' | 'concise' | 'enthusiastic';
  includeResume?: boolean;
}

// Sanitize and format user skills
function formatSkills(skills?: Array<{ skill_name: string }> | string[]): string {
  if (!skills || skills.length === 0) return '';
  
  const skillNames = skills.map(skill => 
    typeof skill === 'string' ? skill : skill.skill_name
  ).filter(Boolean);
  
  return skillNames.slice(0, 8).join(', ');
}

// Format user projects with highlights
function formatProjects(projects?: UserProfile['projects']): string {
  if (!projects || projects.length === 0) return '';
  
  return projects
    .slice(0, 2)
    .map(project => {
      const impact = project.impact || project.description || '';
      const tech = project.technologies ? ` (${project.technologies})` : '';
      return `• ${project.name}${tech}: ${impact}`;
    })
    .join('\n');
}

// Format work experience highlights
function formatExperience(experiences?: UserProfile['work_experiences']): string {
  if (!experiences || experiences.length === 0) return '';
  
  const recent = experiences
    .sort((a, b) => (b.end_year || 9999) - (a.end_year || 9999))
    .slice(0, 2);
  
  return recent
    .map(exp => `• ${exp.position} at ${exp.company}`)
    .join('\n');
}

// Create optimized prompt for cold email generation
function createEmailPrompt(options: EmailGenerationOptions): string {
  const {
    jobTitle,
    company,
    companyUrl,
    jobLocation,
    user,
    tone = 'professional',
    includeResume = true
  } = options;

  const skills = formatSkills(user.skills);
  const projects = formatProjects(user.projects);
  const experience = formatExperience(user.work_experiences);
  
  const locationInfo = jobLocation ? ` (${jobLocation})` : '';
  const companyInfo = companyUrl ? ` (${companyUrl})` : '';
  
  return `Write a concise, professional cold email for ${user.full_name} applying to ${company} for the "${jobTitle}" position${locationInfo}.

REQUIREMENTS:
- Subject: Max 60 characters, avoid spam words, mention position
- Body: Max 1400 characters total
- Tone: ${tone}, human-sounding, not AI-generated
- Structure: 3-4 short paragraphs
- Include: One key achievement/project with quantified impact
- CTA: "Would you be open to a brief conversation?"
- Add: "If you're not the right person, could you point me to someone who is?"
- End with: "Feel free to let me know if you'd prefer no follow-ups."
${includeResume ? '- Mention: "Happy to share my resume"' : ''}

CANDIDATE INFO:
Name: ${user.full_name}
Current Role: ${user.title || 'Professional'}
${skills ? `Skills: ${skills}` : ''}
${experience ? `Experience:\n${experience}` : ''}
${projects ? `Key Projects:\n${projects}` : ''}

AVOID:
- Generic phrases like "I hope this email finds you well"
- Overly enthusiastic language
- Buzzwords or clichés
- Any mention of AI or automation
- Long paragraphs or walls of text

Return ONLY valid JSON:
{
  "subject": "Brief subject line",
  "body": "Email body with proper line breaks using \\n"
}`;
}

// Validate generated email content
function validateEmailContent(content: any): { subject: string; body: string } {
  if (!content || typeof content !== 'object') {
    throw new Error('Invalid email content format');
  }

  const subject = String(content.subject || '').trim();
  const body = String(content.body || '').trim();

  if (!subject || !body) {
    throw new Error('Missing subject or body in generated email');
  }

  if (subject.length > MAX_SUBJECT_LENGTH) {
    throw new Error(`Subject too long: ${subject.length} chars (max ${MAX_SUBJECT_LENGTH})`);
  }

  if (body.length > MAX_BODY_LENGTH) {
    throw new Error(`Body too long: ${body.length} chars (max ${MAX_BODY_LENGTH})`);
  }

  return { subject, body };
}

// Add signature to email body
function addSignature(body: string, user: UserProfile): string {
  const signature = `\n\nBest regards,\n${user.full_name}${user.title ? `\n${user.title}` : ''}${user.email ? `\n${user.email}` : ''}`;
  
  // Check if adding signature would exceed limit
  if (body.length + signature.length > MAX_BODY_LENGTH) {
    // Use shorter signature
    const shortSignature = `\n\n— ${user.full_name}`;
    return body + shortSignature;
  }
  
  return body + signature;
}

// Main email generation function
export async function generateColdEmail(options: EmailGenerationOptions): Promise<EmailDraft> {
  const {
    model = 'meta-llama/llama-3.1-8b-instruct', // More reliable than free tier
    apiKey,
  } = options;

  if (!apiKey) {
    throw new Error('OpenRouter API key is required');
  }

  const prompt = createEmailPrompt(options);

  try {
    const response = await fetch(`${OPENROUTER_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
        'X-Title': 'EazyApply Cold Email Generator',
      },
      body: JSON.stringify({
        model,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        response_format: { type: 'json_object' },
        temperature: 0.5,
        max_tokens: 800,
        top_p: 0.9,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`OpenRouter API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      throw new Error('Invalid response format from OpenRouter');
    }

    const content = data.choices[0].message.content;
    let parsedContent;

    try {
      parsedContent = JSON.parse(content);
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      console.error('Raw content:', content);
      
      // Try to fix common JSON issues
      let fixedContent = content;
      
      // If content starts with { but is incomplete, try to complete it
      if (content.trim().startsWith('{') && !content.trim().endsWith('}')) {
        // Try to find the last complete field and add missing closing brace
        const lastCompleteField = content.lastIndexOf('"');
        if (lastCompleteField > 0) {
          const beforeLastField = content.substring(0, lastCompleteField + 1);
          fixedContent = beforeLastField + '}';
        }
      }
      
      try {
        parsedContent = JSON.parse(fixedContent);
        console.log('Successfully fixed JSON:', parsedContent);
      } catch (secondError) {
        console.error('Failed to fix JSON, using fallback');
        // Use fallback email generation
        return generateFallbackEmail(options);
      }
    }

    const { subject, body } = validateEmailContent(parsedContent);
    const bodyWithSignature = addSignature(body, options.user);

    return {
      subject,
      body: bodyWithSignature,
      metadata: {
        model,
        tokensUsed: data.usage?.total_tokens,
        generatedAt: new Date().toISOString(),
      },
    };

  } catch (error) {
    console.error('Email generation error:', error);
    
    if (error instanceof Error) {
      throw error;
    }
    
    throw new Error('Failed to generate email content');
  }
}

// Fallback email generation for when API fails
export function generateFallbackEmail(options: EmailGenerationOptions): EmailDraft {
  const { jobTitle, company, user } = options;
  
  const subject = `Application for ${jobTitle} at ${company}`;
  
  const body = `Hi there,

I'm reaching out regarding the ${jobTitle} position at ${company}. With my background in ${user.title || 'software development'}, I believe I could contribute meaningfully to your team.

${user.projects && user.projects[0] ? `Recently, I ${user.projects[0].description || `worked on ${user.projects[0].name}`}, which demonstrates my relevant experience.` : ''}

Would you be open to a brief conversation about this opportunity? If you're not the right person to contact, could you point me to someone who is?

Happy to share my resume and discuss how I might contribute to ${company}.

Feel free to let me know if you'd prefer no follow-ups.

Best regards,
${user.full_name}${user.title ? `\n${user.title}` : ''}${user.email ? `\n${user.email}` : ''}`;

  return {
    subject,
    body,
    metadata: {
      model: 'fallback',
      generatedAt: new Date().toISOString(),
    },
  };
}

// Utility to estimate email cost
export function estimateEmailCost(model: string): number {
  const costs: { [key: string]: number } = {
    'meta-llama/llama-3.1-8b-instruct': 0.0005,
    'openai/gpt-4o-mini': 0.002,
    'anthropic/claude-3-haiku': 0.001,
    'openai/gpt-oss-120b:free': 0,
  };
  
  return costs[model] || 0.001; // Default estimate
}
