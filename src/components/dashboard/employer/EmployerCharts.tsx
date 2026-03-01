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
  totalCandidates: number
  ieltsReady: number
  coupleCount: number
  selfFunded: number
  disciplineData: { name: string; value: number }[]
  intakeData: { year: string; count: number }[]
  partnershipData: { name: string; value: number }[]
  fundingData: { name: string; value: number }[]
}

export function EmployerCharts({
  totalCandidates,
  ieltsReady,
  coupleCount,
  selfFunded,
  disciplineData,
  intakeData,
  partnershipData,
  fundingData,
}: Props) {
  return (
    <div className='space-y-6'>
      <h1 className='text-2xl font-bold'>Candidate Pool Analytics</h1>
      <p className='text-gray-600'>
        Aggregated, anonymized statistics about all candidates in the pipeline.
      </p>

      {/* KPI Cards */}
      <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
        <Card>
          <CardContent className='p-4'>
            <p className='text-sm text-gray-500'>Total Candidates</p>
            <p className='text-3xl font-bold'>{totalCandidates}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className='p-4'>
            <p className='text-sm text-gray-500'>IELTS ≥7.0</p>
            <p className='text-3xl font-bold'>{ieltsReady}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className='p-4'>
            <p className='text-sm text-gray-500'>Skilled Couples</p>
            <p className='text-3xl font-bold'>{coupleCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className='p-4'>
            <p className='text-sm text-gray-500'>Self‑funded</p>
            <p className='text-3xl font-bold'>{selfFunded}</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <Card>
          <CardHeader>
            <h2 className='text-lg font-semibold'>Candidates by Discipline</h2>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width='100%' height={300}>
              <BarChart data={disciplineData}>
                <CartesianGrid strokeDasharray='3 3' />
                <XAxis dataKey='name' />
                <YAxis />
                <Tooltip />
                <Bar dataKey='value' fill='#3b82f6' />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h2 className='text-lg font-semibold'>
              Candidates by Expected Graduation Year
            </h2>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width='100%' height={300}>
              <BarChart data={intakeData}>
                <CartesianGrid strokeDasharray='3 3' />
                <XAxis dataKey='year' />
                <YAxis />
                <Tooltip />
                <Bar dataKey='count' fill='#10b981' />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h2 className='text-lg font-semibold'>
              Partner Skill Distribution
            </h2>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width='100%' height={300}>
              <PieChart>
                <Pie
                  data={partnershipData.map((entry, index) => ({
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
            <h2 className='text-lg font-semibold'>Funding Type</h2>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width='100%' height={300}>
              <PieChart>
                <Pie
                  data={fundingData.map((entry, index) => ({
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
