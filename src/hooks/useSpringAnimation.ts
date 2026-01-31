import { useRef, useCallback, useEffect } from 'react'

/**
 * Spring physics configuration
 * Based on iOS-style spring animations
 */
export interface SpringConfig {
  /** Stiffness of the spring (higher = stiffer, faster) */
  stiffness?: number
  /** Damping ratio (lower = more bounce, higher = less bounce) */
  damping?: number
  /** Mass of the object being animated */
  mass?: number
}

/**
 * Result from the spring animation hook
 */
export interface SpringAnimationResult {
  /** Current animated value (0-1 for progress, or any range) */
  currentValue: number
  /** Start animating to target value */
  animateTo: (target: number, config?: SpringConfig) => void
  /** Stop current animation */
  stop: () => void
  /** Whether animation is currently running */
  isAnimating: boolean
}

/**
 * Default spring configuration (iOS-like bounce)
 */
const DEFAULT_CONFIG: Required<SpringConfig> = {
  stiffness: 300,  // Stiff spring
  damping: 25,     // Slight bounce
  mass: 1,         // Normal mass
}

/**
 * Custom spring animation hook using requestAnimationFrame
 * Implements physics-based spring animation for smooth, natural motion
 *
 * Uses damped harmonic oscillator equation:
 * acceleration = (-stiffness * displacement - damping * velocity) / mass
 *
 * @param initialValue - Starting value for animation
 * @returns Spring animation control object
 *
 * @example
 * ```tsx
 * const { currentValue, animateTo } = useSpringAnimation(0)
 *
 * // Animate from 0 to 1
 * animateTo(1)
 *
 * // Use in render
 * <div style={{ opacity: currentValue }} />
 * ```
 */
export function useSpringAnimation(initialValue: number = 0): SpringAnimationResult {
  const currentValueRef = useRef(initialValue)
  const targetValueRef = useRef(initialValue)
  const velocityRef = useRef(0)
  const rafIdRef = useRef<number | null>(null)
  const isAnimatingRef = useRef(false)
  const configRef = useRef<Required<SpringConfig>>(DEFAULT_CONFIG)

  // Spring physics simulation step
  const simulateStep = useCallback(() => {
    const current = currentValueRef.current
    const target = targetValueRef.current
    const velocity = velocityRef.current
    const config = configRef.current

    // Calculate spring force (Hooke's law: F = -kx)
    const displacement = current - target
    const springForce = -config.stiffness * displacement

    // Calculate damping force (F = -cv)
    const dampingForce = -config.damping * velocity

    // Calculate acceleration (F = ma, so a = F/m)
    const acceleration = (springForce + dampingForce) / config.mass

    // Update velocity and position using semi-implicit Euler integration
    velocityRef.current = velocity + acceleration * 0.016 // 16ms timestep (~60fps)
    currentValueRef.current = current + velocityRef.current * 0.016

    // Check if animation should stop (close to target with low velocity)
    const isClose = Math.abs(displacement) < 0.001
    const isSlow = Math.abs(velocityRef.current) < 0.01

    if (isClose && isSlow) {
      // Snap to target and stop
      currentValueRef.current = target
      velocityRef.current = 0
      isAnimatingRef.current = false
      return false // Stop animation
    }

    return true // Continue animation
  }, [])

  // Animation loop
  const animateLoop = useCallback(() => {
    const shouldContinue = simulateStep()

    if (shouldContinue) {
      rafIdRef.current = requestAnimationFrame(animateLoop)
    } else {
      rafIdRef.current = null
    }
  }, [simulateStep])

  // Start animation to target value
  const animateTo = useCallback((target: number, config?: SpringConfig) => {
    // Prevent animation overlap - Feature #77
    // If already animating, stop the current animation first
    if (rafIdRef.current !== null) {
      cancelAnimationFrame(rafIdRef.current)
      rafIdRef.current = null
    }

    targetValueRef.current = target

    // Update config if provided
    if (config) {
      configRef.current = {
        stiffness: config.stiffness ?? DEFAULT_CONFIG.stiffness,
        damping: config.damping ?? DEFAULT_CONFIG.damping,
        mass: config.mass ?? DEFAULT_CONFIG.mass,
      }
    }

    // Start animation (will always start since we cancelled previous raf)
    isAnimatingRef.current = true
    animateLoop()
  }, [animateLoop])

  // Stop animation
  const stop = useCallback(() => {
    if (rafIdRef.current !== null) {
      cancelAnimationFrame(rafIdRef.current)
      rafIdRef.current = null
    }
    isAnimatingRef.current = false
    velocityRef.current = 0
  }, [])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current)
      }
    }
  }, [])

  return {
    currentValue: currentValueRef.current,
    animateTo,
    stop,
    isAnimating: isAnimatingRef.current,
  }
}

/**
 * Specialized hook for drawer spring animation
 * Animates between 0 (collapsed) and 1 (expanded)
 *
 * @returns Drawer spring animation control with expanded state
 */
export function useDrawerSpring() {
  const spring = useSpringAnimation(0)

  /**
   * Expand drawer with spring animation
   */
  const expand = useCallback(() => {
    spring.animateTo(1, {
      stiffness: 350,  // Slightly stiffer for quick response
      damping: 30,     // Subtle bounce
      mass: 0.8,       // Lighter for snappy feel
    })
  }, [spring])

  /**
   * Collapse drawer with spring animation
   */
  const collapse = useCallback(() => {
    spring.animateTo(0, {
      stiffness: 300,
      damping: 25,     // Slightly more bounce on collapse
      mass: 1,
    })
  }, [spring])

  /**
   * Set drawer state directly (instant, no animation)
   */
  const setInstant = useCallback((expanded: boolean) => {
    spring.stop()
    spring.animateTo(expanded ? 1 : 0, {
      stiffness: 1000,  // Very stiff for instant snap
      damping: 100,     // High damping to prevent bounce
      mass: 0.1,
    })
  }, [spring])

  return {
    ...spring,
    expand,
    collapse,
    setInstant,
    isExpanded: spring.currentValue === 1,
    isCollapsed: spring.currentValue === 0,
  }
}
