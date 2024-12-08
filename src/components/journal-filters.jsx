"use client"

import { Slider } from "@/components/ui/slider"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button"


export function JournalFilter({ title, value, max, onChange }) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-[150px]">
          {title}: {value}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="space-y-4">
          <h4 className="font-medium leading-none">{title}</h4>
          <Slider
            min={0}
            max={max}
            step={1}
            value={[value]}
            onValueChange={([val]) => onChange(val)}
          />
        </div>
      </PopoverContent>
    </Popover>
  )
}

