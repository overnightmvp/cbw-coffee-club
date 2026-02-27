import confetti from 'canvas-confetti'

/**
 * Trigger confetti celebration with branded colors
 * Use for high-impact success moments:
 * - Booking inquiry submitted
 * - Quote submitted
 * - Vendor application approved
 * - First-time user signup
 */
export function triggerConfetti() {
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 },
    colors: ['#D4A574', '#8B4513', '#FFD700'], // Brown/gold palette
    ticks: 200,
  })
}

/**
 * Trigger confetti burst from specific element position
 * @param element - DOM element to burst from
 */
export function triggerConfettiFrom(element: HTMLElement) {
  const rect = element.getBoundingClientRect()
  const x = (rect.left + rect.width / 2) / window.innerWidth
  const y = (rect.top + rect.height / 2) / window.innerHeight

  confetti({
    particleCount: 50,
    spread: 60,
    origin: { x, y },
    colors: ['#D4A574', '#8B4513', '#FFD700'],
    ticks: 150,
  })
}
