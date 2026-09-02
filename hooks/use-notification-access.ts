"use client"

import { useCallback, useEffect, useState } from "react"
import { useSimulation } from "@/components/simulation-provider"
import { usePwaStatus } from "@/hooks/use-pwa-status"
import {
  DEFAULT_ACTIVATION_COOLDOWN_DAYS,
  MS_PER_DAY,
  decideVisibility,
  getPNDeniedTimestamp,
  getPNManualEnableRequired,
  isCooldownExpired,
  isPromptSuppressed,
  setPNDeniedTimestamp,
  setPNManualEnableRequired,
  type Visibility,
} from "@/lib/push-notification-logic"

const isIOS = typeof navigator !== "undefined" && /iphone|ipad|ipod/i.test(navigator.userAgent)

const cooldownMs = DEFAULT_ACTIVATION_COOLDOWN_DAYS * MS_PER_DAY

export function useNotificationAccess() {
  const { permission, requestPermission, simMode } = useSimulation()
  const { isInstalled } = usePwaStatus()

  const [visibility, setVisibility] = useState<Visibility>(null)
  // Live debug values, refreshed whenever we recompute.
  const [manualFlag, setManualFlag] = useState(false)
  const [cooldownRemainingMs, setCooldownRemainingMs] = useState(0)

  const supported = typeof window !== "undefined" && "Notification" in window

  const recompute = useCallback(() => {
    const flag = getPNManualEnableRequired()
    const timestamp = getPNDeniedTimestamp()
    const cooldownExpired = isCooldownExpired(timestamp, cooldownMs)

    setManualFlag(flag)
    setCooldownRemainingMs(timestamp ? Math.max(0, cooldownMs - (Date.now() - timestamp)) : 0)

    // Granted: nothing to show, and any stale "must enable manually" flag is no longer true.
    if (permission === "granted") {
      setPNManualEnableRequired(false)
      setManualFlag(false)
      setVisibility(null)
      return
    }

    setVisibility(
      decideVisibility({
        permission,
        manualFlag: flag,
        cooldownExpired,
        isIOS,
        isStandalone: isInstalled,
        supported,
      }),
    )
  }, [permission, isInstalled, supported])

  // Re-run whenever the effective permission or simulation changes (mirrors the mount effect).
  useEffect(() => {
    recompute()
  }, [recompute, simMode])

  const handleConfirm = useCallback(async () => {
    const requestStartedAt = Date.now()
    const result = await requestPermission()

    if (result === "granted") {
      console.log("[webengage] subscribe") // stub for WebEngage subscription registration
      setPNManualEnableRequired(false)
      setManualFlag(false)
      setVisibility(null)
      return
    }

    setPNDeniedTimestamp(Date.now())

    // denied = explicit block; instant `default` = OS suppressed the prompt. Both need settings.
    const mustEnableManually = result === "denied" || isPromptSuppressed(result, Date.now() - requestStartedAt)

    setPNManualEnableRequired(mustEnableManually)
    setManualFlag(mustEnableManually)
    setVisibility(mustEnableManually ? "guideline" : null)
  }, [requestPermission])

  const handleNotNow = useCallback(() => {
    setPNDeniedTimestamp(Date.now())
    setVisibility(null)
  }, [])

  const handleCloseGuideline = useCallback(() => {
    setPNDeniedTimestamp(Date.now())
    setVisibility(null)
  }, [])

  return {
    visibility,
    permission,
    manualFlag,
    cooldownRemainingMs,
    handleConfirm,
    handleNotNow,
    handleCloseGuideline,
    recompute,
  }
}
