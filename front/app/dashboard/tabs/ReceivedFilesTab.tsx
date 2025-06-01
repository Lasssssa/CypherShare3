"use client";

import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Download, FileText, Upload} from "lucide-react";
import {Button} from "@/components/ui/button";
import React, {useEffect, useState} from "react";
import axios from "axios";

interface SharedFile {
  fileId: string;
  owner: string;
  cid: string;
  name: string;
  size: string;
  timestamp: string;
  cryptedKey: string;
}

export default function ReceivedFilesTab() {

  const [receivedFiles, setReceivedFiles] = useState<SharedFile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const address = process.env.NEXT_PUBLIC_WALLET_ADDRESS;

  const handleDownload = async (file: SharedFile) => {

    const keyHex = file.cryptedKey;

    try {
      // Téléchargement du fichier chiffré (IV + données chiffrées)
      const res = await fetch(`https://gateway.lighthouse.storage/ipfs/${file.cid}`);
      if (!res.ok) throw new Error("Fichier non trouvé sur IPFS.");
      const encryptedBuffer = await res.arrayBuffer();

      // Extraction IV (12 premiers octets)
      const iv = new Uint8Array(encryptedBuffer.slice(0, 12));
      const encryptedData = encryptedBuffer.slice(12);

      // Conversion hex vers bytes
      const keyBytes = new Uint8Array(
        keyHex.match(/.{1,2}/g)!.map((byte) => parseInt(byte, 16))
      );

      if (![16, 32].includes(keyBytes.length)) throw new Error("Clé AES invalide");

      // Importer la clé AES
      const cryptoKey = await crypto.subtle.importKey(
        "raw",
        keyBytes,
        "AES-GCM",
        false,
        ["decrypt"]
      );

      // Déchiffrer
      const decryptedData = await crypto.subtle.decrypt(
        { name: "AES-GCM", iv },
        cryptoKey,
        encryptedData
      );

      // Pour les mini-apps (World.app) - Conversion en base64 et partage
      const blob = new Blob([decryptedData]);

      // Vérifier si on est dans une mini-app
      const isWorldApp = window.location.hostname.includes('worldapp') ||
        navigator.userAgent.includes('WorldApp') ||
        window.parent !== window; // Dans une iframe

      if (isWorldApp) {
        // Méthode 1 : Essayer l'API de partage native
        if (navigator.share) {
          try {
            const fileObject = new File([blob], file.name, { type: blob.type });
            await navigator.share({
              title: `Fichier: ${file.name}`,
              files: [fileObject]
            });
            return;
          } catch (shareError) {
            console.log('Partage natif échoué, essai méthode alternative');
          }
        }

        // Méthode 2 : Convertir en base64 et afficher
        const reader = new FileReader();
        reader.onload = function() {
          const base64 = reader.result as string;
          // Créer une nouvelle fenêtre avec le contenu
          const newWindow = window.open('', '_blank');
          if (newWindow) {
            newWindow.document.write(`
              <html>
                <head><title>${file.name}</title></head>
                <body style="margin:0; padding:20px; font-family:Arial;">
                  <h3>Fichier: ${file.name}</h3>
                  <p>Appuyez longuement sur le lien pour sauvegarder:</p>
                  <a href="${base64}" download="${file.name}" style="color:blue; text-decoration:underline;">
                    📥 Télécharger ${file.name}
                  </a>
                  <br><br>
                  <small style="color:gray;">Ou copiez ce lien et ouvrez-le dans votre navigateur</small>
                </body>
              </html>
            `);
            newWindow.document.close();
          } else {
            // Fallback : copier dans le presse-papier
            navigator.clipboard?.writeText(base64).then(() => {
              alert('🎉 Fichier copié dans le presse-papier ! Collez-le dans votre navigateur.');
            });
          }
        };
        reader.readAsDataURL(blob);

      } else {
        // Méthode classique pour les navigateurs normaux
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = file.name;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }

    } catch (err) {
      alert("❌ Échec du déchiffrement ou téléchargement.");
      console.error(err);
    }
  };

  useEffect(() => {
    const fetchSentFiles = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get( `https://7d4b-195-113-187-130.ngrok-free.app/files/get-my-shared-files?address=${address}`, {
          method: 'GET',
          headers: {
            'ngrok-skip-browser-warning': 'true',
            'Content-Type': 'application/json',
          },
          // withCredentials: true, // Include cookies for authentication
        });

        const data = response.data;
        setReceivedFiles(data.files);
      } catch (err) {
        console.log(err);
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSentFiles();
  }, [address]);

  return (
    <main>
      <Card className="glass">
        <CardHeader>
          <CardTitle className="text-foreground">
            Received Files
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Loading...</p>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground text-red-500">{error}</p>
            </div>
          ) : receivedFiles.length === 0 ? (
            <div className="text-center py-8">
              <Upload className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">No files received yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {receivedFiles.map((file) => (
                <div
                  key={file.fileId}
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
                          From: {file.owner.slice(0, 15)}...
                        </p>
                        <p className="text-muted-foreground text-xs">
                          {file.timestamp}
                        </p>
                      </div>
                    </div>
                    <Button onClick={() => {handleDownload(file)}} className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold">
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
    </main>
  );
}
