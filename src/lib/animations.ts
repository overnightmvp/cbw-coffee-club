/**
 * Animation Utilities - Reusable Tailwind animation classes
 * Use these for consistent microinteractions across the app
 */

export const animations = {
  // Card entrance
  cardEnter: 'animate-in fade-in-0 slide-in-from-bottom-4 duration-300',

  // Staggered list items (use with delay utilities)
  listItem: 'animate-in fade-in-0 slide-in-from-left-2 duration-200',

  // Button press feedback
  press: 'active:scale-95 transition-transform duration-150',

  // Hover lift
  lift: 'hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200',

  // Spinner (branded with brown palette)
  spinner: 'animate-spin border-2 border-brown-600 border-t-transparent rounded-full',

  // Success pulse
  successPulse: 'animate-pulse text-green-600',

  // Smooth transitions
  smooth: 'transition-all duration-200 ease-out',
} as const

/**
 * Generate stagger delay class for list items
 * @param index - Item index in list
 * @param delayMs - Delay between items in milliseconds (default: 50)
 */
export function staggerDelay(index: number, delayMs: number = 50): string {
  return `[animation-delay:${index * delayMs}ms]`
}
