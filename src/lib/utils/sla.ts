export function calculateDaysInStage(enteredAt: string): number {
  const start = new Date(enteredAt)
  const now = new Date()
  const diffMs = now.getTime() - start.getTime()
  return Math.floor(diffMs / (1000 * 60 * 60 * 24))
}
