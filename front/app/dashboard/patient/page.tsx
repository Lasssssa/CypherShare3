"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  FileText,
  Shield,
  FilePen,
  Plus,
  User,
  LogOut,
  Edit,
} from "lucide-react";
import { DashboardHeader } from "@/components/dashboard-header";
import { DocumentCard } from "@/components/document-card";
import { UploadDocument } from "@/components/upload-document";
import { AccessControl } from "@/components/access-control";
import { Separator } from "@/components/ui/separator";

const medicalDocuments = [
  {
    id: "doc1",
    title: "Blood Test Results",
    date: "2023-12-15",
    doctor: "Dr. Sarah Johnson",
    hospital: "Metro General Hospital",
    type: "Laboratory",
    ipfsHash: "QmT8CZxmNLj7bvyT48sGKxmY6CRe9ZU7GGdkPGCXqYdZWJ",
    verified: true,
  },
  {
    id: "doc2",
    title: "X-Ray Report",
    date: "2023-11-28",
    doctor: "Dr. Michael Chen",
    hospital: "City Medical Center",
    type: "Radiology",
    ipfsHash: "QmUNLLsPACCz1vLxQVkXqqLX5R1X345qqfHbsf67hvA3Nn",
    verified: true,
  },
  {
    id: "doc3",
    title: "MRI Scan Results",
    date: "2024-01-05",
    doctor: "Dr. Emily Rodriguez",
    hospital: "Wellness Clinic",
    type: "Radiology",
    ipfsHash: "QmPChd2hVbrJ6bfo3WBcTW4iZnpHm8TEzWkLHmLpXhF68A",
    verified: false,
  },
];

const medicalPrescriptions = [
  {
    id: "doc1",
    title: "Prescription for Blood Pressure Medication",
    date: "2023-12-15",
    doctor: "Dr. Sarah Johnson",
    hospital: "Metro General Hospital",
    type: "Laboratory",
    ipfsHash: "QmT8CZxmNLj7bvyT48sGKxmY6CRe9ZU7GGdkPGCXqYdZWJ",
    verified: true,
  },
  {
    id: "doc2",
    title: "Prescription for Diabetes Medication",
    date: "2023-11-28",
    doctor: "Dr. Michael Chen",
    hospital: "City Medical Center",
    type: "Medication",
    ipfsHash: "QmUNLLsPACCz1vLxQVkXqqLX5R1X345qqfHbsf67hvA3Nn",
    verified: true,
  },
  {
    id: "doc3",
    title: "Prescription for Cholesterol Medication",
    date: "2024-01-05",
    doctor: "Dr. Emily Rodriguez",
    hospital: "Wellness Clinic",
    type: "Medication",
    ipfsHash: "QmPChd2hVbrJ6bfo3WBcTW4iZnpHm8TEzWkLHmLpXhF68A",
    verified: false,
  },
];

const doctors = [
  {
    id: "dr1",
    name: "Dr. Sarah Johnson",
    specialty: "Cardiologist",
    hospital: "Metro General Hospital",
    hasAccess: true,
  },
  {
    id: "dr2",
    name: "Dr. Michael Chen",
    specialty: "Radiologist",
    hospital: "City Medical Center",
    hasAccess: true,
  },
  {
    id: "dr3",
    name: "Dr. Emily Rodriguez",
    specialty: "General Practitioner",
    hospital: "Wellness Clinic",
    hasAccess: false,
  },
];

