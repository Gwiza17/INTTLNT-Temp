'use client'

import { useState } from 'react'
import { Database, Trash2, Users, AlertCircle, CheckCircle, Loader2 } from 'lucide-react'
import { Card, CardContent, CardHeader } from '@/components/ui/Card'

export default function SampleDataPage() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const populateSampleData = async () => {
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const response = await fetch('/api/admin/populate-sample-data', {
        method: 'POST',
      })

      const data = await response.json()

      if (response.ok) {
        setResult(data)
      } else {
        setError(data.error || 'Failed to populate sample data')
      }
    } catch (err) {
      setError('Network error occurred')
    } finally {
      setLoading(false)
    }
  }

  const deleteSampleData = async () => {
    if (!confirm('Are you sure you want to delete all sample candidate profiles? This cannot be undone.')) {
      return
    }

    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const response = await fetch('/api/admin/populate-sample-data', {
        method: 'DELETE',
      })

      const data = await response.json()

      if (response.ok) {
        setResult(data)
      } else {
        setError(data.error || 'Failed to delete sample data')
      }
    } catch (err) {
      setError('Network error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <Database size={24} className="text-blue-600" />
        <div>
          <h1 className="text-2xl font-bold text-[#0B1F3B]">Sample Data Management</h1>
          <p className="text-gray-500 text-sm">
            Generate realistic candidate profiles for testing the marketplace
          </p>
        </div>
      </div>

      {/* Warning Notice */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
        <AlertCircle size={20} className="text-amber-600 flex-shrink-0 mt-0.5" />
        <div className="text-amber-800">
          <h3 className="font-semibold mb-1">Development Tool</h3>
          <p className="text-sm">
            This tool is designed for development and testing. Use cautiously in production environments.
            Sample data will be created with reference IDs starting with "CAND-".
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Users size={18} className="text-green-600" />
              <h2 className="font-semibold">Generate Sample Data</h2>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-600">
              Creates 8-17 realistic candidate profiles for each active cohort. 
              Includes varied IELTS scores, experience levels, and opportunity scores.
            </p>
            <button
              onClick={populateSampleData}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold py-3 px-4 rounded-xl transition-colors"
            >
              {loading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Database size={16} />
              )}
              {loading ? 'Generating...' : 'Generate Sample Candidates'}
            </button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Trash2 size={18} className="text-red-600" />
              <h2 className="font-semibold">Clean Sample Data</h2>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-600">
              Removes all candidate profiles with reference IDs starting with "CAND-".
              This will not affect real user data.
            </p>
            <button
              onClick={deleteSampleData}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-semibold py-3 px-4 rounded-xl transition-colors"
            >
              {loading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Trash2 size={16} />
              )}
              {loading ? 'Deleting...' : 'Delete Sample Data'}
            </button>
          </CardContent>
        </Card>
      </div>

      {/* Results */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
          <AlertCircle size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-red-800 mb-1">Error</h3>
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      )}

      {result && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4">
          <div className="flex items-start gap-3 mb-3">
            <CheckCircle size={20} className="text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-green-800">{result.message}</h3>
            </div>
          </div>

          {result.results && (
            <div className="mt-4 space-y-2">
              <h4 className="font-medium text-green-800 text-sm">Details:</h4>
              <div className="bg-white rounded-lg p-3 space-y-2">
                {result.results.map((cohortResult: any, index: number) => (
                  <div key={index} className="flex justify-between items-center text-sm">
                    <span className="text-gray-700">{cohortResult.cohort}</span>
                    <span className={`font-medium ${cohortResult.success ? 'text-green-600' : 'text-red-600'}`}>
                      {cohortResult.success ? `${cohortResult.count} created` : 'Failed'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {result.deletedCount !== undefined && (
            <div className="mt-4">
              <p className="text-sm text-green-700">
                <span className="font-medium">{result.deletedCount}</span> profiles removed
              </p>
              {result.deletedRefs && result.deletedRefs.length > 0 && (
                <details className="mt-2">
                  <summary className="text-sm text-green-600 cursor-pointer hover:underline">
                    View deleted references
                  </summary>
                  <div className="mt-2 max-h-40 overflow-y-auto bg-white rounded p-2 border">
                    <div className="grid grid-cols-4 gap-1 text-xs font-mono text-gray-600">
                      {result.deletedRefs.map((ref: string, i: number) => (
                        <span key={i}>{ref}</span>
                      ))}
                    </div>
                  </div>
                </details>
              )}
            </div>
          )}
        </div>
      )}

      {/* Instructions */}
      <Card>
        <CardHeader>
          <h3 className="font-semibold">Usage Instructions</h3>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="text-sm text-gray-600 space-y-2">
            <p>
              <span className="font-medium">1. Generate Sample Data:</span> Creates realistic candidate profiles for testing. 
              Each cohort gets 8-17 candidates with varied backgrounds and scores.
            </p>
            <p>
              <span className="font-medium">2. Test Marketplace:</span> Visit the marketplace to see the generated candidates. 
              Test the interest expression and reveal workflows.
            </p>
            <p>
              <span className="font-medium">3. Clean Up:</span> Delete all sample data when done testing. 
              Only affects profiles with "CAND-" reference IDs.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
