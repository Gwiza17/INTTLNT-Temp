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
} from 'recharts'

interface Props {
  totalApplicants: number
  above7: number
  avgGpa: string
  chartData: { name: string; count: number }[]
}

export function EducationProviderCharts({
  totalApplicants,
  above7,
  avgGpa,
  chartData,
}: Props) {
  return (
    <div className='space-y-6'>
      <h1 className='text-2xl font-bold'>Pipeline Analytics</h1>
      <p className='text-gray-600'>
        Anonymized statistics across all applicants.
      </p>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
        <Card>
          <CardContent className='p-4'>
            <p className='text-sm text-gray-500'>Total Applicants</p>
            <p className='text-3xl font-bold'>{totalApplicants}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className='p-4'>
            <p className='text-sm text-gray-500'>IELTS ≥7.0</p>
            <p className='text-3xl font-bold'>{above7}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className='p-4'>
            <p className='text-sm text-gray-500'>Average GPA</p>
            <p className='text-3xl font-bold'>{avgGpa}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <h2 className='text-lg font-semibold'>Applications by Stage</h2>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width='100%' height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray='3 3' />
              <XAxis dataKey='name' angle={-45} textAnchor='end' height={80} />
              <YAxis />
              <Tooltip />
              <Bar dataKey='count' fill='#3b82f6' />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
