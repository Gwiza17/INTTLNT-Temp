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
} from 'recharts'

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8']

interface Props {
  totalCases: number
  approvalRate: number
  ieltsAbove7: number
  coupleCount: number
  casesByStage: { name: string; count: unknown }[]
  ieltsData: { name: string; value: unknown }[]
  gpaData: { name: string; value: unknown }[]
  coupleData: { name: string; value: number }[]
}

export function AnalyticsCharts({
  totalCases,
  approvalRate,
  ieltsAbove7,
  coupleCount,
  casesByStage,
  ieltsData,
  gpaData,
  coupleData,
}: Props) {
  return (
    <div className='space-y-6'>
      <h1 className='text-2xl font-bold'>Portfolio Analytics</h1>
      <p className='text-gray-600'>
        Aggregated, anonymized statistics across all cases.
      </p>

      {/* KPI Cards */}
      <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
        <Card>
          <CardContent className='p-4'>
            <p className='text-sm text-gray-500'>Total Cases</p>
            <p className='text-3xl font-bold'>{totalCases}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className='p-4'>
            <p className='text-sm text-gray-500'>Funding Approval Rate</p>
            <p className='text-3xl font-bold'>{approvalRate}%</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className='p-4'>
            <p className='text-sm text-gray-500'>IELTS ≥7.0</p>
            <p className='text-3xl font-bold'>{ieltsAbove7}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className='p-4'>
            <p className='text-sm text-gray-500'>Skilled Couples</p>
            <p className='text-3xl font-bold'>{coupleCount}</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <Card>
          <CardHeader>
            <h2 className='text-lg font-semibold'>Cases by Stage</h2>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width='100%' height={300}>
              <BarChart data={casesByStage}>
                <CartesianGrid strokeDasharray='3 3' />
                <XAxis
                  dataKey='name'
                  angle={-45}
                  textAnchor='end'
                  height={80}
                />
                <YAxis />
                <Tooltip />
                <Bar dataKey='count' fill='#3b82f6' />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h2 className='text-lg font-semibold'>IELTS Band Distribution</h2>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width='100%' height={300}>
              <PieChart>
                <Pie
                  data={ieltsData.map((entry, index) => ({
                    ...entry,
                    fill: COLORS[index % COLORS.length],
                  }))}
                  dataKey='value'
                  nameKey='name'
                  cx='50%'
                  cy='50%'
                  outerRadius={80}
                  label
                />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h2 className='text-lg font-semibold'>GPA Distribution</h2>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width='100%' height={300}>
              <BarChart data={gpaData}>
                <CartesianGrid strokeDasharray='3 3' />
                <XAxis dataKey='name' />
                <YAxis />
                <Tooltip />
                <Bar dataKey='value' fill='#10b981' />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h2 className='text-lg font-semibold'>Partner vs Single</h2>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width='100%' height={300}>
              <PieChart>
                <Pie
                  data={coupleData.map((entry, index) => ({
                    ...entry,
                    fill: COLORS[index % COLORS.length],
                  }))}
                  dataKey='value'
                  nameKey='name'
                  cx='50%'
                  cy='50%'
                  outerRadius={80}
                  label
                />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
