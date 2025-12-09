"use client"

import { useState, useEffect } from "react"
import { useNotificationPermission } from "@/hooks/use-notification-permission"
import { usePwaStatus } from "@/hooks/use-pwa-status"
import { NotificationModal } from "@/components/notification-modal"
import { PermissionStatus } from "@/components/permission-status"
import { PwaStatus } from "@/components/pwa-status"
import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Home() {
  const { permission, isLoading, requestPermission, isSupported, isDenied, isGranted } = useNotificationPermission()
  const { isInstalled, isLoading: isPwaLoading } = usePwaStatus()
  const [modalOpen, setModalOpen] = useState(false)

  // Register service worker on mount
  useEffect(() => {
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .catch((err) => console.error("Service worker registration failed:", err))
    }
  }, [])

  useEffect(() => {
    if (!isLoading && isSupported && permission === "default") {
      setModalOpen(true)
    }
  }, [isLoading, isSupported, permission])

  const handleAllowAccess = async () => {
    await requestPermission()
    setModalOpen(false)
  }

  const handleNotNow = () => {
    setModalOpen(false)
  }

  const handleRequestAgain = () => {
    if (permission === "default" && isSupported) {
      setModalOpen(true)
    }
  }

  const canShowModal = isSupported && permission === "default"

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background p-6">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10">
            <Bell className="h-10 w-10 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Notification PWA</h1>
          <p className="mt-2 text-muted-foreground">A simple PWA with notification permission handling</p>
        </div>

        <PwaStatus isInstalled={isInstalled} isLoading={isPwaLoading} />

        <PermissionStatus permission={permission} isLoading={isLoading} isPwaInstalled={isInstalled} />

        {/* Info Messages */}
        {isDenied && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">
            <p className="font-medium">Notifications Blocked</p>
            <p className="mt-1 text-red-700">
              You have denied notification permissions. To enable notifications, please update your browser settings for
              this site.
            </p>
          </div>
        )}

        {isGranted && (
          <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
            <p className="font-medium">Notifications Enabled</p>
            <p className="mt-1 text-emerald-700">You will receive notifications from this app.</p>
          </div>
        )}

        {canShowModal && !isLoading && (
          <Button onClick={handleRequestAgain} className="w-full">
            Request Notification Permission
          </Button>
        )}

        {/* Install Instructions - show more prominently if not installed */}
        {!isInstalled && !isPwaLoading && (
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
            <p className="font-medium">Add to Home Screen</p>
            <p className="mt-2">
              <strong>iOS:</strong> Tap the Share button, then &quot;Add to Home Screen&quot;
            </p>
            <p className="mt-1">
              <strong>Android:</strong> Tap the menu, then &quot;Add to Home Screen&quot;
            </p>
          </div>
        )}
      </div>

      {canShowModal && <NotificationModal open={modalOpen} onClose={handleNotNow} onAllow={handleAllowAccess} />}
    </main>
  )
}
