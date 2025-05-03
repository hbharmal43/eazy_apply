"use client"

import { useState, useEffect, useRef } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar } from "@/components/ui/avatar"
import { Bot, Send, User, FileText, FileEdit, Download, Loader2, FileOutput, Copy, Save, Clock } from "lucide-react"
import { getProfile, saveGeneratedContent, saveAssistantSession } from "@/lib/api"
import type { Profile, AIMessage, AIResponse } from "@/lib/api"
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { toast } from "@/components/ui/use-toast"

interface ChatMessage {
  role: "user" | "assistant"
  content: string
}

interface ProfileData {
  fullName: string
  title: string
  email: string
  phone: string
  location: string
  bio: string
  education: {
    school: string
    degree: string
    date: string
  }[]
  experience: {
    title: string
    company: string
    location: string
    date: string
    description: string
  }[]
  projects: {
    name: string
    description: string
    url: string
  }[]
  skills: string[]
  languages: string[]
  socials: {
    linkedin?: string
    github?: string
    portfolio?: string
  }
}

export default function AssistantPage() {
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content: "👋 Hello! I'm your EazyApply AI Assistant. I can help you with:\n\n- Creating tailored resumes for specific job positions\n- Writing personalized cover letters\n- Providing job application advice based on your profile\n- Optimizing your LinkedIn profile\n- Preparing for interviews\n\nJust let me know what you need help with today!"
    }
  ])
  const [input, setInput] = useState("")
  const [profileData, setProfileData] = useState<ProfileData | null>(null)
  const [activeTab, setActiveTab] = useState("chat")
  const [generatedContent, setGeneratedContent] = useState("")
  const [contentType, setContentType] = useState<"plain" | "resume" | "cover-letter">("plain")
  const [showSuggestions, setShowSuggestions] = useState(true)
  const messagesEndRef = useRef<null | HTMLDivElement>(null)
  const textareaRef = useRef<null | HTMLTextAreaElement>(null)
  const supabase = createClientComponentClient()
  const router = useRouter()

  useEffect(() => {
    loadUserProfile()
  }, [])
  
  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  async function loadUserProfile() {
    try {
      setLoading(true)
      const profile = await getProfile()
      
      if (profile) {
        setProfileData({
          fullName: profile.full_name || "",
          title: profile.title || "",
          email: profile.email || "",
          phone: profile.phone || "",
          location: profile.location || "",
          bio: profile.bio || "",
          education: profile.education || [],
          experience: profile.experience || [],
          projects: profile.projects || [],
          skills: profile.skills || [],
          languages: profile.languages || [],
          socials: profile.socials || {}
        })
      }
    } catch (error) {
      console.error("Error loading profile:", error)
    } finally {
      setLoading(false)
    }
  }

  const formatContent = (content: string, type: "plain" | "resume" | "cover-letter") => {
    // Basic content doesn't need formatting
    if (type === "plain") return content;
    
    // For resumes and cover letters, we can add some basic formatting
    // This is a simple example; you might want to use a markdown parser for better formatting
    return content
      .replace(/\n\n/g, '<br/><br/>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/# (.*?)(\n|$)/g, '<h1>$1</h1>')
      .replace(/## (.*?)(\n|$)/g, '<h2>$1</h2>')
      .replace(/### (.*?)(\n|$)/g, '<h3>$1</h3>');
  }

  const sendMessage = async () => {
    if (!input.trim()) return
    
    const userMessage = input
    setInput("")
    
    // Add user message to chat
    setMessages(prev => [
      ...prev, 
      { role: "user", content: userMessage }
    ])
    
    setSending(true)
    
    try {
      // Prepare system message with user profile data
      const systemPrompt = `You are an AI assistant for EazyApply, a job application tracking platform.
You have access to the user's profile data:
${JSON.stringify(profileData, null, 2)}

Your goal is to help the user with job application materials like resumes, cover letters, 
and provide personalized advice based on their profile information.
Be professional, supportive, and provide specific, tailored advice.

When creating resumes or cover letters:
1. Use markdown formatting for structure
2. Include appropriate sections (Education, Experience, Skills, etc.)
3. Tailor the content to the specific job or industry
4. Keep content professional and concise`
      
      // Format messages for the API
      const apiMessages = [
        { role: "system", content: systemPrompt },
        ...messages.map(msg => ({ role: msg.role, content: msg.content })),
        { role: "user", content: userMessage }
      ]
      
      // Use OpenRouter API key from environment variables
      // The API key is stored in the .env.local file as NEXT_PUBLIC_OPENROUTER_API_KEY
      const apiKey = process.env.NEXT_PUBLIC_OPENROUTER_API_KEY || "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";
      
      // Make API call to OpenRouter API
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "HTTP-Referer": "https://eazyapply.com",
          "X-Title": "EazyApply Assistant",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          "model": "deepseek/deepseek-chat-v3-0324:free",
          "messages": apiMessages
        })
      })
      
      const data = await response.json()
      
      if (data.choices && data.choices.length > 0) {
        const aiResponse = data.choices[0].message.content
        
        // Add AI response to chat
        setMessages(prev => [
          ...prev,
          { role: "assistant", content: aiResponse }
        ])
        
        // If generating resume or cover letter, set the generated content
        if (userMessage.toLowerCase().includes("resume") || userMessage.toLowerCase().includes("cv")) {
          setGeneratedContent(aiResponse)
          setContentType("resume")
          if (activeTab === "chat") {
            setActiveTab("generated")
          }
        } else if (userMessage.toLowerCase().includes("cover letter")) {
          setGeneratedContent(aiResponse)
          setContentType("cover-letter")
          if (activeTab === "chat") {
            setActiveTab("generated")
          }
        } else {
          setContentType("plain")
        }
      } else {
        // Handle error
        setMessages(prev => [
          ...prev,
          { role: "assistant", content: "I apologize, but I encountered an error processing your request. Please try again." }
        ])
      }
    } catch (error) {
      console.error("Error calling AI API:", error)
      setMessages(prev => [
        ...prev,
        { role: "assistant", content: "I apologize, but I encountered an error processing your request. Please try again." }
      ])
    } finally {
      setSending(false)
    }
  }
  
  const handleDownload = (format: 'txt' | 'md' | 'pdf') => {
    const filename = contentType === "resume" 
      ? "my_resume" 
      : contentType === "cover-letter" 
        ? "cover_letter" 
        : "generated_content";
    
    if (format === 'txt' || format === 'md') {
      const element = document.createElement("a")
      const content = format === 'md' ? generatedContent : generatedContent.replace(/\*\*/g, '').replace(/\*/g, '')
      const file = new Blob([content], {type: format === 'md' ? 'text/markdown' : 'text/plain'})
      element.href = URL.createObjectURL(file)
      element.download = `${filename}.${format}`
      document.body.appendChild(element)
      element.click()
      document.body.removeChild(element)
    } else if (format === 'pdf') {
      // For PDF, we'd typically want to use a library like jsPDF or html2pdf
      // This is a placeholder for that functionality
      alert("PDF download functionality will be implemented in a future update.")
    }
  }
  
  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(generatedContent)
      .then(() => {
        toast({
          title: "Copied to clipboard",
          description: "Content has been copied to your clipboard."
        })
      })
      .catch(err => {
        console.error("Could not copy text: ", err)
        toast({
          title: "Copy failed",
          description: "Failed to copy to clipboard.",
          variant: "destructive"
        })
      })
  }
  
  const handleSaveToAccount = async () => {
    if (!generatedContent) return;
    
    const contentTypeForSave = contentType === "resume" 
      ? "resume" 
      : contentType === "cover-letter" 
        ? "cover_letter" 
        : "note";
    
    try {
      // Save the content to storage
      const savedPath = await saveGeneratedContent(generatedContent, contentTypeForSave);
      
      if (savedPath) {
        // Generate a title based on the content type and first user message
        const userMessages = messages.filter(m => m.role === "user");
        const firstUserMessage = userMessages.length > 0 ? userMessages[0].content : "";
        const title = contentType === "resume" 
          ? `Resume: ${firstUserMessage.substring(0, 30)}...` 
          : contentType === "cover-letter"
            ? `Cover Letter: ${firstUserMessage.substring(0, 30)}...`
            : `Note: ${firstUserMessage.substring(0, 30)}...`;
        
        // Save the session including messages
        const sessionMessages = messages.map(m => ({
          role: m.role,
          content: m.content
        }));
        
        const savedSession = await saveAssistantSession(sessionMessages, title, savedPath);
        
        toast({
          title: "Content saved",
          description: "Your generated content and conversation have been saved to your account."
        });
      } else {
        throw new Error("Failed to save content");
      }
    } catch (error) {
      console.error("Error saving content:", error);
      toast({
        title: "Save failed",
        description: "Failed to save content to your account.",
        variant: "destructive"
      });
    }
  }
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion)
    setShowSuggestions(false)
    // Focus the textarea
    textareaRef.current?.focus()
  }

  const suggestions = [
    "Help me create a resume tailored for a software engineering position.",
    "Write a cover letter for a marketing role at Google.",
    "How can I improve my LinkedIn profile?",
    "What skills should I highlight for a data analyst position?",
    "Give me tips for my upcoming job interview."
  ]

  return (
    <div className="container mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">AI Assistant</h1>
        <Button 
          variant="outline"
          onClick={() => router.push('/dashboard/assistant/history')}
          className="flex items-center"
        >
          <Clock className="mr-2 h-4 w-4" />
          View Session History
        </Button>
      </div>
      
      <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start">
          <Bot className="h-5 w-5 mr-2 mt-0.5 text-blue-500" />
          <div>
            <h2 className="font-semibold text-blue-800">Your Personalized AI Career Assistant</h2>
            <p className="text-blue-700 mt-1">This AI assistant has access to your profile information and can help create personalized job application materials. Ask for help with resumes, cover letters, interview prep, or general job search advice.</p>
          </div>
        </div>
      </div>
      
      <Tabs defaultValue="chat" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="chat">Chat</TabsTrigger>
          <TabsTrigger value="generated">Generated Content</TabsTrigger>
        </TabsList>
        
        <TabsContent value="chat" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="w-full md:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bot className="h-5 w-5 mr-2 text-blue-500" />
                  Chat with AI Assistant
                </CardTitle>
              </CardHeader>
              
              <CardContent>
                <div className="flex flex-col space-y-4 h-[calc(70vh-200px)] overflow-y-auto p-4 rounded-lg bg-gray-50">
                  {messages.map((message, i) => (
                    <div 
                      key={i} 
                      className={`flex ${message.role === "assistant" ? "justify-start" : "justify-end"}`}
                    >
                      <div className={`flex items-start max-w-[80%] ${message.role === "assistant" ? "flex-row" : "flex-row-reverse"}`}>
                        <div className={`flex-shrink-0 ${message.role === "assistant" ? "mr-3" : "ml-3"}`}>
                          {message.role === "assistant" ? (
                            <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center">
                              <Bot className="h-5 w-5 text-white" />
                            </div>
                          ) : (
                            <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                              <User className="h-5 w-5 text-gray-700" />
                            </div>
                          )}
                        </div>
                        
                        <div 
                          className={`p-3 rounded-lg ${
                            message.role === "assistant" 
                              ? "bg-white border border-gray-200" 
                              : "bg-blue-500 text-white"
                          }`}
                        >
                          <p className="whitespace-pre-wrap">{message.content}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {showSuggestions && messages.length === 1 && (
                    <div className="mt-4">
                      <p className="text-sm text-gray-500 mb-2">Try asking:</p>
                      <div className="flex flex-wrap gap-2">
                        {suggestions.map((suggestion, index) => (
                          <button
                            key={index}
                            onClick={() => handleSuggestionClick(suggestion)}
                            className="px-3 py-1.5 bg-white border border-gray-200 rounded-full text-sm hover:bg-gray-50 transition-colors"
                          >
                            {suggestion}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </div>
              </CardContent>
              
              <CardFooter>
                <div className="flex w-full items-center space-x-2">
                  <Textarea
                    ref={textareaRef}
                    placeholder="Ask me about creating resumes, cover letters, or job application advice..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="flex-1 min-h-[60px] max-h-[120px]"
                    disabled={sending}
                    onFocus={() => setShowSuggestions(false)}
                  />
                  <Button 
                    onClick={sendMessage} 
                    disabled={sending || !input.trim()}
                    className="h-full"
                  >
                    {sending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </CardFooter>
            </Card>
            
            <Card className="w-full hidden md:block">
              <CardHeader>
                <CardTitle className="text-sm font-medium">What can the assistant help with?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border rounded-lg p-3">
                  <h3 className="font-medium text-sm mb-1">Resume Creation</h3>
                  <p className="text-xs text-gray-500">Get a tailored resume based on your profile data and target role.</p>
                </div>
                
                <div className="border rounded-lg p-3">
                  <h3 className="font-medium text-sm mb-1">Cover Letters</h3>
                  <p className="text-xs text-gray-500">Generate personalized cover letters for specific companies.</p>
                </div>
                
                <div className="border rounded-lg p-3">
                  <h3 className="font-medium text-sm mb-1">LinkedIn Optimization</h3>
                  <p className="text-xs text-gray-500">Get tips to improve your LinkedIn profile.</p>
                </div>
                
                <div className="border rounded-lg p-3">
                  <h3 className="font-medium text-sm mb-1">Interview Preparation</h3>
                  <p className="text-xs text-gray-500">Practice with common interview questions for your field.</p>
                </div>
                
                <div className="text-xs text-gray-500 mt-4">
                  <p className="font-medium mb-1">Example prompts:</p>
                  <ul className="list-disc pl-4 space-y-1">
                    <li>"Create a resume for a Front-End Developer position at Netflix"</li>
                    <li>"Write a cover letter for a Data Analyst role at Microsoft"</li>
                    <li>"What skills should I highlight for a UX Designer position?"</li>
                    <li>"Help me prepare for a product manager interview"</li>
                    <li>"How can I improve my LinkedIn headline?"</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="generated">
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="h-5 w-5 mr-2 text-blue-500" />
                Generated Content
              </CardTitle>
            </CardHeader>
            
            <CardContent>
              <div className="bg-white border rounded-lg p-4 min-h-[calc(70vh-200px)]">
                {generatedContent ? (
                  <div className="whitespace-pre-wrap">
                    {generatedContent}
                  </div>
                ) : (
                  <div className="text-center text-gray-500 mt-20">
                    <FileEdit className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No content generated yet. Ask the assistant to create a resume or cover letter.</p>
                  </div>
                )}
              </div>
            </CardContent>
            
            {generatedContent && (
              <CardFooter className="flex justify-between">
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    onClick={handleCopyToClipboard}
                    className="flex items-center"
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copy
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={handleSaveToAccount}
                    className="flex items-center"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save to Account
                  </Button>
                </div>
                
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setActiveTab("chat")
                    }}
                  >
                    Back to Chat
                  </Button>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button className="flex items-center">
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => handleDownload('txt')}>
                        <FileText className="h-4 w-4 mr-2" />
                        Text (.txt)
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDownload('md')}>
                        <FileOutput className="h-4 w-4 mr-2" />
                        Markdown (.md)
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDownload('pdf')}>
                        <FileText className="h-4 w-4 mr-2" />
                        PDF (.pdf)
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardFooter>
            )}
          </Card>
        </TabsContent>
      </Tabs>
      
      {loading && (
        <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-50">
          <div className="flex flex-col items-center">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500 mb-2" />
            <p>Loading your profile data...</p>
          </div>
        </div>
      )}
    </div>
  )
} 