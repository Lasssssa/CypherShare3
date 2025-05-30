"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Globe, ArrowLeft, CheckCircle, Zap } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function ConnectPage() {
  const [isConnecting, setIsConnecting] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  const [worldId, setWorldId] = useState("")
  const [walletAddress, setWalletAddress] = useState("")
  const router = useRouter()

  const connectWorldId = async () => {
    setIsConnecting(true)

    // Simulate World ID connection with MiniKit
    setTimeout(() => {
      const mockWorldId = "world_id_0x742d35Cc6634C0532925a3b8D4C9db96590c4C5d"
      const mockWallet = "0x742d35Cc6634C0532925a3b8D4C9db96590c4C5d"
      setWorldId(mockWorldId)
      setWalletAddress(mockWallet)
      setIsConnected(true)
      setIsConnecting(false)
      localStorage.setItem("worldid-connected", "true")
      localStorage.setItem("world-id", mockWorldId)
      localStorage.setItem("wallet-address", mockWallet)

      // Redirect to dashboard after 2 seconds
      setTimeout(() => {
        router.push("/dashboard")
      }, 2000)
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Back Button */}
        <Link
          href="/"
          className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>

        {/* Logo */}
        <div className="text-center">
          <div className="w-16 h-16 accent-purple rounded-2xl mx-auto flex items-center justify-center mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">CypherShare</h1>
        </div>

        {/* Connection Card */}
        <Card className="glass">
          <CardHeader className="text-center">
            <CardTitle className="text-foreground">
              {isConnected ? "World ID Connected!" : "Connect with World ID"}
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              {isConnected
                ? "You will be redirected to the dashboard shortly."
                : "Verify your unique identity with World ID to start sharing files securely."}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {!isConnected ? (
              <Button
                onClick={connectWorldId}
                disabled={isConnecting}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-12 font-semibold"
              >
                {isConnecting ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin"></div>
                    <span>Connecting...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Globe className="w-5 h-5" />
                    <span>Connect World ID</span>
                  </div>
                )}
              </Button>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-center space-x-2 text-green-400">
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-semibold">Connected Successfully</span>
                </div>
                <div className="space-y-3">
                  <div className="bg-muted/50 rounded-lg p-3 border border-border">
                    <p className="text-xs text-muted-foreground mb-1">World ID:</p>
                    <p className="text-foreground font-mono text-sm break-all">{worldId}</p>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-3 border border-border">
                    <p className="text-xs text-muted-foreground mb-1">World Chain Wallet:</p>
                    <p className="text-foreground font-mono text-sm break-all">{walletAddress}</p>
                  </div>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-2 h-2 bg-violet-400 rounded-full animate-pulse"></div>
                  <span className="text-muted-foreground text-sm">Redirecting to dashboard...</span>
                </div>
              </div>
            )}

            {!isConnected && (
              <div className="text-center space-y-2">
                <p className="text-xs text-muted-foreground">
                  Don't have World App?{" "}
                  <a
                    href="https://worldcoin.org/world-app"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-violet-400 hover:text-violet-300"
                  >
                    Download it here
                  </a>
                </p>
                <p className="text-xs text-muted-foreground">
                  Your World ID ensures unique, verified identity for secure file sharing.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Features */}
        <div className="grid grid-cols-1 gap-3">
          <Card className="glass">
            <CardContent className="pt-4">
              <div className="flex items-start space-x-3">
                <Shield className="w-5 h-5 text-violet-400 mt-0.5" />
                <div>
                  <h3 className="text-foreground font-semibold text-sm">End-to-End Encrypted</h3>
                  <p className="text-muted-foreground text-xs mt-1">
                    Files are encrypted locally before upload. Only verified recipients can decrypt.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="glass">
            <CardContent className="pt-4">
              <div className="flex items-start space-x-3">
                <Zap className="w-5 h-5 text-green-400 mt-0.5" />
                <div>
                  <h3 className="text-foreground font-semibold text-sm">Decentralized Storage</h3>
                  <p className="text-muted-foreground text-xs mt-1">
                    Files stored on Filecoin network for maximum availability and censorship resistance.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
