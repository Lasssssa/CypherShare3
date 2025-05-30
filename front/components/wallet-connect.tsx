"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Wallet, ArrowRight } from "lucide-react"

export function WalletConnect() {
  const [isConnecting, setIsConnecting] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  const [walletAddress, setWalletAddress] = useState("")

  const handleConnect = (walletType: string) => {
    setIsConnecting(true)

    // Simulate connection
    setTimeout(() => {
      setIsConnecting(false)
      setIsConnected(true)
      setWalletAddress("0x1a2b...3c4d")
    }, 1500)
  }

  if (isConnected) {
    return (
      <Button variant="outline" className="border-primary/20 bg-primary/5 hover:bg-primary/10">
        <span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span>
        {walletAddress}
      </Button>
    )
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white">
          <Wallet className="mr-2 h-4 w-4" />
          Connect Wallet
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md border border-primary/20 bg-background/95 backdrop-blur-xl">
        <DialogHeader>
          <DialogTitle>Connect your wallet</DialogTitle>
          <DialogDescription>
            Connect your Web3 wallet to access your medical records on the blockchain.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Button
            variant="outline"
            className="flex justify-between items-center h-16 border-primary/20 hover:border-primary/40 hover:bg-primary/5"
            onClick={() => handleConnect("metamask")}
            disabled={isConnecting}
          >
            <div className="flex items-center">
              <div className="w-8 h-8 mr-4 rounded bg-orange-100 flex items-center justify-center">
                <span className="text-orange-500 font-bold">M</span>
              </div>
              <span>MetaMask</span>
            </div>
            {isConnecting ? (
              <div className="w-5 h-5 rounded-full border-2 border-primary border-t-transparent animate-spin"></div>
            ) : (
              <ArrowRight className="h-4 w-4" />
            )}
          </Button>

          <Button
            variant="outline"
            className="flex justify-between items-center h-16 border-primary/20 hover:border-primary/40 hover:bg-primary/5"
            onClick={() => handleConnect("walletconnect")}
            disabled={isConnecting}
          >
            <div className="flex items-center">
              <div className="w-8 h-8 mr-4 rounded bg-blue-100 flex items-center justify-center">
                <span className="text-blue-500 font-bold">W</span>
              </div>
              <span>WalletConnect</span>
            </div>
            {isConnecting ? (
              <div className="w-5 h-5 rounded-full border-2 border-primary border-t-transparent animate-spin"></div>
            ) : (
              <ArrowRight className="h-4 w-4" />
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

