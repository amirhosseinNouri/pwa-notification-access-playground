"use client"

import type React from "react"

import { Bell, BellOff, BellRing, HelpCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import type { NotificationPermissionState } from "@/hooks/use-notification-permission"

interface PermissionStatusProps {
  permission: NotificationPermissionState
  isLoading: boolean
  isPwaInstalled: boolean
}

const statusConfig: Record<
  NotificationPermissionState,
  { icon: React.ElementType; label: string; color: string; bgColor: string }
> = {
  default: {
    icon: Bell,
    label: "Not Requested",
    color: "text-amber-600",
    bgColor: "bg-amber-100",
  },
  granted: {
    icon: BellRing,
    label: "Granted",
    color: "text-emerald-600",
    bgColor: "bg-emerald-100",
  },
  denied: {
    icon: BellOff,
    label: "Denied",
    color: "text-red-600",
    bgColor: "bg-red-100",
  },
  unsupported: {
    icon: HelpCircle,
    label: "Not Supported",
    color: "text-muted-foreground",
    bgColor: "bg-muted",
  },
}

export function PermissionStatus({ permission, isLoading, isPwaInstalled }: PermissionStatusProps) {
  if (isLoading) {
    return (
      <div className="flex items-center gap-3 rounded-lg border bg-card p-4">
        <div className="h-10 w-10 animate-pulse rounded-full bg-muted" />
        <div className="space-y-2">
          <div className="h-4 w-32 animate-pulse rounded bg-muted" />
          <div className="h-3 w-24 animate-pulse rounded bg-muted" />
        </div>
      </div>
    )
  }

  const config = statusConfig[permission]
  const Icon = config.icon

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-3 rounded-lg border bg-card p-4">
        <div className={cn("flex h-10 w-10 items-center justify-center rounded-full", config.bgColor)}>
          <Icon className={cn("h-5 w-5", config.color)} />
        </div>
        <div>
          <p className="text-sm font-medium text-foreground">Notification Permission</p>
          <p className={cn("text-sm font-semibold", config.color)}>{config.label}</p>
        </div>
      </div>
      {permission === "unsupported" && !isPwaInstalled && (
        <p className="text-xs text-muted-foreground px-1">
          Push notifications require the app to be added to your home screen. Please install the app first.
        </p>
      )}
    </div>
  )
}
