import lighthouse from "@lighthouse-web3/sdk";

export interface LighthouseUploadResult {
  cid: string;
  size: number;
  Name: string;
  Hash: string;
}

export interface UploadProgress {
  progress: number;
  stage: "preparing" | "uploading" | "finalizing" | "complete";
  message: string;
}

export class LighthouseService {
  private static API_KEY: string | null = null;

  /**
   * Initialise la clé API Lighthouse
   *
   * Pour obtenir une clé gratuite :
   * 1. Va sur https://lighthouse.storage
   * 2. Clique "Get Started"
   * 3. Inscris-toi avec ton email
   * 4. Vérifie ton email
   * 5. Va dans "API Keys" dans ton dashboard
   * 6. Crée une nouvelle clé API
   * 7. Ajoute NEXT_PUBLIC_LIGHTHOUSE_API_KEY=ta_clé dans .env.local
   *
   * Plan gratuit : 1GB/mois - parfait pour tester !
   */
  static setApiKey(apiKey: string) {
    this.API_KEY = apiKey;
    console.log(
      "🔑 Clé API Lighthouse configurée:",
      apiKey.substring(0, 10) + "..."
    );
  }

  /**
   * Obtient la clé API depuis les variables d'environnement ou celle configurée
   */
  static getApiKey(): string | null {
    // Priorité : clé configurée manuellement > variable d'environnement
    if (this.API_KEY) {
      return this.API_KEY;
    }

    // Récupérer depuis les variables d'environnement Next.js
    const envApiKey = process.env.NEXT_PUBLIC_LIGHTHOUSE_API_KEY;
    if (envApiKey) {
      console.log(
        "🔑 Utilisation de la clé API depuis .env.local:",
        envApiKey.substring(0, 10) + "..."
      );
      return envApiKey;
    }

    return null;
  }

  /**
   * Vérifie si on est en mode développement
   */
  static isDevelopmentMode(): boolean {
    return (
      process.env.NEXT_PUBLIC_DEV_MODE === "true" ||
      process.env.NODE_ENV === "development"
    );
  }

  /**
   * Obtient une clé API temporaire pour les tests
   * Alternative gratuite sans inscription
   */
  static async getTemporaryApiKey(): Promise<string> {
    try {
      // Utilise l'API publique de Lighthouse pour obtenir une clé temporaire
      const response = await fetch(
        "https://node.lighthouse.storage/api/auth/get_temp_key",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            // Paramètres par défaut pour une clé temporaire
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Impossible d'obtenir une clé temporaire");
      }

      const data = await response.json();
      return data.tempKey || "demo-key";
    } catch (error) {
      console.warn("Utilisation de la clé démo:", error);
      // Fallback vers une clé de démonstration
      return "demo-key-for-testing";
    }
  }

  /**
   * Vérifie si un CID est vraiment accessible sur IPFS/Filecoin
   */
  static async verifyCIDAccessibility(cid: string): Promise<{
    accessible: boolean;
    size?: number;
    gateway: string;
    error?: string;
  }> {
    const gateways = [
      "https://gateway.lighthouse.storage/ipfs",
      "https://ipfs.io/ipfs",
      "https://cloudflare-ipfs.com/ipfs",
      "https://gateway.pinata.cloud/ipfs",
    ];

    for (const gateway of gateways) {
      try {
        console.log(`🔍 Test d'accessibilité: ${gateway}/${cid}`);

        const response = await fetch(`${gateway}/${cid}`, {
          method: "HEAD",
          signal: AbortSignal.timeout(10000), // 10 secondes timeout
        });

        if (response.ok) {
          const size = parseInt(response.headers.get("content-length") || "0");
          return {
            accessible: true,
            size,
            gateway: `${gateway}/${cid}`,
          };
        }
      } catch (error) {
        console.warn(`❌ Gateway ${gateway} inaccessible:`, error);
        continue;
      }
    }

    return {
      accessible: false,
      gateway: "",
      error: "CID inaccessible sur tous les gateways testés",
    };
  }

