'use client'

import { useState } from 'react'
import { formatDistanceToNow } from 'date-fns'

interface AuditLog {
  id: string
  case_id: string | null
  user_id: string | null
  action: string
  old_value: any
  new_value: any
  created_at: string
  // Optionally join with users or cases, but we'll keep simple
}

interface AuditLogTableProps {
  logs: AuditLog[]
}

export function AuditLogTable({ logs }: AuditLogTableProps) {
  const [expanded, setExpanded] = useState<string | null>(null)

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Time
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Action
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Details
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {logs.map((log) => (
            <tr key={log.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {formatDistanceToNow(new Date(log.created_at), { addSuffix: true })}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {log.action}
              </td>
              <td className="px-6 py-4 text-sm text-gray-500">
                <button
                  onClick={() => setExpanded(expanded === log.id ? null : log.id)}
                  className="text-blue-600 hover:underline"
                >
                  {expanded === log.id ? 'Hide' : 'View'}
                </button>
                {expanded === log.id && (
                  <pre className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-auto">
                    {JSON.stringify(
                      {
                        case_id: log.case_id,
                        user_id: log.user_id,
                        old: log.old_value,
                        new: log.new_value,
                      },
                      null,
                      2
                    )}
                  </pre>
                )}
              </td>
            </tr>
          ))}
          {logs.length === 0 && (
            <tr>
              <td colSpan={3} className="px-6 py-4 text-center text-gray-500">
                No audit logs found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}