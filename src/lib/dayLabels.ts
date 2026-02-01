/**
 * Day label utilities for 7-day forecast
 * Provides human-readable day names: "Today", "Tomorrow", "Wed", "Thu", etc.
 */

const SHORT_WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const FULL_WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

/**
 * Get a short label for a day based on its index in the forecast
 * @param dayIndex - Index of the day (0 = today, 1 = tomorrow, 2-6 = weekday names)
 * @param date - The date for the day (used to get weekday name for days 2+)
 * @returns Short label like "Today", "Tomorrow", "Wed", "Thu"
 *
 * @example
 * getDayLabel(0, new Date()) // "Today"
 * getDayLabel(1, new Date()) // "Tomorrow"
 * getDayLabel(2, new Date('2026-02-04')) // "Wed"
 */
export function getDayLabel(dayIndex: number, date: Date | string): string {
  if (dayIndex === 0) return 'Today'
  if (dayIndex === 1) return 'Tomorrow'

  const dateObj = typeof date === 'string' ? new Date(date) : date
  const dayOfWeek = dateObj.getDay()
  return SHORT_WEEKDAYS[dayOfWeek]
}

/**
 * Get the full weekday name for a day (for accessibility)
 * @param dayIndex - Index of the day (0 = today, 1 = tomorrow, 2-6 = weekday names)
 * @param date - The date for the day
 * @returns Full name like "Today", "Tomorrow", "Wednesday", "Thursday"
 *
 * @example
 * getDayFullName(0, new Date()) // "Today"
 * getDayFullName(1, new Date()) // "Tomorrow"
 * getDayFullName(2, new Date('2026-02-04')) // "Wednesday"
 */
export function getDayFullName(dayIndex: number, date: Date | string): string {
  if (dayIndex === 0) return 'Today'
  if (dayIndex === 1) return 'Tomorrow'

  const dateObj = typeof date === 'string' ? new Date(date) : date
  const dayOfWeek = dateObj.getDay()
  return FULL_WEEKDAYS[dayOfWeek]
}

/**
 * Format a date for display (e.g., "Feb 4")
 * @param date - The date to format
 * @returns Formatted date like "Feb 4"
 */
export function formatDayDate(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  const month = dateObj.toLocaleDateString('en-US', { month: 'short' })
  const day = dateObj.getDate()
  return `${month} ${day}`
}
