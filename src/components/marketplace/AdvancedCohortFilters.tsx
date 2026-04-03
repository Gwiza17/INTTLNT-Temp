'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Search, Filter, X, ChevronDown, Users, MapPin, GraduationCap, Clock, TrendingUp } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/Card'

interface FilterOptions {
  disciplines: string[]
  destinations: string[]
  countries: string[]
  experienceRanges: { label: string; min: number; max: number }[]
  readinessTimelines: string[]
}

const EXPERIENCE_RANGES = [
  { label: '0-2 years', min: 0, max: 2 },
  { label: '3-5 years', min: 3, max: 5 },
  { label: '6-10 years', min: 6, max: 10 },
  { label: '10+ years', min: 10, max: 100 },
]

const READINESS_OPTIONS = [
  '1-3 months',
  '3-6 months',
  '6-12 months',
  '12-18 months',
  '2-3 months',
  '4-8 months'
]

export default function AdvancedCohortFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '')

  // Filter states
  const [selectedDisciplines, setSelectedDisciplines] = useState<string[]>(
    searchParams.getAll('discipline')
  )
  const [selectedDestinations, setSelectedDestinations] = useState<string[]>(
    searchParams.getAll('destination')
  )
  const [selectedCountries, setSelectedCountries] = useState<string[]>(
    searchParams.getAll('country')
  )
  const [selectedExperience, setSelectedExperience] = useState<string[]>(
    searchParams.getAll('experience')
  )
  const [selectedReadiness, setSelectedReadiness] = useState<string[]>(
    searchParams.getAll('readiness')
  )
  const [minOpportunityScore, setMinOpportunityScore] = useState(
    parseInt(searchParams.get('min_score') || '0')
  )

  // Available options (would typically come from API)
  const [filterOptions] = useState<FilterOptions>({
    disciplines: ['Engineering', 'Computer Science', 'Nursing', 'Education', 'Business Administration', 'Medicine', 'Architecture', 'Data Science'],
    destinations: ['Canada', 'Australia'],
    countries: ['Kenya', 'Philippines', 'Nigeria', 'India', 'Sri Lanka', 'Ghana', 'Zimbabwe', 'South Africa', 'Bangladesh', 'Pakistan'],
    experienceRanges: EXPERIENCE_RANGES,
    readinessTimelines: READINESS_OPTIONS
  })

  // Check if any advanced filters are active
  const hasAdvancedFilters = selectedExperience.length > 0 || 
                            selectedReadiness.length > 0 || 
                            minOpportunityScore > 0

  useEffect(() => {
    if (hasAdvancedFilters) {
      setShowAdvanced(true)
    }
  }, [hasAdvancedFilters])

  const applyFilters = () => {
    const params = new URLSearchParams()

    // Basic filters
    if (searchQuery.trim()) params.set('search', searchQuery.trim())
    selectedDisciplines.forEach(d => params.append('discipline', d))
    selectedDestinations.forEach(d => params.append('destination', d))
    selectedCountries.forEach(c => params.append('country', c))

    // Advanced filters
    selectedExperience.forEach(e => params.append('experience', e))
    selectedReadiness.forEach(r => params.append('readiness', r))
    if (minOpportunityScore > 0) params.set('min_score', minOpportunityScore.toString())

    router.push(`/marketplace?${params.toString()}`)
  }

  const clearAllFilters = () => {
    setSearchQuery('')
    setSelectedDisciplines([])
    setSelectedDestinations([])
    setSelectedCountries([])
    setSelectedExperience([])
    setSelectedReadiness([])
    setMinOpportunityScore(0)
    router.push('/marketplace')
  }

  const totalActiveFilters = selectedDisciplines.length + selectedDestinations.length + 
                            selectedCountries.length + selectedExperience.length + 
                            selectedReadiness.length + (minOpportunityScore > 0 ? 1 : 0) +
                            (searchQuery.trim() ? 1 : 0)

  return (
    <Card>
      <CardContent className="p-4 space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search size={16} className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search cohorts, disciplines, or countries..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && applyFilters()}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Basic Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Discipline */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <GraduationCap size={14} className="inline mr-1" />
              Discipline
            </label>
            <select
              value={selectedDisciplines[0] || ''}
              onChange={(e) => setSelectedDisciplines(e.target.value ? [e.target.value] : [])}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            >
              <option value="">All disciplines</option>
              {filterOptions.disciplines.map(discipline => (
                <option key={discipline} value={discipline}>{discipline}</option>
              ))}
            </select>
          </div>

          {/* Destination */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <MapPin size={14} className="inline mr-1" />
              Destination
            </label>
            <select
              value={selectedDestinations[0] || ''}
              onChange={(e) => setSelectedDestinations(e.target.value ? [e.target.value] : [])}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            >
              <option value="">All destinations</option>
              {filterOptions.destinations.map(destination => (
                <option key={destination} value={destination}>{destination}</option>
              ))}
            </select>
          </div>

          {/* Country of Origin */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Users size={14} className="inline mr-1" />
              Country of Origin
            </label>
            <select
              value={selectedCountries[0] || ''}
              onChange={(e) => setSelectedCountries(e.target.value ? [e.target.value] : [])}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            >
              <option value="">All countries</option>
              {filterOptions.countries.map(country => (
                <option key={country} value={country}>{country}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Advanced Filters Toggle */}
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
        >
          <Filter size={14} />
          Advanced Filters
          <ChevronDown size={14} className={`transition-transform ${showAdvanced ? 'rotate-180' : ''}`} />
        </button>

        {/* Advanced Filters */}
        {showAdvanced && (
          <div className="space-y-4 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Experience Level */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Experience Level</label>
                <div className="space-y-2">
                  {EXPERIENCE_RANGES.map(range => (
                    <label key={range.label} className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={selectedExperience.includes(range.label)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedExperience([...selectedExperience, range.label])
                          } else {
                            setSelectedExperience(selectedExperience.filter(exp => exp !== range.label))
                          }
                        }}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      {range.label}
                    </label>
                  ))}
                </div>
              </div>

              {/* Readiness Timeline */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Clock size={14} className="inline mr-1" />
                  Readiness Timeline
                </label>
                <div className="space-y-2">
                  {READINESS_OPTIONS.map(timeline => (
                    <label key={timeline} className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={selectedReadiness.includes(timeline)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedReadiness([...selectedReadiness, timeline])
                          } else {
                            setSelectedReadiness(selectedReadiness.filter(time => time !== timeline))
                          }
                        }}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      {timeline}
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Minimum Opportunity Score */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <TrendingUp size={14} className="inline mr-1" />
                Minimum Opportunity Score
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={minOpportunityScore}
                  onChange={(e) => setMinOpportunityScore(parseInt(e.target.value))}
                  className="flex-1"
                />
                <span className="text-sm font-medium text-gray-600 min-w-[3rem]">
                  {minOpportunityScore}+
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            {totalActiveFilters > 0 && (
              <>
                <Filter size={14} />
                {totalActiveFilters} filter{totalActiveFilters !== 1 ? 's' : ''} active
              </>
            )}
          </div>
          <div className="flex items-center gap-2">
            {totalActiveFilters > 0 && (
              <button
                onClick={clearAllFilters}
                className="flex items-center gap-1 px-3 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <X size={14} />
                Clear All
              </button>
            )}
            <button
              onClick={applyFilters}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
