# EazyApply

Job application tracker with AI-powered features to help manage and optimize your job search.

## Features

- Dashboard with job application analytics
- Application tracking and management
- Resume and profile management
- Streak tracking for consistent job applications
- AI Assistant for resume and cover letter generation

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```
# OpenRouter API Key for AI Assistant
NEXT_PUBLIC_OPENROUTER_API_KEY=your_openrouter_api_key_here
```

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Run the development server: `npm run dev`

## AI Assistant

The AI Assistant feature uses OpenRouter API to provide personalized resume and cover letter generation based on the user's profile information. The assistant can help with:

- Creating tailored resumes for specific job positions
- Writing personalized cover letters
- Providing job application advice
- Optimizing LinkedIn profiles
- Interview preparation

To setup the AI Assistant:

1. Get an API key from [OpenRouter](https://openrouter.ai)
2. Add the API key to your `.env.local` file
3. The assistant will be available in the dashboard under "AI Assistant"

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
