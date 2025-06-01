"use client";

import {UploadSuccessInfo} from "@/components/UploadSuccessInfo";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {FileEncryptionUploader} from "@/components/FileEncryptionUploader";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Globe, Plus, Send, X} from "lucide-react";
import {Badge} from "@/components/ui/badge";
import type React from "react";
import {useState} from "react";
import {EncryptedFileData, FileEncryption} from "@/lib/encryption";
import {LighthouseUploadResult} from "@/lib/lighthouse";
import {useLighthouseUpload} from "@/hooks/useLighthouseUpload";
import {useToast} from "@/hooks/use-toast";
import {DecryptionStorage} from "@/services/DecryptionStorage";
import axios from "axios";

interface SentFile {
  id: string;
  name: string;
  recipients: string[];
  date: string;
  cid: string;
  size: number;
}

const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB in bytes

export default function SendFileTab() {
  const [encryptedFileData, setEncryptedFileData] =
    useState<EncryptedFileData | null>(null);
  const [recipients, setRecipients] = useState<string[]>([]);
  const [newRecipient, setNewRecipient] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState<{
    uploadResult: LighthouseUploadResult;
    encryptedFileData: EncryptedFileData;
    recipients: string[];
  } | null>(null);

  const [hash, setHash] = useState<string | null>(null);

  const { uploadState, uploadToLighthouse, resetUpload } = useLighthouseUpload();
  const { toast } = useToast();

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

      const aes = FileEncryption.keyToHex(encryptedFileData.key);
      // Sauvegarder les métadonnées de déchiffrement avec le nouveau système simplifié
      DecryptionStorage.save({
        cid: uploadResult.cid,
        aesKey: aes,
        fileName: encryptedFileData.originalName,
        fileSize: encryptedFileData.originalSize,
        accessLevel: recipients.length > 1 ? "shared" : "private",
        tags: ["sent", "dashboard"],
      });

      const response = await axios.post("https://7d4b-195-113-187-130.ngrok-free.app/files/upload-file", {
        cid: uploadResult.cid,
        name: encryptedFileData.originalName,
        size: encryptedFileData.originalSize,
        cryptedKeys: [aes],
        recipients: recipients,
      }, {
      headers: {
          "ngrok-skip-browser-warning": "true",
          "Content-Type": "application/json",
      },
        // withCredentials: true,
      });

      setHash(response.data.transactionHash);

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

      toast({
        title: "File sent successfully!",
        description: `Encrypted file stored on Filecoin with CID: ${uploadResult.cid.substring(
          0,
          20
        )}...`,
      });

    } catch (error) {
      setIsSending(false);
      resetUpload();
      toast({
        title: "Send Error",
        description:
          error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    }
  };


  return (
    <main>
      {uploadSuccess ? (
        <UploadSuccessInfo
          transactionHash={hash}
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
                    <div key={index}>
                      <Badge className="bg-violet-500/10 text-violet-400 border-violet-500/20 flex items-center space-x-1 text-xs">
                        <Globe className="w-3 h-3" />
                        <span>{recipient.slice(0, 12)}...</span>
                        <button
                          onClick={() => removeRecipient(recipient)}
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    </div>
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
    </main>
  );
}
