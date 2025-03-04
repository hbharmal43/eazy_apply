"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface EditGoalDialogProps {
  isOpen: boolean
  onClose: () => void
  currentGoal: number
  onSave: (newGoal: number) => void
}

export function EditGoalDialog({
  isOpen,
  onClose,
  currentGoal,
  onSave,
}: EditGoalDialogProps) {
  const [goal, setGoal] = useState(currentGoal)

  const handleSave = () => {
    onSave(goal)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-white">
        <DialogHeader className="space-y-3">
          <DialogTitle className="text-xl">Edit Daily Goal</DialogTitle>
          <DialogDescription className="text-gray-600">
            Set your target number of job applications per day.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Input
              id="goal"
              type="number"
              value={goal}
              onChange={(e) => setGoal(Number(e.target.value))}
              min={1}
              max={50}
              className="col-span-4"
            />
          </div>
          <p className="text-sm text-muted-foreground">
            Tip: Setting realistic goals helps maintain consistency. Consider your available time and the quality of applications.
          </p>
        </div>
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button className="bg-[#0A66C2] hover:bg-[#084e96]" onClick={handleSave}>
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 