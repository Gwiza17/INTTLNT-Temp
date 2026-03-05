'use client'

import { Card, CardContent, CardHeader } from '@/components/ui/Card'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts'

const COLORS = [
  '#0088FE',
  '#00C49F',
  '#FFBB28',
  '#FF8042',
  '#8884D8',
  '#FF6B6B',
]

interface Props {
  stageData: { name: string; count: number }[]
  forecastData: { name: string; value: number }[]
  timelineData: { month: string; count: number }[]
  stageCounts: Record<string, number>
  forecastCounts: Record<string, number>
  totalReferrals: number
  activeCases: number
}

export function PartnerAnalyticsCharts({
  stageData,
  forecastData,
  timelineData,
  stageCounts,
  forecastCounts,
  totalReferrals,
  activeCases,
}: Props) {
  return (
    <>
      {/* KPI Cards */}
      <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
        <Card>
          <CardContent className='p-4'>
            <p className='text-sm text-gray-500'>Total Referrals</p>
            <p className='text-3xl font-bold'>{totalReferrals}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className='p-4'>
            <p className='text-sm text-gray-500'>Active Cases</p>
            <p className='text-3xl font-bold'>{activeCases}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className='p-4'>
            <p className='text-sm text-gray-500'>On Track</p>
            <p className='text-3xl font-bold'>{forecastCounts.on_track || 0}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className='p-4'>
            <p className='text-sm text-gray-500'>At Risk / Missed</p>
            <p className='text-3xl font-bold'>
              {(forecastCounts.at_risk || 0) + (forecastCounts.missed || 0)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        {/* Stage Distribution */}
        <Card>
          <CardHeader>
            <h2 className='text-lg font-semibold'>Referrals by Stage</h2>
          </CardHeader>
          <CardContent>
            {stageData.length > 0 ? (
              <ResponsiveContainer width='100%' height={300}>
                <BarChart
                  data={stageData}
                  layout='vertical'
                  margin={{ left: 100 }}
                >
                  <CartesianGrid strokeDasharray='3 3' />
                  <XAxis type='number' />
                  <YAxis dataKey='name' type='category' width={90} />
                  <Tooltip />
                  <Bar dataKey='count' fill='#3b82f6' />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className='text-gray-500 text-center py-8'>
                No stage data available
              </p>
            )}
          </CardContent>
        </Card>

        {/* Forecast Status */}
        <Card>
          <CardHeader>
            <h2 className='text-lg font-semibold'>Forecast Status</h2>
          </CardHeader>
          <CardContent>
            {forecastData.length > 0 ? (
              <ResponsiveContainer width='100%' height={300}>
                <PieChart>
                  <Pie
                    data={forecastData}
                    dataKey='value'
                    nameKey='name'
                    cx='50%'
                    cy='50%'
                    outerRadius={80}
                    label
                  >
                    {forecastData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className='text-gray-500 text-center py-8'>
                No forecast data available
              </p>
            )}
          </CardContent>
        </Card>

        {/* Referrals Over Time */}
        <Card className='lg:col-span-2'>
          <CardHeader>
            <h2 className='text-lg font-semibold'>
              Referrals Over Time (Last 6 Months)
            </h2>
          </CardHeader>
          <CardContent>
            {timelineData.length > 0 ? (
              <ResponsiveContainer width='100%' height={300}>
                <BarChart data={timelineData}>
                  <CartesianGrid strokeDasharray='3 3' />
                  <XAxis dataKey='month' />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey='count' fill='#10b981' />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className='text-gray-500 text-center py-8'>
                No referral data in the last 6 months
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Conversion Summary */}
      <Card>
        <CardHeader>
          <h2 className='text-lg font-semibold'>Conversion Summary</h2>
        </CardHeader>
        <CardContent>
          <div className='grid grid-cols-1 md:grid-cols-4 gap-4 text-center'>
            <div>
              <p className='text-sm text-gray-500'>EOI Submitted</p>
              <p className='text-2xl font-bold'>
                {stageCounts['EOI Submitted'] || 0}
              </p>
            </div>
            <div>
              <p className='text-sm text-gray-500'>IELTS Prep</p>
              <p className='text-2xl font-bold'>
                {stageCounts['IELTS Prep / IELTS Pending'] || 0}
              </p>
            </div>
            <div>
              <p className='text-sm text-gray-500'>Funding Approved</p>
              <p className='text-2xl font-bold'>
                {(stageCounts['Unconditional Funding'] || 0) +
                  (stageCounts['Conditional Funding Assessment'] || 0)}
              </p>
            </div>
            <div>
              <p className='text-sm text-gray-500'>Visa Granted</p>
              <p className='text-2xl font-bold'>
                {stageCounts['Visa Granted'] || 0}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  )
}
