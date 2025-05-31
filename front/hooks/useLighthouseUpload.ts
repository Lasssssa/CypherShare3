import { useState, useCallback } from "react";
import {
  LighthouseService,
  LighthouseUploadResult,
  UploadProgress,
} from "@/lib/lighthouse";
import { EncryptedFileData } from "@/lib/encryption";

export interface UploadState {
  isUploading: boolean;
  progress: number;
  stage: UploadProgress["stage"] | null;
  message: string;
  uploadResult: LighthouseUploadResult | null;
  error: string | null;
}

const initialState: UploadState = {
  isUploading: false,
  progress: 0,
  stage: null,
  message: "",
  uploadResult: null,
  error: null,
};

export function useLighthouseUpload() {
  const [uploadState, setUploadState] = useState<UploadState>(initialState);

  const uploadToLighthouse = useCallback(
    async (
      encryptedFileData: EncryptedFileData
    ): Promise<LighthouseUploadResult | null> => {
      try {
        setUploadState({
          ...initialState,
          isUploading: true,
          stage: "preparing",
          message: "Préparation de l'upload...",
        });

        const result = await LighthouseService.uploadEncryptedFile(
          encryptedFileData.encryptedFile,
          encryptedFileData.originalName,
          (progress: UploadProgress) => {
            setUploadState((prevState) => ({
              ...prevState,
              progress: progress.progress,
              stage: progress.stage,
              message: progress.message,
            }));
          }
        );

        setUploadState((prevState) => ({
          ...prevState,
          isUploading: false,
          uploadResult: result,
          stage: "complete",
          message: "Upload terminé avec succès !",
          progress: 100,
        }));

        return result;
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Erreur inconnue lors de l'upload";

        setUploadState((prevState) => ({
          ...prevState,
          isUploading: false,
          error: errorMessage,
          stage: null,
          message: "",
          progress: 0,
        }));

        console.error("Erreur upload Lighthouse:", error);
        return null;
      }
    },
    []
  );

  const resetUpload = useCallback(() => {
    setUploadState(initialState);
  }, []);

  const downloadFromLighthouse = useCallback(
    async (cid: string): Promise<ArrayBuffer | null> => {
      try {
        setUploadState((prevState) => ({
          ...prevState,
          isUploading: true,
          stage: "preparing",
          message: "Téléchargement en cours...",
          progress: 50,
        }));

        const data = await LighthouseService.downloadFile(cid);

        setUploadState((prevState) => ({
          ...prevState,
          isUploading: false,
          stage: "complete",
          message: "Téléchargement terminé",
          progress: 100,
        }));

        return data;
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Erreur lors du téléchargement";

        setUploadState((prevState) => ({
          ...prevState,
          isUploading: false,
          error: errorMessage,
          stage: null,
          message: "",
          progress: 0,
        }));

        console.error("Erreur téléchargement:", error);
        return null;
      }
    },
    []
  );

  return {
    uploadState,
    uploadToLighthouse,
    downloadFromLighthouse,
    resetUpload,
    isValidCID: LighthouseService.isValidCID,
  };
}
