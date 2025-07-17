import { clsx } from "clsx"
import { type TextareaHTMLAttributes, forwardRef } from "react"

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(({ className, ...props }, ref) => {
  return <textarea className={clsx("textarea", className)} ref={ref} {...props} />
})

Textarea.displayName = "Textarea"

export { Textarea }
