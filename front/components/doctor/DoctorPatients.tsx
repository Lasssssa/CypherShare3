"use client";

import {CheckCircle, FileText, Search, XCircle} from "lucide-react";
import {Input} from "@/components/ui/input";
import {useState} from "react";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";
import Link from "next/link";


const patients = [
  {
    id: "pat-1",
    name: "John Doe",
    age: 42,
    lastVisit: "2024-01-15",
    condition: "Hypertension",
    hasDocuments: true,
    status: "Active",
  },
  {
    id: "pat2",
    name: "Jane Smith",
    age: 35,
    lastVisit: "2024-02-03",
    condition: "Diabetes Type 2",
    hasDocuments: true,
    status: "Active",
  },
  {
    id: "pat3",
    name: "Robert Johnson",
    age: 58,
    lastVisit: "2023-12-20",
    condition: "Arthritis",
    hasDocuments: true,
    status: "Follow-up",
  },
  {
    id: "pat4",
    name: "Emily Williams",
    age: 29,
    lastVisit: "2024-01-28",
    condition: "Asthma",
    hasDocuments: false,
    status: "New",
  },
];

export default function DoctorPatients() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPatients = patients.filter(
    (patient) =>
      patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.condition.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <main>
      <div className="relative mb-4">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground"/>
        <Input
          placeholder="Search patients..."
          className="pl-8"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filteredPatients.map((patient) => (
          <div
            key={patient.id}
            className="hover:scale-[1.01] transition-transform duration-300"
          >
            <Card
              className="border border-primary/10 bg-background/60 backdrop-blur-sm hover:border-primary/30 transition-all duration-300">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage
                        src={`/placeholder.svg?height=40&width=40`}
                      />
                      <AvatarFallback>
                        {patient.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">
                        {patient.name}
                      </CardTitle>
                      <CardDescription>
                        Age: {patient.age} • Last Visit:{" "}
                        {patient.lastVisit}
                      </CardDescription>
                    </div>
                  </div>
                  <Badge
                    variant="outline"
                    className={
                      patient.status === "Active"
                        ? "bg-green-500/10 text-green-500 border-green-500/20"
                        : patient.status === "Follow-up"
                          ? "bg-blue-500/10 text-blue-500 border-blue-500/20"
                          : "bg-cyan-500/10 text-cyan-500 border-cyan-500/20"
                    }
                  >
                    {patient.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <p className="text-muted-foreground">Condition</p>
                    <p className="font-medium">{patient.condition}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">
                      Medical Records
                    </p>
                    <div className="flex items-center">
                      {patient.hasDocuments ? (
                        <>
                          <CheckCircle className="h-4 w-4 text-green-500 mr-1"/>
                          <span className="text-green-500 font-medium">
                                      Available
                                    </span>
                        </>
                      ) : (
                        <>
                          <XCircle className="h-4 w-4 text-yellow-500 mr-1"/>
                          <span className="text-yellow-500 font-medium">
                                      Not Available
                                    </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end gap-2">
                <Link href={`/dashboard/doctor/patient/${patient.id}`}>
                  <Button
                    size="sm"
                    className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white"
                  >
                    <FileText className="mr-2 h-4 w-4"/>
                    View Records
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          </div>
        ))}
      </div>
    </main>
  );
}
