"use client"

import { clsx } from "clsx"
import { ChevronDown } from "lucide-react"
import { type SelectHTMLAttributes, forwardRef, useState } from "react"

interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, "onChange" | "value"> {
  placeholder?: string
  options: { value: string; label: string }[]
  onValueChange?: (value: string) => void
  value?: string
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, placeholder, options, onValueChange, value: controlledValue, ...rest }, ref) => {
    // Detect controlled vs uncontrolled usage
    const isControlled = controlledValue !== undefined

    const [internalValue, setInternalValue] = useState("")
    const [isOpen, setIsOpen] = useState(false)

    const selectedValue = isControlled ? controlledValue : internalValue
    const selectedOption = options.find((o) => o.value === selectedValue)

    const handleSelect = (val: string) => {
      if (!isControlled) {
        setInternalValue(val)
      }
      onValueChange?.(val)
      setIsOpen(false)
    }

    return (
      <div className="relative">
        {/* Trigger */}
        <button
          type="button"
          className={clsx("input flex items-center justify-between cursor-pointer", className)}
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className={selectedValue ? "text-gray-900" : "text-gray-500"}>
            {selectedOption?.label || placeholder || "Select..."}
          </span>
          <ChevronDown className="h-4 w-4 text-gray-400" />
        </button>

        {/* Options */}
        {isOpen && (
          <div className="absolute z-50 mt-1 w-full rounded-md border border-gray-300 bg-white shadow-lg">
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100 first:rounded-t-md last:rounded-b-md"
                onClick={() => handleSelect(option.value)}
              >
                {option.label}
              </button>
            ))}
          </div>
        )}

        {/* Hidden native select for form compatibility */}
        <select
          ref={ref}
          className="sr-only"
          value={selectedValue}
          onChange={(e) => handleSelect(e.target.value)}
          {...rest}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    )
  },
)

Select.displayName = "Select"

export { Select }
