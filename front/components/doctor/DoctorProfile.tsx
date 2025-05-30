"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {Edit, Shield} from "lucide-react";
import {Button} from "@/components/ui/button";

export default function DoctorProfile() {
  return (
    <main>
      <div className="space-y-6">
        {/* Profile Header */}
        <div className="flex flex-col items-center text-center mb-6">
          <Avatar className="h-24 w-24 border-2 border-primary/20 mb-4">
            <AvatarImage src="/placeholder.svg?height=96&width=96" />
            <AvatarFallback className="text-2xl">DR</AvatarFallback>
          </Avatar>
          <h2 className="text-2xl font-bold">Dr. Sarah Johnson</h2>
          <p className="text-muted-foreground">Cardiologist</p>
          <div className="flex gap-2 mt-2">
            <Badge
              variant="outline"
              className="bg-blue-500/10 text-blue-500 border-blue-500/20"
            >
              Verified
            </Badge>
            <Badge
              variant="outline"
              className="bg-cyan-500/10 text-cyan-500 border-cyan-500/20"
            >
              Board Certified
            </Badge>
          </div>
        </div>

        {/* Professional Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Professional Information</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Specialty</p>
              <p className="font-medium">Cardiology</p>
            </div>
            <div>
              <p className="text-muted-foreground">License Number</p>
              <p className="font-medium">MED-12345-CA</p>
            </div>
            <div>
              <p className="text-muted-foreground">Hospital/Clinic</p>
              <p className="font-medium">Metro General Hospital</p>
            </div>
            <div>
              <p className="text-muted-foreground">Years of Experience</p>
              <p className="font-medium">12 years</p>
            </div>
          </div>
        </div>

        {/* Blockchain Certifications */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Blockchain Certifications</h3>
          <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
            <div className="flex items-center gap-3 mb-3">
              <Shield className="h-6 w-6 text-green-500" />
              <div>
                <p className="font-medium">Medical License Verification</p>
                <p className="text-sm text-muted-foreground">
                  License MED-12345-CA verified on blockchain
                </p>
              </div>
            </div>
            <div className="bg-background/40 rounded-md p-3 text-xs font-mono">
              <p className="text-muted-foreground mb-1">Transaction Hash:</p>
              <p className="break-all">
                0x4b5c9e2d1f0a7b6c5d4e3f2a1b0c9d8e7f6a5b4c3d2e1f0a3b5c7
              </p>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Contact Information</h3>
          <p className="text-muted-foreground text-sm">
            How patients can reach you
          </p>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Email Address</p>
              <p className="font-medium">dr.sarah.johnson@example.com</p>
            </div>
            <div>
              <p className="text-muted-foreground">Phone Number</p>
              <p className="font-medium">+1 (555) 123-4567</p>
            </div>
          </div>
          <Button
            variant="outline"
            className="w-full border-primary/20 hover:bg-primary/5"
          >
            <Edit className="mr-2 h-4 w-4" />
            Edit Information
          </Button>
        </div>
      </div>
    </main>
  );
}