import { clsx } from "clsx"
import { type InputHTMLAttributes, forwardRef } from "react"

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {}

const Input = forwardRef<HTMLInputElement, InputProps>(({ className, type, ...props }, ref) => {
  return <input type={type} className={clsx("input", className)} ref={ref} {...props} />
})

Input.displayName = "Input"

export { Input }
