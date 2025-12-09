"use client"

import { Smartphone, Globe } from "lucide-react"
import { cn } from "@/lib/utils"

interface PwaStatusProps {
  isInstalled: boolean
  isLoading: boolean
}

export function PwaStatus({ isInstalled, isLoading }: PwaStatusProps) {
  if (isLoading) {
    return (
      <div className="flex items-center gap-3 rounded-lg border bg-card p-4">
        <div className="h-10 w-10 animate-pulse rounded-full bg-muted" />
        <div className="space-y-2">
          <div className="h-4 w-24 animate-pulse rounded bg-muted" />
          <div className="h-3 w-20 animate-pulse rounded bg-muted" />
        </div>
      </div>
    )
  }

  const config = isInstalled
    ? {
        icon: Smartphone,
        label: "Installed",
        description: "Added to home screen",
        color: "text-emerald-600",
        bgColor: "bg-emerald-100",
      }
    : {
        icon: Globe,
        label: "Not Installed",
        description: "Running in browser",
        color: "text-amber-600",
        bgColor: "bg-amber-100",
      }

  const Icon = config.icon

  return (
    <div className="flex items-center gap-3 rounded-lg border bg-card p-4">
      <div className={cn("flex h-10 w-10 items-center justify-center rounded-full", config.bgColor)}>
        <Icon className={cn("h-5 w-5", config.color)} />
      </div>
      <div>
        <p className="text-sm font-medium text-foreground">PWA Status</p>
        <p className={cn("text-sm font-semibold", config.color)}>{config.label}</p>
        <p className="text-xs text-muted-foreground">{config.description}</p>
      </div>
    </div>
  )
}
