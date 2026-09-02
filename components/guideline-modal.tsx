"use client"

import { Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface GuidelineModalProps {
  open: boolean
  onClose: () => void
}

const STEPS = ["Open your device Settings", "Find this app under Notifications", "Turn notifications On"]

export function GuidelineModal({ open, onClose }: GuidelineModalProps) {
  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center sm:text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-amber-100">
            <Settings className="h-8 w-8 text-amber-600" />
          </div>
          <DialogTitle className="text-xl">Notifications are turned off</DialogTitle>
          <DialogDescription className="text-center">
            We can&apos;t ask for permission because notifications are disabled in your settings. Enable them manually to
            continue.
          </DialogDescription>
        </DialogHeader>

        <ol className="flex flex-col gap-3 py-4">
          {STEPS.map((step, i) => (
            <li key={step} className="flex items-center gap-3">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                {i + 1}
              </span>
              <span className="text-sm text-foreground">{step}</span>
            </li>
          ))}
        </ol>

        <Button onClick={onClose} className="w-full">
          Got it
        </Button>
      </DialogContent>
    </Dialog>
  )
}
