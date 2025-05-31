/**
 * Service de chiffrement de fichiers côté client
 * Utilise AES-GCM pour un chiffrement authentifié
 * L'IV est stocké au début du fichier chiffré (12 premiers bytes)
 */

export interface EncryptedFileData {
  encryptedFile: ArrayBuffer; // Contient IV (12 bytes) + données chiffrées
  key: Uint8Array;
  originalName: string;
  originalSize: number;
}

export class FileEncryption {
  /**
   * Génère une clé AES-256 aléatoire
   */
  static generateAESKey(): Uint8Array {
    return crypto.getRandomValues(new Uint8Array(32)); // 256 bits
  }

  /**
   * Génère un vecteur d'initialisation (IV) aléatoire
   */
  static generateIV(): Uint8Array {
    return crypto.getRandomValues(new Uint8Array(12)); // 96 bits pour AES-GCM
  }

  /**
   * Convertit un fichier en ArrayBuffer
   */
  static async fileToArrayBuffer(file: File): Promise<ArrayBuffer> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as ArrayBuffer);
      reader.onerror = () => reject(reader.error);
      reader.readAsArrayBuffer(file);
    });
  }

  /**
   * Chiffre un fichier avec AES-GCM et stocke l'IV au début
   */
  static async encryptFile(file: File): Promise<EncryptedFileData> {
    try {
      // 1. Générer une clé AES aléatoire
      const key = this.generateAESKey();

      // 2. Générer un IV aléatoire
      const iv = this.generateIV();

      // 3. Debug détaillé des clés générées
      const keyHex = this.keyToHex(key);
      const ivHex = this.keyToHex(iv);

      console.log("🔐 INFORMATIONS DE CHIFFREMENT:");
      console.log("📄 Fichier:", file.name);
      console.log("🔑 Clé AES (bytes):", key.length, "bytes");
      console.log("🔑 Clé AES (bits):", key.length * 8, "bits");
      console.log("🔑 Clé AES (hex):", keyHex);
      console.log("🔑 Clé AES hex longueur:", keyHex.length, "caractères");
      console.log("🎲 IV (bytes):", iv.length, "bytes");
      console.log("🎲 IV (bits):", iv.length * 8, "bits");
      console.log("🎲 IV (hex):", ivHex);
      console.log("🎲 IV hex longueur:", ivHex.length, "caractères");
      console.log(
        "📦 NOUVEAU: IV stocké au début du fichier chiffré (12 premiers bytes)"
      );
      console.log(
        "⚠️  SAUVEGARDEZ SEULEMENT LA CLÉ AES - l'IV sera extrait automatiquement !"
      );

      // 4. Convertir le fichier en ArrayBuffer
      const fileBuffer = await this.fileToArrayBuffer(file);

      // 5. Importer la clé pour l'API Web Crypto
      const cryptoKey = await crypto.subtle.importKey(
        "raw",
        key,
        "AES-GCM",
        false,
        ["encrypt"]
      );

      // 6. Chiffrer le fichier
      const encryptedData = await crypto.subtle.encrypt(
        {
          name: "AES-GCM",
          iv: iv,
        },
        cryptoKey,
        fileBuffer
      );

      // 7. Créer un nouveau ArrayBuffer avec IV + données chiffrées
      const finalData = new ArrayBuffer(iv.length + encryptedData.byteLength);
      const finalView = new Uint8Array(finalData);

      // Copier l'IV au début
      finalView.set(iv, 0);

      // Copier les données chiffrées après l'IV
      finalView.set(new Uint8Array(encryptedData), iv.length);

      console.log(
        `📦 Fichier final: ${finalData.byteLength} bytes (${iv.length} IV + ${encryptedData.byteLength} chiffré)`
      );

      return {
        encryptedFile: finalData,
        key,
        originalName: file.name,
        originalSize: file.size,
      };
    } catch (error) {
      console.error("Erreur lors du chiffrement:", error);
      throw new Error("Échec du chiffrement du fichier");
    }
  }

  /**
   * Déchiffre un fichier avec AES-GCM en extrayant l'IV du début
   */
  static async decryptFile(
    encryptedDataWithIV: ArrayBuffer,
    key: Uint8Array
  ): Promise<ArrayBuffer> {
    try {
      // 1. Extraire l'IV (12 premiers bytes)
      const iv = new Uint8Array(encryptedDataWithIV.slice(0, 12));

      // 2. Extraire les données chiffrées (après les 12 premiers bytes)
      const encryptedData = encryptedDataWithIV.slice(12);

      console.log("🔓 DÉCHIFFREMENT:");
      console.log("📦 Taille totale:", encryptedDataWithIV.byteLength, "bytes");
      console.log("🎲 IV extrait:", this.keyToHex(iv), `(${iv.length} bytes)`);
      console.log("🔒 Données chiffrées:", encryptedData.byteLength, "bytes");

      // 3. Importer la clé pour l'API Web Crypto
      const cryptoKey = await crypto.subtle.importKey(
        "raw",
        key,
        "AES-GCM",
        false,
        ["decrypt"]
      );

      // 4. Déchiffrer le fichier
      const decryptedFile = await crypto.subtle.decrypt(
        {
          name: "AES-GCM",
          iv: iv,
        },
        cryptoKey,
        encryptedData
      );

      console.log(
        "✅ Déchiffrement réussi:",
        decryptedFile.byteLength,
        "bytes"
      );
      return decryptedFile;
    } catch (error) {
      console.error("Erreur lors du déchiffrement:", error);
      throw new Error("Échec du déchiffrement du fichier");
    }
  }

  /**
   * Déchiffre un fichier avec clé et IV séparés (pour compatibilité)
   * @deprecated Utilisez decryptFile(data, key) à la place
   */
  static async decryptFileWithSeparateIV(
    encryptedData: ArrayBuffer,
    key: Uint8Array,
    iv: Uint8Array
  ): Promise<ArrayBuffer> {
    try {
      // Importer la clé pour l'API Web Crypto
      const cryptoKey = await crypto.subtle.importKey(
        "raw",
        key,
        "AES-GCM",
        false,
        ["decrypt"]
      );

      // Déchiffrer le fichier
      const decryptedFile = await crypto.subtle.decrypt(
        {
          name: "AES-GCM",
          iv: iv,
        },
        cryptoKey,
        encryptedData
      );

      return decryptedFile;
    } catch (error) {
      console.error("Erreur lors du déchiffrement:", error);
      throw new Error("Échec du déchiffrement du fichier");
    }
  }

  /**
   * Extrait l'IV d'un fichier chiffré (12 premiers bytes)
   */
  static extractIV(encryptedFileWithIV: ArrayBuffer): Uint8Array {
    return new Uint8Array(encryptedFileWithIV.slice(0, 12));
  }

  /**
   * Extrait les données chiffrées (sans l'IV)
   */
  static extractEncryptedData(encryptedFileWithIV: ArrayBuffer): ArrayBuffer {
    return encryptedFileWithIV.slice(12);
  }

  /**
   * Convertit une clé Uint8Array en string hexadécimale
   */
  static keyToHex(key: Uint8Array): string {
    return Array.from(key)
      .map((byte) => byte.toString(16).padStart(2, "0"))
      .join("");
  }

  /**
   * Convertit une string hexadécimale en Uint8Array (pour clé AES uniquement)
   */
  static hexToKey(hex: string): Uint8Array {
    // Nettoyer la chaîne hex (supprimer espaces, retours à la ligne, etc.)
    const cleanHex = hex.replace(/\s+/g, "").trim();

    // Vérifier que c'est bien du hexadécimal
    if (!/^[0-9a-fA-F]+$/.test(cleanHex)) {
      throw new Error(
        `Format hexadécimal invalide: ${cleanHex.substring(0, 20)}...`
      );
    }

    // Vérifier la longueur (doit être paire)
    if (cleanHex.length % 2 !== 0) {
      throw new Error(
        `Longueur hexadécimale invalide: ${cleanHex.length} caractères (doit être paire)`
      );
    }

    // Vérifier que c'est une clé AES valide (128, 192 ou 256 bits)
    const keyLengthBits = cleanHex.length * 4; // chaque caractère hex = 4 bits
    if (![128, 192, 256].includes(keyLengthBits)) {
      throw new Error(
        `Taille invalide: ${keyLengthBits} bits (doit être 128/192/256 bits pour clé AES)`
      );
    }

    const bytes = new Uint8Array(cleanHex.length / 2);
    for (let i = 0; i < cleanHex.length; i += 2) {
      bytes[i / 2] = parseInt(cleanHex.substring(i, i + 2), 16);
    }

    console.log(
      `🔑 Conversion hex vers clé AES: ${keyLengthBits} bits (${bytes.length} bytes)`
    );
    return bytes;
  }

  /**
   * Convertit une string hexadécimale en IV (Vecteur d'Initialisation)
   * @deprecated L'IV est maintenant extrait automatiquement du fichier
   */
  static hexToIV(hex: string): Uint8Array {
    // Nettoyer la chaîne hex
    const cleanHex = hex.replace(/\s+/g, "").trim();

    // Vérifier que c'est bien du hexadécimal
    if (!/^[0-9a-fA-F]+$/.test(cleanHex)) {
      throw new Error(
        `Format hexadécimal invalide pour IV: ${cleanHex.substring(0, 20)}...`
      );
    }

    // Vérifier la longueur (doit être paire)
    if (cleanHex.length % 2 !== 0) {
      throw new Error(
        `Longueur hexadécimale invalide pour IV: ${cleanHex.length} caractères (doit être paire)`
      );
    }

    // Vérifier que c'est un IV valide (96 bits = 24 caractères hex)
    if (cleanHex.length !== 24) {
      throw new Error(
        `Taille d'IV invalide: ${cleanHex.length} caractères (doit être exactement 24 caractères pour 96 bits)`
      );
    }

    const bytes = new Uint8Array(12); // 96 bits = 12 bytes
    for (let i = 0; i < cleanHex.length; i += 2) {
      bytes[i / 2] = parseInt(cleanHex.substring(i, i + 2), 16);
    }

    console.log(`🎲 Conversion hex vers IV: 96 bits (${bytes.length} bytes)`);
    return bytes;
  }

  /**
   * Crée un blob à partir de données déchiffrées
   */
  static createBlobFromDecrypted(
    decryptedData: ArrayBuffer,
    originalName: string,
    mimeType?: string
  ): Blob {
    const inferredMimeType = mimeType || this.getMimeTypeFromName(originalName);
    return new Blob([decryptedData], { type: inferredMimeType });
  }

  /**
   * Infère le type MIME à partir de l'extension du fichier
   */
  private static getMimeTypeFromName(fileName: string): string {
    const extension = fileName.split(".").pop()?.toLowerCase();
    const mimeTypes: { [key: string]: string } = {
      pdf: "application/pdf",
      txt: "text/plain",
      doc: "application/msword",
      docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      jpg: "image/jpeg",
      jpeg: "image/jpeg",
      png: "image/png",
      gif: "image/gif",
      mp4: "video/mp4",
      mp3: "audio/mpeg",
      zip: "application/zip",
      json: "application/json",
    };

    return mimeTypes[extension || ""] || "application/octet-stream";
  }
}

/**
 * Utilitaires pour l'affichage des tailles de fichiers
 */
export class FileUtils {
  static formatFileSize(bytes: number): string {
    const sizes = ["Bytes", "KB", "MB", "GB"];
    if (bytes === 0) return "0 Bytes";
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + " " + sizes[i];
  }

  static isFileSizeValid(file: File, maxSizeMB: number = 100): boolean {
    return file.size <= maxSizeMB * 1024 * 1024;
  }
}
