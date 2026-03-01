'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Card, CardContent, CardHeader } from '@/components/ui/Card'
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton'

interface Availability {
  id: string
  country: string
  city: string
  test_type: string
  provider: string
  exam_date: string
  last_checked_at: string
  source_url: string
  seats_status: 'available' | 'limited' | 'full' | 'unknown'
}

interface SubscriptionForm {
  email: string
  whatsapp: string
}

export function IELTSAvailabilityWidget() {
  const [countries, setCountries] = useState<string[]>([])
  const [cities, setCities] = useState<string[]>([])
  const [selectedCountry, setSelectedCountry] = useState('')
  const [selectedCity, setSelectedCity] = useState('')
  const [availability, setAvailability] = useState<Availability[]>([])
  const [loading, setLoading] = useState(false)
  const [loadingCountries, setLoadingCountries] = useState(true)
  const [subscribing, setSubscribing] = useState(false)

  const supabase = createClient()
  const { register, handleSubmit, reset } = useForm<SubscriptionForm>()

  useEffect(() => {
    const loadCountries = async () => {
      try {
        const { data, error } = await supabase
          .from('ielts_availability')
          .select('country')
          .order('country')
        if (error) throw error
        const unique = Array.from(new Set(data?.map((d) => d.country) || []))
        setCountries(unique)
      } catch (error) {
        console.error('Error loading countries:', error)
        toast.error('Could not load countries')
      } finally {
        setLoadingCountries(false)
      }
    }
    loadCountries()
  }, [])

  useEffect(() => {
    if (!selectedCountry) {
      setCities([])
      return
    }
    const loadCities = async () => {
      try {
        const { data, error } = await supabase
          .from('ielts_availability')
          .select('city')
          .eq('country', selectedCountry)
          .order('city')
        if (error) throw error
        const unique = Array.from(new Set(data?.map((d) => d.city) || []))
        setCities(unique)
      } catch (error) {
        console.error('Error loading cities:', error)
        toast.error('Could not load cities')
      }
    }
    loadCities()
  }, [selectedCountry])

  const searchAvailability = async () => {
    setLoading(true)
    setAvailability([])
    try {
      let query = supabase
        .from('ielts_availability')
        .select('*')
        .order('exam_date', { ascending: true })

      if (selectedCountry) {
        query = query.eq('country', selectedCountry)
      }
      if (selectedCity) {
        query = query.eq('city', selectedCity)
      }

      const { data, error } = await query
      if (error) throw error
     setAvailability((data || []) as Availability[])
    } catch (error) {
      console.error('Search error:', error)
      toast.error('Failed to search availability')
    } finally {
      setLoading(false)
    }
  }

  const onSubscribe = async (formData: SubscriptionForm) => {
    setSubscribing(true)
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) {
        toast.error('You must be logged in to subscribe.')
        return
      }

      const { error } = await supabase.from('ielts_alerts').insert({
        user_id: user.id,
        email: formData.email || null,
        whatsapp: formData.whatsapp || null,
        country: selectedCountry || null,
        city: selectedCity || null,
      })

      if (error) throw error

      toast.success('Subscription successful! We will notify you.')
      reset()
    } catch (error) {
      console.error('Subscription error:', error)
      toast.error('Subscription failed. Please try again.')
    } finally {
      setSubscribing(false)
    }
  }

  if (loadingCountries) {
    return (
      <Card>
        <CardHeader>
          <h2 className='text-xl font-semibold'>IELTS Exam Availability</h2>
        </CardHeader>
        <CardContent>
          <LoadingSkeleton />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <h2 className='text-xl font-semibold'>IELTS Exam Availability</h2>
      </CardHeader>
      <CardContent className='space-y-4'>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
          <Select
            label='Country'
            options={[
              { value: '', label: 'All Countries' },
              ...countries.map((c) => ({ value: c, label: c })),
            ]}
            value={selectedCountry}
            onChange={(e) => {
              setSelectedCountry(e.target.value)
              setSelectedCity('')
              setAvailability([])
            }}
          />
          <Select
            label='City'
            options={[
              { value: '', label: 'All Cities' },
              ...cities.map((c) => ({ value: c, label: c })),
            ]}
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            disabled={!selectedCountry}
          />
          <div className='flex items-end'>
            <Button onClick={searchAvailability} disabled={loading}>
              {loading ? 'Searching...' : 'Search'}
            </Button>
          </div>
        </div>

        {loading ? (
          <LoadingSkeleton />
        ) : availability.length > 0 ? (
          <div className='overflow-x-auto'>
            <table className='min-w-full divide-y divide-gray-200'>
              <thead className='bg-gray-50'>
                <tr>
                  <th className='px-4 py-2 text-left text-xs font-medium text-gray-500'>
                    Date
                  </th>
                  <th className='px-4 py-2 text-left text-xs font-medium text-gray-500'>
                    City
                  </th>
                  <th className='px-4 py-2 text-left text-xs font-medium text-gray-500'>
                    Test Type
                  </th>
                  <th className='px-4 py-2 text-left text-xs font-medium text-gray-500'>
                    Provider
                  </th>
                  <th className='px-4 py-2 text-left text-xs font-medium text-gray-500'>
                    Seats
                  </th>
                </tr>
              </thead>
              <tbody className='divide-y divide-gray-200'>
                {availability.map((exam) => (
                  <tr key={exam.id}>
                    <td className='px-4 py-2'>
                      {new Date(exam.exam_date).toLocaleDateString()}
                    </td>
                    <td className='px-4 py-2'>{exam.city}</td>
                    <td className='px-4 py-2'>{exam.test_type}</td>
                    <td className='px-4 py-2'>{exam.provider}</td>
                    <td className='px-4 py-2'>
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          exam.seats_status === 'available'
                            ? 'bg-green-100 text-green-800'
                            : exam.seats_status === 'limited'
                              ? 'bg-yellow-100 text-yellow-800'
                              : exam.seats_status === 'full'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {exam.seats_status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          !loading && (
            <p className='text-gray-500 text-center py-4'>
              {selectedCountry
                ? 'No exams found for this location.'
                : 'Select a country and city to see upcoming exam dates.'}
            </p>
          )
        )}

        {selectedCountry && (
          <div className='mt-6 border-t pt-4'>
            <h3 className='text-lg font-medium mb-2'>
              Notify me when seats become available
            </h3>
            <form onSubmit={handleSubmit(onSubscribe)} className='space-y-4'>
              <Input
                label='Email (optional)'
                type='email'
                {...register('email')}
                placeholder='you@example.com'
              />
              <Input
                label='WhatsApp (optional)'
                {...register('whatsapp')}
                placeholder='+27123456789'
              />
              <Button type='submit' disabled={subscribing}>
                {subscribing ? 'Subscribing...' : 'Subscribe'}
              </Button>
            </form>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
