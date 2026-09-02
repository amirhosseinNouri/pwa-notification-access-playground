"use client"

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react"
import type { PermissionState } from "@/lib/push-notification-logic"

export type SimMode = null | "os-off" | "denied" | "granted" | "dismiss"

type SimulationContextValue = {
  simMode: SimMode
  // Effective permission the app should read (simulated or real).
  permission: PermissionState
  // Awaited by the activation handler; mirrors Notification.requestPermission().
  requestPermission: () => Promise<PermissionState>
  simulate: (mode: SimMode) => void
  reset: () => void
}

const SimulationContext = createContext<SimulationContextValue | null>(null)

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

function readRealPermission(): PermissionState {
  if (typeof window === "undefined" || !("Notification" in window)) return "default"
  return Notification.permission as PermissionState
}

export function SimulationProvider({ children }: { children: ReactNode }) {
  const [simMode, setSimMode] = useState<SimMode>(null)
  const [realPermission, setRealPermission] = useState<PermissionState>("default")

  // Keep the real permission fresh for the non-simulated path (one-shot read + on focus).
  useEffect(() => {
    const sync = () => setRealPermission(readRealPermission())
    sync()
    window.addEventListener("focus", sync)
    return () => window.removeEventListener("focus", sync)
  }, [])

  const permission = useMemo<PermissionState>(() => {
    switch (simMode) {
      case "os-off":
      case "dismiss":
        return "default"
      case "denied":
        return "denied"
      case "granted":
        return "granted"
      default:
        return realPermission
    }
  }, [simMode, realPermission])

  const requestPermission = useCallback(async (): Promise<PermissionState> => {
    switch (simMode) {
      // OS notifications off: the browser can't show a prompt, so it resolves instantly to default.
      case "os-off":
        return "default"
      case "denied":
        await delay(1200)
        return "denied"
      case "granted":
        await delay(1200)
        return "granted"
      // User sees a real prompt and dismisses it without deciding (slow → not suppressed).
      case "dismiss":
        await delay(1500)
        return "default"
      default: {
        if (typeof window === "undefined" || !("Notification" in window)) return "default"
        const result = (await Notification.requestPermission()) as PermissionState
        setRealPermission(result)
        return result
      }
    }
  }, [simMode])

  const simulate = useCallback((mode: SimMode) => setSimMode(mode), [])
  const reset = useCallback(() => setSimMode(null), [])

  const value = useMemo(
    () => ({ simMode, permission, requestPermission, simulate, reset }),
    [simMode, permission, requestPermission, simulate, reset],
  )

  return <SimulationContext.Provider value={value}>{children}</SimulationContext.Provider>
}

export function useSimulation() {
  const ctx = useContext(SimulationContext)
  if (!ctx) throw new Error("useSimulation must be used within a SimulationProvider")
  return ctx
}
