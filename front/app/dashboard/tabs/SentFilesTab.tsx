"use client";

import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {FileText, Upload} from "lucide-react";
import React, {useState, useEffect} from "react";
import axios from "axios";

interface SentFile {
  fileId: string;
  owner: string;
  name: string;
  cid: string;
  uploadDate: string;
  // recipients: Array<string>;
  size?: number;
}

export default function SentFilesTab() {
  const [sentFiles, setSentFiles] = useState<SentFile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const address = process.env.NEXT_PUBLIC_WALLET_ADDRESS;

  useEffect(() => {
    const fetchSentFiles = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get( `https://a42c-195-113-187-130.ngrok-free.app/files/get-my-uploaded-files?address=${address}`, {
          method: 'GET',
          headers: {
            "ngrok-skip-browser-warning": "true",
            "Content-Type": "application/json",
          },
          // withCredentials: true, // Include cookies for authentication
        });

        const data = response.data;
        setSentFiles(data.files);
      } catch (err) {
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
          <CardTitle className="text-foreground">Sent Files</CardTitle>
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
          ) : sentFiles.length === 0 ? (
            <div className="text-center py-8">
              <Upload className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">No files sent yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {sentFiles.map((file) => (
                <div
                  key={file.fileId}
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
                          Size: {file.size ? `${(Number(file.size) / 1024).toFixed(2)} KB` : 'Unknown'}
                        </p>
                        <p className="text-muted-foreground text-xs">
                          {new Date(file.uploadDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
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
