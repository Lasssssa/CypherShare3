/**
 * Service de stockage et gestion des métadonnées de déchiffrement
 * Maintenant simplifié - l'IV est stocké dans le fichier chiffré
 */

export interface DecryptionMetadata {
  cid: string;
  aesKey: string; // Clé AES en hexadécimal (256 bits)
  // L'IV n'est plus stocké ici - il est dans le fichier chiffré
  fileName: string;
  fileSize: number;

  // Métadonnées étendues
  version: string;
  algorithm: string;
  uploadedAt: Date;
  accessLevel: "private" | "shared" | "public";
  downloadCount: number;
  lastAccessedAt?: Date;
  tags: string[];
  expiresAt?: Date;
}

export interface SmartContractMetadata {
  cid: string;
  encryptedKey: string; // Clé AES chiffrée avec la clé publique du destinataire
  fileName: string;
  fileSize: number;
  algorithm: string;
  accessRules: {
    allowedRecipients: string[];
    expiresAt?: number;
    downloadLimit?: number;
  };
  metadata: {
    uploadedAt: number;
    tags: string[];
    version: string;
  };
}

export class DecryptionStorage {
  private static readonly STORAGE_KEY = "cypherShare-decryption-metadata";
  private static readonly CURRENT_VERSION = "2.0"; // Version avec IV intégré

  /**
   * Sauvegarde les métadonnées de déchiffrement
   */
  static save(
    metadata: Omit<
      DecryptionMetadata,
      "uploadedAt" | "version" | "algorithm" | "downloadCount"
    > & { tags?: string[] }
  ): void {
    try {
      const completeMetadata: DecryptionMetadata = {
        ...metadata,
        version: this.CURRENT_VERSION,
        algorithm: "AES-256-GCM",
        uploadedAt: new Date(),
        downloadCount: 0,
        tags: metadata.tags || [],
      };

      const existing = this.getAll();
      const updated = [
        ...existing.filter((m) => m.cid !== metadata.cid),
        completeMetadata,
      ];

      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updated));

      console.log("✅ Métadonnées sauvegardées:", metadata.fileName);
      console.log("🔑 CID:", metadata.cid);
      console.log("🔐 AES Key:", metadata.aesKey);

