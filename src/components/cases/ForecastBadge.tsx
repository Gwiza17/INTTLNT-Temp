export function ForecastBadge({ status }: { status: 'on_track' | 'at_risk' | 'missed' }) {
  const colors = {
    on_track: 'bg-green-100 text-green-800',
    at_risk: 'bg-yellow-100 text-yellow-800',
    missed: 'bg-red-100 text-red-800',
  }
  const labels = {
    on_track: 'On Track',
    at_risk: 'At Risk',
    missed: 'Missed',
  }
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${colors[status]}`}>
      {labels[status]}
    </span>
  )
}