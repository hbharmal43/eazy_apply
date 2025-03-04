"use client"

import { useEffect, useState } from 'react'
import { getRecentApplications } from '@/lib/api'
import type { Application } from '@/lib/api'
import { format } from 'date-fns'

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

  return (
    <div>
      {loading ? (
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
        </div>
      ) : error ? (
        <div className="text-red-500 text-center">{error}</div>
      ) : applications.length === 0 ? (
        <div className="text-center text-gray-500">No recent applications</div>
      ) : (
        <div className="space-y-4">
          {applications.map((app) => (
            <div
              key={app.id}
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex-1">
                <h4 className="font-medium">{app.position}</h4>
                <div className="text-sm text-gray-500">
                  {app.company} • {app.location}
                </div>
                <div className="text-sm text-gray-500">
                  {app.salary_min && app.salary_max
                    ? `${app.salary_currency}${app.salary_min.toLocaleString()} - ${app.salary_currency}${app.salary_max.toLocaleString()}`
                    : 'Salary not specified'}
                </div>
              </div>
              <div className="flex flex-col items-end gap-1">
                <div className="text-sm font-medium">
                  {format(new Date(app.applied_date), 'MMM d, h:mm a')}
                </div>
                <div className={`text-sm ${getStatusColor(app.status)}`}>
                  {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function getStatusColor(status: Application['status']) {
  switch (status) {
    case 'applied':
      return 'text-blue-600'
    case 'screening':
      return 'text-purple-600'
    case 'interview':
      return 'text-orange-600'
    case 'offer':
      return 'text-green-600'
    case 'rejected':
      return 'text-red-600'
    case 'withdrawn':
      return 'text-gray-600'
    default:
      return 'text-gray-600'
  }
} 