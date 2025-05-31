"use client";

import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  Upload,
  FileText,
  Shield,
  CheckCircle,
  AlertCircle,
  X,
  Key,
  Lock,
  Copy,
} from "lucide-react";
import { useFileEncryption } from "@/hooks/useFileEncryption";
import { FileUtils, EncryptedFileData, FileEncryption } from "@/lib/encryption";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";

interface FileEncryptionUploaderProps {
  onFileEncrypted?: (encryptedData: EncryptedFileData) => void;
  onFileRemoved?: () => void;
  className?: string;
  maxFileSizeMB?: number;
  acceptedFileTypes?: string[];
}

export function FileEncryptionUploader({
  onFileEncrypted,
  onFileRemoved,
  className,
  maxFileSizeMB = 100,
  acceptedFileTypes = [],
}: FileEncryptionUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const { encryptionState, encryptFile, resetEncryption, isFileValid } =
    useFileEncryption();
  const { toast } = useToast();

  const handleFileSelect = async (file: File) => {
    const validation = isFileValid(file);
    if (!validation.valid) {
      return;
    }

    setSelectedFile(file);

    // Lancer le chiffrement automatiquement
    const encryptedData = await encryptFile(file);
    if (encryptedData && onFileEncrypted) {
      onFileEncrypted(encryptedData);
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);

    const file = event.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleDragEnter = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    // Vérifier si on quitte vraiment la zone de drop
    if (!event.currentTarget.contains(event.relatedTarget as Node)) {
      setIsDragging(false);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    resetEncryption();
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    onFileRemoved?.();
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split(".").pop()?.toLowerCase();

    // Pour simplifier, on utilise FileText pour tous les fichiers
    // Tu peux ajouter d'autres icônes selon l'extension
    return <FileText className="w-6 h-6" />;
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: `${label} copied to clipboard`,
    });
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Zone de sélection de fichier */}
      {!selectedFile && (
        <div
          onClick={
            !encryptionState.isEncrypting ? () => openFileDialog() : undefined
          }
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={!encryptionState.isEncrypting ? handleDrop : undefined}
          className={`
            relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-200
            ${
              isDragging
                ? "border-primary bg-primary/5 scale-105"
                : "border-border hover:border-primary/50 hover:bg-primary/5"
            }
            ${
              encryptionState.isEncrypting
                ? "cursor-not-allowed opacity-60"
                : ""
            }
          `}
        >
          <div className="flex flex-col items-center space-y-4">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
              <Upload className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">
                Choose a file to encrypt
              </h3>
              <p className="text-muted-foreground mt-1">
                Drag and drop your file here or click to select
              </p>
            </div>
            {!encryptionState.isEncrypting && (
              <div className="flex items-center space-x-2">
                <div className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium">
                  Select a file
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Fichier sélectionné et état du chiffrement */}
      {selectedFile && (
        <div className="space-y-6">
          {/* Informations du fichier */}
          <div className="bg-muted/50 rounded-lg p-4 border border-border">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                {getFileIcon(selectedFile.name)}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-foreground truncate">
                  {selectedFile.name}
                </h4>
                <p className="text-sm text-muted-foreground">
                  {FileUtils.formatFileSize(selectedFile.size)} •{" "}
                  {selectedFile.type || "Unknown type"}
                </p>
                {encryptionState.isEncrypting && (
                  <div className="mt-3 space-y-2">
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin"></div>
                      <span className="text-sm text-primary font-medium">
                        Generating AES key and encrypting file
                      </span>
                    </div>
                    <Progress
                      value={encryptionState.progress}
                      className="h-2"
                    />
                  </div>
                )}
                {encryptionState.encryptedData && (
                  <div className="mt-3 flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-green-600 font-medium">
                      File encrypted successfully
                    </span>
                  </div>
                )}
              </div>
              {!encryptionState.isEncrypting &&
                !encryptionState.encryptedData && (
                  <Button
                    onClick={handleRemoveFile}
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground hover:text-red-500"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
            </div>
          </div>
        </div>
      )}

      {/* Erreur de chiffrement */}
      {encryptionState.error && (
        <Alert variant="destructive">
          <AlertCircle className="w-4 h-4" />
          <AlertDescription>{encryptionState.error}</AlertDescription>
        </Alert>
      )}

      {/* Input caché pour la sélection de fichier */}
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        onChange={handleInputChange}
        accept={acceptedFileTypes.join(",")}
      />
    </div>
  );
}
