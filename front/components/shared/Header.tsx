"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Shield, Menu, X, Globe, Wallet } from "lucide-react"
import Link from "next/link"
import { useWallet } from "@/contexts/WalletContext"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { isConnected, walletAddress, isVerifying, signInWithWallet } = useWallet()

  return (
    <header className="relative z-50 border-b border-border bg-card/80 backdrop-blur-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 accent-purple rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-foreground">CypherShare</span>
          </Link>

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
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
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
  )
} 