export default function PatientDashboard() {
  const [showUpload, setShowUpload] = useState(false);
  const [showAccessControl, setShowAccessControl] = useState(false);
  const [currentView, setCurrentView] = useState<
    "records" | "access" | "profile" | "prescriptions"
  >("records");
  const [tab, setTab] = useState("personal");

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-background/90 relative">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[30%] -left-[10%] w-[70%] h-[70%] rounded-full bg-purple-500/5 blur-[120px]" />
        <div className="absolute -bottom-[30%] -right-[10%] w-[70%] h-[70%] rounded-full bg-cyan-500/5 blur-[120px]" />
      </div>

      <DashboardHeader userType="patient" />

      <main className="container mx-auto px-4 py-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-20 border border-primary/10 bg-background/60 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12 border-2 border-primary/20">
                    <AvatarImage src="/placeholder.svg?height=48&width=48" />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle>John Doe</CardTitle>
                    <CardDescription>Patient ID: P-12345</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <nav className="space-y-2">
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => setCurrentView("records")}
                  >
                    <FileText className="mr-2 h-4 w-4" />
                    Medical Records
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => setCurrentView("prescriptions")}
                  >
                    <FilePen className="mr-2 h-4 w-4" />
                    Prescriptions
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => setCurrentView("access")}
                  >
                    <Shield className="mr-2 h-4 w-4" />
                    Access Control
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => setCurrentView("profile")}
                  >
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </Button>
                </nav>
              </CardContent>
              <CardFooter>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Disconnect Wallet
                </Button>
              </CardFooter>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {currentView === "records" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {medicalDocuments.map((doc) => (
                  <DocumentCard key={doc.id} document={doc} />
                ))}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="cursor-pointer"
                  onClick={() => setShowUpload(true)}
                >
                  <Card className="h-full border border-dashed border-primary/20 bg-background/40 hover:border-primary/40 transition-colors">
                    <CardContent className="flex flex-col items-center justify-center h-full py-10">
                      <Plus className="h-12 w-12 text-primary/40 mb-4" />
                      <p className="text-primary/60 font-medium">
                        Add New Document
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            )}

            {currentView === "prescriptions" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {medicalPrescriptions.map((doc) => (
                  <DocumentCard key={doc.id} document={doc} />
                ))}
              </div>
            )}

            {currentView === "access" && (
              <div className="grid grid-cols-1 gap-4">
                {doctors.map((doctor) => (
                  <Card
                    key={doctor.id}
                    className="border border-primary/10 bg-background/60 backdrop-blur-sm hover:border-primary/30 transition-all duration-300"
                  >
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage
                              src={`/placeholder.svg?height=40&width=40`}
                            />
                            <AvatarFallback>
                              {doctor.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <CardTitle className="text-lg">
                              {doctor.name}
                            </CardTitle>
                            <CardDescription>
                              {doctor.specialty} at {doctor.hospital}
                            </CardDescription>
                          </div>
                        </div>
                        <Badge
                          variant={doctor.hasAccess ? "outline" : "secondary"}
                          className={
                            doctor.hasAccess
                              ? "bg-green-500/10 text-green-500 border-green-500/20"
                              : ""
                          }
                        >
                          {doctor.hasAccess ? "Has Access" : "No Access"}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardFooter className="flex justify-end gap-2">
                      <Button
                        variant={doctor.hasAccess ? "destructive" : "default"}
                        size="sm"
                        className={
                          doctor.hasAccess
                            ? "bg-destructive/10 text-destructive hover:bg-destructive/20"
                            : "bg-gradient-to-r from-cyan-500 to-purple-600"
                        }
                      >
                        <Shield className="mr-2 h-4 w-4" />
                        {doctor.hasAccess ? "Revoke Access" : "Grant Access"}
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}

            {currentView === "profile" && (
              <div className="space-y-6">
                <Tabs value={tab} onValueChange={setTab}>
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="personal">Personal Info</TabsTrigger>
                    <TabsTrigger value="contact">
                      Contact & Emergency
                    </TabsTrigger>
                    <TabsTrigger value="medical">Medical History</TabsTrigger>
                  </TabsList>

                  {/* Personal Info */}
                  <TabsContent value="personal" className="space-y-4 mt-4">
                    <Card className="border border-primary/10 bg-background/60 backdrop-blur-sm">
                      <CardHeader>
                        <CardTitle>Personal Information</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">Full Name</p>
                            <p className="font-medium">John Doe</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">
                              Date of Birth
                            </p>
                            <p className="font-medium">15 May 1982</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Age</p>
                            <p className="font-medium">42 years</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Gender</p>
                            <p className="font-medium">Male</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Blood Type</p>
                            <p className="font-medium">O+</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Height</p>
                            <p className="font-medium">180 cm</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Weight</p>
                            <p className="font-medium">75 kg</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Allergies</p>
                            <div className="flex flex-wrap gap-1">
                              <Badge
                                variant="outline"
                                className="bg-red-500/10 text-red-500 border-red-500/20"
                              >
                                Penicillin
                              </Badge>
                              <Badge
                                variant="outline"
                                className="bg-red-500/10 text-red-500 border-red-500/20"
                              >
                                Peanuts
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button
                          variant="outline"
                          className="w-full border-primary/20 hover:bg-primary/5"
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Edit Information
                        </Button>
                      </CardFooter>
                    </Card>
                  </TabsContent>

                  {/* Contact & Emergency */}
                  <TabsContent value="contact" className="space-y-4 mt-4">
                    <Card className="border border-primary/10 bg-background/60 backdrop-blur-sm">
                      <CardHeader>
                        <CardTitle>Contact Information</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">Email</p>
                            <p className="font-medium">john.doe@example.com</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Phone</p>
                            <p className="font-medium">+1 (555) 123-4567</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Address</p>
                            <p className="font-medium">
                              123 Main St, Anytown, USA
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Separator className="my-4" />

                    <Card className="border border-primary/10 bg-background/60 backdrop-blur-sm">
                      <CardHeader>
                        <CardTitle>Emergency Contacts</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="p-3 rounded-lg bg-primary/5">
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="font-medium">Jane Doe</p>
                                <p className="text-sm text-muted-foreground">
                                  Spouse
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="text-sm">+1 (555) 987-6543</p>
                              </div>
                            </div>
                          </div>
                          <div className="p-3 rounded-lg bg-primary/5">
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="font-medium">Robert Doe</p>
                                <p className="text-sm text-muted-foreground">
                                  Brother
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="text-sm">+1 (555) 456-7890</p>
                              </div>
                            </div>
                          </div>
                          <Button
                            variant="outline"
                            className="w-full border-primary/20 hover:bg-primary/5"
                          >
                            <Plus className="mr-2 h-4 w-4" />
                            Add Emergency Contact
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  {/* Medical History */}
                  <TabsContent value="medical" className="space-y-4 mt-4">
                    <Card className="border border-primary/10 bg-background/60 backdrop-blur-sm">
                      <CardHeader>
                        <CardTitle>Healthcare Providers</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {doctors.map((doctor) => (
                            <div
                              key={doctor.id}
                              className="p-3 rounded-lg bg-primary/5"
                            >
                              <div className="flex justify-between items-start">
                                <div className="flex items-center gap-3">
                                  <Avatar>
                                    <AvatarImage
                                      src={`/placeholder.svg?height=40&width=40`}
                                    />
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
                                <Badge
                                  variant={
                                    doctor.hasAccess ? "outline" : "secondary"
                                  }
                                  className={
                                    doctor.hasAccess
                                      ? "bg-green-500/10 text-green-500 border-green-500/20"
                                      : ""
                                  }
                                >
                                  {doctor.hasAccess
                                    ? "Has Access"
                                    : "No Access"}
                                </Badge>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    <Separator className="my-4" />

                    <Card className="border border-primary/10 bg-background/60 backdrop-blur-sm">
                      <CardHeader>
                        <CardTitle>Medical History Timeline</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="relative">
                          {/* Timeline line */}
                          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-primary/20"></div>

                          <div className="space-y-6 ml-9">
                            <div className="relative">
                              <div className="absolute -left-9 mt-1.5 w-4 h-4 rounded-full border-2 border-cyan-500 bg-background"></div>
                              <div className="bg-primary/5 rounded-md p-4">
                                <p className="text-base font-medium">
                                  Initial Diagnosis: Hypertension
                                </p>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                                  <span>January 10, 2023</span>
                                  <span>•</span>
                                  <span>Dr. Sarah Johnson</span>
                                </div>
                                <p className="mt-2 text-sm">
                                  Patient presented with elevated blood pressure
                                  readings over several months. Prescribed
                                  lisinopril 10mg daily and recommended
                                  lifestyle modifications.
                                </p>
                              </div>
                            </div>

                            <div className="relative">
                              <div className="absolute -left-9 mt-1.5 w-4 h-4 rounded-full border-2 border-purple-500 bg-background"></div>
                              <div className="bg-primary/5 rounded-md p-4">
                                <p className="text-base font-medium">
                                  Diagnosis: Type 2 Diabetes
                                </p>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                                  <span>March 15, 2023</span>
                                  <span>•</span>
                                  <span>Dr. Emily Rodriguez</span>
                                </div>
                                <p className="mt-2 text-sm">
                                  Routine bloodwork showed elevated HbA1c levels
                                  of 7.2%. Started on metformin 500mg twice
                                  daily and referred to nutritionist.
                                </p>
                              </div>
                            </div>

                            <div className="relative">
                              <div className="absolute -left-9 mt-1.5 w-4 h-4 rounded-full border-2 border-blue-500 bg-background"></div>
                              <div className="bg-primary/5 rounded-md p-4">
                                <p className="text-base font-medium">
                                  Medication Adjustment
                                </p>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                                  <span>June 22, 2023</span>
                                  <span>•</span>
                                  <span>Dr. Sarah Johnson</span>
                                </div>
                                <p className="mt-2 text-sm">
                                  Blood pressure still elevated. Increased
                                  lisinopril to 20mg daily. Added amlodipine 5mg
                                  daily to regimen.
                                </p>
                              </div>
                            </div>

                            <div className="relative">
                              <div className="absolute -left-9 mt-1.5 w-4 h-4 rounded-full border-2 border-green-500 bg-background"></div>
                              <div className="bg-primary/5 rounded-md p-4">
                                <p className="text-base font-medium">
                                  Follow-up: Diabetes Management
                                </p>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                                  <span>November 5, 2023</span>
                                  <span>•</span>
                                  <span>Dr. Emily Rodriguez</span>
                                </div>
                                <p className="mt-2 text-sm">
                                  HbA1c improved to 6.8%. Patient reports
                                  adherence to diet and medication. Continue
                                  current regimen and follow up in 3 months.
                                </p>
                              </div>
                            </div>

                            <div className="relative">
                              <div className="absolute -left-9 mt-1.5 w-4 h-4 rounded-full border-2 border-cyan-500 bg-background"></div>
                              <div className="bg-primary/5 rounded-md p-4">
                                <p className="text-base font-medium">
                                  Annual Physical Examination
                                </p>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                                  <span>January 15, 2024</span>
                                  <span>•</span>
                                  <span>Dr. Sarah Johnson</span>
                                </div>
                                <p className="mt-2 text-sm">
                                  Comprehensive physical exam performed. Blood
                                  pressure well-controlled at 128/82.
                                  Cholesterol slightly elevated. Recommended
                                  continued medication adherence and increased
                                  physical activity.
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          className="w-full border-primary/20 hover:bg-primary/5 mt-4"
                        >
                          <Plus className="mr-2 h-4 w-4" />
                          Add new element
                        </Button>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Upload Document Dialog */}
      {showUpload && <UploadDocument onClose={() => setShowUpload(false)} />}

      {/* Access Control Dialog */}
      {showAccessControl && (
        <AccessControl
          doctors={doctors}
          onClose={() => setShowAccessControl(false)}
        />
      )}
    </div>
  );
}
