"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  Upload,
  Send,
  Copy,
  FileText,
  Calendar,
  Download,
  Shield,
  Menu,
  X,
  LogOut,
  Settings,
  Inbox,
  SendHorizontal,
  Plus,
  Globe,
  Users,
  CheckCircle,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useWallet } from "@/contexts/WalletContext";
import { Header } from "@/components/shared/Header";
import { FileEncryptionUploader } from "@/components/FileEncryptionUploader";
import { EncryptedFileData } from "@/lib/encryption";
import { useLighthouseUpload } from "@/hooks/useLighthouseUpload";
import { DecryptionStorage } from "@/services/DecryptionStorage";
import { FileEncryption } from "@/lib/encryption";
import { LighthouseUploadResult } from "@/lib/lighthouse";
import { UploadSuccessInfo } from "@/components/UploadSuccessInfo";

interface SentFile {
  id: string;
  name: string;
  recipients: string[];
  date: string;
  cid: string;
  size: number;
}

interface ReceivedFile {
  id: string;
  name: string;
  sender: string;
  date: string;
  cid: string;
  size: number;
}

const isWorldApp = () => {
  // Check for World App specific properties
  return (
    typeof window !== "undefined" &&
    // Check for World App user agent
    (/World App/i.test(navigator.userAgent) ||
      // Check for World App specific objects
      "ethereum" in window ||
      // Check for World ID specific objects
      "worldId" in window)
  );
};

const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB in bytes

