"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle,
  Copy,
  FileText,
  Users,
  Calendar,
  Key,
  Globe,
  X,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { EncryptedFileData } from "@/lib/encryption";
import { LighthouseUploadResult } from "@/lib/lighthouse";
import { FileEncryption } from "@/lib/encryption";

interface UploadSuccessInfoProps {
  uploadResult: LighthouseUploadResult;
  encryptedFileData: EncryptedFileData;
  recipients: string[];
  onClose: () => void;
}

export function UploadSuccessInfo({
  uploadResult,
  encryptedFileData,
  recipients,
  onClose,
}: UploadSuccessInfoProps) {
  const { toast } = useToast();

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: `${label} copied to clipboard`,
    });
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-6 h-6 text-green-500" />
            <span>File sent successfully!</span>
          </div>
          <Button onClick={onClose} variant="ghost" size="sm">
            <X className="w-4 h-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* TODO : DELETE */}
        {/* <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg p-4 border-2 border-blue-400">
          <div className="text-center mb-3">
            <h3 className="text-lg font-bold">
              🔑 DECRYPTION INFO - COPY THESE!
            </h3>
            <p className="text-sm opacity-90">Tap to copy each value</p>
          </div>

          <div className="space-y-3">
            <div
              className="bg-white/20 rounded-lg p-3 cursor-pointer hover:bg-white/30 transition-colors"
              onClick={() => copyToClipboard(uploadResult.cid, "CID")}
            >
              <div className="text-xs font-medium opacity-90 mb-1">
                FILECOIN CID:
              </div>
              <div className="font-mono text-sm break-all">
                {uploadResult.cid}
              </div>
            </div>

            <div
              className="bg-white/20 rounded-lg p-3 cursor-pointer hover:bg-white/30 transition-colors"
              onClick={() =>
                copyToClipboard(
                  FileEncryption.keyToHex(encryptedFileData.key),
                  "AES Key"
                )
              }
            >
              <div className="text-xs font-medium opacity-90 mb-1">
                AES KEY (256-bit):
              </div>
              <div className="font-mono text-sm break-all">
                {FileEncryption.keyToHex(encryptedFileData.key)}
              </div>
            </div>
          </div>

          <div className="text-center mt-3 text-xs opacity-90">
            ⚠️ Save these 2 values - they're needed for decryption!
          </div>
        </div> */}

        {/* Informations du fichier */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-green-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-green-800 mb-2">
                {encryptedFileData.originalName}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <FileText className="w-4 h-4 text-green-600" />
                  <span className="text-green-700">
                    {(encryptedFileData.originalSize / 1024 / 1024).toFixed(2)}{" "}
                    MB
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4 text-green-600" />
                  <span className="text-green-700">
                    {recipients.length} recipient(s)
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-green-600" />
                  <span className="text-green-700">
                    {new Date().toLocaleDateString()}
                  </span>
                </div>
              </div>
              <div className="mt-3">
                <p className="text-xs text-green-600 mb-2">Recipients:</p>
                <div className="flex flex-wrap gap-1">
                  {recipients.map((recipient, index) => (
                    <Badge
                      key={index}
                      className="bg-green-100 text-green-700 border-green-300 text-xs"
                    >
                      <Globe className="w-3 h-3 mr-1" />
                      {recipient.slice(0, 15)}...
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
