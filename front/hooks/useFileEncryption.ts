import { useState, useCallback } from "react";
import { FileEncryption, EncryptedFileData, FileUtils } from "@/lib/encryption";

export interface EncryptionState {
  isEncrypting: boolean;
  progress: number;
  error: string | null;
  encryptedData: EncryptedFileData | null;
}

export interface UseFileEncryptionReturn {
  encryptionState: EncryptionState;
  encryptFile: (file: File) => Promise<EncryptedFileData | null>;
  resetEncryption: () => void;
  isFileValid: (file: File) => { valid: boolean; error?: string };
}

export function useFileEncryption(): UseFileEncryptionReturn {
  const [encryptionState, setEncryptionState] = useState<EncryptionState>({
    isEncrypting: false,
    progress: 0,
    error: null,
    encryptedData: null,
  });

  const isFileValid = useCallback(
    (file: File): { valid: boolean; error?: string } => {
      // Vérifier la taille du fichier (max 100MB par défaut)
      if (!FileUtils.isFileSizeValid(file, 100)) {
        return {
          valid: false,
          error: "Le fichier est trop volumineux (maximum 100MB)",
        };
      }

      // Vérifier que le fichier n'est pas vide
      if (file.size === 0) {
        return {
          valid: false,
          error: "Le fichier est vide",
        };
      }

      // Types de fichiers interdits (exécutables, etc.)
      const forbiddenExtensions = [
        ".exe",
        ".bat",
        ".cmd",
        ".com",
        ".scr",
        ".vbs",
        ".js",
      ];
      const fileExtension = "." + file.name.split(".").pop()?.toLowerCase();

      if (forbiddenExtensions.includes(fileExtension)) {
        return {
          valid: false,
          error: "Type de fichier non autorisé pour des raisons de sécurité",
        };
      }

      return { valid: true };
    },
    []
  );

  const encryptFile = useCallback(
    async (file: File): Promise<EncryptedFileData | null> => {
      // Vérifier la validité du fichier
      const validation = isFileValid(file);
      if (!validation.valid) {
        setEncryptionState((prev) => ({
          ...prev,
          error: validation.error || "Fichier invalide",
        }));
        return null;
      }

      try {
        // Réinitialiser l'état
        setEncryptionState({
          isEncrypting: true,
          progress: 0,
          error: null,
          encryptedData: null,
        });

        // Simuler le progrès pour l'UX
        const progressInterval = setInterval(() => {
          setEncryptionState((prev) => ({
            ...prev,
            progress: Math.min(prev.progress + 10, 90),
          }));
        }, 100);

        // Chiffrer le fichier
        const encryptedData = await FileEncryption.encryptFile(file);

        // Finaliser le progrès
        clearInterval(progressInterval);

        setEncryptionState({
          isEncrypting: false,
          progress: 100,
          error: null,
          encryptedData,
        });

        return encryptedData;
      } catch (error) {
        console.error("Erreur lors du chiffrement:", error);

        setEncryptionState((prev) => ({
          ...prev,
          isEncrypting: false,
          error:
            error instanceof Error ? error.message : "Erreur de chiffrement",
        }));

        return null;
      }
    },
    [isFileValid]
  );

  const resetEncryption = useCallback(() => {
    setEncryptionState({
      isEncrypting: false,
      progress: 0,
      error: null,
      encryptedData: null,
    });
  }, []);

  return {
    encryptionState,
    encryptFile,
    resetEncryption,
    isFileValid,
  };
}
