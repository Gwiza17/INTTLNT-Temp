import { Card, CardContent } from '@/components/ui/Card'

interface ActivityCardProps {
  daysSince: number | null
  lastSentAt: string | null
}

export function ActivityCard({ daysSince, lastSentAt }: ActivityCardProps) {
  const config = getConfig(daysSince)

  return (
    <Card className={`border-2 ${config.borderColor}`}>
      <CardContent className='p-5'>
        <div className='flex items-start justify-between'>
          <div className='space-y-1'>
            <p className='text-sm font-medium text-gray-500'>Invite Activity</p>
            <p className={`text-lg font-bold ${config.textColor}`}>
              {config.headline}
            </p>
            <p className='text-sm text-gray-500'>{config.subtext}</p>
          </div>
          <span className='text-4xl'>{config.emoji}</span>
        </div>

        {daysSince !== null && daysSince >= 2 && (
          <div className='mt-4 pt-4 border-t border-gray-100'>
            <div className='flex items-center gap-2'>
              <div className='flex-1 bg-gray-100 rounded-full h-2'>
                <div
                  className={`h-2 rounded-full transition-all ${config.barColor}`}
                  style={{ width: `${Math.min((daysSince / 14) * 100, 100)}%` }}
                />
              </div>
              <span className='text-xs text-gray-400 whitespace-nowrap'>
                {daysSince}d inactive
              </span>
            </div>
          </div>
        )}

        {lastSentAt && (
          <p className='text-xs text-gray-400 mt-3'>
            Last invite:{' '}
            {new Date(lastSentAt).toLocaleDateString('en-GB', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            })}
          </p>
        )}
      </CardContent>
    </Card>
  )
}

function getConfig(daysSince: number | null): {
  emoji: string
  headline: string
  subtext: string
  textColor: string
  borderColor: string
  barColor: string
} {
  if (daysSince === null) {
    return {
      emoji: '👋',
      headline: 'No invites sent yet',
      subtext: 'Send your first invite to get started.',
      textColor: 'text-gray-600',
      borderColor: 'border-gray-200',
      barColor: 'bg-gray-300',
    }
  }

  if (daysSince === 0) {
    return {
      emoji: '🔥',
      headline: 'Invite sent today!',
      subtext: 'Great work — keep the momentum going.',
      textColor: 'text-green-600',
      borderColor: 'border-green-300',
      barColor: 'bg-green-400',
    }
  }

  if (daysSince === 1) {
    return {
      emoji: '👍',
      headline: 'Last invite: yesterday',
      subtext: 'Still fresh — send one today to stay on track.',
      textColor: 'text-blue-600',
      borderColor: 'border-blue-200',
      barColor: 'bg-blue-400',
    }
  }

  if (daysSince <= 3) {
    return {
      emoji: '😐',
      headline: `${daysSince} days since last invite`,
      subtext: 'Getting quiet — time to reach out to someone new.',
      textColor: 'text-yellow-600',
      borderColor: 'border-yellow-300',
      barColor: 'bg-yellow-400',
    }
  }

  if (daysSince <= 7) {
    return {
      emoji: '😕',
      headline: `${daysSince} days of inactivity`,
      subtext: 'Your pipeline might be cooling down.',
      textColor: 'text-orange-600',
      borderColor: 'border-orange-300',
      barColor: 'bg-orange-400',
    }
  }

  return {
    emoji: '😢',
    headline: `${daysSince} days since last invite`,
    subtext: "It's been a while — your network needs you!",
    textColor: 'text-red-600',
    borderColor: 'border-red-300',
    barColor: 'bg-red-400',
  }
}
