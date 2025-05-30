"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Upload, X, FileText, CheckCircle } from "lucide-react"

interface UploadDocumentProps {
  onClose: () => void
}

export function UploadDocument({ onClose }: UploadDocumentProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [file, setFile] = useState<File | null>(null)
  const [dragging, setDragging] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadComplete, setUploadComplete] = useState(false)
  const [documentType, setDocumentType] = useState("")
  const [doctorName, setDoctorName] = useState("")
  const [hospital, setHospital] = useState("")
  const [date, setDate] = useState("")

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFile(e.dataTransfer.files[0])
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0])
    }
  }

  const handleUpload = () => {
    setUploading(true)

    // Simulate upload process
    setTimeout(() => {
      setUploading(false)
      setUploadComplete(true)

      // Move to next step after a brief delay
      setTimeout(() => {
        setStep(3)
      }, 1000)
    }, 2000)
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md border border-primary/20 bg-background/95 backdrop-blur-xl">
        <DialogHeader>
          <DialogTitle>Upload Medical Document</DialogTitle>
          <DialogDescription>
            Upload your medical document to securely store it on IPFS with blockchain verification.
          </DialogDescription>
        </DialogHeader>

        {step === 1 && (
          <div className="space-y-4 py-4">
            <div
              className={`border-2 ${dragging ? "border-primary" : "border-dashed border-primary/20"} rounded-lg p-6 text-center transition-colors ${file ? "bg-primary/5" : ""}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              {file ? (
                <div className="flex flex-col items-center">
                  <FileText className="h-10 w-10 text-primary mb-2" />
                  <p className="font-medium">{file.name}</p>
                  <p className="text-sm text-muted-foreground">{(file.size / 1024).toFixed(2)} KB</p>
                  <Button variant="ghost" size="sm" className="mt-2" onClick={() => setFile(null)}>
                    <X className="h-4 w-4 mr-1" />
                    Remove
                  </Button>
                </div>
              ) : (
                <>
                  <Upload className="h-10 w-10 text-primary/40 mx-auto mb-2" />
                  <p className="text-primary/60 font-medium">Drag and drop your file here</p>
                  <p className="text-sm text-muted-foreground mt-1">or</p>
                  <div className="mt-4">
                    <Label htmlFor="file-upload" className="cursor-pointer">
                      <div className="bg-primary/10 hover:bg-primary/20 text-primary rounded-md py-2 px-4 text-sm font-medium transition-colors">
                        Browse Files
                      </div>
                      <Input
                        id="file-upload"
                        type="file"
                        className="hidden"
                        onChange={handleFileChange}
                        accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                      />
                    </Label>
                  </div>
                  <p className="text-xs text-muted-foreground mt-4">Supported formats: PDF, JPG, PNG, DOC</p>
                </>
              )}
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button
                onClick={() => setStep(2)}
                disabled={!file}
                className={
                  file
                    ? "bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white"
                    : ""
                }
              >
                Next
              </Button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4 py-4">
            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Document Type</Label>
                  <Select value={documentType} onValueChange={setDocumentType}>
                    <SelectTrigger id="type">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="laboratory">Laboratory</SelectItem>
                      <SelectItem value="radiology">Radiology</SelectItem>
                      <SelectItem value="prescription">Prescription</SelectItem>
                      <SelectItem value="consultation">Consultation</SelectItem>
                      <SelectItem value="surgery">Surgery</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="doctor">Doctor Name</Label>
                <Input
                  id="doctor"
                  placeholder="Dr. John Smith"
                  value={doctorName}
                  onChange={(e) => setDoctorName(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="hospital">Hospital/Clinic</Label>
                <Input
                  id="hospital"
                  placeholder="Metro General Hospital"
                  value={hospital}
                  onChange={(e) => setHospital(e.target.value)}
                />
              </div>
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep(1)}>
                Back
              </Button>
              <Button
                onClick={handleUpload}
                disabled={uploading || !documentType || !doctorName || !hospital || !date}
                className={
                  !uploading && documentType && doctorName && hospital && date
                    ? "bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white"
                    : ""
                }
              >
                {uploading ? (
                  <>
                    <div className="w-4 h-4 rounded-full border-2 border-primary border-t-transparent animate-spin mr-2"></div>
                    Uploading...
                  </>
                ) : uploadComplete ? (
                  <>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Uploaded
                  </>
                ) : (
                  "Upload to IPFS"
                )}
              </Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4 py-4">
            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-6 text-center">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
              </motion.div>
              <h3 className="text-xl font-semibold text-green-500 mb-2">Upload Successful!</h3>
              <p className="text-muted-foreground mb-4">
                Your document has been securely uploaded to IPFS and registered on the blockchain.
              </p>

              <div className="bg-primary/5 rounded-md p-3 text-xs font-mono mb-4">
                <p className="text-muted-foreground mb-1">IPFS Hash:</p>
                <p className="text-primary/70">QmT8CZxmNLj7bvyT48sGKxmY6CRe9ZU7GGdkPGCXqYdZWJ</p>
              </div>

              <div className="bg-primary/5 rounded-md p-3 text-xs font-mono">
                <p className="text-muted-foreground mb-1">Transaction Hash:</p>
                <p className="text-primary/70">0x3a8d7f4b5c9e2d1f0a7b6c5d4e3f2a1b0c9d8e7f6a5b4c3d2e1f0</p>
              </div>
            </div>

            <div className="flex justify-center">
              <Button
                onClick={onClose}
                className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white"
              >
                Done
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

