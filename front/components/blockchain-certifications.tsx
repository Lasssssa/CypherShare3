"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Shield, CheckCircle, ExternalLink, Copy, Search, Download, X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Certificate {
  id: string
  title: string
  issuer: string
  issueDate: string
  expiryDate?: string
  type: string
  tokenId?: string
  txHash: string
  ipfsHash: string
  verified: boolean
}

interface BlockchainCertificationsProps {
  onClose: () => void
  certificates: Certificate[]
}

export function BlockchainCertifications({ onClose, certificates }: BlockchainCertificationsProps) {
  const [activeTab, setActiveTab] = useState("certificates")
  const [verifyHash, setVerifyHash] = useState("")
  const [verificationResult, setVerificationResult] = useState<"success" | "error" | null>(null)
  const { toast } = useToast()

  const handleCopyHash = (hash: string, type: string) => {
    navigator.clipboard.writeText(hash)
    toast({
      title: `${type} copied to clipboard`,
      description: "You can now paste it anywhere you need",
    })
  }

  const handleVerify = () => {
    if (!verifyHash.trim()) return

    // Simulate verification process
    setTimeout(() => {
      // Check if the hash matches any certificate
      const matchingCert = certificates.find((cert) => cert.ipfsHash === verifyHash || cert.txHash === verifyHash)

      setVerificationResult(matchingCert ? "success" : "error")
    }, 1500)
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl border border-primary/20 bg-background/95 backdrop-blur-xl">
        <DialogHeader>
          <DialogTitle>Blockchain Certifications</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="certificates" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="certificates">My Certificates</TabsTrigger>
            <TabsTrigger value="nfts">Soulbound NFTs</TabsTrigger>
            <TabsTrigger value="verify">Verify Document</TabsTrigger>
          </TabsList>

          <TabsContent value="certificates" className="space-y-4 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {certificates
                .filter((cert) => cert.type !== "NFT")
                .map((cert) => (
                  <motion.div key={cert.id} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Card className="border border-primary/10 bg-background/60 backdrop-blur-sm hover:border-primary/30 transition-all duration-300">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-lg">{cert.title}</CardTitle>
                          <Badge variant="outline" className="bg-cyan-500/10 text-cyan-500 border-cyan-500/20">
                            {cert.type}
                          </Badge>
                        </div>
                        <CardDescription>
                          Issued by {cert.issuer} on {cert.issueDate}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="bg-primary/5 rounded-md p-3 text-xs font-mono mb-3">
                          <div className="flex justify-between items-center mb-1">
                            <p className="text-muted-foreground">IPFS Hash:</p>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 px-2"
                              onClick={() => handleCopyHash(cert.ipfsHash, "IPFS Hash")}
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>
                          <p className="break-all">{cert.ipfsHash}</p>
                        </div>

                        <div className="bg-primary/5 rounded-md p-3 text-xs font-mono">
                          <div className="flex justify-between items-center mb-1">
                            <p className="text-muted-foreground">Transaction Hash:</p>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 px-2"
                              onClick={() => handleCopyHash(cert.txHash, "Transaction Hash")}
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>
                          <p className="break-all">{cert.txHash}</p>
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-between">
                        <Button variant="outline" size="sm" className="border-primary/20 hover:bg-primary/5">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          View on Blockchain
                        </Button>
                        <Button
                          size="sm"
                          className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white"
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                      </CardFooter>
                    </Card>
                  </motion.div>
                ))}
            </div>
          </TabsContent>

          <TabsContent value="nfts" className="space-y-4 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {certificates
                .filter((cert) => cert.type === "NFT")
                .map((cert) => (
                  <motion.div key={cert.id} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Card className="border border-primary/10 bg-background/60 backdrop-blur-sm hover:border-primary/30 transition-all duration-300">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-lg">{cert.title}</CardTitle>
                          <Badge variant="outline" className="bg-purple-500/10 text-purple-500 border-purple-500/20">
                            Soulbound NFT
                          </Badge>
                        </div>
                        <CardDescription>
                          Issued by {cert.issuer} on {cert.issueDate}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="bg-gradient-to-br from-purple-500/10 to-cyan-500/10 rounded-lg p-4 mb-3 flex items-center justify-center">
                          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500/20 to-cyan-500/20 flex items-center justify-center">
                            <Shield className="h-8 w-8 text-primary/60" />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div>
                            <p className="text-muted-foreground">Token ID</p>
                            <p className="font-medium">{cert.tokenId || "N/A"}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Expiry</p>
                            <p className="font-medium">{cert.expiryDate || "Never"}</p>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-between">
                        <Button variant="outline" size="sm" className="border-primary/20 hover:bg-primary/5">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          View on OpenSea
                        </Button>
                        <Button
                          size="sm"
                          className="bg-gradient-to-r from-purple-500 to-cyan-600 hover:from-purple-600 hover:to-cyan-700 text-white"
                        >
                          Share Credential
                        </Button>
                      </CardFooter>
                    </Card>
                  </motion.div>
                ))}
            </div>
          </TabsContent>

          <TabsContent value="verify" className="space-y-4 mt-4">
            <Card className="border border-primary/10 bg-background/60 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Verify Document Authenticity</CardTitle>
                <CardDescription>
                  Enter a document hash or transaction ID to verify its authenticity on the blockchain
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="hash">Document Hash or Transaction ID</Label>
                    <div className="flex gap-2">
                      <Input
                        id="hash"
                        placeholder="Enter IPFS hash or transaction hash"
                        value={verifyHash}
                        onChange={(e) => setVerifyHash(e.target.value)}
                        className="font-mono"
                      />
                      <Button
                        onClick={handleVerify}
                        className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white"
                      >
                        <Search className="h-4 w-4 mr-2" />
                        Verify
                      </Button>
                    </div>
                  </div>

                  {verificationResult && (
                    <div
                      className={`p-4 rounded-lg ${
                        verificationResult === "success"
                          ? "bg-green-500/10 border border-green-500/20"
                          : "bg-red-500/10 border border-red-500/20"
                      }`}
                    >
                      {verificationResult === "success" ? (
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-green-500">Document Verified</h3>
                            <p className="text-sm text-muted-foreground">
                              This document has been verified on the blockchain and is authentic.
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center">
                            <X className="h-5 w-5 text-red-500" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-red-500">Verification Failed</h3>
                            <p className="text-sm text-muted-foreground">
                              This document could not be verified on the blockchain. It may be tampered with or not
                              registered.
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}

