"use client"

import { Button } from "@/components/ui/button"
import { useSimulation, type SimMode } from "@/components/simulation-provider"
import { resetPNStorage, type PermissionState, type Visibility } from "@/lib/push-notification-logic"

interface DebugPanelProps {
  permission: PermissionState
  visibility: Visibility
  manualFlag: boolean
  cooldownRemainingMs: number
  onReset: () => void
}

const SIM_BUTTONS: { mode: Exclude<SimMode, null>; label: string }[] = [
  { mode: "os-off", label: "Simulate OS-off" },
  { mode: "denied", label: "Simulate denied" },
  { mode: "granted", label: "Simulate granted" },
  { mode: "dismiss", label: "Simulate dismiss" },
]

function formatCooldown(ms: number) {
  if (ms <= 0) return "expired"
  const days = ms / (24 * 60 * 60 * 1000)
  return `${days.toFixed(2)}d left`
}

export function DebugPanel({ permission, visibility, manualFlag, cooldownRemainingMs, onReset }: DebugPanelProps) {
  const { simMode, simulate, reset } = useSimulation()

  const handleReset = () => {
    resetPNStorage()
    reset()
    onReset()
  }

  return (
    <div className="rounded-lg border border-dashed bg-card p-4">
      <p className="mb-3 text-sm font-semibold text-foreground">Debug panel</p>

      <div className="grid grid-cols-2 gap-2">
        {SIM_BUTTONS.map(({ mode, label }) => (
          <Button
            key={mode}
            size="sm"
            variant={simMode === mode ? "default" : "outline"}
            onClick={() => simulate(mode)}
          >
            {label}
          </Button>
        ))}
      </div>

      <Button size="sm" variant="destructive" onClick={handleReset} className="mt-2 w-full">
        Reset storage &amp; sim
      </Button>

      <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
        <dt className="text-muted-foreground">sim mode</dt>
        <dd className="text-right font-mono text-foreground">{simMode ?? "off (real)"}</dd>
        <dt className="text-muted-foreground">permission</dt>
        <dd className="text-right font-mono text-foreground">{permission}</dd>
        <dt className="text-muted-foreground">visibility</dt>
        <dd className="text-right font-mono text-foreground">{visibility ?? "none"}</dd>
        <dt className="text-muted-foreground">manualFlag</dt>
        <dd className="text-right font-mono text-foreground">{String(manualFlag)}</dd>
        <dt className="text-muted-foreground">cooldown</dt>
        <dd className="text-right font-mono text-foreground">{formatCooldown(cooldownRemainingMs)}</dd>
      </dl>
    </div>
  )
}
