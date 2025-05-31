"use client"

import {useEffect, useState} from "react"
import {Button} from "@/components/ui/button"
import {Card, CardContent} from "@/components/ui/card"
import {Badge} from "@/components/ui/badge"
import {FileText, Shield, Zap, Menu, X, Globe, Wallet} from "lucide-react"
import Link from "next/link"
import {MiniKit } from '@worldcoin/minikit-js'

export default function HomePage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isVerifying, setIsVerifying] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  const [walletAddress, setWalletAddress] = useState<string | null>(null)

  // Check connection status on mount and when MiniKit becomes available
  useEffect(() => {
    const checkConnection = () => {
      // Check if we have stored connection data
      const storedAddress = localStorage.getItem('wallet-address')
      const isStoredConnected = localStorage.getItem('worldid-connected') === 'true'
      
      // If we have stored data, use that as the primary indicator
      if (isStoredConnected && storedAddress) {
        setIsConnected(true)
        setWalletAddress(storedAddress)
        return
      }

      // Fallback to MiniKit check only if we don't have stored data
      const installed = MiniKit.isInstalled()
      setIsConnected(installed)
    }

    // Initial check
    checkConnection()

    // Set up an interval to check periodically
    const interval = setInterval(checkConnection, 2000)

    return () => clearInterval(interval)
  }, [])

  const signInWithWallet = async () => {
    try {
      setIsVerifying(true)
      const res = await fetch(`/api/nonce`)
      const { nonce } = await res.json()

      const { commandPayload, finalPayload } = await MiniKit.commandsAsync.walletAuth({
        nonce,
        requestId: '0',
        expirationTime: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000),
        notBefore: new Date(new Date().getTime() - 24 * 60 * 60 * 1000),
        statement: 'Sign in with World ID',
      })

      if (finalPayload.status === 'error') {
        throw new Error('Authentication failed')
      }

      const response = await fetch('/api/complete-siwe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          payload: finalPayload,
          nonce,
        }),
      })

      const result = await response.json()
      
      if (result.status === 'success' && result.isValid) {
        // Store the wallet address and generate World ID
        const address = finalPayload.address
        setIsConnected(true)
        setWalletAddress(address)
        localStorage.setItem('wallet-address', address)
        localStorage.setItem('worldid-connected', 'true')
        alert("Successfully connected to World App!")
      } else {
        throw new Error(result.message || 'Authentication failed')
      }
    } catch (error) {
      console.error("Authentication error:", error)
      alert(error instanceof Error ? error.message : "An error occurred during authentication. Please try again.")
    } finally {
      setIsVerifying(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="relative z-50 border-b border-border bg-card/80 backdrop-blur-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 accent-purple rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-white"/>
              </div>
              <span className="text-xl font-bold text-foreground">
                  CypherShare3
                </span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              <div className="flex items-center space-x-3 bg-muted/50 rounded-lg px-4 py-2 border border-border">
                <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`}></div>
                <div>
                  <p className="text-xs text-muted-foreground">World ID</p>
                  <p className="text-foreground text-sm font-mono">
                    {isConnected 
                      ? walletAddress
                        ? `Connected - ${walletAddress.slice(0, 12)}...${walletAddress.slice(-8)}`
                        : "Connected"
                      : "Not Connected"}
                  </p>
                </div>
              </div>
              <Button 
                onClick={signInWithWallet}
                disabled={isVerifying || isConnected}
                className={`${isConnected 
                  ? 'bg-green-500 text-white hover:bg-green-600' 
                  : 'bg-primary text-primary-foreground hover:bg-primary/90'} font-semibold flex items-center gap-2`}
              >
                <Wallet className="w-4 h-4" />
                {isVerifying 
                  ? "Connecting..." 
                  : isConnected 
                    ? "Connected" 
                    : "Connect Wallet"}
              </Button>
              <Link href="/dashboard">
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold">
                  Dashboard
                </Button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button className="md:hidden text-foreground" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="w-6 h-6"/> : <Menu className="w-6 h-6"/>}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden mt-4 pb-4 border-t border-border pt-4">
              <div className="flex flex-col space-y-3">
                <div className="flex items-center space-x-2 bg-muted/50 rounded-lg px-3 py-2 border border-border">
                  <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`}></div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-muted-foreground">World ID</p>
                    <p className="text-foreground text-sm font-mono truncate">
                      {isConnected 
                        ? walletAddress
                          ? `Connected - ${walletAddress.slice(0, 12)}...${walletAddress.slice(-8)}`
                          : "Connected"
                        : "Not Connected"}
                    </p>
                  </div>
                </div>
                <Button 
                  onClick={signInWithWallet}
                  disabled={isVerifying || isConnected}
                  className={`w-full ${isConnected 
                    ? 'bg-green-500 text-white hover:bg-green-600' 
                    : 'bg-primary text-primary-foreground hover:bg-primary/90'} font-semibold flex items-center justify-center gap-2`}
                >
                  <Wallet className="w-4 h-4" />
                  {isVerifying 
                    ? "Connecting..." 
                    : isConnected 
                      ? "Connected" 
                      : "Connect Wallet"}
                </Button>
                <Link href="/dashboard">
                  <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold">
                    Dashboard
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-16 md:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <Badge className="bg-primary/10 text-primary border-primary/20">
                <Globe className="w-3 h-3 mr-1"/>
                World ID Verified Sharing
              </Badge>
              <h1 className="text-4xl md:text-6xl font-bold text-foreground leading-tight">
                Share files securely.{" "}
                <span className="bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
                    Verified.
                  </span>
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                CypherShare lets you share encrypted files with verified World ID users — instantly, privately, and
                decentralized on Filecoin.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/dashboard">
                <Button
                  size="lg"
                  className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold text-lg px-8 py-3"
                >
                  Get Started
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="text-lg px-8 py-3 font-semibold">
                Learn More
              </Button>
            </div>

            {/* Features */}
            <div className="grid sm:grid-cols-3 gap-6 pt-8">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Shield className="w-5 h-5 text-violet-400"/>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">End-to-End Encrypted</h3>
                  <p className="text-sm text-muted-foreground">AES-GCM + RSA encryption</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
                  <Globe className="w-5 h-5 text-green-400"/>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">World ID Verified</h3>
                  <p className="text-sm text-muted-foreground">Proof of unique identity</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
                  <Zap className="w-5 h-5 text-blue-400"/>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Decentralized</h3>
                  <p className="text-sm text-muted-foreground">Stored on Filecoin</p>
                </div>
              </div>
            </div>
          </div>

          {/* Illustration */}
          <div className="relative">
            <Card className="glass p-8">
              <CardContent className="space-y-6">
                <div className="text-center space-y-4">
                  <div
                    className="w-20 h-20 bg-gradient-to-r from-violet-500 to-purple-600 rounded-2xl mx-auto flex items-center justify-center">
                    <FileText className="w-10 h-10 text-white"/>
                  </div>
                  <div className="flex items-center justify-center space-x-4">
                    <div className="w-2 h-2 bg-violet-400 rounded-full animate-pulse"></div>
                    <div className="w-2 h-2 bg-violet-400 rounded-full animate-pulse delay-100"></div>
                    <div className="w-2 h-2 bg-violet-400 rounded-full animate-pulse delay-200"></div>
                  </div>
                  <div
                    className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-green-600 rounded-xl mx-auto flex items-center justify-center">
                    <Globe className="w-8 h-8 text-white"/>
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-muted-foreground text-sm">
                    Your files, encrypted and delivered securely to verified World ID users
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card/50 backdrop-blur-md mt-24">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-2">
              <div
                className="w-6 h-6 bg-gradient-to-r from-violet-500 to-purple-600 rounded-md flex items-center justify-center">
                <Shield className="w-4 h-4 text-white"/>
              </div>
              <span className="text-foreground font-semibold">CypherShare</span>
            </div>
            <p className="text-muted-foreground text-sm">
              © 2024 CypherShare. Secure file sharing with World ID verification.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
