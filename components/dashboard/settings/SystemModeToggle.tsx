'use client'

import { useState } from 'react'
import { Zap, Clock, Power } from 'lucide-react'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'

// Define a literal type so TypeScript knows exactly what values are allowed
type AnsweringMode = 'always_on' | 'after_hours' | 'disabled'

interface SystemModeToggleProps {
  initialMode: AnsweringMode
  onModeChange: (mode: AnsweringMode) => void
  aiName?: string
}

export function SystemModeToggle({ initialMode, onModeChange, aiName = 'Your AI' }: SystemModeToggleProps) {
  // Pass the type to useState
  const [mode, setMode] = useState<AnsweringMode>(initialMode)

  const handleValueChange = (value: string) => {
    const newMode = value as AnsweringMode

    // If they are turning the system off, double check
    if (newMode === 'disabled') {
        const confirmOff = confirm("Are you sure? This will stop Beacon Horizons from answering all incoming calls.")
    if (!confirmOff) return // Exit if they click cancel
    }
    
    setMode(newMode)
    onModeChange(newMode)
  }

  return (
    <div className="space-y-4 p-1">
      <div className="flex flex-col gap-1 mb-4">
        <h3 className="text-sm font-semibold text-white/90 uppercase tracking-tight">Answering Protocol</h3>
        <p className="text-xs text-white/40">Select how the AI handles incoming voice traffic.</p>
      </div>

      <Tabs value={mode} onValueChange={handleValueChange} className="w-full">
        {/* Added w-full and grid-cols-3 to ensure it fills the space */}
        <TabsList className="grid w-full grid-cols-3 bg-black/40 border border-[#212129] h-12 p-1 rounded-xl">
          
          <TabsTrigger 
            value="always_on" 
            className={cn(
              "rounded-xl gap-2 data-[state=active]:bg-[#2DD4BF] data-[state=active]:text-white transition-all duration-300",
              "text-white/40 font-semibold text-[10px] uppercase tracking-widest h-full"
            )}
          >
            <Zap className="size-3" />
            Always On
          </TabsTrigger>

          <TabsTrigger 
            value="after_hours" 
            className={cn(
              "rounded-xl gap-2 data-[state=active]:bg-amber-500 data-[state=active]:text-white transition-all duration-300",
              "text-white/40 font-semibold text-[10px] uppercase tracking-widest h-full"
            )}
          >
            <Clock className="size-3" />
            After Hours
          </TabsTrigger>

          <TabsTrigger 
            value="disabled" 
            className={cn(
              "rounded-xl gap-2 data-[state=active]:bg-red-500 data-[state=active]:text-white transition-all duration-300",
              "text-white/40 font-semibold text-[10px] uppercase tracking-widest h-full"
            )}
          >
            <Power className="size-3" />
            Offline
          </TabsTrigger>

        </TabsList>
      </Tabs>

      <div className="mt-4 px-3 py-3 rounded-xl bg-[#121216] border border-[#212129] min-h-[44px] flex items-center">
        <p className="text-[11px] text-white/60 leading-relaxed italic">
          {mode === 'always_on' && `• ${aiName} will pick up every call, 24/7.`}
          {mode === 'after_hours' && `• ${aiName} only triggers when your clinic is closed (based on KL business hours).`}
          {mode === 'disabled' && `• ${aiName} is currently paused. Calls will go to your default voicemail.`}
        </p>
      </div>
    </div>
  )
}