  /**
   * Upload un fichier chiffré vers Lighthouse/IPFS
   */
  static async uploadEncryptedFile(
    encryptedData: ArrayBuffer,
    fileName: string,
    onProgress?: (progress: UploadProgress) => void
  ): Promise<LighthouseUploadResult> {
    try {
      onProgress?.({
        progress: 10,
        stage: "preparing",
        message: "Préparation de l'upload...",
      });

      // Obtenir une clé API si on n'en a pas
      let apiKey = this.getApiKey();
      if (!apiKey) {
        onProgress?.({
          progress: 20,
          stage: "preparing",
          message: "Obtention de la clé API...",
        });
        apiKey = await this.getTemporaryApiKey();
        this.setApiKey(apiKey);
      }

      onProgress?.({
        progress: 30,
        stage: "preparing",
        message: "Conversion du fichier...",
      });

      // Convertir ArrayBuffer en File
      const blob = new Blob([encryptedData], {
        type: "application/octet-stream",
      });
      const file = new File([blob], `encrypted_${fileName}`, {
        type: "application/octet-stream",
      });

      onProgress?.({
        progress: 40,
        stage: "uploading",
        message: "Upload vers IPFS/Filecoin en cours...",
      });

      // Essayer d'abord un vrai upload vers Lighthouse
      let uploadResult: LighthouseUploadResult;

      try {
        // Upload vers Lighthouse
        const uploadResponse = await lighthouse.upload([file], apiKey);

        if (
          !uploadResponse ||
          !uploadResponse.data ||
          !uploadResponse.data.Hash
        ) {
          throw new Error("Échec de l'upload vers Lighthouse");
        }

        const result = uploadResponse.data;
        uploadResult = {
          cid: result.Hash,
          size: parseInt(result.Size) || encryptedData.byteLength,
          Name: result.Name,
          Hash: result.Hash,
        };

        // Vérifier l'accessibilité du CID uploadé
        onProgress?.({
          progress: 85,
          stage: "finalizing",
          message: "Vérification de l'accessibilité...",
        });

        const verification = await this.verifyCIDAccessibility(
          uploadResult.cid
        );

        if (verification.accessible) {
          console.log(
            `✅ Upload Lighthouse réussi! CID vérifié: ${uploadResult.cid}`
          );
          console.log(`🌐 Accessible via: ${verification.gateway}`);
          console.log(`📏 Taille vérifiée: ${verification.size} bytes`);
        } else {
          console.warn(
            `⚠️ Upload réussi mais CID pas encore accessible: ${uploadResult.cid}`
          );
          console.warn(
            "💡 Le fichier peut prendre quelques minutes à être propagé sur IPFS"
          );
        }
      } catch (realUploadError) {
        console.warn("❌ Échec upload Lighthouse réel:", realUploadError);

        // En cas d'échec, utiliser le mock seulement en développement
        if (this.isDevelopmentMode()) {
          console.log("🔄 Fallback vers upload simulé...");
          onProgress?.({
            progress: 60,
            stage: "uploading",
            message: "Fallback vers simulation...",
          });
          uploadResult = await this.mockUpload(
            fileName,
            encryptedData.byteLength,
            onProgress
          );
        } else {
          throw realUploadError;
        }
      }

      onProgress?.({
        progress: 100,
        stage: "complete",
        message: "Upload terminé avec succès !",
      });

      return uploadResult;
    } catch (error) {
      console.error("Erreur lors de l'upload Lighthouse:", error);
      throw new Error(
        `Échec de l'upload: ${
          error instanceof Error ? error.message : "Erreur inconnue"
        }`
      );
    }
  }

  /**
   * Teste un upload et vérifie immédiatement l'accessibilité
   */
  static async testUploadAndVerify(
    testData: ArrayBuffer,
    fileName: string
  ): Promise<{
    success: boolean;
    cid?: string;
    verified?: boolean;
    gateway?: string;
    error?: string;
  }> {
    try {
      console.log("🧪 Test d'upload Lighthouse avec vérification...");

      const result = await this.uploadEncryptedFile(testData, fileName);

      // Attendre 5 secondes pour la propagation
      console.log("⏳ Attente 5 secondes pour la propagation IPFS...");
      await new Promise((resolve) => setTimeout(resolve, 5000));

      const verification = await this.verifyCIDAccessibility(result.cid);

      return {
        success: true,
        cid: result.cid,
        verified: verification.accessible,
        gateway: verification.gateway,
        error: verification.error,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Erreur inconnue",
      };
    }
  }

  /**
   * Mock pour les tests en développement
   */
  private static async mockUpload(
    fileName: string,
    size: number,
    onProgress?: (progress: UploadProgress) => void
  ): Promise<LighthouseUploadResult> {
    // Simuler un upload avec progression
    const stages = [
      { progress: 20, stage: "preparing" as const, message: "Préparation..." },
      {
        progress: 50,
        stage: "uploading" as const,
        message: "Upload simulé...",
      },
      { progress: 80, stage: "uploading" as const, message: "Finalisation..." },
      {
        progress: 100,
        stage: "complete" as const,
        message: "Terminé (mode test)",
      },
    ];

    for (const stage of stages) {
      onProgress?.(stage);
      await new Promise((resolve) => setTimeout(resolve, 500));
    }

    // Générer un CID factice mais réaliste
    const mockCid = `bafy${Math.random()
      .toString(36)
      .substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;

    return {
      cid: mockCid,
      size,
      Name: `encrypted_${fileName}`,
      Hash: mockCid,
    };
  }

  /**
   * Télécharge un fichier depuis Lighthouse/IPFS
   */
  static async downloadFile(cid: string): Promise<ArrayBuffer> {
    try {
      const response = await fetch(
        `https://gateway.lighthouse.storage/ipfs/${cid}`
      );

      if (!response.ok) {
        throw new Error(`Erreur de téléchargement: ${response.status}`);
      }

      return await response.arrayBuffer();
    } catch (error) {
      console.error("Erreur lors du téléchargement:", error);
      throw error;
    }
  }

  /**
   * Vérifie si un CID est valide
   */
  static isValidCID(cid: string): boolean {
    // Vérification basique d'un CID IPFS
    return /^(Qm[1-9A-HJ-NP-Za-km-z]{44,}|bafy[a-z2-7]{53,})$/.test(cid);
  }

  /**
   * Obtient les informations d'un fichier sur IPFS
   */
  static async getFileInfo(
    cid: string
  ): Promise<{ size: number; type: string }> {
    try {
      const response = await fetch(
        `https://gateway.lighthouse.storage/ipfs/${cid}`,
        {
          method: "HEAD",
        }
      );

      return {
        size: parseInt(response.headers.get("content-length") || "0"),
        type:
          response.headers.get("content-type") || "application/octet-stream",
      };
    } catch (error) {
      throw new Error("Impossible d'obtenir les informations du fichier");
    }
  }
}
