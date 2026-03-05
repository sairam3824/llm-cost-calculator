"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface SliderProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  value?: number;
  onValueChange?: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
}

const Slider = React.forwardRef<HTMLInputElement, SliderProps>(
  ({ className, value, onValueChange, min = 0, max = 100, step = 1, ...props }, ref) => {
    return (
      <input
        type="range"
        ref={ref}
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onValueChange?.(Number(e.target.value))}
        className={cn(
          "w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider-thumb",
          className
        )}
        {...props}
      />
    )
  }
)
Slider.displayName = "Slider"

export { Slider }
