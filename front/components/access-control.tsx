"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Switch } from "@/components/ui/switch"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, Shield, Plus } from "lucide-react"

interface Doctor {
  id: string
  name: string
  specialty: string
  hospital: string
  hasAccess: boolean
}

interface AccessControlProps {
  doctors: Doctor[]
  onClose: () => void
}

export function AccessControl({ doctors, onClose }: AccessControlProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [localDoctors, setLocalDoctors] = useState<Doctor[]>(doctors)

  const filteredDoctors = localDoctors.filter(
    (doctor) =>
      doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doctor.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doctor.hospital.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleAccessToggle = (doctorId: string) => {
    setLocalDoctors((prevDoctors) =>
      prevDoctors.map((doctor) => (doctor.id === doctorId ? { ...doctor, hasAccess: !doctor.hasAccess } : doctor)),
    )
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md border border-primary/20 bg-background/95 backdrop-blur-xl">
        <DialogHeader>
          <DialogTitle>Manage Access Control</DialogTitle>
          <DialogDescription>Control which healthcare providers can access your medical records.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search doctors..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
            {filteredDoctors.length > 0 ? (
              filteredDoctors.map((doctor) => (
                <div
                  key={doctor.id}
                  className="flex items-center justify-between p-3 rounded-lg border border-primary/10 bg-background/60 hover:border-primary/30 transition-all duration-300"
                >
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={`/placeholder.svg?height=40&width=40`} />
                      <AvatarFallback>
                        {doctor.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{doctor.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {doctor.specialty} at {doctor.hospital}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Switch
                      checked={doctor.hasAccess}
                      onCheckedChange={() => handleAccessToggle(doctor.id)}
                      className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-cyan-500 data-[state=checked]:to-purple-600"
                    />
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <Shield className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground">No doctors found</p>
              </div>
            )}
          </div>

          <Button className="w-full border border-dashed border-primary/20 bg-background/40 hover:border-primary/40 transition-colors">
            <Plus className="mr-2 h-4 w-4" />
            Add New Healthcare Provider
          </Button>

          <div className="flex justify-end">
            <Button
              onClick={onClose}
              className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white"
            >
              Save Changes
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

