import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { jobTitle, company, companyUrl, jobLocation, user, selectedContact } = body;

    const openrouterApiKey = process.env.OPENROUTER_API_KEY;
    
    if (!openrouterApiKey) {
      console.error('❌ OpenRouter API key not configured on server');
      return NextResponse.json(
        { error: 'OpenRouter API key not configured on server' },
        { status: 500 }
      );
    }

    // Extract user data from the nested profile structure
    const userProfile = user.profile || {};
    const userData = {
      full_name: userProfile.full_name || 'Job Applicant',
      title: userProfile.title || 'Professional Developer',
      email: userProfile.email || 'your.email@example.com',
      phone: userProfile.phone || 'your phone number',
      skills: user.skills || [],
      projects: user.projects || []
    };

    // Debug: Log the extracted user data
    console.log('🔍 Extracted user data:', userData);

    // Generate the email using OpenRouter
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openrouterApiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
        'X-Title': 'EazyApply Cold Email Generator',
      },
      body: JSON.stringify({
        model: 'x-ai/grok-4-fast:free',
        messages: [
          {
            role: 'system',
            content: `You are a professional email writing assistant. Generate a personalized cold email for a job application.

CONTACT INFORMATION (Who you're emailing):
- Name: ${selectedContact?.fullName || 'Hiring Manager'}
- Position: ${selectedContact?.position || 'Hiring Manager'}
- Email: ${selectedContact?.email || 'their email'}

APPLICANT INFORMATION (Who is sending - USE THESE EXACT VALUES):
- Name: "${userData.full_name}"
- Title: "${userData.title}"
- Email: "${userData.email}"
- Phone: "${userData.phone}"
- Skills: ${userData.skills?.map((s: any) => s.skill_name).join(', ') || 'Various skills'}
- Projects: ${userData.projects?.map((p: any) => p.name).join(', ') || 'Various projects'}

JOB DETAILS:
- Position: ${jobTitle}
- Company: ${company}
- Location: ${jobLocation || 'Not specified'}

CRITICAL REQUIREMENTS:
1. Address the email to the specific contact person: "${selectedContact?.fullName || 'Hiring Manager'}"
2. In the signature, use EXACTLY these values:
   - Name: "${userData.full_name}"
   - Title: "${userData.title}"
   - Email: "${userData.email}"
   - Phone: "${userData.phone}"
3. Do NOT use placeholder text like "[Your Email]" or "[Your Phone Number]"
4. Use the actual values provided above
5. Mention specific skills or projects that match the job
6. Show genuine interest in the company
7. Keep it concise (under 200 words)
8. Include a clear call-to-action
9. Make it sound natural, not AI-generated

Return ONLY a JSON object with this exact structure:
{
  "subject": "Your email subject here",
  "body": "Your complete email body with signature here"
}`
          },
          {
            role: 'user',
            content: `Generate a cold email for applying to ${jobTitle} position at ${company}.`
          }
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ OpenRouter API error:', { status: response.status, errorText });
      return NextResponse.json(
        { error: `OpenRouter API error: ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      console.error('❌ No content received from OpenRouter');
      return NextResponse.json(
        { error: 'No content received from OpenRouter' },
        { status: 500 }
      );
    }

    // Parse the JSON response
    try {
      const parsed = JSON.parse(content);
      return NextResponse.json({
        subject: parsed.subject || '',
        body: parsed.body || '',
        metadata: {
          model: 'x-ai/grok-4-fast:free',
          generated_at: new Date().toISOString()
        }
      });
    } catch (parseError) {
      console.error('❌ Failed to parse OpenRouter response:', parseError);
      console.log('Raw content:', content);
      
      // Fallback email generation
      const fallbackSubject = `Application for ${jobTitle} at ${company}`;
      const fallbackBody = `Dear Hiring Manager,

I hope this email finds you well. I am writing to express my strong interest in the ${jobTitle} position at ${company}.

With my background in ${user.title || 'software development'} and experience in ${user.skills?.slice(0, 3).join(', ') || 'various technologies'}, I believe I would be a valuable addition to your team.

I would welcome the opportunity to discuss how my skills and experience can contribute to ${company}'s continued success.

Thank you for your time and consideration.

Best regards,
${user.full_name || 'Job Applicant'}`;

      return NextResponse.json({
        subject: fallbackSubject,
        body: fallbackBody,
        metadata: {
          model: 'fallback',
          generated_at: new Date().toISOString()
        }
      });
    }

  } catch (error) {
    console.error('❌ Generate email error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
