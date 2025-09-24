"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Overview } from "@/components/dashboard/overview"
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
  Flame,
  ArrowRight
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from '@/components/ui/progress'
import { getApplicationStats, getProfile, updateDailyGoal } from '@/lib/api'
import type { ApplicationStats, Profile } from '@/lib/api'
import Link from "next/link"

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [stats, setStats] = useState<ApplicationStats>({
    total_applications: 0,
    applications_this_week: 0,
    applications_today: 0,
    current_streak: 0,
    response_rate: 0,
    longest_streak: 0,
    last_application_date: '',
    streak_start_date: ''
  })
  const [profile, setProfile] = useState<Profile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('7d')
  const [isEditingGoal, setIsEditingGoal] = useState(false)
  const [dailyGoal, setDailyGoal] = useState(5)

  const profileName = profile?.full_name || user?.user_metadata?.full_name || '';

  useEffect(() => {
    const supabase = createClientComponentClient()
    
    async function getUserData() {
      setIsLoading(true)
      try {
        // Get auth user
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          setUser(user)
          
          // Get profile
          const profile = await getProfile()
          setProfile(profile)
          
          // Get application stats
          const stats = await getApplicationStats()
          setStats(stats)
          
          // Set daily goal from profile
          if (profile?.daily_goal) {
            setDailyGoal(profile.daily_goal)
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setIsLoading(false)
      }
    }
    
    getUserData()
  }, [])
  
  const handleEditGoal = () => {
    setIsEditingGoal(true)
  }
  
  const handleSaveGoal = async (newGoal: number) => {
    setDailyGoal(newGoal)
    setIsEditingGoal(false)
    
    // Update in database
    try {
      await updateDailyGoal(newGoal)
    } catch (error) {
      console.error("Error updating daily goal:", error)
    }
  }

  return (
    <div className="flex flex-col gap-8 min-h-screen">
      {/* Welcome Section */}
      <div className="relative flex items-center justify-between p-6 overflow-hidden rounded-xl bg-gradient-to-r from-[#0A66C2]/90 to-[#1E88E5]/90 text-white shadow-lg">
        <div className="absolute inset-0 bg-grid-white/5 [mask-image:linear-gradient(0deg,#ffffff10,#ffffff80)]"></div>
        <div className="relative">
          <h1 className="text-4xl font-bold tracking-tight text-white">
            Welcome back, {profileName || 'User'}
          </h1>
          <p className="mt-1 text-blue-100">Ready to accelerate your job search?</p>
        </div>
        <Button className="relative bg-white text-[#0A66C2] hover:bg-blue-50 px-6 py-2 rounded-lg shadow-md transition-all hover:shadow-lg font-medium flex items-center gap-2 hover:scale-105 duration-300">
          <Rocket className="h-4 w-4" />
          Quick Apply Now
        </Button>
        
        {/* Decorative elements */}
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-blue-500/20 blur-3xl"></div>
        <div className="absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-blue-400/20 blur-3xl"></div>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Daily Progress */}
        <Card className="bg-white border-none shadow-md hover:shadow-lg transition-all duration-300 rounded-xl overflow-hidden group">
          <CardHeader className="flex flex-row items-center justify-between pb-2 border-b bg-gradient-to-r from-blue-50 to-white">
            <div className="flex items-center gap-2">
              <CardTitle className="text-base font-semibold text-gray-800">Daily Progress</CardTitle>
              <button
                onClick={handleEditGoal}
                className="text-gray-400 hover:text-[#0A66C2] transition-colors"
                title="Edit goal"
              >
                <Pencil className="h-3.5 w-3.5" />
              </button>
            </div>
            <div className="text-[#0A66C2] bg-blue-100 p-2 rounded-full group-hover:scale-110 transition-transform">
              <Target className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold text-gray-900">
                  {stats.applications_today || 0}
                </span>
                <span className="text-xl font-semibold text-gray-500">
                  /{dailyGoal}
                </span>
              </div>
              <div className="text-sm font-medium text-gray-500">
                {((stats.applications_today || 0) / dailyGoal * 100).toFixed(0)}%
              </div>
            </div>
            <Progress
              value={((stats.applications_today || 0) / dailyGoal) * 100}
              className="h-2.5 bg-blue-100"
            />
            <div className="mt-3">
              {stats.applications_today >= dailyGoal ? (
                <div className="text-emerald-600 font-medium flex items-center gap-1 text-sm">
                  <Trophy className="h-4 w-4" />
                  Daily goal achieved!
                </div>
              ) : (
                <div className="text-[#0A66C2] font-medium text-sm">
                  {dailyGoal - (stats.applications_today || 0)} more to reach your goal
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Weekly Progress */}
        <Card className="bg-white border-none shadow-md hover:shadow-lg transition-all duration-300 rounded-xl overflow-hidden group">
          <CardHeader className="flex flex-row items-center justify-between pb-2 border-b bg-gradient-to-r from-blue-50 to-white">
            <CardTitle className="text-base font-semibold text-gray-800">Weekly Progress</CardTitle>
            <div className="text-[#0A66C2] bg-blue-100 p-2 rounded-full group-hover:scale-110 transition-transform">
              <Calendar className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="flex flex-col">
              <div className="flex items-baseline justify-between">
                <div className="text-3xl font-bold text-gray-900">{stats.applications_this_week || 0}</div>
                <div className="text-gray-500 text-sm">/{dailyGoal * 7}</div>
              </div>
              
              <div className="mt-2 w-full bg-gray-100 rounded-full h-2.5">
                <div 
                  className="bg-[#0A66C2] h-2.5 rounded-full transition-all duration-300" 
                  style={{ width: `${Math.min(((stats.applications_this_week || 0) / (dailyGoal * 7)) * 100, 100)}%` }}
                ></div>
              </div>
              
              <div className="mt-3">
                {stats.applications_this_week >= (dailyGoal * 7) ? (
                  <div className="text-emerald-600 font-medium text-sm">
                    Weekly goal achieved! 🎉
                  </div>
                ) : (
                  <div className="text-[#0A66C2] font-medium text-sm">
                    {(dailyGoal * 7) - (stats.applications_this_week || 0)} more to reach weekly goal
                  </div>
                )}
                <div className="text-gray-500 text-xs mt-1">
                  Average: {((stats.applications_this_week || 0) / 7).toFixed(1)} per day
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Current Streak */}
        <Card className="bg-white border-none shadow-md hover:shadow-lg transition-all duration-300 rounded-xl overflow-hidden group">
          <CardHeader className="flex flex-row items-center justify-between pb-2 border-b bg-gradient-to-r from-yellow-50 to-white">
            <CardTitle className="text-base font-semibold text-gray-800">Current Streak</CardTitle>
            <div className="text-amber-500 bg-amber-100 p-2 rounded-full group-hover:scale-110 transition-transform">
              <Flame className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="flex items-baseline gap-2">
              <div className="text-3xl font-bold text-gray-900">{stats.current_streak || 0}</div>
              <div className="text-gray-500">days</div>
            </div>
            <div className="mt-2 text-sm text-gray-500">
              Started {stats.streak_start_date ? new Date(stats.streak_start_date).toLocaleDateString() : 'Recently'}
            </div>
            <div className="mt-3 text-blue-600 text-sm font-medium">
              Keep it going! Apply today to maintain your streak
            </div>
          </CardContent>
        </Card>

        {/* Longest Streak */}
        <Card className="bg-white border-none shadow-md hover:shadow-lg transition-all duration-300 rounded-xl overflow-hidden group">
          <CardHeader className="flex flex-row items-center justify-between pb-2 border-b bg-gradient-to-r from-amber-50 to-white">
            <CardTitle className="text-base font-semibold text-gray-800">Longest Streak</CardTitle>
            <div className="text-amber-500 bg-amber-100 p-2 rounded-full group-hover:scale-110 transition-transform">
              <Trophy className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="flex flex-col">
              <div className="flex items-baseline gap-2">
                <div className="text-3xl font-bold text-gray-900">{stats.longest_streak || 3}</div>
                <div className="text-gray-500">days</div>
              </div>
              
              <div className="flex items-center gap-1 mt-2">
                <div className="text-amber-500 text-sm font-medium">Personal Best</div>
                <div className="text-amber-500">
                  <Trophy className="h-3.5 w-3.5" />
                </div>
              </div>
              
              <div className="mt-3 text-gray-600 text-sm">
                3 days to beat your record
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
        {/* Application Overview */}
        <Card className="bg-white border-none shadow-md hover:shadow-lg transition-all duration-300 rounded-xl overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between border-b pb-4 bg-gradient-to-r from-blue-50 to-white">
            <CardTitle className="text-lg font-semibold text-gray-800">Application Activity</CardTitle>
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value as any)}
              className="text-sm rounded-lg border border-gray-300 p-1.5 bg-white hover:border-blue-300 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all outline-none"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
            </select>
          </CardHeader>
          <CardContent className="pt-4">
            <Overview timeRange={timeRange} />
          </CardContent>
        </Card>

        {/* Quick Tips */}
        <Card className="bg-white border-none shadow-md hover:shadow-lg transition-all duration-300 rounded-xl overflow-hidden">
          <CardHeader className="border-b pb-4 bg-gradient-to-r from-blue-50 to-white">
            <CardTitle className="text-lg font-semibold text-gray-800">Quick Tips</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="space-y-5">
              <div className="flex gap-4 p-3 rounded-lg hover:bg-blue-50 transition-colors">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-3 rounded-xl shadow-sm">
                  <Target className="h-5 w-5" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-semibold text-gray-800">Daily Goal: {dailyGoal} Applications</h4>
                  <p className="text-sm text-gray-600">Stay consistent with your daily targets for better results</p>
                </div>
              </div>
              
              <div className="flex gap-4 p-3 rounded-lg hover:bg-blue-50 transition-colors">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-3 rounded-xl shadow-sm">
                  <Clock className="h-5 w-5" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-semibold text-gray-800">Best Time to Apply</h4>
                  <p className="text-sm text-gray-600">Apply within 24 hours of job posting for higher visibility</p>
                </div>
              </div>
              
              <div className="flex gap-4 p-3 rounded-lg hover:bg-blue-50 transition-colors">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-3 rounded-xl shadow-sm">
                  <Lightning className="h-5 w-5" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-semibold text-gray-800">Speed Matters</h4>
                  <p className="text-sm text-gray-600">Aim to complete each application in under 3 minutes</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* EditGoalDialog */}
      {isEditingGoal && (
        <EditGoalDialog
          isOpen={isEditingGoal}
          currentGoal={dailyGoal}
          onClose={() => setIsEditingGoal(false)}
          onSave={handleSaveGoal}
        />
      )}
    </div>
  )
} 