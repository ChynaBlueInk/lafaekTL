import type React from "react"
import { clsx } from "clsx"
import { type HTMLAttributes, forwardRef } from "react"

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

const Card = forwardRef<HTMLDivElement, CardProps>(({ className, children, ...props }, ref) => (
  <div ref={ref} className={clsx("card", className)} {...props}>
    {children}
  </div>
))

Card.displayName = "Card"

interface CardContentProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

const CardContent = forwardRef<HTMLDivElement, CardContentProps>(({ className, children, ...props }, ref) => (
  <div ref={ref} className={clsx("p-6", className)} {...props}>
    {children}
  </div>
))

CardContent.displayName = "CardContent"

export { Card, CardContent }
