/**
 * Simple static background gradient component
 * Renders a smooth gradient based on weather conditions without animation
 */

import { cn } from "@/lib/utils"

export interface GradientColors {
  gradientBackgroundStart: string
  gradientBackgroundEnd: string
  // Keep these for API compatibility but they won't be used
  firstColor?: string
  secondColor?: string
  thirdColor?: string
  fourthColor?: string
  fifthColor?: string
  pointerColor?: string
}

export const BackgroundGradient = ({
  gradientBackgroundStart = "rgb(241, 245, 249)",
  gradientBackgroundEnd = "rgb(226, 232, 240)",
  children,
  className,
  containerClassName,
}: GradientColors & {
  children?: React.ReactNode
  className?: string
  containerClassName?: string
  interactive?: boolean // kept for API compatibility, unused
}) => {
  return (
    <div
      className={cn(
        "min-h-screen w-full",
        "transition-colors duration-1000 ease-in-out",
        containerClassName
      )}
      style={{
        background: `linear-gradient(135deg, ${gradientBackgroundStart} 0%, ${gradientBackgroundEnd} 100%)`,
      }}
    >
      <div className={cn("min-h-screen", className)}>{children}</div>
    </div>
  )
}
