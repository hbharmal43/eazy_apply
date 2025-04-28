"use client"

import { useEffect, useState } from 'react'
import { getRecentApplications } from '@/lib/api'
import type { Application } from '@/lib/api'
import { format } from 'date-fns'
import { 
  Building, 
  MapPin, 
  Calendar, 
  Clock,
  CheckCircle2, 
  XCircle, 
  Clock3,
  FileCheck,
  MessageSquare,
  Award,
  Ban,
  DollarSign
} from 'lucide-react'

export function RecentApplications() {
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadRecentApplications() {
      try {
        const data = await getRecentApplications(5)
        setApplications(data)
      } catch (err) {
        setError('Failed to load recent applications')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    loadRecentApplications()
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="px-4 py-6 text-red-500 bg-red-50 rounded-lg text-center">
        <XCircle className="h-8 w-8 mx-auto mb-2 text-red-500" />
        <p>{error}</p>
      </div>
    )
  }

  if (applications.length === 0) {
    return (
      <div className="px-4 py-10 text-gray-500 bg-gray-50 rounded-lg text-center">
        <FileCheck className="h-10 w-10 mx-auto mb-3 text-gray-400" />
        <p className="font-medium">No recent applications</p>
        <p className="text-sm mt-1">Start applying to jobs to see your activity here</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {applications.map((app) => (
        <div
          key={app.id}
          className="flex flex-col md:flex-row md:items-center justify-between p-4 border border-gray-200 rounded-xl hover:shadow-md transition-all duration-300 bg-white hover:bg-blue-50/30"
        >
          <div className="flex-1 flex items-start gap-3">
            <div className="bg-blue-100 rounded-xl p-3 text-blue-800 h-12 w-12 flex items-center justify-center">
              {app.company?.charAt(0) || 'C'}
            </div>
            
            <div className="flex-1">
              <h4 className="font-medium text-gray-900">{app.position}</h4>
              <div className="mt-1 flex flex-wrap gap-3 text-gray-600 text-sm">
                <div className="flex items-center gap-1">
                  <Building className="h-3.5 w-3.5" />
                  <span>{app.company || 'Unnamed Company'}</span>
                </div>
                
                {app.location && (
                  <div className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" />
                    <span>{app.location}</span>
                  </div>
                )}
                
                {app.salary_min && app.salary_max && (
                  <div className="flex items-center gap-1">
                    <DollarSign className="h-3.5 w-3.5" />
                    <span>
                      {app.salary_currency}{app.salary_min.toLocaleString()} - {app.salary_currency}{app.salary_max.toLocaleString()}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-between mt-3 md:mt-0">
            <div className="md:text-right">
              <div className="text-xs text-gray-500 flex items-center gap-1 md:justify-end">
                <Calendar className="h-3 w-3" />
                <span>{format(new Date(app.applied_date), 'MMM d, yyyy')}</span>
              </div>
              <div className="text-xs text-gray-500 flex items-center gap-1 mt-1 md:justify-end">
                <Clock className="h-3 w-3" />
                <span>{format(new Date(app.applied_date), 'h:mm a')}</span>
              </div>
            </div>
            
            <div className={`ml-4 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusStyle(app.status).bgColor}`}>
              {getStatusIcon(app.status)}
              <span>{getStatusLabel(app.status)}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

function getStatusIcon(status: Application['status']) {
  switch (status) {
    case 'applied':
      return <FileCheck className="h-3 w-3" />
    case 'screening':
      return <Clock3 className="h-3 w-3" />
    case 'interview':
      return <MessageSquare className="h-3 w-3" />
    case 'offer':
      return <Award className="h-3 w-3" />
    case 'rejected':
      return <XCircle className="h-3 w-3" />
    case 'withdrawn':
      return <Ban className="h-3 w-3" />
    default:
      return <Clock3 className="h-3 w-3" />
  }
}

function getStatusLabel(status: Application['status']) {
  return status.charAt(0).toUpperCase() + status.slice(1)
}

function getStatusStyle(status: Application['status']) {
  switch (status) {
    case 'applied':
      return {
        bgColor: 'bg-blue-100 text-blue-800',
      }
    case 'screening':
      return {
        bgColor: 'bg-purple-100 text-purple-800',
      }
    case 'interview':
      return {
        bgColor: 'bg-orange-100 text-orange-800',
      }
    case 'offer':
      return {
        bgColor: 'bg-green-100 text-green-800',
      }
    case 'rejected':
      return {
        bgColor: 'bg-red-100 text-red-800',
      }
    case 'withdrawn':
      return {
        bgColor: 'bg-gray-100 text-gray-800',
      }
    default:
      return {
        bgColor: 'bg-gray-100 text-gray-800',
      }
  }
} 