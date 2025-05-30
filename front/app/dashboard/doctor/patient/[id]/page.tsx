"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MessageSquare, Calendar, Shield, CheckCircle, ArrowLeft, Upload, Download, Share, Clock } from "lucide-react"
import { DashboardHeader } from "@/components/dashboard-header"
import { DocumentDetail } from "@/components/document-detail"

// Sample patient data
const patientData = {
  id: "pat1",
  name: "John Doe",
  age: 42,
  dateOfBirth: "1982-05-15",
  gender: "Male",
  bloodType: "O+",
  allergies: ["Penicillin", "Peanuts"],
  conditions: ["Hypertension", "Type 2 Diabetes"],
  lastVisit: "2024-01-15",
  status: "Active",
  contact: {
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    address: "123 Main St, Anytown, USA",
  },
}

// Sample medical documents
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
    title: "Prescription",
    date: "2024-01-05",
    doctor: "Dr. Emily Rodriguez",
    hospital: "Wellness Clinic",
    type: "Medication",
    ipfsHash: "QmPChd2hVbrJ6bfo3WBcTW4iZnpHm8TEzWkLHmLpXhF68A",
    verified: false,
  },
]

export default function PatientDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [selectedDocument, setSelectedDocument] = useState<any | null>(null)

  const patientId = params.id as string

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-background/90 relative">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[30%] -left-[10%] w-[70%] h-[70%] rounded-full bg-blue-500/5 blur-[120px]" />
        <div className="absolute -bottom-[30%] -right-[10%] w-[70%] h-[70%] rounded-full bg-cyan-500/5 blur-[120px]" />
      </div>

      <DashboardHeader userType="doctor" />

      <main className="container mx-auto px-4 py-8 relative z-10">
        <Button variant="ghost" className="mb-6 -ml-2 hover:bg-primary/5" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Patients
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Patient Info Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-20 border border-primary/10 bg-background/60 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Avatar className="h-16 w-16 border-2 border-primary/20">
                    <AvatarImage src="/placeholder.svg?height=64&width=64" />
                    <AvatarFallback>
                      {patientData.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle>{patientData.name}</CardTitle>
                    <CardDescription>Patient ID: {patientData.id}</CardDescription>
                    <Badge variant="outline" className="mt-1 bg-green-500/10 text-green-500 border-green-500/20">
                      {patientData.status}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium mb-2">Personal Information</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <p className="text-muted-foreground">Age</p>
                      <p>{patientData.age}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Gender</p>
                      <p>{patientData.gender}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">DOB</p>
                      <p>{patientData.dateOfBirth}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Blood Type</p>
                      <p>{patientData.bloodType}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium mb-2">Medical Conditions</h3>
                  <div className="flex flex-wrap gap-1">
                    {patientData.conditions.map((condition, index) => (
                      <Badge key={index} variant="secondary" className="bg-primary/10">
                        {condition}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium mb-2">Allergies</h3>
                  <div className="flex flex-wrap gap-1">
                    {patientData.allergies.map((allergy, index) => (
                      <Badge key={index} variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20">
                        {allergy}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium mb-2">Contact Information</h3>
                  <div className="space-y-1 text-sm">
                    <p className="text-muted-foreground">Email</p>
                    <p className="truncate">{patientData.contact.email}</p>
                    <p className="text-muted-foreground mt-1">Phone</p>
                    <p>{patientData.contact.phone}</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" size="sm" className="border-primary/20 hover:bg-primary/5">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Message
                </Button>
                <Button
                  size="sm"
                  className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white"
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  Schedule
                </Button>
              </CardFooter>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4">
              <Button className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white">
                <Upload className="mr-2 h-4 w-4" />
                Add Document
              </Button>
              <Button variant="outline" className="border-primary/20 bg-primary/5 hover:bg-primary/10">
                <Shield className="mr-2 h-4 w-4" />
                Verify Document
              </Button>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="records" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="records">Medical Records</TabsTrigger>
                <TabsTrigger value="history">Medical History</TabsTrigger>
              </TabsList>

              <TabsContent value="records" className="space-y-4 mt-6">
                <div className="grid grid-cols-1 gap-4">
                  {medicalDocuments.map((doc) => (
                    <motion.div
                      key={doc.id}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      className="cursor-pointer"
                      onClick={() => setSelectedDocument(doc)}
                    >
                      <Card className="border border-primary/10 bg-background/60 backdrop-blur-sm hover:border-primary/30 transition-all duration-300">
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-start">
                            <CardTitle className="text-lg">{doc.title}</CardTitle>
                            <Badge
                              variant="outline"
                              className={
                                doc.type === "Laboratory"
                                  ? "bg-cyan-500/10 text-cyan-500 border-cyan-500/20"
                                  : doc.type === "Radiology"
                                    ? "bg-purple-500/10 text-purple-500 border-purple-500/20"
                                    : "bg-blue-500/10 text-blue-500 border-blue-500/20"
                              }
                            >
                              {doc.type}
                            </Badge>
                          </div>
                          <CardDescription>Added on {doc.date}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-2 gap-2 text-sm mb-4">
                            <div>
                              <p className="text-muted-foreground">Doctor</p>
                              <p className="font-medium">{doc.doctor}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Hospital</p>
                              <p className="font-medium">{doc.hospital}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Verification</p>
                              <div className="flex items-center">
                                {doc.verified ? (
                                  <>
                                    <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                                    <span className="text-green-500 font-medium">Verified</span>
                                  </>
                                ) : (
                                  <>
                                    <Clock className="h-4 w-4 text-yellow-500 mr-1" />
                                    <span className="text-yellow-500 font-medium">Pending</span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                        <CardFooter className="flex justify-between">
                          <Button variant="outline" size="sm" className="border-primary/20 hover:bg-primary/5">
                            <Download className="mr-2 h-4 w-4" />
                            Download
                          </Button>
                          {!doc.verified && (
                            <Button
                              size="sm"
                              className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white"
                            >
                              <CheckCircle className="mr-2 h-4 w-4" />
                              Verify
                            </Button>
                          )}
                          {doc.verified && (
                            <Button variant="outline" size="sm" className="border-primary/20 hover:bg-primary/5">
                              <Share className="mr-2 h-4 w-4" />
                              Share
                            </Button>
                          )}
                        </CardFooter>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="history" className="space-y-4 mt-6">
                <Card className="border border-primary/10 bg-background/60 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle>Medical History Timeline</CardTitle>
                    <CardDescription>Complete medical history for {patientData.name}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="relative">
                      {/* Timeline line */}
                      <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-primary/20"></div>

                      <div className="space-y-6 ml-9">
                        <div className="relative">
                          <div className="absolute -left-9 mt-1.5 w-4 h-4 rounded-full border-2 border-cyan-500 bg-background"></div>
                          <div className="bg-primary/5 rounded-md p-4">
                            <p className="text-base font-medium">Initial Diagnosis: Hypertension</p>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                              <span>January 10, 2023</span>
                              <span>•</span>
                              <span>Dr. Sarah Johnson</span>
                            </div>
                            <p className="mt-2 text-sm">
                              Patient presented with elevated blood pressure readings over several months. Prescribed
                              lisinopril 10mg daily and recommended lifestyle modifications.
                            </p>
                          </div>
                        </div>

                        <div className="relative">
                          <div className="absolute -left-9 mt-1.5 w-4 h-4 rounded-full border-2 border-purple-500 bg-background"></div>
                          <div className="bg-primary/5 rounded-md p-4">
                            <p className="text-base font-medium">Diagnosis: Type 2 Diabetes</p>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                              <span>March 15, 2023</span>
                              <span>•</span>
                              <span>Dr. Emily Rodriguez</span>
                            </div>
                            <p className="mt-2 text-sm">
                              Routine bloodwork showed elevated HbA1c levels of 7.2%. Started on metformin 500mg twice
                              daily and referred to nutritionist.
                            </p>
                          </div>
                        </div>

                        <div className="relative">
                          <div className="absolute -left-9 mt-1.5 w-4 h-4 rounded-full border-2 border-blue-500 bg-background"></div>
                          <div className="bg-primary/5 rounded-md p-4">
                            <p className="text-base font-medium">Medication Adjustment</p>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                              <span>June 22, 2023</span>
                              <span>•</span>
                              <span>Dr. Sarah Johnson</span>
                            </div>
                            <p className="mt-2 text-sm">
                              Blood pressure still elevated. Increased lisinopril to 20mg daily. Added amlodipine 5mg
                              daily to regimen.
                            </p>
                          </div>
                        </div>

                        <div className="relative">
                          <div className="absolute -left-9 mt-1.5 w-4 h-4 rounded-full border-2 border-green-500 bg-background"></div>
                          <div className="bg-primary/5 rounded-md p-4">
                            <p className="text-base font-medium">Follow-up: Diabetes Management</p>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                              <span>November 5, 2023</span>
                              <span>•</span>
                              <span>Dr. Emily Rodriguez</span>
                            </div>
                            <p className="mt-2 text-sm">
                              HbA1c improved to 6.8%. Patient reports adherence to diet and medication. Continue current
                              regimen and follow up in 3 months.
                            </p>
                          </div>
                        </div>

                        <div className="relative">
                          <div className="absolute -left-9 mt-1.5 w-4 h-4 rounded-full border-2 border-cyan-500 bg-background"></div>
                          <div className="bg-primary/5 rounded-md p-4">
                            <p className="text-base font-medium">Annual Physical Examination</p>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                              <span>January 15, 2024</span>
                              <span>•</span>
                              <span>Dr. Sarah Johnson</span>
                            </div>
                            <p className="mt-2 text-sm">
                              Comprehensive physical exam performed. Blood pressure well-controlled at 128/82.
                              Cholesterol slightly elevated. Recommended continued medication adherence and increased
                              physical activity.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>

      {/* Document Detail Dialog */}
      {selectedDocument && <DocumentDetail document={selectedDocument} onClose={() => setSelectedDocument(null)} />}
    </div>
  )
}

