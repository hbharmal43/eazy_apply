interface EmailTemplate {
  subject: string;
  body: string;
}

interface TemplateVariables {
  recipientName: string;
  recipientTitle: string;
  companyName: string;
  senderName: string;
  senderTitle: string;
  senderBackground: string;
  emailPurpose: string;
  foundVia: string;
  specificPoints: string;
  callToAction: string;
}

const templates: Record<string, Record<string, EmailTemplate>> = {
  'job-inquiry': {
    professional: {
      subject: "Interested in {{recipientTitle}} opportunities at {{companyName}}",
      body: `Dear {{recipientName}},

I hope this email finds you well. I came across {{companyName}} through {{foundVia}} and was particularly impressed by {{specificPoints}}.

I am currently a {{senderTitle}} with experience in {{senderBackground}}. I'm reaching out because I'm very interested in exploring {{recipientTitle}} opportunities at {{companyName}}.

{{callToAction}}

Thank you for your time, and I look forward to potentially connecting.

Best regards,
{{senderName}}`
    },
    friendly: {
      subject: "Quick question about {{recipientTitle}} roles at {{companyName}}",
      body: `Hi {{recipientName}},

I hope you're having a great day! I recently came across {{companyName}} through {{foundVia}} and was really excited about {{specificPoints}}.

I'm {{senderName}}, currently working as a {{senderTitle}}. {{senderBackground}}

I'd love to learn more about the {{recipientTitle}} opportunities at {{companyName}}. {{callToAction}}

Looking forward to connecting!

Best,
{{senderName}}`
    },
    formal: {
      subject: "Inquiry Regarding {{recipientTitle}} Position at {{companyName}}",
      body: `Dear {{recipientName}},

I am writing to express my keen interest in exploring {{recipientTitle}} opportunities at {{companyName}}, which I discovered through {{foundVia}}.

As a {{senderTitle}} with {{senderBackground}}, I was particularly drawn to {{specificPoints}}.

{{callToAction}}

Thank you for considering my inquiry. I look forward to the possibility of discussing this further.

Yours sincerely,
{{senderName}}`
    }
  },
  'informational': {
    professional: {
      subject: "Request for Informational Discussion - {{recipientTitle}} at {{companyName}}",
      body: `Dear {{recipientName}},

I hope this email finds you well. I discovered your profile through {{foundVia}} and was particularly impressed by {{specificPoints}}.

I am {{senderName}}, currently {{senderTitle}} with {{senderBackground}}. I would greatly value the opportunity to learn more about your experience at {{companyName}} and your journey in the industry.

{{callToAction}}

Thank you for considering my request. I understand you're busy and appreciate any time you can spare.

Best regards,
{{senderName}}`
    },
    friendly: {
      subject: "Quick chat about your role at {{companyName}}?",
      body: `Hi {{recipientName}},

I hope you're having a great day! I came across your profile on {{foundVia}} and was really inspired by {{specificPoints}}.

I'm {{senderName}}, and I'm currently {{senderTitle}}. {{senderBackground}}

I'd love to learn more about your experience as {{recipientTitle}} at {{companyName}}. {{callToAction}}

Thanks for considering!

Best,
{{senderName}}`
    },
    formal: {
      subject: "Request for Professional Insights - {{recipientTitle}} Role at {{companyName}}",
      body: `Dear {{recipientName}},

I am writing to request your valuable insights regarding the {{recipientTitle}} role at {{companyName}}. I discovered your profile through {{foundVia}} and was particularly impressed by {{specificPoints}}.

As a {{senderTitle}} with {{senderBackground}}, I am keen to learn from your experience and expertise in the field.

{{callToAction}}

I appreciate your time and consideration of my request.

Yours sincerely,
{{senderName}}`
    }
  },
  'networking': {
    professional: {
      subject: "Professional Connection Request - {{senderTitle}} reaching out",
      body: `Dear {{recipientName}},

I hope this email finds you well. I came across your profile through {{foundVia}} and was impressed by {{specificPoints}}.

I'm {{senderName}}, currently {{senderTitle}}. {{senderBackground}}

I believe there could be valuable opportunities for professional collaboration and knowledge sharing between us. {{callToAction}}

Thank you for considering my connection request.

Best regards,
{{senderName}}`
    },
    friendly: {
      subject: "Let's connect! Fellow {{recipientTitle}} reaching out",
      body: `Hi {{recipientName}},

Hope you're having a great day! I found you through {{foundVia}} and was really interested in {{specificPoints}}.

I'm {{senderName}}, working as {{senderTitle}}. {{senderBackground}}

I'd love to connect and perhaps explore ways we could help each other grow professionally. {{callToAction}}

Looking forward to potentially connecting!

Best,
{{senderName}}`
    },
    formal: {
      subject: "Professional Network Extension - {{senderTitle}}",
      body: `Dear {{recipientName}},

I am writing to establish a professional connection with you, having discovered your profile through {{foundVia}}. Your work in {{specificPoints}} particularly caught my attention.

As a {{senderTitle}} with {{senderBackground}}, I believe there could be mutual benefit in connecting.

{{callToAction}}

Thank you for considering my request.

Yours sincerely,
{{senderName}}`
    }
  },
  'collaboration': {
    professional: {
      subject: "Collaboration Opportunity - {{companyName}} and {{senderTitle}}",
      body: `Dear {{recipientName}},

I hope this email finds you well. I recently learned about {{companyName}} through {{foundVia}} and was particularly impressed by {{specificPoints}}.

I'm {{senderName}}, {{senderTitle}} with {{senderBackground}}. I believe there could be interesting opportunities for collaboration between us.

{{callToAction}}

Thank you for your time, and I look forward to potentially discussing this further.

Best regards,
{{senderName}}`
    },
    friendly: {
      subject: "Exciting collaboration idea for {{companyName}}",
      body: `Hi {{recipientName}},

I hope you're doing well! I recently came across {{companyName}} through {{foundVia}} and was really excited about {{specificPoints}}.

I'm {{senderName}}, and as a {{senderTitle}} with {{senderBackground}}, I see some amazing potential for us to work together.

{{callToAction}}

Looking forward to your thoughts!

Best,
{{senderName}}`
    },
    formal: {
      subject: "Proposed Collaboration - {{companyName}} and {{senderTitle}}",
      body: `Dear {{recipientName}},

I am writing to propose a potential collaboration opportunity between {{companyName}} and myself. I discovered your organization through {{foundVia}} and was particularly impressed by {{specificPoints}}.

As a {{senderTitle}} with {{senderBackground}}, I believe there could be significant mutual benefit in exploring a partnership.

{{callToAction}}

Thank you for considering this proposal.

Yours sincerely,
{{senderName}}`
    }
  },
  'mentorship': {
    professional: {
      subject: "Mentorship Request - {{senderTitle}} seeking guidance",
      body: `Dear {{recipientName}},

I hope this email finds you well. I discovered your profile through {{foundVia}} and was particularly inspired by {{specificPoints}}.

I am {{senderName}}, currently {{senderTitle}} with {{senderBackground}}. I am reaching out because I believe your experience and insights would be invaluable to my professional development.

{{callToAction}}

Thank you for considering my request.

Best regards,
{{senderName}}`
    },
    friendly: {
      subject: "Seeking mentorship advice - {{recipientTitle}} at {{companyName}}",
      body: `Hi {{recipientName}},

I hope you're having a great day! I came across your profile on {{foundVia}} and was really inspired by {{specificPoints}}.

I'm {{senderName}}, currently {{senderTitle}}. {{senderBackground}}

I would really value your mentorship and guidance in navigating my career path. {{callToAction}}

Thanks for considering!

Best,
{{senderName}}`
    },
    formal: {
      subject: "Request for Professional Mentorship - {{senderTitle}}",
      body: `Dear {{recipientName}},

I am writing to formally request your consideration as a professional mentor. I discovered your profile through {{foundVia}} and was deeply impressed by {{specificPoints}}.

As a {{senderTitle}} with {{senderBackground}}, I am seeking guidance from experienced professionals like yourself to further my development.

{{callToAction}}

Thank you for considering my request.

Yours sincerely,
{{senderName}}`
    }
  },
  'introduction': {
    professional: {
      subject: "Introduction via {{foundVia}} - {{senderTitle}}",
      body: `Dear {{recipientName}},

I hope this email finds you well. I was introduced to your work through {{foundVia}} and was particularly impressed by {{specificPoints}}.

I am {{senderName}}, currently {{senderTitle}} with {{senderBackground}}.

{{callToAction}}

Thank you for your time, and I look forward to potentially connecting.

Best regards,
{{senderName}}`
    },
    friendly: {
      subject: "Quick intro - {{foundVia}} connection",
      body: `Hi {{recipientName}},

Hope you're doing great! {{foundVia}} mentioned you'd be a great person to connect with, and I was really interested in {{specificPoints}}.

I'm {{senderName}}, working as {{senderTitle}}. {{senderBackground}}

{{callToAction}}

Looking forward to connecting!

Best,
{{senderName}}`
    },
    formal: {
      subject: "Professional Introduction - {{senderTitle}}",
      body: `Dear {{recipientName}},

I am writing to introduce myself, having been made aware of your work through {{foundVia}}. Your achievements in {{specificPoints}} are particularly noteworthy.

As a {{senderTitle}} with {{senderBackground}}, I believe there could be value in establishing a professional connection.

{{callToAction}}

Thank you for considering this introduction.

Yours sincerely,
{{senderName}}`
    }
  },
  'other': {
    professional: {
      subject: "Professional Inquiry - {{senderTitle}}",
      body: `Dear {{recipientName}},

I hope this email finds you well. I came across your profile through {{foundVia}} and was particularly interested in {{specificPoints}}.

I am {{senderName}}, currently {{senderTitle}} with {{senderBackground}}.

{{callToAction}}

Thank you for your time and consideration.

Best regards,
{{senderName}}`
    },
    friendly: {
      subject: "Quick question for {{recipientName}}",
      body: `Hi {{recipientName}},

Hope you're having a great day! I found you through {{foundVia}} and was really interested in {{specificPoints}}.

I'm {{senderName}}, currently {{senderTitle}}. {{senderBackground}}

{{callToAction}}

Thanks for your time!

Best,
{{senderName}}`
    },
    formal: {
      subject: "Professional Inquiry - {{senderTitle}}",
      body: `Dear {{recipientName}},

I am writing regarding {{specificPoints}}, having discovered your profile through {{foundVia}}.

As a {{senderTitle}} with {{senderBackground}}, I wanted to reach out concerning this matter.

{{callToAction}}

Thank you for your consideration.

Yours sincerely,
{{senderName}}`
    }
  }
}

export function generateEmail(variables: TemplateVariables, purpose: string, tone: string): EmailTemplate {
  const template = templates[purpose]?.[tone];
  
  if (!template) {
    throw new Error('Template not found');
  }

  let subject = template.subject;
  let body = template.body;

  // Replace all variables in the template
  Object.entries(variables).forEach(([key, value]) => {
    const regex = new RegExp(`{{${key}}}`, 'g');
    subject = subject.replace(regex, value);
    body = body.replace(regex, value);
  });

  return { subject, body };
} 