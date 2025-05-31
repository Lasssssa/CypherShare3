"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { MiniKit } from "@worldcoin/minikit-js";
import { useRouter } from "next/navigation";

interface WalletContextType {
  isConnected: boolean;
  walletAddress: string | null;
  worldId: string | null;
  isVerifying: boolean;
  signInWithWallet: () => Promise<void>;
  disconnect: () => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [worldId, setWorldId] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const router = useRouter();

  // Check connection status on mount and when MiniKit becomes available
  useEffect(() => {
    const checkConnection = () => {
      const storedAddress = localStorage.getItem("wallet-address");
      const storedWorldId = localStorage.getItem("world-id");
      const isStoredConnected =
        localStorage.getItem("worldid-connected") === "true";

      if (isStoredConnected && storedAddress) {
        setIsConnected(true);
        setWalletAddress(storedAddress);
        setWorldId(storedWorldId);
      }
    };

    checkConnection();
    const interval = setInterval(checkConnection, 2000);
    return () => clearInterval(interval);
  }, []);

  const signInWithWallet = async () => {
    try {
      setIsVerifying(true);
      const res = await fetch(`/api/nonce`);
      const { nonce } = await res.json();

      const { commandPayload, finalPayload } =
        await MiniKit.commandsAsync.walletAuth({
          nonce,
          requestId: "0",
          expirationTime: new Date(
            new Date().getTime() + 7 * 24 * 60 * 60 * 1000
          ),
          notBefore: new Date(new Date().getTime() - 24 * 60 * 60 * 1000),
          statement: "Sign in with World ID",
        });

      if (finalPayload.status === "error") {
        throw new Error("Authentication failed");
      }

      const response = await fetch("/api/complete-siwe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          payload: finalPayload,
          nonce,
        }),
      });

      const result = await response.json();

      if (result.status === "success" && result.isValid) {
        const address = finalPayload.address;
        setIsConnected(true);
        setWalletAddress(address);
        setWorldId(`world_id_${address}`);
        localStorage.setItem("wallet-address", address);
        localStorage.setItem("world-id", `world_id_${address}`);
        localStorage.setItem("worldid-connected", "true");
      } else {
        throw new Error(result.message || "Authentication failed");
      }
    } catch (error) {
      console.error("Authentication error:", error);
      throw error;
    } finally {
      setIsVerifying(false);
    }
  };

  const disconnect = () => {
    localStorage.removeItem("worldid-connected");
    localStorage.removeItem("world-id");
    localStorage.removeItem("wallet-address");
    setIsConnected(false);
    setWalletAddress(null);
    setWorldId(null);
    router.push("/");
  };

  return (
    <WalletContext.Provider
      value={{
        isConnected,
        walletAddress,
        worldId,
        isVerifying,
        signInWithWallet,
        disconnect,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return context;
}
