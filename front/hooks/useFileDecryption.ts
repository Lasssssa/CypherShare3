"use client";

import { useState } from "react";
import { FileEncryption } from "@/lib/encryption";
import { DecryptionStorage } from "@/services/DecryptionStorage";

/**
 * Hook personnalisé pour le déchiffrement de fichiers
 * Simplifié avec IV stocké dans le fichier
 */

export interface DecryptionResult {
  success: boolean;
  fileName?: string;
  fileSize?: number;
  downloadUrl?: string;
  error?: string;
}

export const useFileDecryption = () => {
  const [isDecrypting, setIsDecrypting] = useState(false);
  const [result, setResult] = useState<DecryptionResult | null>(null);

  /**
   * Déchiffre un fichier à partir du CID et de la clé AES (IV extrait automatiquement)
   */
  const decryptFile = async (cid: string, aesKeyHex: string): Promise<void> => {
    setIsDecrypting(true);
    setResult(null);

    try {
      console.log("🔓 Début du déchiffrement");
      console.log("📍 CID:", cid);
      console.log("🔑 Clé AES:", aesKeyHex);
      console.log("📦 NOUVEAU: IV sera extrait automatiquement du fichier");

      // Télécharger le fichier chiffré depuis Lighthouse
      const response = await fetch(
        `https://gateway.lighthouse.storage/ipfs/${cid}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const encryptedFileWithIV = await response.arrayBuffer();
      console.log(
        "📦 Fichier téléchargé:",
        encryptedFileWithIV.byteLength,
        "bytes"
      );

      // Convertir la clé hex en Uint8Array
      const aesKey = FileEncryption.hexToKey(aesKeyHex);

      // Déchiffrer le fichier (l'IV sera extrait automatiquement)
      const decryptedData = await FileEncryption.decryptFile(
        encryptedFileWithIV,
        aesKey
      );

      // Récupérer les métadonnées si disponibles
      const metadata = DecryptionStorage.getByCid(cid);
      const fileName = metadata?.fileName || "decrypted_file";

      // Créer un blob et URL de téléchargement
      const blob = FileEncryption.createBlobFromDecrypted(
        decryptedData,
        fileName
      );
      const downloadUrl = URL.createObjectURL(blob);

      setResult({
        success: true,
        fileName,
        fileSize: decryptedData.byteLength,
        downloadUrl,
      });

      console.log(
        "✅ Déchiffrement réussi:",
        fileName,
        `(${decryptedData.byteLength} bytes)`
      );
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      console.error("❌ Erreur déchiffrement:", errorMessage);

      setResult({
        success: false,
        error: errorMessage,
      });
    } finally {
      setIsDecrypting(false);
    }
  };

  /**
   * Méthode de déchiffrement avec IV séparé (pour compatibilité avec anciens fichiers)
   */
  const decryptFileWithSeparateIV = async (
    cid: string,
    aesKeyHex: string,
    ivHex: string
  ): Promise<void> => {
    setIsDecrypting(true);
    setResult(null);

    try {
      console.log("🔓 Déchiffrement avec IV séparé (mode compatibilité)");
      console.log("📍 CID:", cid);
      console.log("🔑 Clé AES:", aesKeyHex);
      console.log("🎲 IV:", ivHex);

      // Télécharger le fichier chiffré
      const response = await fetch(
        `https://gateway.lighthouse.storage/ipfs/${cid}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const encryptedData = await response.arrayBuffer();

      // Convertir les clés hex
      const aesKey = FileEncryption.hexToKey(aesKeyHex);
      const iv = FileEncryption.hexToIV(ivHex);

      // Déchiffrer avec IV séparé
      const decryptedData = await FileEncryption.decryptFileWithSeparateIV(
        encryptedData,
        aesKey,
        iv
      );

      // Récupérer les métadonnées
      const metadata = DecryptionStorage.getByCid(cid);
      const fileName = metadata?.fileName || "decrypted_file";

      // Créer le blob et URL
      const blob = FileEncryption.createBlobFromDecrypted(
        decryptedData,
        fileName
      );
      const downloadUrl = URL.createObjectURL(blob);

      setResult({
        success: true,
        fileName,
        fileSize: decryptedData.byteLength,
        downloadUrl,
      });

      console.log("✅ Déchiffrement réussi (IV séparé):", fileName);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      console.error("❌ Erreur déchiffrement:", errorMessage);

      setResult({
        success: false,
        error: errorMessage,
      });
    } finally {
      setIsDecrypting(false);
    }
  };

  /**
   * Déchiffre automatiquement à partir du CID (utilise les métadonnées stockées)
   */
  const decryptFromMetadata = async (cid: string): Promise<void> => {
    const metadata = DecryptionStorage.getByCid(cid);

    if (!metadata) {
      setResult({
        success: false,
        error: "No stored metadata found for this CID",
      });
      return;
    }

    await decryptFile(cid, metadata.aesKey);
  };

  /**
   * Nettoie l'URL de téléchargement
   */
  const cleanupDownloadUrl = () => {
    if (result?.downloadUrl) {
      URL.revokeObjectURL(result.downloadUrl);
    }
    setResult(null);
  };

  /**
   * Remet à zéro le résultat
   */
  const reset = () => {
    cleanupDownloadUrl();
    setResult(null);
  };

  return {
    isDecrypting,
    result,
    decryptFile,
    decryptFileWithSeparateIV,
    decryptFromMetadata,
    cleanupDownloadUrl,
    reset,
  };
};
