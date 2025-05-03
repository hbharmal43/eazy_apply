"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead,
  TableHeader,
  TableRow 
} from "@/components/ui/table"
import { Bot, FileText, Clock, Calendar, ChevronRight, Loader2 } from "lucide-react"
import { getAssistantSessions } from "@/lib/api"
import type { AIAssistantSession } from "@/lib/api"
import { format } from "date-fns"

export default function AssistantHistoryPage() {
  const [sessions, setSessions] = useState<AIAssistantSession[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  
  useEffect(() => {
    loadSessions()
  }, [])
  
  async function loadSessions() {
    try {
      setLoading(true)
      const sessions = await getAssistantSessions()
      setSessions(sessions)
    } catch (error) {
      console.error("Error loading sessions:", error)
    } finally {
      setLoading(false)
    }
  }
  
  const viewSession = (id: string) => {
    router.push(`/dashboard/assistant/history/${id}`)
  }
  
  return (
    <div className="container mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Saved Assistant Sessions</h1>
        <Button 
          onClick={() => router.push('/dashboard/assistant')}
          className="flex items-center"
        >
          <Bot className="mr-2 h-4 w-4" />
          New Session
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Clock className="h-5 w-5 mr-2 text-blue-500" />
            Session History
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center py-10">
              <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            </div>
          ) : sessions.length === 0 ? (
            <div className="text-center py-10">
              <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p className="text-gray-500">No sessions saved yet.</p>
              <p className="text-gray-500 text-sm mt-1">Start a conversation with the assistant and save content to see it here.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Generated Content</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              
              <TableBody>
                {sessions.map((session) => (
                  <TableRow key={session.id}>
                    <TableCell className="font-medium">{session.title}</TableCell>
                    <TableCell>
                      {format(new Date(session.created_at), "MMM d, yyyy h:mm a")}
                    </TableCell>
                    <TableCell>
                      {session.generated_content_path ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <FileText className="h-3 w-3 mr-1" />
                          Available
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          None
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => viewSession(session.id)}
                        className="flex items-center"
                      >
                        View
                        <ChevronRight className="ml-1 h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
} 