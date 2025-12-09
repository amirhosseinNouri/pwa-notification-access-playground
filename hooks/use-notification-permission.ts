"use client"

import { useState, useEffect, useCallback } from "react"

export type NotificationPermissionState = "default" | "granted" | "denied" | "unsupported"

export function useNotificationPermission() {
  const [permission, setPermission] = useState<NotificationPermissionState>("default")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (typeof window === "undefined" || !("Notification" in window)) {
      setPermission("unsupported")
      setIsLoading(false)
      return
    }

    setPermission(Notification.permission as NotificationPermissionState)
    setIsLoading(false)

    // Listen for permission changes (some browsers support this)
    const checkPermission = () => {
      setPermission(Notification.permission as NotificationPermissionState)
    }

    // Poll for permission changes since not all browsers support the permissionchange event
    const interval = setInterval(checkPermission, 1000)
    return () => clearInterval(interval)
  }, [])

  const requestPermission = useCallback(async (): Promise<NotificationPermissionState> => {
    if (typeof window === "undefined" || !("Notification" in window)) {
      return "unsupported"
    }

    try {
      const result = await Notification.requestPermission()
      setPermission(result as NotificationPermissionState)
      return result as NotificationPermissionState
    } catch (error) {
      console.error("Error requesting notification permission:", error)
      return Notification.permission as NotificationPermissionState
    }
  }, [])

  return {
    permission,
    isLoading,
    requestPermission,
    isSupported: permission !== "unsupported",
    isGranted: permission === "granted",
    isDenied: permission === "denied",
    isDefault: permission === "default",
  }
}
