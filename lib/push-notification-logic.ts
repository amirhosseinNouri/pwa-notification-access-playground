// Framework-agnostic port of the Snapp PWA push-notification logic.
// Mirrors src/service/push-notifications/* from the real app.

export type PermissionState = "default" | "granted" | "denied"
export type Visibility = "access" | "guideline" | null

export const PROMPT_SUPPRESSION_THRESHOLD_MS = 700
export const DEFAULT_ACTIVATION_COOLDOWN_DAYS = 14
export const MS_PER_DAY = 24 * 60 * 60 * 1000

const KEY_DENIED_TIMESTAMP = "pnDeniedTimestamp"
const KEY_MANUAL_REQUIRED = "pnManualEnableRequired"

function readParsed<T>(key: string): T | null {
  if (typeof window === "undefined") return null
  const raw = window.localStorage.getItem(key)
  if (raw === null) return null
  try {
    return JSON.parse(raw) as T
  } catch {
    return null
  }
}

function write(key: string, value: unknown) {
  if (typeof window === "undefined") return
  window.localStorage.setItem(key, JSON.stringify(value))
}

export function getPNDeniedTimestamp(): number | null {
  return readParsed<number>(KEY_DENIED_TIMESTAMP)
}

export function setPNDeniedTimestamp(timestamp: number) {
  write(KEY_DENIED_TIMESTAMP, timestamp)
}

// Sticky flag: the device can't be prompted, so the user must enable notifications in settings.
export function getPNManualEnableRequired(): boolean {
  return readParsed<boolean>(KEY_MANUAL_REQUIRED) === true
}

export function setPNManualEnableRequired(value: boolean) {
  write(KEY_MANUAL_REQUIRED, value)
}

export function resetPNStorage() {
  if (typeof window === "undefined") return
  window.localStorage.removeItem(KEY_DENIED_TIMESTAMP)
  window.localStorage.removeItem(KEY_MANUAL_REQUIRED)
}

export function isCooldownExpired(timestamp: number | null, cooldownMs: number) {
  if (!timestamp) return true
  return Date.now() - timestamp >= cooldownMs
}

// Below the threshold, requestPermission() resolved too fast for a real prompt: the OS suppressed it.
export function isPromptSuppressed(permission: PermissionState, elapsedMs: number) {
  return permission === "default" && elapsedMs < PROMPT_SUPPRESSION_THRESHOLD_MS
}

type DecideArgs = {
  permission: PermissionState
  manualFlag: boolean
  cooldownExpired: boolean
  isIOS: boolean
  isStandalone: boolean
  supported: boolean
}

// Pure port of the useEffect in use-push-notification-modal.ts.
// The caller handles the granted case (clear flag + render nothing).
export function decideVisibility({
  permission,
  manualFlag,
  cooldownExpired,
  isIOS,
  isStandalone,
  supported,
}: DecideArgs): Visibility {
  // Mirrors checkFlags: standalone is only required on iOS.
  if (!supported || (isIOS && !isStandalone)) return null
  if (permission === "granted") return null
  if (!cooldownExpired) return null

  // Blocked or OS-level off: only the manual guideline can help, never the access prompt.
  if (permission === "denied" || manualFlag) return "guideline"

  if (permission === "default") return "access"
  return null
}
