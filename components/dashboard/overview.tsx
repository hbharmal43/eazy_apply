"use client"

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts'
import { addDays, format } from 'date-fns'
import { supabase } from '@/lib/supabase'

interface DailyApplications {
  date: string
  total: number
  responses: number
}

interface OverviewProps {
  timeRange: '7d' | '30d' | '90d'
}

export function Overview({ timeRange }: OverviewProps) {
  const [data, setData] = useState<DailyApplications[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchApplicationActivity() {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) throw new Error('Not authenticated')

        const endDate = new Date()
        const startDate = addDays(endDate, timeRange === '7d' ? -7 : timeRange === '30d' ? -30 : -90)

        // Get applications between start and end date
        const { data: applications, error: applicationsError } = await supabase
          .from('applications')
          .select('applied_date, status')
          .eq('user_id', user.id)
          .gte('applied_date', startDate.toISOString())
          .lte('applied_date', endDate.toISOString())
          .order('applied_date', { ascending: true })

        if (applicationsError) throw applicationsError

        // Process the data to get daily counts
        const dailyData = new Map<string, { total: number; responses: number }>()
        
        // Initialize all dates in the range
        let currentDate = startDate
        while (currentDate <= endDate) {
          const dateStr = format(currentDate, 'yyyy-MM-dd')
          dailyData.set(dateStr, { total: 0, responses: 0 })
          currentDate = addDays(currentDate, 1)
        }

        // Count applications and responses
        applications?.forEach(app => {
          const dateStr = format(new Date(app.applied_date), 'yyyy-MM-dd')
          const current = dailyData.get(dateStr) || { total: 0, responses: 0 }
          
          dailyData.set(dateStr, {
            total: current.total + 1,
            responses: current.responses + (
              ['screening', 'interview', 'offer'].includes(app.status) ? 1 : 0
            )
          })
        })

        // Convert to array and sort by date
        const chartData = Array.from(dailyData.entries()).map(([date, counts]) => ({
          date: format(new Date(date), 'MMM d'),
          total: counts.total,
          responses: counts.responses
        })).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

        setData(chartData)
      } catch (err) {
        console.error('Error fetching application activity:', err)
        setError('Failed to load application activity')
      } finally {
        setLoading(false)
      }
    }

    fetchApplicationActivity()
  }, [timeRange])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[350px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-[350px] text-red-500">
        {error}
      </div>
    )
  }

  return (
    <div className="h-[350px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{
            top: 5,
            right: 10,
            left: 10,
            bottom: 0,
          }}
        >
          <defs>
            <linearGradient id="total" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#0A66C2" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#0A66C2" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="responses" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="date"
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `${value}`}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="rounded-lg border bg-background p-2 shadow-sm">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex flex-col">
                        <span className="text-[0.70rem] uppercase text-muted-foreground">
                          Applications
                        </span>
                        <span className="font-bold text-[#0A66C2]">
                          {payload[0].value}
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[0.70rem] uppercase text-muted-foreground">
                          Responses
                        </span>
                        <span className="font-bold text-emerald-500">
                          {payload[1].value}
                        </span>
                      </div>
                    </div>
                  </div>
                )
              }
              return null
            }}
          />
          <Area
            type="monotone"
            dataKey="total"
            stroke="#0A66C2"
            strokeWidth={2}
            fill="url(#total)"
          />
          <Area
            type="monotone"
            dataKey="responses"
            stroke="#10B981"
            strokeWidth={2}
            fill="url(#responses)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
} 