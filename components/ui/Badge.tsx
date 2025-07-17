import { clsx } from "clsx"
import { type HTMLAttributes, forwardRef } from "react"

interface BadgeProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "destructive" | "outline" | "custom"
}

const Badge = forwardRef<HTMLDivElement, BadgeProps>(({ className, variant = "default", ...props }, ref) => {
  const variantClasses = {
    default: "badge-default",
    secondary: "badge-secondary",
    destructive: "badge-destructive",
    outline: "badge-outline",
    custom: "badge-custom", // For custom gradients/colors defined directly in usage
  }

  return <div ref={ref} className={clsx("badge", variantClasses[variant], className)} {...props} />
})

Badge.displayName = "Badge"

export { Badge }
