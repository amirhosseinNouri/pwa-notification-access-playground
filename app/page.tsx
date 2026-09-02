"use client"

import { useEffect } from "react"
import { Bell } from "lucide-react"
import { SimulationProvider } from "@/components/simulation-provider"
import { useNotificationAccess } from "@/hooks/use-notification-access"
import { usePwaStatus } from "@/hooks/use-pwa-status"
import { NotificationModal } from "@/components/notification-modal"
import { GuidelineModal } from "@/components/guideline-modal"
import { PermissionStatus } from "@/components/permission-status"
import { PwaStatus } from "@/components/pwa-status"
import { DebugPanel } from "@/components/debug-panel"
import type { NotificationPermissionState } from "@/hooks/use-notification-permission"

function Playground() {
  const { isInstalled, isLoading: isPwaLoading } = usePwaStatus()
  const {
    visibility,
    permission,
    manualFlag,
    cooldownRemainingMs,
    handleConfirm,
    handleNotNow,
    handleCloseGuideline,
    recompute,
  } = useNotificationAccess()

  // Register the service worker so the app is installable as a PWA.
  useEffect(() => {
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch((err) => console.error("SW registration failed:", err))
    }
  }, [])

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background p-6">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10">
            <Bell className="h-10 w-10 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Notification Access Playground</h1>
          <p className="mt-2 text-muted-foreground">Access ↔ Guideline routing, ported from the Snapp PWA fix</p>
        </div>

        <PwaStatus isInstalled={isInstalled} isLoading={isPwaLoading} />
        <PermissionStatus
          permission={permission as NotificationPermissionState}
          isLoading={false}
          isPwaInstalled={isInstalled}
        />

        <DebugPanel
          permission={permission}
          visibility={visibility}
          manualFlag={manualFlag}
          cooldownRemainingMs={cooldownRemainingMs}
          onReset={recompute}
        />
      </div>

      <NotificationModal open={visibility === "access"} onClose={handleNotNow} onAllow={handleConfirm} />
      <GuidelineModal open={visibility === "guideline"} onClose={handleCloseGuideline} />
    </main>
  )
}

export default function Home() {
  return (
    <SimulationProvider>
      <Playground />
    </SimulationProvider>
  )
}