      // Solution temporaire mobile : affichage console amélioré
      console.log(
        "📱 MOBILE USERS: Ouvrez la console pour voir les infos de déchiffrement"
      );
      console.log("=".repeat(50));
      console.log("FICHIER:", metadata.fileName);
      console.log("CID:", metadata.cid);
      console.log("CLÉ AES:", metadata.aesKey);
      console.log("=".repeat(50));
    } catch (error) {
      console.error("❌ Erreur sauvegarde métadonnées:", error);
      throw new Error("Failed to save decryption metadata");
    }
  }

  /**
   * Récupère toutes les métadonnées stockées
   */
  static getAll(): DecryptionMetadata[] {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (!stored) return [];

      const parsed = JSON.parse(stored);
      return parsed.map((item: any) => ({
        ...item,
        uploadedAt: new Date(item.uploadedAt),
        lastAccessedAt: item.lastAccessedAt
          ? new Date(item.lastAccessedAt)
          : undefined,
        expiresAt: item.expiresAt ? new Date(item.expiresAt) : undefined,
      }));
    } catch (error) {
      console.error("❌ Erreur lecture métadonnées:", error);
      return [];
    }
  }

  /**
   * Récupère les métadonnées par CID
   */
  static getByCid(cid: string): DecryptionMetadata | null {
    const all = this.getAll();
    const found = all.find((m) => m.cid === cid);

    if (found) {
      // Incrémenter le compteur de téléchargement
      found.downloadCount++;
      found.lastAccessedAt = new Date();
      this.updateMetadata(found);
    }

    return found || null;
  }

  /**
   * Met à jour les métadonnées existantes
   */
  static updateMetadata(updatedMetadata: DecryptionMetadata): void {
    const all = this.getAll();
    const index = all.findIndex((m) => m.cid === updatedMetadata.cid);

    if (index !== -1) {
      all[index] = updatedMetadata;
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(all));
    }
  }

  /**
   * Supprime les métadonnées par CID
   */
  static remove(cid: string): boolean {
    try {
      const existing = this.getAll();
      const filtered = existing.filter((m) => m.cid !== cid);

      if (filtered.length !== existing.length) {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filtered));
        console.log("✅ Métadonnées supprimées pour CID:", cid);
        return true;
      }
      return false;
    } catch (error) {
      console.error("❌ Erreur suppression métadonnées:", error);
      return false;
    }
  }

  /**
   * Vide tout le stockage
   */
  static clear(): void {
    localStorage.removeItem(this.STORAGE_KEY);
    console.log("✅ Toutes les métadonnées supprimées");
  }

  /**
   * Exporte toutes les métadonnées
   */
  static export(): string {
    const allMetadata = this.getAll();
    return JSON.stringify(allMetadata, null, 2);
  }

  /**
   * Importe des métadonnées depuis JSON
   */
  static import(jsonData: string): void {
    try {
      const imported = JSON.parse(jsonData);
      if (!Array.isArray(imported)) {
        throw new Error("Format JSON invalide");
      }

      const existing = this.getAll();
      const merged = [...existing];

      imported.forEach((item: any) => {
        const index = merged.findIndex((m) => m.cid === item.cid);
        if (index !== -1) {
          merged[index] = item;
        } else {
          merged.push(item);
        }
      });

      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(merged));
      console.log("✅ Métadonnées importées:", imported.length, "items");
    } catch (error) {
      console.error("❌ Erreur import métadonnées:", error);
      throw new Error("Failed to import metadata");
    }
  }

  /**
   * Nettoie les métadonnées expirées
   */
  static cleanup(): number {
    const all = this.getAll();
    const now = new Date();
    const valid = all.filter((m) => !m.expiresAt || m.expiresAt > now);

    const deletedCount = all.length - valid.length;

    if (deletedCount > 0) {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(valid));
      console.log(
        "✅ Nettoyage:",
        deletedCount,
        "métadonnées expirées supprimées"
      );
    }

    return deletedCount;
  }

  /**
   * Obtient des statistiques
   */
  static getStatistics() {
    const all = this.getAll();
    const now = new Date();
    const recentLimit = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000); // 7 jours

    return {
      totalFiles: all.length,
      totalDownloads: all.reduce((sum, m) => sum + m.downloadCount, 0),
      recentFiles: all.filter((m) => m.uploadedAt > recentLimit).length,
      accessLevels: {
        private: all.filter((m) => m.accessLevel === "private").length,
        shared: all.filter((m) => m.accessLevel === "shared").length,
        public: all.filter((m) => m.accessLevel === "public").length,
      },
      expiredFiles: all.filter((m) => m.expiresAt && m.expiresAt < now).length,
    };
  }

  /**
   * Prépare les métadonnées pour smart contract
   */
  static prepareForSmartContract(
    cid: string,
    recipientPublicKey: string
  ): SmartContractMetadata | null {
    const metadata = this.getByCid(cid);
    if (!metadata) return null;

    // TODO: Implémenter le chiffrement de la clé AES avec la clé publique du destinataire
    const encryptedKey = `encrypted_${metadata.aesKey}_with_${recipientPublicKey}`;

    return {
      cid: metadata.cid,
      encryptedKey,
      fileName: metadata.fileName,
      fileSize: metadata.fileSize,
      algorithm: metadata.algorithm,
      accessRules: {
        allowedRecipients: [recipientPublicKey],
        expiresAt: metadata.expiresAt?.getTime(),
      },
      metadata: {
        uploadedAt: metadata.uploadedAt.getTime(),
        tags: metadata.tags,
        version: metadata.version,
      },
    };
  }

  /**
   * Ajoute des tags à un fichier
   */
  static addTags(cid: string, newTags: string[]): void {
    const metadata = this.getByCid(cid);
    if (metadata) {
      const uniqueTags = [...new Set([...metadata.tags, ...newTags])];
      metadata.tags = uniqueTags;
      this.updateMetadata(metadata);
    }
  }

  /**
   * Supprime des tags d'un fichier
   */
  static removeTags(cid: string, tagsToRemove: string[]): void {
    const metadata = this.getByCid(cid);
    if (metadata) {
      metadata.tags = metadata.tags.filter(
        (tag) => !tagsToRemove.includes(tag)
      );
      this.updateMetadata(metadata);
    }
  }
}
