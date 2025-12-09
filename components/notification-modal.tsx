"use client"

import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface NotificationModalProps {
  open: boolean
  onClose: () => void
  onAllow: () => void
}

export function NotificationModal({ open, onClose, onAllow }: NotificationModalProps) {
  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center sm:text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <Bell className="h-8 w-8 text-primary" />
          </div>
          <DialogTitle className="text-xl">Enable Notifications</DialogTitle>
          <DialogDescription className="text-center">
            Stay updated with important alerts and never miss a thing. We&apos;ll only send you relevant notifications.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-3 pt-4">
          <Button onClick={onAllow} className="w-full">
            Allow Access
          </Button>
          <Button variant="outline" onClick={onClose} className="w-full bg-transparent">
            Not Now
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
