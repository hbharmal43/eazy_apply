"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Overview } from "@/components/dashboard/overview"
import { RecentApplications } from "@/components/dashboard/recent-applications"
import { EditGoalDialog } from "@/components/dashboard/edit-goal-dialog"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { 
  Target, 
  Clock, 
  FileCheck, 
  TrendingUp,
  Rocket,
  Calendar,
  Zap,
  Trophy,
  Pencil,
  Globe,
  Building,
  Home,
  DollarSign,
  Zap as Lightning,
  Flame
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from '@/components/ui/progress'
import { getApplicationStats, getProfile, updateDailyGoal } from '@/lib/api'
import type { ApplicationStats, Profile } from '@/lib/api'
import Link from "next/link"

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<ApplicationStats | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('7d')
  const [isEditingGoal, setIsEditingGoal] = useState(false)
  const [dailyGoal, setDailyGoal] = useState(10)
  const [profileName, setProfileName] = useState('')
  const supabase = createClientComponentClient()

  useEffect(() => {
    async function getUser() {
      const { data } = await supabase.auth.getUser()
      setUser(data.user)
      
      // Fetch profile name
      if (data.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('full_name')
          .eq('id', data.user.id)
          .single()
        
        if (profile?.full_name) {
          setProfileName(profile.full_name)
        }
      }
      
      setLoading(false)
    }
    getUser()
  }, [supabase])

  useEffect(() => {
    async function loadProfile() {
      try {
        const profile = await getProfile()
        if (profile?.daily_goal) {
          setDailyGoal(profile.daily_goal)
        }
      } catch (err) {
        console.error('Error loading profile:', err)
      }
    }

    loadProfile()
  }, [])

  useEffect(() => {
    async function loadStats() {
      if (!user) return; // Don't load stats if no user
      try {
        console.log('Fetching application stats...')
        const data: ApplicationStats = await getApplicationStats()
        console.log('Application Stats:', {
          total_applications: data.total_applications,
          current_streak: data.current_streak,
          longest_streak: data.longest_streak,
          last_application_date: data.last_application_date
        })
        setStats(data)
      } catch (err) {
        console.error('Error loading stats:', err)
        setError('Failed to load application statistics')
      } finally {
        setLoading(false)
      }
    }

    loadStats()
  }, [user])

  const handleSaveGoal = async (newGoal: number) => {
    try {
      await updateDailyGoal(newGoal)
      setDailyGoal(newGoal)
      // Refresh stats after updating the goal
      const updatedStats = await getApplicationStats()
      setStats(updatedStats)
      const tipElement = document.querySelector('[data-daily-goal-tip]')
      if (tipElement) {
        tipElement.textContent = `Daily Goal: ${newGoal} Applications`
      }
    } catch (err) {
      console.error('Error updating daily goal:', err)
    }
  }

  if (loading) {
    return <div className="flex h-screen items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
    </div>
  }

  return (
    <div className="flex flex-col gap-8 p-8 bg-gray-50 min-h-screen">
      {/* Welcome Section */}
      <div className="flex items-center justify-between bg-white rounded-xl p-6 shadow-sm">
        <div>
          <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-[#0A66C2] to-[#1E88E5] bg-clip-text text-transparent">
            Welcome back, {profileName || 'User'}
          </h1>
          <p className="text-gray-600 mt-1">Ready to accelerate your job search?</p>
        </div>
        <Button className="bg-gradient-to-r from-[#0A66C2] to-[#1E88E5] hover:from-[#084e96] hover:to-[#1976D2] text-white px-6 py-2 rounded-lg shadow-md transition-all hover:shadow-lg">
          + Quick Apply Now
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {loading ? (
          Array(4).fill(0).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Loading...</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">--</div>
              </CardContent>
            </Card>
          ))
        ) : error ? (
          <div className="col-span-4 text-red-500 text-center bg-red-50 p-4 rounded-lg">{error}</div>
        ) : stats ? (
          <>
            <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 border-b">
                <CardTitle className="text-sm font-semibold text-gray-700">Daily Progress</CardTitle>
                <div className="flex items-center gap-2">
                  {stats.applications_today >= dailyGoal && (
                    <div className="text-emerald-500">
                      <FileCheck className="h-5 w-5" />
                    </div>
                  )}
                  <button
                    onClick={() => setIsEditingGoal(true)}
                    className="p-2 hover:bg-blue-50 rounded-full transition-colors"
                  >
                    <Pencil className="h-4 w-4 text-[#0A66C2]" />
                  </button>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold text-gray-900">
                      {stats.applications_today || 0}
                    </span>
                    <span className="text-xl font-semibold text-gray-600">
                      /{dailyGoal}
                    </span>
                  </div>
                  <div className="text-sm font-medium">
                    {((stats.applications_today || 0) / dailyGoal * 100).toFixed(0)}%
                  </div>
                </div>
                <Progress
                  value={((stats.applications_today || 0) / dailyGoal) * 100}
                  className="h-2.5 bg-blue-100"
                />
                <div className="mt-3 text-sm">
                  {stats.applications_today >= dailyGoal ? (
                    <div className="text-emerald-600 font-medium flex items-center gap-1">
                      <Trophy className="h-4 w-4" />
                      Daily goal achieved!
                    </div>
                  ) : (
                    <div className="text-blue-600 font-medium">
                      {dailyGoal - (stats.applications_today || 0)} more to reach your goal
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 border-b">
                <CardTitle className="text-sm font-semibold text-gray-700">Weekly Progress</CardTitle>
                <div className="text-blue-500">
                  <Calendar className="h-5 w-5" />
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold text-gray-900">
                      {stats.applications_this_week || 0}
                    </span>
                    <span className="text-xl font-semibold text-gray-600">
                      /{dailyGoal * 7}
                    </span>
                  </div>
                  <div className="text-sm font-medium">
                    {((stats.applications_this_week || 0) / (dailyGoal * 7) * 100).toFixed(0)}%
                  </div>
                </div>
                <Progress
                  value={((stats.applications_this_week || 0) / (dailyGoal * 7)) * 100}
                  className={`h-2.5 ${
                    stats.applications_this_week >= dailyGoal * 7
                      ? 'bg-emerald-100'
                      : 'bg-blue-100'
                  }`}
                />
                <div className="mt-3">
                  {stats.applications_this_week >= dailyGoal * 7 ? (
                    <div className="text-emerald-600 text-sm font-medium flex items-center gap-1">
                      <Trophy className="h-4 w-4" />
                      Weekly goal achieved!
                    </div>
                  ) : (
                    <div className="flex flex-col gap-1">
                      <div className="text-blue-600 text-sm font-medium">
                        {dailyGoal * 7 - (stats.applications_this_week || 0)} more to reach weekly goal
                      </div>
                      <div className="text-xs text-gray-600">
                        Average: {((stats.applications_this_week || 0) / 7).toFixed(1)} per day
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 border-b">
                <CardTitle className="text-sm font-semibold text-gray-700">Current Streak</CardTitle>
                <div className="text-orange-500">
                  {stats.current_streak > 0 ? <Flame className="h-5 w-5" /> : null}
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="flex items-center gap-2">
                  <div className="text-3xl font-bold mb-1 text-gray-900">
                    {stats.current_streak}
                  </div>
                  <div className="text-xl font-semibold text-gray-600">days</div>
                </div>
                <div className="mt-2">
                  {stats.current_streak > 0 ? (
                    <div className="flex flex-col gap-1">
                      <div className="text-sm font-medium text-gray-900">
                        Started {new Date(stats.streak_start_date).toLocaleDateString()}
                      </div>
                      <div className="text-xs text-gray-600">
                        Keep it going! Apply today to maintain your streak
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-blue-600">
                      <Rocket className="h-4 w-4" />
                      <span className="text-sm">Start your streak today!</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 border-b">
                <CardTitle className="text-sm font-semibold text-gray-700">Longest Streak</CardTitle>
                <div className="text-yellow-500">
                  <Trophy className="h-5 w-5" />
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="flex items-center gap-2">
                  <div className="text-3xl font-bold mb-1 text-gray-900">
                    {stats.longest_streak}
                  </div>
                  <div className="text-xl font-semibold text-gray-600">days</div>
                </div>
                <div className="mt-2">
                  {stats.longest_streak > 0 ? (
                    <div className="flex flex-col gap-1">
                      <div className="text-sm font-medium text-emerald-600">
                        Personal Best 🏆
                      </div>
                      {stats.current_streak >= stats.longest_streak ? (
                        <div className="text-xs text-blue-600 font-medium">
                          You're on a record streak!
                        </div>
                      ) : (
                        <div className="text-xs text-gray-600">
                          {stats.longest_streak - stats.current_streak} days to beat your record
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-sm text-gray-600">
                      Start applying to set your record!
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </>
        ) : null}
      </div>

      {/* Main Content */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        {/* Application Overview */}
        <Card className="col-span-4 bg-white shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="border-b">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-semibold text-gray-900">Application Activity</CardTitle>
              <select 
                className="text-sm border rounded-lg p-2 bg-gray-50 hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value as '7d' | '30d' | '90d')}
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 3 months</option>
              </select>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <Overview timeRange={timeRange} />
          </CardContent>
        </Card>

        {/* Quick Tips */}
        <Card className="col-span-3 bg-white shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="border-b">
            <CardTitle className="text-xl font-semibold text-gray-900">Quick Tips</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-6">
              <div className="flex items-start space-x-4 p-4 rounded-lg hover:bg-blue-50 transition-colors">
                <div className="bg-gradient-to-br from-[#0A66C2] to-[#1E88E5] p-3 rounded-lg shadow-sm">
                  <Target className="h-5 w-5 text-white" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-gray-900" data-daily-goal-tip>
                    Daily Goal: {dailyGoal} Applications
                  </p>
                  <p className="text-sm text-gray-600">
                    Stay consistent with your daily targets for better results
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-4 rounded-lg hover:bg-blue-50 transition-colors">
                <div className="bg-gradient-to-br from-[#0A66C2] to-[#1E88E5] p-3 rounded-lg shadow-sm">
                  <Clock className="h-5 w-5 text-white" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-gray-900">Best Time to Apply</p>
                  <p className="text-sm text-gray-600">Apply within 24 hours of job posting for higher visibility</p>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-4 rounded-lg hover:bg-blue-50 transition-colors">
                <div className="bg-gradient-to-br from-[#0A66C2] to-[#1E88E5] p-3 rounded-lg shadow-sm">
                  <Zap className="h-5 w-5 text-white" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-gray-900">Speed Matters</p>
                  <p className="text-sm text-gray-600">Aim to complete each application in under 3 minutes</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Applications */}
        <Card className="col-span-7 bg-white shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="border-b">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-semibold text-gray-900">Recent Applications</CardTitle>
              <Button 
                variant="outline" 
                size="sm" 
                asChild
                className="border-[#0A66C2] text-[#0A66C2] hover:bg-blue-50"
              >
                <Link href="/dashboard/applications">View All</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <RecentApplications />
          </CardContent>
        </Card>
      </div>

      {/* EditGoalDialog remains unchanged */}
      <EditGoalDialog
        isOpen={isEditingGoal}
        onClose={() => setIsEditingGoal(false)}
        currentGoal={dailyGoal}
        onSave={handleSaveGoal}
      />
    </div>
  )
} 