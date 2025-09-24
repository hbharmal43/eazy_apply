"use client"

import { useState, useEffect } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  Search, 
  Filter, 
  Loader2, 
  FileText, 
  Plus, 
  Building, 
  MapPin, 
  Calendar,
  Globe,
  FileCheck,
  CheckCircle2,
  XCircle,
  Clock3,
  MessageSquare,
  Award,
  Ban,
  ChevronDown,
  EyeIcon
} from "lucide-react"
import { formatDistanceToNow, format } from "date-fns"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ApplicationDetailsModal } from "@/components/dashboard/ApplicationDetailsModal"

interface Application {
  id: number
  position: string
  company: string
  location: string
  applied_date: string
  source: string
  status: string
  custom_resume_url?: string
  custom_resume_generated_at?: string
  custom_resume_status?: 'not_generated' | 'generating' | 'completed' | 'failed'
}

interface StatusStyleProps {
  bgColor: string;
  textColor: string;
  icon: JSX.Element;
}

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedApplicationId, setSelectedApplicationId] = useState<string | null>(null)
  const itemsPerPage = 10

  useEffect(() => {
    async function fetchApplications() {
      try {
        setLoading(true)
        const supabase = createClientComponentClient()
        
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) throw new Error('Not authenticated')

        const { data, error } = await supabase
          .from('applications')
          .select('*')
          .eq('user_id', user.id)
          .order('applied_date', { ascending: false })

        if (error) throw error

        setApplications(data || [])
      } catch (err) {
        console.error('Error fetching applications:', err)
        setError('Failed to load applications')
      } finally {
        setLoading(false)
      }
    }
    fetchApplications()
  }, [])

  const filteredApplications = applications.filter(app => 
    app.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
    app.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
    app.location.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Statistics
  const totalApplied = applications.length
  const pendingApplications = applications.filter(app => 
    ['applied', 'screening', 'interview'].includes(app.status.toLowerCase())
  ).length
  const successfulApplications = applications.filter(app => 
    app.status.toLowerCase() === 'offer'
  ).length
  const rejectedApplications = applications.filter(app => 
    app.status.toLowerCase() === 'rejected'
  ).length

  // Pagination calculations
  const totalItems = filteredApplications.length
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentItems = filteredApplications.slice(startIndex, endIndex)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleRowClick = (applicationId: number) => {
    setSelectedApplicationId(applicationId.toString())
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedApplicationId(null)
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="px-4 py-6 text-red-500 bg-red-50 rounded-lg text-center">
          <XCircle className="h-8 w-8 mx-auto mb-2 text-red-500" />
          <p className="font-medium">{error}</p>
          <p className="text-sm mt-1">Please try again later</p>
        </div>
      </div>
    )
  }

  const getStatusStyle = (status: string): StatusStyleProps => {
    switch (status.toLowerCase()) {
      case 'applied':
        return {
          bgColor: 'bg-blue-100',
          textColor: 'text-blue-800',
          icon: <FileCheck className="h-3.5 w-3.5 mr-1" />
        }
      case 'screening':
        return {
          bgColor: 'bg-purple-100',
          textColor: 'text-purple-800',
          icon: <Clock3 className="h-3.5 w-3.5 mr-1" />
        }
      case 'interview':
        return {
          bgColor: 'bg-orange-100',
          textColor: 'text-orange-800',
          icon: <MessageSquare className="h-3.5 w-3.5 mr-1" />
        }
      case 'offer':
        return {
          bgColor: 'bg-green-100',
          textColor: 'text-green-800',
          icon: <Award className="h-3.5 w-3.5 mr-1" />
        }
      case 'rejected':
        return {
          bgColor: 'bg-red-100',
          textColor: 'text-red-800',
          icon: <XCircle className="h-3.5 w-3.5 mr-1" />
        }
      case 'withdrawn':
        return {
          bgColor: 'bg-gray-100',
          textColor: 'text-gray-800',
          icon: <Ban className="h-3.5 w-3.5 mr-1" />
        }
      default:
        return {
          bgColor: 'bg-gray-100',
          textColor: 'text-gray-800',
          icon: <Clock3 className="h-3.5 w-3.5 mr-1" />
        }
    }
  }

  return (
    <div className="flex flex-col gap-8 min-h-screen">
      {/* Header Section */}
      <div className="relative flex items-center justify-between p-6 overflow-hidden rounded-xl bg-gradient-to-r from-[#0A66C2]/90 to-[#1E88E5]/90 text-white shadow-lg">
        <div className="absolute inset-0 bg-grid-white/5 [mask-image:linear-gradient(0deg,#ffffff10,#ffffff80)]"></div>
        <div className="relative">
          <h1 className="text-4xl font-bold tracking-tight text-white">
            Applications
          </h1>
          <p className="mt-1 text-blue-100">Track and manage your job applications</p>
        </div>
        <Button className="relative bg-white text-[#0A66C2] hover:bg-blue-50 px-6 py-2 rounded-lg shadow-md transition-all hover:shadow-lg font-medium flex items-center gap-2 hover:scale-105 duration-300">
          <Plus className="h-4 w-4" />
          New Application
        </Button>
        
        {/* Decorative elements */}
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-blue-500/20 blur-3xl"></div>
        <div className="absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-blue-400/20 blur-3xl"></div>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-white border-none shadow-md hover:shadow-lg transition-all duration-300 rounded-xl overflow-hidden group">
          <CardHeader className="flex flex-row items-center justify-between pb-2 border-b bg-gradient-to-r from-blue-50 to-white">
            <CardTitle className="text-base font-semibold text-gray-800">Total Applications</CardTitle>
            <div className="text-[#0A66C2] bg-blue-100 p-2 rounded-full group-hover:scale-110 transition-transform">
              <FileText className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-3xl font-bold text-gray-900">{totalApplied}</div>
            <p className="text-sm text-gray-500 mt-1">All time applications</p>
          </CardContent>
        </Card>

        <Card className="bg-white border-none shadow-md hover:shadow-lg transition-all duration-300 rounded-xl overflow-hidden group">
          <CardHeader className="flex flex-row items-center justify-between pb-2 border-b bg-gradient-to-r from-blue-50 to-white">
            <CardTitle className="text-base font-semibold text-gray-800">Pending</CardTitle>
            <div className="text-[#0A66C2] bg-blue-100 p-2 rounded-full group-hover:scale-110 transition-transform">
              <Clock3 className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-3xl font-bold text-gray-900">{pendingApplications}</div>
            <p className="text-sm text-gray-500 mt-1">Awaiting response</p>
          </CardContent>
        </Card>

        <Card className="bg-white border-none shadow-md hover:shadow-lg transition-all duration-300 rounded-xl overflow-hidden group">
          <CardHeader className="flex flex-row items-center justify-between pb-2 border-b bg-gradient-to-r from-green-50 to-white">
            <CardTitle className="text-base font-semibold text-gray-800">Offers</CardTitle>
            <div className="text-green-600 bg-green-100 p-2 rounded-full group-hover:scale-110 transition-transform">
              <Award className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-3xl font-bold text-gray-900">{successfulApplications}</div>
            <p className="text-sm text-gray-500 mt-1">Job offers received</p>
          </CardContent>
        </Card>

        <Card className="bg-white border-none shadow-md hover:shadow-lg transition-all duration-300 rounded-xl overflow-hidden group">
          <CardHeader className="flex flex-row items-center justify-between pb-2 border-b bg-gradient-to-r from-red-50 to-white">
            <CardTitle className="text-base font-semibold text-gray-800">Rejected</CardTitle>
            <div className="text-red-600 bg-red-100 p-2 rounded-full group-hover:scale-110 transition-transform">
              <XCircle className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-3xl font-bold text-gray-900">{rejectedApplications}</div>
            <p className="text-sm text-gray-500 mt-1">Applications not successful</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card className="bg-white border-none shadow-md rounded-xl overflow-hidden">
        <CardContent className="pt-6 pb-4">
      <div className="flex gap-4 items-center">
        <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
                placeholder="Search by position, company or location..."
                className="pl-10 py-2 border-gray-200 focus:border-blue-300 focus:ring-2 focus:ring-blue-100 rounded-lg"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
            <Button variant="outline" className="flex gap-2 border-gray-200 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300 rounded-lg">
          <Filter className="h-4 w-4" />
          Filters
              <ChevronDown className="h-4 w-4" />
        </Button>
      </div>
        </CardContent>
      </Card>

      {/* Applications List */}
      <Card className="bg-white border-none shadow-md rounded-xl overflow-hidden">
        <CardHeader className="border-b pb-4 bg-gradient-to-r from-blue-50 to-white">
          <CardTitle className="text-lg font-semibold text-gray-800">Application History</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
      {loading ? (
            <div className="flex justify-center items-center py-16">
              <div className="flex flex-col items-center">
                <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
                <p className="mt-4 text-gray-500">Loading your applications...</p>
              </div>
        </div>
      ) : (
            <>
              <div className="max-h-[500px] overflow-y-auto custom-scrollbar">
          <Table>
                  <TableHeader className="sticky top-0 z-10">
                    <TableRow className="bg-gray-50 border-b">
                      <TableHead className="font-semibold text-gray-700 bg-gray-50">Position</TableHead>
                      <TableHead className="font-semibold text-gray-700 bg-gray-50">Company</TableHead>
                      <TableHead className="font-semibold text-gray-700 bg-gray-50">Location</TableHead>
                      <TableHead className="font-semibold text-gray-700 bg-gray-50">Applied Date</TableHead>
                      <TableHead className="font-semibold text-gray-700 bg-gray-50">Source</TableHead>
                      <TableHead className="font-semibold text-gray-700 bg-gray-50">Custom Resume</TableHead>
                      <TableHead className="font-semibold text-gray-700 bg-gray-50">Status</TableHead>
                      <TableHead className="font-semibold text-gray-700 bg-gray-50">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
                    {currentItems.length === 0 ? (
                <TableRow>
                        <TableCell colSpan={8} className="text-center py-16 text-gray-500">
                          <FileText className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                          <p className="font-medium">
                    {searchQuery ? 'No applications match your search' : 'No applications yet'}
                          </p>
                          <p className="text-sm mt-1">
                            {searchQuery ? 'Try adjusting your search terms' : 'Start tracking your job applications'}
                          </p>
                  </TableCell>
                </TableRow>
              ) : (
                      currentItems.map((app) => {
                        const statusStyle = getStatusStyle(app.status);
                        return (
                          <TableRow 
                            key={app.id} 
                            className="hover:bg-blue-50/30 transition-colors cursor-pointer" 
                            onClick={() => handleRowClick(app.id)}
                          >
                            <TableCell className="font-medium text-gray-900">{app.position}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <div className="bg-blue-100 rounded-md p-1.5 text-blue-800 h-7 w-7 flex items-center justify-center text-xs font-bold">
                                  {app.company?.charAt(0) || 'C'}
                                </div>
                                <span>{app.company}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1.5">
                                <MapPin className="h-3.5 w-3.5 text-gray-400" />
                                <span>{app.location || 'Remote'}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex flex-col">
                                <div className="flex items-center gap-1.5">
                                  <Calendar className="h-3.5 w-3.5 text-gray-400" />
                                  <span>{format(new Date(app.applied_date), 'MMM d, yyyy')}</span>
                                </div>
                                <span className="text-gray-400 text-xs mt-0.5">
                                  {formatDistanceToNow(new Date(app.applied_date), { addSuffix: true })}
                                </span>
                              </div>
                            </TableCell>
                    <TableCell>
                              <div className="flex items-center gap-1.5">
                                <Globe className="h-3.5 w-3.5 text-gray-400" />
                                <span>{app.source}</span>
                              </div>
                    </TableCell>
                    <TableCell className="text-center">
                      {app.custom_resume_url ? (
                        <a href={app.custom_resume_url} target="_blank" rel="noopener noreferrer" title="View Custom Resume">
                          <FileText className="h-5 w-5 text-blue-600 hover:text-blue-800 inline" />
                        </a>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                              <div className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${statusStyle.bgColor} ${statusStyle.textColor}`}>
                                {statusStyle.icon}
                        {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                              </div>
                    </TableCell>
                    <TableCell>
                              <Button variant="ghost" size="sm" className="rounded-full hover:bg-blue-100 hover:text-blue-800 p-2">
                                <EyeIcon className="h-4 w-4" />
                              </Button>
                    </TableCell>
                  </TableRow>
                        )
                      })
              )}
            </TableBody>
          </Table>
        </div>

              {totalItems > 0 && (
                <div className="flex flex-col gap-2 items-center justify-center py-6 border-t">
                  <div className="text-sm text-gray-500">
                    Showing {startIndex + 1} to {Math.min(endIndex, totalItems)} of {totalItems} applications
                  </div>
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious 
                          onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                          className={`${currentPage === 1 ? "opacity-50" : "cursor-pointer hover:bg-blue-50 hover:text-blue-700"}`}
                        />
                      </PaginationItem>
                      
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                        if (
                          page === 1 ||
                          page === totalPages ||
                          (page >= currentPage - 1 && page <= currentPage + 1)
                        ) {
                          return (
                            <PaginationItem key={page}>
                              <PaginationLink
                                onClick={() => handlePageChange(page)}
                                isActive={page === currentPage}
                                className={page === currentPage ? "bg-blue-600" : "hover:bg-blue-50 hover:text-blue-700"}
                              >
                                {page}
                              </PaginationLink>
                            </PaginationItem>
                          )
                        } else if (
                          page === currentPage - 2 ||
                          page === currentPage + 2
                        ) {
                          return (
                            <PaginationItem key={page}>
                              <PaginationEllipsis />
                            </PaginationItem>
                          )
                        }
                        return null
                      })}

                      <PaginationItem>
                        <PaginationNext
                          onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
                          className={`${currentPage === totalPages ? "opacity-50" : "cursor-pointer hover:bg-blue-50 hover:text-blue-700"}`}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Application Details Modal */}
      {selectedApplicationId && (
        <ApplicationDetailsModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          applicationId={selectedApplicationId}
        />
      )}
    </div>
  )
} 