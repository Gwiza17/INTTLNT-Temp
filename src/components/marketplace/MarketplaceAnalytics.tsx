'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader } from '@/components/ui/Card'
import { TrendingUp, Users, Eye, CheckCircle, Clock, XCircle, BarChart3 } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

interface AnalyticsData {
  totalInterests: number
  totalApprovals: number
  totalDeclines: number
  pendingInterests: number
  approvalRate: number
  cohortBreakdown: Array<{
    cohort: string
    interests: number
    approvals: number
  }>
  recentActivity: Array<{
    date: string
    interests: number
    approvals: number
  }>
}

interface MarketplaceAnalyticsProps {
  /** Filter by stakeholder role (optional) */
  role?: string
  /** Show compact version */
  compact?: boolean
}

const COLORS = ['#0B1F3B', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4']

export default function MarketplaceAnalytics({ role, compact = false }: MarketplaceAnalyticsProps) {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadAnalytics()
  }, [role])

  const loadAnalytics = async () => {
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        setError('User not authenticated')
        return
      }

      // Get stakeholder info
      const { data: stakeholder } = await supabase
        .from('stakeholders')
        .select('id, roles')
        .eq('user_id', user.id)
        .eq('status', 'approved')
        .single()

      if (!stakeholder) {
        setError('Not an approved stakeholder')
        return
      }

      // Get all interest records for this stakeholder
      const { data: interests, error: interestsError } = await supabase
        .from('marketplace_interest')
        .select(`
          id, status, expressed_at,
          candidate_marketplace_profiles (
            cohorts (name, discipline)
          )
        `)
        .eq('stakeholder_id', stakeholder.id)

      if (interestsError) throw interestsError

      // Process analytics data
      const processedData = processAnalyticsData(interests || [])
      setAnalytics(processedData)

    } catch (err) {
      console.error('Error loading analytics:', err)
      setError('Failed to load analytics')
    } finally {
      setLoading(false)
    }
  }

  const processAnalyticsData = (interests: any[]): AnalyticsData => {
    const totalInterests = interests.length
    const approvedInterests = interests.filter(i => i.status === 'approved')
    const declinedInterests = interests.filter(i => i.status === 'declined')
    const pendingInterests = interests.filter(i => i.status === 'pending')

    const totalApprovals = approvedInterests.length
    const totalDeclines = declinedInterests.length
    const approvalRate = totalInterests > 0 ? (totalApprovals / (totalApprovals + totalDeclines)) * 100 : 0

    // Cohort breakdown
    const cohortMap = new Map()
    interests.forEach(interest => {
      const cohortName = interest.candidate_marketplace_profiles?.cohorts?.name || 'Unknown'
      if (!cohortMap.has(cohortName)) {
        cohortMap.set(cohortName, { interests: 0, approvals: 0 })
      }
      const cohortData = cohortMap.get(cohortName)
      cohortData.interests++
      if (interest.status === 'approved') {
        cohortData.approvals++
      }
    })

    const cohortBreakdown = Array.from(cohortMap.entries()).map(([cohort, data]) => ({
      cohort,
      interests: data.interests,
      approvals: data.approvals
    })).sort((a, b) => b.interests - a.interests).slice(0, 8)

    // Recent activity (last 7 days)
    const recentActivity = generateRecentActivity(interests)

    return {
      totalInterests,
      totalApprovals,
      totalDeclines,
      pendingInterests: pendingInterests.length,
      approvalRate: Math.round(approvalRate),
      cohortBreakdown,
      recentActivity
    }
  }

  const generateRecentActivity = (interests: any[]) => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - (6 - i))
      return date.toISOString().split('T')[0]
    })

    return last7Days.map(date => {
      const dayInterests = interests.filter(i => 
        i.expressed_at.split('T')[0] === date
      )
      const dayApprovals = dayInterests.filter(i => i.status === 'approved')

      return {
        date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        interests: dayInterests.length,
        approvals: dayApprovals.length
      }
    })
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-3">
            <div className="h-4 bg-gray-200 rounded w-1/3"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error || !analytics) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <BarChart3 size={32} className="text-gray-300 mx-auto mb-2" />
          <p className="text-gray-500 text-sm">{error || 'No analytics data available'}</p>
        </CardContent>
      </Card>
    )
  }

  const stats = [
    { 
      label: 'Total Interests', 
      value: analytics.totalInterests, 
      icon: Eye, 
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    { 
      label: 'Approvals', 
      value: analytics.totalApprovals, 
      icon: CheckCircle, 
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    { 
      label: 'Pending', 
      value: analytics.pendingInterests, 
      icon: Clock, 
      color: 'text-amber-600',
      bgColor: 'bg-amber-50'
    },
    { 
      label: 'Approval Rate', 
      value: `${analytics.approvalRate}%`, 
      icon: TrendingUp, 
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
  ]

  if (compact) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <stat.icon size={16} className={stat.color} />
                </div>
                <div>
                  <p className="text-xs text-gray-500">{stat.label}</p>
                  <p className="text-lg font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                  <stat.icon size={20} className={stat.color} />
                </div>
                <div>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Activity Timeline */}
        <Card>
          <CardHeader>
            <h3 className="font-semibold flex items-center gap-2">
              <BarChart3 size={18} />
              Recent Activity (7 days)
            </h3>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={analytics.recentActivity}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="interests" fill="#0B1F3B" name="Interests" />
                <Bar dataKey="approvals" fill="#10b981" name="Approvals" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Cohort Breakdown */}
        <Card>
          <CardHeader>
            <h3 className="font-semibold flex items-center gap-2">
              <Users size={18} />
              Top Cohorts by Interest
            </h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analytics.cohortBreakdown.slice(0, 5).map((cohort, index) => {
                const approvalRate = cohort.interests > 0 ? (cohort.approvals / cohort.interests) * 100 : 0
                return (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-sm">{cohort.cohort}</p>
                      <p className="text-xs text-gray-500">
                        {cohort.interests} interests · {cohort.approvals} approvals
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-green-600">
                        {Math.round(approvalRate)}%
                      </p>
                      <p className="text-xs text-gray-400">approval</p>
                    </div>
                  </div>
                )
              })}
              {analytics.cohortBreakdown.length === 0 && (
                <p className="text-center text-gray-400 py-8 text-sm">
                  No cohort data available yet
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Status Distribution */}
      {analytics.totalInterests > 0 && (
        <Card>
          <CardHeader>
            <h3 className="font-semibold">Interest Status Distribution</h3>
          </CardHeader>
          <CardContent>
            <div className="grid lg:grid-cols-2 gap-6 items-center">
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Approved', value: analytics.totalApprovals, color: '#10b981' },
                      { name: 'Declined', value: analytics.totalDeclines, color: '#ef4444' },
                      { name: 'Pending', value: analytics.pendingInterests, color: '#f59e0b' },
                    ].filter(item => item.value > 0)}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={(entry) => `${entry.name}: ${entry.value}`}
                  >
                    {[
                      { name: 'Approved', value: analytics.totalApprovals, color: '#10b981' },
                      { name: 'Declined', value: analytics.totalDeclines, color: '#ef4444' },
                      { name: 'Pending', value: analytics.pendingInterests, color: '#f59e0b' },
                    ].filter(item => item.value > 0).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              
              <div className="space-y-3">
                {[
                  { label: 'Approved', value: analytics.totalApprovals, color: 'bg-green-500' },
                  { label: 'Declined', value: analytics.totalDeclines, color: 'bg-red-500' },
                  { label: 'Pending', value: analytics.pendingInterests, color: 'bg-amber-500' },
                ].filter(item => item.value > 0).map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                      <span className="text-sm text-gray-600">{item.label}</span>
                    </div>
                    <span className="font-semibold">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