export default function DashboardPage() {
  const { isConnected, walletAddress, worldId, disconnect } = useWallet();
  const [encryptedFileData, setEncryptedFileData] =
    useState<EncryptedFileData | null>(null);
  const [recipients, setRecipients] = useState<string[]>([]);
  const [newRecipient, setNewRecipient] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [sentFiles, setSentFiles] = useState<SentFile[]>([]);
  const [receivedFiles, setReceivedFiles] = useState<ReceivedFile[]>([]);
  const [activeTab, setActiveTab] = useState("send");
  const [isDragging, setIsDragging] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState<{
    uploadResult: LighthouseUploadResult;
    encryptedFileData: EncryptedFileData;
    recipients: string[];
  } | null>(null);

  const { uploadState, uploadToLighthouse, resetUpload } =
    useLighthouseUpload();
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    // Load mock data
    setSentFiles([
      {
        id: "1",
        name: "contract.pdf",
        recipients: [
          "world_id_0x742d35Cc6634C0532925a3b8D4C9db96590c4C5d",
          "world_id_0x8ba1f109551bD432803012645Hac136c22C177ec",
        ],
        date: "2024-01-15",
        cid: "QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG",
        size: 2.4,
      },
      {
        id: "2",
        name: "presentation.pptx",
        recipients: ["world_id_0x8ba1f109551bD432803012645Hac136c22C177ec"],
        date: "2024-01-14",
        cid: "QmPChd2hVbrJ6bfo3WBcTW4iZnpHm8TEzWkLHmLpXhF32k",
        size: 15.7,
      },
    ]);

    setReceivedFiles([
      {
        id: "1",
        name: "invoice.pdf",
        sender: "world_id_0x8ba1f109551bD432803012645Hac136c22C177ec",
        date: "2024-01-16",
        cid: "QmNLei78zWmzUdbeRB3CiUfAizWUrbeeZh5K1rhAQKCh51",
        size: 0.8,
      },
    ]);
  }, []);

  const handleFileEncrypted = (data: EncryptedFileData) => {
    setEncryptedFileData(data);
    toast({
      title: "File encrypted successfully!",
      description: `${data.originalName} is ready to be sent`,
    });
  };

  const handleFileRemoved = () => {
    setEncryptedFileData(null);
  };

  const addRecipient = () => {
    if (newRecipient && !recipients.includes(newRecipient)) {
      setRecipients([...recipients, newRecipient]);
      setNewRecipient("");
    }
  };

  const removeRecipient = (recipient: string) => {
    setRecipients(recipients.filter((r) => r !== recipient));
  };

  const sendFile = async () => {
    if (!encryptedFileData || recipients.length === 0) {
      toast({
        title: "Missing Requirements",
        description: "Please select a file and add at least one recipient",
        variant: "destructive",
      });
      return;
    }

    setIsSending(true);

    try {
      // Utiliser le hook useLighthouseUpload
      const blob = new Blob([encryptedFileData.encryptedFile]);
      const file = new File(
        [blob],
        `${encryptedFileData.originalName}.encrypted`,
        {
          type: "application/octet-stream",
        }
      );

      const uploadResult = await uploadToLighthouse(encryptedFileData);

      if (!uploadResult) {
        throw new Error("Failed to upload to Lighthouse");
      }

      // Sauvegarder les métadonnées de déchiffrement avec le nouveau système simplifié
      DecryptionStorage.save({
        cid: uploadResult.cid,
        aesKey: FileEncryption.keyToHex(encryptedFileData.key),
        fileName: encryptedFileData.originalName,
        fileSize: encryptedFileData.originalSize,
        accessLevel: recipients.length > 1 ? "shared" : "private",
        tags: ["sent", "dashboard"],
      });

      // Afficher les informations de succès
      setUploadSuccess({
        uploadResult,
        encryptedFileData,
        recipients: [...recipients],
      });

      setEncryptedFileData(null);
      setRecipients([]);
      setIsSending(false);
      resetUpload();

      // Créer l'entrée du fichier envoyé avec le vrai CID
      const newFile: SentFile = {
        id: Date.now().toString(),
        name: encryptedFileData.originalName,
        recipients: [...recipients],
        date: new Date().toISOString().split("T")[0],
        cid: uploadResult.cid,
        size: encryptedFileData.originalSize / 1024 / 1024,
      };

      setSentFiles((prev) => [newFile, ...prev]);

      toast({
        title: "File sent successfully!",
        description: `Encrypted file stored on Filecoin with CID: ${uploadResult.cid.substring(
          0,
          20
        )}...`,
      });

      // Optionnel: Afficher plus d'informations sur l'upload
      console.log("📦 File uploaded successfully:", {
        cid: uploadResult.cid,
        nom: uploadResult.Name,
        taille: uploadResult.size,
        destinataires: recipients.length,
      });
      console.log("🔑 Decryption metadata saved locally");
    } catch (error) {
      setIsSending(false);
      resetUpload();

      console.error("Send error:", error);

      toast({
        title: "Send Error",
        description:
          error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "CID copied to clipboard",
    });
  };

  if (!isConnected) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard</h1>
          <p className="text-muted-foreground">
            Send and manage your encrypted files securely with World ID
            verification
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="glass">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <SendHorizontal className="w-6 h-6 text-violet-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    {sentFiles.length}
                  </p>
                  <p className="text-muted-foreground text-sm">Files Sent</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="glass">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center">
                  <Inbox className="w-6 h-6 text-green-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    {receivedFiles.length}
                  </p>
                  <p className="text-muted-foreground text-sm">
                    Files Received
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="glass">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
                  <Zap className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    {(
                      sentFiles.reduce((acc, file) => acc + file.size, 0) +
                      receivedFiles.reduce((acc, file) => acc + file.size, 0)
                    ).toFixed(1)}
                  </p>
                  <p className="text-muted-foreground text-sm">MB Total</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Desktop Layout */}
        <div className="hidden md:block">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="space-y-6"
          >
            <TabsList className="bg-muted border border-border p-1">
              <TabsTrigger
                value="send"
                className="data-[state=active]:bg-background data-[state=active]:text-foreground text-muted-foreground"
              >
                <SendHorizontal className="w-4 h-4 mr-2" />
                Send File
              </TabsTrigger>
              <TabsTrigger
                value="sent"
                className="data-[state=active]:bg-background data-[state=active]:text-foreground text-muted-foreground"
              >
                <Upload className="w-4 h-4 mr-2" />
                Sent Files
              </TabsTrigger>
              <TabsTrigger
                value="received"
                className="data-[state=active]:bg-background data-[state=active]:text-foreground text-muted-foreground"
              >
                <Inbox className="w-4 h-4 mr-2" />
                Received Files
              </TabsTrigger>
              <TabsTrigger
                value="account"
                className="data-[state=active]:bg-background data-[state=active]:text-foreground text-muted-foreground"
              >
                <Settings className="w-4 h-4 mr-2" />
                My Account
              </TabsTrigger>
            </TabsList>

            {/* Send File Tab */}
            <TabsContent value="send">
              {uploadSuccess ? (
                <UploadSuccessInfo
                  uploadResult={uploadSuccess.uploadResult}
                  encryptedFileData={uploadSuccess.encryptedFileData}
                  recipients={uploadSuccess.recipients}
                  onClose={() => setUploadSuccess(null)}
                />
              ) : (
                <Card className="glass">
                  <CardHeader>
                    <CardTitle className="text-foreground flex items-center space-x-2">
                      <Shield className="w-5 h-5 text-violet-400" />
                      <span>Send Encrypted File</span>
                    </CardTitle>
                    <CardDescription className="text-muted-foreground">
                      Upload a file and send it securely to verified World ID
                      users via Filecoin
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* File Upload avec Chiffrement */}
                    <div className="space-y-2">
                      <Label className="text-foreground flex items-center space-x-2">
                        <Shield className="w-4 h-4 text-violet-400" />
                        <span>Select and Encrypt a File</span>
                      </Label>
                      <FileEncryptionUploader
                        onFileEncrypted={handleFileEncrypted}
                        onFileRemoved={handleFileRemoved}
                        maxFileSizeMB={100}
                      />
                    </div>

                    {/* Recipients */}
                    <div className="space-y-3">
                      <Label className="text-foreground flex items-center space-x-2">
                        <Users className="w-4 h-4 text-violet-400" />
                        <span>Recipients (World ID)</span>
                      </Label>
                      <div className="flex space-x-2">
                        <Input
                          placeholder="world_id_0x... or paste World ID"
                          value={newRecipient}
                          onChange={(e) => setNewRecipient(e.target.value)}
                          className="bg-background border-border text-foreground placeholder:text-muted-foreground focus:border-violet-400"
                          onKeyPress={(e) =>
                            e.key === "Enter" && addRecipient()
                          }
                        />
                        <Button
                          onClick={addRecipient}
                          disabled={!newRecipient}
                          className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold"
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                      {recipients.length > 0 && (
                        <div className="space-y-3">
                          <div className="flex flex-wrap gap-2">
                            {recipients.map((recipient, index) => (
                              <Badge
                                key={index}
                                className="bg-violet-500/10 text-violet-400 border-violet-500/20 flex items-center space-x-2 px-3 py-1"
                              >
                                <Globe className="w-3 h-3" />
                                <span className="font-mono text-xs">
                                  {recipient.length > 25
                                    ? `${recipient.slice(0, 25)}...`
                                    : recipient}
                                </span>
                                <button
                                  onClick={() => removeRecipient(recipient)}
                                  className="ml-1 hover:text-red-300"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </Badge>
                            ))}
                          </div>
                          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                            <CheckCircle className="w-4 h-4 text-green-400" />
                            <span>
                              {recipients.length} verified recipient(s) added
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Send Button */}
                    <Button
                      onClick={sendFile}
                      disabled={
                        !encryptedFileData ||
                        recipients.length === 0 ||
                        isSending ||
                        uploadState.isUploading
                      }
                      className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold w-full h-14 text-lg"
                    >
                      {isSending || uploadState.isUploading ? (
                        <div className="flex items-center space-x-3">
                          <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin"></div>
                          <div className="text-left">
                            <p>
                              {uploadState.stage === "preparing" &&
                                "Preparing upload..."}
                              {uploadState.stage === "uploading" &&
                                "Uploading to Filecoin..."}
                              {uploadState.stage === "finalizing" &&
                                "Finalizing..."}
                              {uploadState.stage === "complete" && "Complete!"}
                              {!uploadState.stage &&
                                "Encrypting and uploading..."}
                            </p>
                            <p className="text-xs text-primary-foreground/70">
                              {uploadState.message ||
                                "This may take a few moments"}
                              {uploadState.progress > 0 &&
                                ` • ${uploadState.progress}%`}
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <Send className="w-5 h-5" />
                          <span>
                            Send Securely to {recipients.length} recipient
                            {recipients.length !== 1 ? "s" : ""}
                          </span>
                        </div>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Sent Files Tab */}
            <TabsContent value="sent">
              <Card className="glass">
                <CardHeader>
                  <CardTitle className="text-foreground flex items-center space-x-2">
                    <Upload className="w-5 h-5 text-violet-400" />
                    <span>Sent Files</span>
                  </CardTitle>
                  <CardDescription className="text-muted-foreground">
                    Files you've sent from this World ID
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {sentFiles.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-muted rounded-xl mx-auto mb-4 flex items-center justify-center">
                        <Upload className="w-8 h-8 text-muted-foreground" />
                      </div>
                      <p className="text-muted-foreground text-lg">
                        No files sent yet
                      </p>
                      <p className="text-muted-foreground text-sm mt-1">
                        Start sharing encrypted files securely
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {sentFiles.map((file) => (
                        <div
                          key={file.id}
                          className="bg-muted/50 rounded-lg p-6 border border-border hover:bg-muted/70 transition-colors"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex items-start space-x-4 flex-1">
                              <div className="w-12 h-12 bg-gradient-to-r from-violet-500 to-purple-600 rounded-lg flex items-center justify-center">
                                <FileText className="w-6 h-6 text-white" />
                              </div>
                              <div className="flex-1">
                                <h3 className="text-foreground font-semibold text-lg">
                                  {file.name}
                                </h3>
                                <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
                                  <div className="flex items-center space-x-1">
                                    <Users className="w-4 h-4" />
                                    <span>
                                      {file.recipients.length} recipient(s)
                                    </span>
                                  </div>
                                  <div className="flex items-center space-x-1">
                                    <Calendar className="w-4 h-4" />
                                    <span>{file.date}</span>
                                  </div>
                                  <div className="flex items-center space-x-1">
                                    <FileText className="w-4 h-4" />
                                    <span>{file.size.toFixed(1)} MB</span>
                                  </div>
                                </div>
                                <div className="mt-3">
                                  <p className="text-xs text-muted-foreground mb-2">
                                    Recipients:
                                  </p>
                                  <div className="flex flex-wrap gap-1">
                                    {file.recipients.map((recipient, index) => (
                                      <Badge
                                        key={index}
                                        className="bg-violet-500/10 text-violet-400 border-violet-500/20 text-xs"
                                      >
                                        <Globe className="w-3 h-3 mr-1" />
                                        {recipient.slice(0, 15)}...
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-3">
                              <Badge className="bg-green-500/10 text-green-400 border-green-500/20">
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Sent
                              </Badge>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => copyToClipboard(file.cid)}
                              >
                                <Copy className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                          <div className="mt-4 pt-4 border-t border-border">
                            <p className="text-xs text-muted-foreground">
                              Filecoin CID: {file.cid}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Received Files Tab */}
            <TabsContent value="received">
              <Card className="glass">
                <CardHeader>
                  <CardTitle className="text-foreground flex items-center space-x-2">
                    <Inbox className="w-5 h-5 text-green-400" />
                    <span>Received Files</span>
                  </CardTitle>
                  <CardDescription className="text-muted-foreground">
                    Files sent to your World ID
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {receivedFiles.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-muted rounded-xl mx-auto mb-4 flex items-center justify-center">
                        <Inbox className="w-8 h-8 text-muted-foreground" />
                      </div>
                      <p className="text-muted-foreground text-lg">
                        No files received yet
                      </p>
                      <p className="text-muted-foreground text-sm mt-1">
                        Files sent to your World ID will appear here
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {receivedFiles.map((file) => (
                        <div
                          key={file.id}
                          className="bg-muted/50 rounded-lg p-6 border border-border hover:bg-muted/70 transition-colors"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex items-start space-x-4 flex-1">
                              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                                <FileText className="w-6 h-6 text-white" />
                              </div>
                              <div className="flex-1">
                                <h3 className="text-foreground font-semibold text-lg">
                                  {file.name}
                                </h3>
                                <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
                                  <div className="flex items-center space-x-1">
                                    <Globe className="w-4 h-4" />
                                    <span>
                                      From: {file.sender.slice(0, 20)}...
                                    </span>
                                  </div>
                                  <div className="flex items-center space-x-1">
                                    <Calendar className="w-4 h-4" />
                                    <span>{file.date}</span>
                                  </div>
                                  <div className="flex items-center space-x-1">
                                    <FileText className="w-4 h-4" />
                                    <span>{file.size.toFixed(1)} MB</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-3">
                              <Button className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold">
                                <Download className="w-4 h-4 mr-2" />
                                Download & Decrypt
                              </Button>
                            </div>
                          </div>
                          <div className="mt-4 pt-4 border-t border-border">
                            <p className="text-xs text-muted-foreground">
                              Filecoin CID: {file.cid}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* My Account Tab */}
            <TabsContent value="account">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Account Info */}
                <Card className="glass">
                  <CardHeader>
                    <CardTitle className="text-foreground flex items-center space-x-2">
                      <Settings className="w-5 h-5 text-violet-400" />
                      <span>Account Information</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-foreground">Wallet Address</Label>
                      <div className="flex items-center space-x-2">
                        <Input
                          value={walletAddress || "Not connected"}
                          readOnly
                          className="bg-background border-border text-foreground font-mono text-sm"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyToClipboard(walletAddress || "")}
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-foreground">World ID</Label>
                      <div className="flex items-center space-x-2">
                        <Input
                          value={worldId || "Not verified"}
                          readOnly
                          className="bg-background border-border text-foreground font-mono text-sm"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyToClipboard(worldId || "")}
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="pt-4">
                      <Button
                        onClick={disconnect}
                        variant="destructive"
                        className="w-full"
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        Disconnect Wallet
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Mobile Layout */}
        <div className="md:hidden">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="space-y-4"
          >
            <TabsList className="grid w-full grid-cols-4 bg-muted border border-border p-1">
              <TabsTrigger
                value="send"
                className="data-[state=active]:bg-background data-[state=active]:text-foreground text-muted-foreground"
              >
                <SendHorizontal className="w-4 h-4" />
              </TabsTrigger>
              <TabsTrigger
                value="sent"
                className="data-[state=active]:bg-background data-[state=active]:text-foreground text-muted-foreground"
              >
                <Upload className="w-4 h-4" />
              </TabsTrigger>
              <TabsTrigger
                value="received"
                className="data-[state=active]:bg-background data-[state=active]:text-foreground text-muted-foreground"
              >
                <Inbox className="w-4 h-4" />
              </TabsTrigger>
              <TabsTrigger
                value="account"
                className="data-[state=active]:bg-background data-[state=active]:text-foreground text-muted-foreground"
              >
                <Settings className="w-4 h-4" />
              </TabsTrigger>
            </TabsList>

            {/* Mobile content - optimized versions of desktop tabs */}
            <TabsContent value="send">
              {uploadSuccess ? (
                <UploadSuccessInfo
                  uploadResult={uploadSuccess.uploadResult}
                  encryptedFileData={uploadSuccess.encryptedFileData}
                  recipients={uploadSuccess.recipients}
                  onClose={() => setUploadSuccess(null)}
                />
              ) : (
                <Card className="glass">
                  <CardHeader>
                    <CardTitle className="text-foreground">Send File</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FileEncryptionUploader
                      onFileEncrypted={handleFileEncrypted}
                      onFileRemoved={handleFileRemoved}
                      maxFileSizeMB={100}
                    />

                    <div className="space-y-2">
                      <div className="flex space-x-2">
                        <Input
                          placeholder="World ID recipient"
                          value={newRecipient}
                          onChange={(e) => setNewRecipient(e.target.value)}
                          className="bg-background border-border text-foreground placeholder:text-muted-foreground"
                          onKeyPress={(e) =>
                            e.key === "Enter" && addRecipient()
                          }
                        />
                        <Button
                          onClick={addRecipient}
                          className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold"
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                      {recipients.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {recipients.map((recipient, index) => (
                            <Badge
                              key={index}
                              className="bg-violet-500/10 text-violet-400 border-violet-500/20 flex items-center space-x-1 text-xs"
                            >
                              <Globe className="w-3 h-3" />
                              <span>{recipient.slice(0, 12)}...</span>
                              <button
                                onClick={() => removeRecipient(recipient)}
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>

                    <Button
                      onClick={sendFile}
                      disabled={
                        !encryptedFileData ||
                        recipients.length === 0 ||
                        isSending ||
                        uploadState.isUploading
                      }
                      className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold w-full"
                    >
                      {isSending || uploadState.isUploading ? (
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin"></div>
                          <span>Sending...</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <Send className="w-4 h-4" />
                          <span>Send to {recipients.length}</span>
                        </div>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Mobile Sent Files */}
            <TabsContent value="sent">
              <Card className="glass">
                <CardHeader>
                  <CardTitle className="text-foreground">Sent Files</CardTitle>
                </CardHeader>
                <CardContent>
                  {sentFiles.length === 0 ? (
                    <div className="text-center py-8">
                      <Upload className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                      <p className="text-muted-foreground">No files sent yet</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {sentFiles.map((file) => (
                        <div
                          key={file.id}
                          className="bg-muted/50 rounded-lg p-4 border border-border"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex items-center space-x-3 flex-1">
                              <FileText className="w-8 h-8 text-violet-400" />
                              <div className="min-w-0 flex-1">
                                <h3 className="text-foreground font-semibold text-sm truncate">
                                  {file.name}
                                </h3>
                                <p className="text-muted-foreground text-xs">
                                  {file.recipients.length} recipient(s)
                                </p>
                                <p className="text-muted-foreground text-xs">
                                  {file.date}
                                </p>
                              </div>
                            </div>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => copyToClipboard(file.cid)}
                            >
                              <Copy className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Mobile Received Files */}
            <TabsContent value="received">
              <Card className="glass">
                <CardHeader>
                  <CardTitle className="text-foreground">
                    Received Files
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {receivedFiles.length === 0 ? (
                    <div className="text-center py-8">
                      <Inbox className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                      <p className="text-muted-foreground">
                        No files received yet
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {receivedFiles.map((file) => (
                        <div
                          key={file.id}
                          className="bg-muted/50 rounded-lg p-4 border border-border"
                        >
                          <div className="space-y-3">
                            <div className="flex items-center space-x-3">
                              <FileText className="w-8 h-8 text-green-400" />
                              <div className="min-w-0 flex-1">
                                <h3 className="text-foreground font-semibold text-sm">
                                  {file.name}
                                </h3>
                                <p className="text-muted-foreground text-xs">
                                  From: {file.sender.slice(0, 15)}...
                                </p>
                                <p className="text-muted-foreground text-xs">
                                  {file.date}
                                </p>
                              </div>
                            </div>
                            <Button className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold">
                              <Download className="w-4 h-4 mr-2" />
                              Download
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Mobile Account */}
            <TabsContent value="account">
              <Card className="glass">
                <CardHeader>
                  <CardTitle className="text-foreground">Account</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-muted/50 rounded-lg p-4 border border-border">
                    <h3 className="text-foreground font-semibold text-sm mb-2 flex items-center space-x-1">
                      <Globe className="w-4 h-4 text-violet-400" />
                      <span>World ID</span>
                    </h3>
                    <p className="text-muted-foreground font-mono text-xs break-all">
                      {worldId}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-muted/50 rounded-lg p-3 border border-border text-center">
                      <h3 className="text-foreground font-semibold text-sm">
                        Sent
                      </h3>
                      <p className="text-2xl font-bold text-violet-400">
                        {sentFiles.length}
                      </p>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-3 border border-border text-center">
                      <h3 className="text-foreground font-semibold text-sm">
                        Received
                      </h3>
                      <p className="text-2xl font-bold text-green-400">
                        {receivedFiles.length}
                      </p>
                    </div>
                  </div>

                  <Button
                    onClick={disconnect}
                    variant="outline"
                    className="w-full text-red-400 border-red-400/30 hover:bg-red-400/10 font-semibold"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Disconnect
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
