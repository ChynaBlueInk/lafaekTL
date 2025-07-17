import { clsx } from "clsx"
import { type LabelHTMLAttributes, forwardRef } from "react"

interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {}

const Label = forwardRef<HTMLLabelElement, LabelProps>(({ className, ...props }, ref) => {
  return <label ref={ref} className={clsx("label", className)} {...props} />
})

Label.displayName = "Label"

export { Label }
