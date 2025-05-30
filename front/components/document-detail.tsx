"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  FileText,
  Download,
  Share,
  CheckCircle,
  Clock,
  Copy,
  ExternalLink,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface DocumentDetailProps {
  document: {
    id: string;
    title: string;
    date: string;
    doctor: string;
    hospital: string;
    type: string;
    ipfsHash: string;
    verified: boolean;
    content?: string;
    txHash?: string;
    history?: Array<{
      date: string;
      action: string;
      by: string;
    }>;
  };
  onClose: () => void;
}

export function DocumentDetail({ document, onClose }: DocumentDetailProps) {
  const [activeTab, setActiveTab] = useState("preview");
  const { toast } = useToast();

  const handleCopyHash = (hash: string, type: string) => {
    navigator.clipboard.writeText(hash);
    toast({
      title: `${type} copied to clipboard`,
      description: "You can now paste it anywhere you need",
    });
  };

  const handleShareDocument = () => {
    // Generate a temporary secure link
    const tempLink = `https://medledger.app/share/${
      document.id
    }?token=temp_${Math.random().toString(36).substring(2, 15)}`;

    // Copy to clipboard
    navigator.clipboard.writeText(tempLink);
    toast({
      title: "Secure link generated",
      description:
        "The link has been copied to your clipboard and will expire in 24 hours",
    });
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-3xl border border-primary/20 bg-background/95 backdrop-blur-xl">
        <DialogHeader>
          <DialogTitle className="text-xl">{document.title}</DialogTitle>
          <DialogDescription className="flex items-center gap-2">
            <span>Added on {document.date}</span>
            <span>•</span>
            <span>{document.type}</span>
            <span>•</span>
            {document.verified ? (
              <span className="flex items-center text-green-500">
                <CheckCircle className="h-4 w-4 mr-1" />
                Verified
              </span>
            ) : (
              <span className="flex items-center text-yellow-500">
                <Clock className="h-4 w-4 mr-1" />
                Pending Verification
              </span>
            )}
          </DialogDescription>
        </DialogHeader>

        <Tabs
          defaultValue="preview"
          className="w-full"
          onValueChange={setActiveTab}
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="preview">Document Preview</TabsTrigger>
            <TabsTrigger value="metadata">Blockchain Metadata</TabsTrigger>
          </TabsList>

          <TabsContent value="preview" className="space-y-4 mt-4">
            <div className="bg-primary/5 rounded-lg p-6 min-h-[300px] flex flex-col items-center justify-center">
              {document.content ? (
                <div className="w-full">
                  {/* This would be the actual document preview */}
                  <p className="text-center text-muted-foreground">
                    {document.content}
                  </p>
                </div>
              ) : (
                <div className="text-center">
                  <FileText className="h-16 w-16 text-primary/40 mx-auto mb-4" />
                  <p className="text-primary/60 font-medium">
                    Document Preview
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    This document is securely stored on IPFS and can be viewed
                    with proper permissions.
                  </p>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Doctor</p>
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={`/placeholder.svg?height=24&width=24`} />
                    <AvatarFallback>
                      {document.doctor
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <p className="font-medium">{document.doctor}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  Hospital/Clinic
                </p>
                <p className="font-medium">{document.hospital}</p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="metadata" className="space-y-4 mt-4">
            <div className="space-y-4">
              <div className="bg-primary/5 rounded-md p-4">
                <div className="flex justify-between items-center mb-2">
                  <p className="text-sm text-muted-foreground">
                    IPFS Content Identifier (CID)
                  </p>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 px-2"
                    onClick={() =>
                      handleCopyHash(document.ipfsHash, "IPFS Hash")
                    }
                  >
                    <Copy className="h-3.5 w-3.5" />
                  </Button>
                </div>
                <p className="font-mono text-sm break-all">
                  {document.ipfsHash}
                </p>
                <div className="mt-2 flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 text-xs border-primary/20 hover:bg-primary/5"
                  >
                    <ExternalLink className="h-3.5 w-3.5 mr-1" />
                    View on IPFS Gateway
                  </Button>
                </div>
              </div>

              {document.txHash && (
                <div className="bg-primary/5 rounded-md p-4">
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-sm text-muted-foreground">
                      Blockchain Transaction Hash
                    </p>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 px-2"
                      onClick={() =>
                        handleCopyHash(document.txHash!, "Transaction Hash")
                      }
                    >
                      <Copy className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                  <p className="font-mono text-sm break-all">
                    {document.txHash}
                  </p>
                  <div className="mt-2 flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 text-xs border-primary/20 hover:bg-primary/5"
                    >
                      <ExternalLink className="h-3.5 w-3.5 mr-1" />
                      View on Polygon Explorer
                    </Button>
                  </div>
                </div>
              )}

              <div className="bg-primary/5 rounded-md p-4">
                <p className="text-sm text-muted-foreground mb-2">
                  Document Fingerprint
                </p>
                <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                  <div className="bg-primary/10 rounded p-2">
                    <p className="text-muted-foreground mb-1">SHA-256</p>
                    <p className="break-all">
                      e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
                    </p>
                  </div>
                  <div className="bg-primary/10 rounded p-2">
                    <p className="text-muted-foreground mb-1">Timestamp</p>
                    <p>2024-02-19 14:32:45 UTC</p>
                  </div>
                </div>
              </div>

              <div className="bg-green-500/10 border border-green-500/20 rounded-md p-4">
                <div className="flex items-center gap-2 text-green-500 mb-2">
                  <CheckCircle className="h-5 w-5" />
                  <p className="font-medium">Blockchain Verification</p>
                </div>
                <p className="text-sm text-muted-foreground">
                  This document has been cryptographically verified on the
                  Polygon blockchain. The document's fingerprint matches the
                  hash stored in the blockchain transaction.
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-between mt-4">
          <Button
            variant="outline"
            onClick={onClose}
            className="border-primary/20 hover:bg-primary/5"
          >
            Close
          </Button>

          <div className="flex gap-2">
            <Button
              variant="outline"
              className="border-primary/20 hover:bg-primary/5"
              onClick={handleShareDocument}
            >
              <Share className="mr-2 h-4 w-4" />
              Share Securely
            </Button>

            <Button className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white">
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
