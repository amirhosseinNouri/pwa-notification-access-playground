"use client"

import { useState, useEffect } from "react"

export function usePwaStatus() {
  const [isInstalled, setIsInstalled] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (typeof window === "undefined") {
      setIsLoading(false)
      return
    }

    // Check if running in standalone mode (added to home screen)
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as Navigator & { standalone?: boolean }).standalone === true

    setIsInstalled(isStandalone)
    setIsLoading(false)

    // Listen for display mode changes
    const mediaQuery = window.matchMedia("(display-mode: standalone)")
    const handleChange = (e: MediaQueryListEvent) => {
      setIsInstalled(e.matches)
    }

    mediaQuery.addEventListener("change", handleChange)
    return () => mediaQuery.removeEventListener("change", handleChange)
  }, [])

  return {
    isInstalled,
    isLoading,
  }
}
