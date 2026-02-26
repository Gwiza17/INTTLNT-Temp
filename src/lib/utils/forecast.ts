export type ForecastStatus = 'on_track' | 'at_risk' | 'missed'

/**
 * Calculate forecast status based on remaining days and SLA
 * @param daysRemainingUntilIntake Number of days left until the target intake
 * @param remainingSlaDays Number of days left in current stage (SLA due date - now)
 * @returns Forecast status
 */
export function calculateForecast(
  daysRemainingUntilIntake: number,
  remainingSlaDays: number,
): ForecastStatus {
  if (daysRemainingUntilIntake <= 0) return 'missed'
  if (remainingSlaDays > daysRemainingUntilIntake) return 'at_risk'
  return 'on_track'
}

/**
 * Calculate days remaining until a target intake date
 * @param targetIntake String like "May 2026" – we need to parse it
 */
export function daysUntilIntake(targetIntake: string): number {
  // Simple parsing – assumes format like "May 2026"
  const months: Record<string, number> = {
    jan: 0,
    feb: 1,
    mar: 2,
    apr: 3,
    may: 4,
    jun: 5,
    jul: 6,
    aug: 7,
    sep: 8,
    oct: 9,
    nov: 10,
    dec: 11,
  }
  const match = targetIntake.toLowerCase().match(/(\w+)\s+(\d{4})/)
  if (!match) return Infinity // Unknown, default to on track

  const monthName = match[1].substring(0, 3)
  const month = months[monthName]
  if (month === undefined) return Infinity

  const year = parseInt(match[2], 10)
  // Assume intake is the first day of that month
  const intakeDate = new Date(year, month, 1)
  const now = new Date()
  const diffMs = intakeDate.getTime() - now.getTime()
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24))
}
