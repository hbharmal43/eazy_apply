"use client"

import { useState, useEffect } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Overview } from "@/components/dashboard/overview"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { 
  TrendingUp, 
  Clock, 
  Target, 
  BarChart,
  Calendar,
  Building,
  MapPin,
  DollarSign
} from "lucide-react"

interface AnalyticsData {
  totalApplications: number
  averageTimePerApp: string
  weeklyAverage: number
  successRate: number
  applicationsByCompany: { name: string; count: number }[]
  applicationsByLocation: { location: string; count: number }[]
  salaryRanges: { range: string; count: number }[]
  weeklyProgress: number[]
}

export default function AnalyticsPage() {
  const [timeframe, setTimeframe] = useState("7d")
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<AnalyticsData>({
    totalApplications: 0,
    averageTimePerApp: "",
    weeklyAverage: 0,
    successRate: 0,
    applicationsByCompany: [],
    applicationsByLocation: [],
    salaryRanges: [],
    weeklyProgress: []
  })

  useEffect(() => {
    async function fetchAnalytics() {
      const supabase = createClientComponentClient()
      // TODO: Replace with actual analytics fetch from Supabase
      // This is mock data for now
      const mockData: AnalyticsData = {
        totalApplications: 127,
        averageTimePerApp: "2.5 min",
        weeklyAverage: 45,
        successRate: 15,
        applicationsByCompany: [
          { name: "Tech Corp", count: 15 },
          { name: "Startup Inc", count: 12 },
          { name: "Big Tech", count: 10 },
          { name: "Software Co", count: 8 },
          { name: "Dev Agency", count: 5 }
        ],
        applicationsByLocation: [
          { location: "Remote", count: 45 },
          { location: "San Francisco", count: 25 },
          { location: "New York", count: 20 },
          { location: "Seattle", count: 15 },
          { location: "Austin", count: 12 }
        ],
        salaryRanges: [
          { range: "$80k-100k", count: 20 },
          { range: "$100k-120k", count: 35 },
          { range: "$120k-140k", count: 40 },
          { range: "$140k-160k", count: 25 },
          { range: "$160k+", count: 7 }
        ],
        weeklyProgress: [35, 42, 45, 40, 38, 45, 50]
      }
      setData(mockData)
      setLoading(false)
    }
    fetchAnalytics()
  }, [timeframe])

  if (loading) {
    return <div className="flex h-screen items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
    </div>
  }

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
        <Select value={timeframe} onValueChange={setTimeframe}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select timeframe" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="90d">Last 90 days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Applications
            </CardTitle>
            <BarChart className="h-4 w-4 text-[#0A66C2]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.totalApplications}</div>
            <p className="text-xs text-muted-foreground">
              +{data.weeklyAverage} this week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Average Time per App
            </CardTitle>
            <Clock className="h-4 w-4 text-[#0A66C2]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.averageTimePerApp}</div>
            <p className="text-xs text-muted-foreground">
              Consistent speed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Weekly Average
            </CardTitle>
            <Calendar className="h-4 w-4 text-[#0A66C2]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.weeklyAverage}</div>
            <p className="text-xs text-muted-foreground">
              Applications per week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <Target className="h-4 w-4 text-[#0A66C2]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.successRate}%</div>
            <p className="text-xs text-muted-foreground">
              Response rate
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Application Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <Overview />
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Top Companies</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.applicationsByCompany.map((company, i) => (
                <div key={i} className="flex items-center">
                  <Building className="h-4 w-4 text-muted-foreground mr-2" />
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {company.name}
                    </p>
                    <div className="flex items-center text-xs text-muted-foreground">
                      {company.count} applications
                    </div>
                  </div>
                  <span className="text-sm font-medium">
                    {Math.round((company.count / data.totalApplications) * 100)}%
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Applications by Location</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.applicationsByLocation.map((loc, i) => (
                <div key={i}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 text-muted-foreground mr-2" />
                      <span className="text-sm font-medium">{loc.location}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {loc.count} applications
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-blue-100">
                    <div
                      className="h-full rounded-full bg-[#0A66C2]"
                      style={{
                        width: `${(loc.count / data.totalApplications) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Salary Ranges</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.salaryRanges.map((range, i) => (
                <div key={i} className="flex items-center">
                  <DollarSign className="h-4 w-4 text-muted-foreground mr-2" />
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {range.range}
                    </p>
                    <div className="flex items-center text-xs text-muted-foreground">
                      {range.count} positions
                    </div>
                  </div>
                  <span className="text-sm font-medium">
                    {Math.round((range.count / data.totalApplications) * 100)}%
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 