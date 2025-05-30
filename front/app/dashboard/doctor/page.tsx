"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {FileText, User, LogOut,} from "lucide-react";
import { DashboardHeader } from "@/components/dashboard-header";
import DoctorPatients from "@/components/doctor/DoctorPatients";
import DoctorDocuments from "@/components/doctor/DoctorDocuments";
import DoctorProfile from "@/components/doctor/DoctorProfile";

export default function DoctorDashboard() {
  const [currentTab, setCurrentTab] = useState("patients");
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-background/90 relative">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[30%] -left-[10%] w-[70%] h-[70%] rounded-full bg-blue-500/5 blur-[120px]" />
        <div className="absolute -bottom-[30%] -right-[10%] w-[70%] h-[70%] rounded-full bg-cyan-500/5 blur-[120px]" />
      </div>

      <DashboardHeader userType="doctor" />

      <main className="container mx-auto px-4 py-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <Card className="sticky top-20 border border-primary/10 bg-background/60 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12 border-2 border-primary/20">
                    <AvatarImage src="/placeholder.svg?height=48&width=48"/>
                    <AvatarFallback>DR</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle>Dr. Sarah Johnson</CardTitle>
                    <CardDescription>Cardiologist</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <nav className="space-y-2">
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => setCurrentTab("patients")}
                  >
                    <User className="mr-2 h-4 w-4"/>
                    Patients
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => setCurrentTab("documents")}
                  >
                    <FileText className="mr-2 h-4 w-4"/>
                    Documents
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => setCurrentTab("profile")}
                  >
                    <User className="mr-2 h-4 w-4"/>
                    Profile
                  </Button>
                </nav>
              </CardContent>
              <CardFooter>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                  <LogOut className="mr-2 h-4 w-4"/>
                  Disconnect Wallet
                </Button>
              </CardFooter>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {currentTab === "patients" && (
              <DoctorPatients />
            )}
            {currentTab === "documents" && (
              <DoctorDocuments />
            )}
            {currentTab === "profile" && (
              <DoctorProfile />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
