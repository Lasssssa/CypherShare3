"use client";

import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, Share, CheckCircle, XCircle } from "lucide-react";
import { DocumentDetail } from "@/components/document-detail";
import { useState } from "react";

interface DocumentCardProps {
  document: {
    id: string;
    title: string;
    date: string;
    doctor: string;
    hospital: string;
    type: string;
    ipfsHash: string;
    verified: boolean;
  };
}

export function DocumentCard({ document }: DocumentCardProps) {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="cursor-pointer"
    >
      <Card
        className="h-full border border-primary/10 bg-background/60 backdrop-blur-sm hover:border-primary/30 transition-all duration-300"
        onClick={() => setShowDetails(true)}
      >
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <CardTitle className="text-lg">{document.title}</CardTitle>
            <Badge
              variant="outline"
              className={
                document.type === "Laboratory"
                  ? "bg-cyan-500/10 text-cyan-500 border-cyan-500/20"
                  : document.type === "Radiology"
                  ? "bg-purple-500/10 text-purple-500 border-purple-500/20"
                  : "bg-blue-500/10 text-blue-500 border-blue-500/20"
              }
            >
              {document.type}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-2 text-sm mb-4">
            <div>
              <p className="text-muted-foreground">Date</p>
              <p className="font-medium">{document.date}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Doctor</p>
              <p className="font-medium">{document.doctor}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Hospital</p>
              <p className="font-medium">{document.hospital}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Verification</p>
              <div className="flex items-center">
                {document.verified ? (
                  <>
                    <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                    <span className="text-green-500 font-medium">Verified</span>
                  </>
                ) : (
                  <>
                    <XCircle className="h-4 w-4 text-yellow-500 mr-1" />
                    <span className="text-yellow-500 font-medium">Pending</span>
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="bg-primary/5 rounded-md p-2 text-xs font-mono overflow-hidden text-ellipsis">
            <p className="text-muted-foreground mb-1">IPFS Hash:</p>
            <p className="text-primary/70">{document.ipfsHash}</p>
          </div>
        </CardContent>
        <CardFooter className="flex-row-reverse">
          <Button
            variant="outline"
            size="sm"
            className="border-primary/20 hover:bg-primary/5"
          >
            <Share className="mr-2 h-4 w-4" />
            Share
          </Button>
        </CardFooter>
      </Card>
      {showDetails && (
        <DocumentDetail
          document={document}
          onClose={() => setShowDetails(false)}
        />
      )}
    </motion.div>
  );
}
