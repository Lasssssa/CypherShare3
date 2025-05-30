"use client";


import {Card, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";
import {Search} from "lucide-react";
import {Input} from "@/components/ui/input";
import {useState} from "react";

const documents = [
  {
    id: "doc1",
    title: "Patient Consent Form",
    patient: "John Doe",
    date: "2024-01-15",
    status: "Needs Verification",
  },
  {
    id: "doc2",
    title: "Medical Report",
    patient: "Jane Smith",
    date: "2024-02-03",
    status: "Signed",
  },
  {
    id: "doc3",
    title: "Prescription",
    patient: "Robert Johnson",
    date: "2023-12-20",
    status: "Needs Verification",
  },
];

export default function DoctorDocuments() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <main>
      <div className="relative mb-4">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground"/>
        <Input
          placeholder="Search documents..."
          className="pl-8"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="space-y-4">
        {documents.map((doc) => (
          <Card
            key={doc.id}
            className="border border-primary/10 bg-background/60 backdrop-blur-sm hover:border-primary/30 transition-all duration-300"
          >
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{doc.title}</CardTitle>
                  <CardDescription>
                    Patient: {doc.patient} • Date: {doc.date}
                  </CardDescription>
                </div>
                <Badge
                  variant="outline"
                  className={
                    doc.status === "Needs Verification"
                      ? "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
                      : "bg-blue-500/10 text-blue-500 border-blue-500/20"
                  }
                >
                  {doc.status}
                </Badge>
              </div>
            </CardHeader>
            <CardFooter className="flex justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                className="border-primary/20 hover:bg-primary/5"
              >
                View Document
              </Button>
              <Button
                size="sm"
                className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white"
              >
                {doc.status === "Needs Verification" ? "Verify" : "Sign"}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </main>
  );
}
