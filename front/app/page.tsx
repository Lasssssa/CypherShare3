"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FileText, Shield, Zap, Github, Menu, X, Globe } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  const [worldId, setWorldId] = useState("")

  useEffect(() => {
    // Check if World ID is connected
    const connected = localStorage.getItem("worldid-connected") === "true"
    const worldIdValue = localStorage.getItem("world-id") || ""
    setIsConnected(connected)
    setWorldId(worldIdValue)
  }, [])

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="relative z-50 border-b border-border bg-card/80 backdrop-blur-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 accent-purple rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-foreground">CypherShare</span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              <Link href="#about" className="text-muted-foreground hover:text-foreground transition-colors">
                About
              </Link>
              <Link
                href="https://github.com"
                className="text-muted-foreground hover:text-foreground transition-colors flex items-center space-x-1"
              >
                <Github className="w-4 h-4" />
                <span>GitHub</span>
              </Link>
              {isConnected && (
                <div className="flex items-center space-x-3 bg-muted/50 rounded-lg px-4 py-2 border border-border">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <div>
                    <p className="text-xs text-muted-foreground">World ID</p>
                    <p className="text-foreground text-sm font-mono">
                      {worldId.slice(0, 12)}...{worldId.slice(-8)}
                    </p>
                  </div>
                </div>
              )}
              {isConnected ? (
                <Link href="/dashboard">
                  <Button className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold">
                    Dashboard
                  </Button>
                </Link>
              ) : (
                <Link href="/connect">
                  <Button className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold">
                    Connect World ID
                  </Button>
                </Link>
              )}
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
                <Link href="#about" className="text-muted-foreground hover:text-foreground transition-colors">
                  About
                </Link>
                <Link
                  href="https://github.com"
                  className="text-muted-foreground hover:text-foreground transition-colors flex items-center space-x-1"
                >
                  <Github className="w-4 h-4" />
                  <span>GitHub</span>
                </Link>
                {isConnected && (
                  <div className="flex items-center space-x-2 bg-muted/50 rounded-lg px-3 py-2 border border-border">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-muted-foreground">World ID</p>
                      <p className="text-foreground text-sm font-mono truncate">{worldId}</p>
                    </div>
                  </div>
                )}
                {isConnected ? (
                  <Link href="/dashboard">
                    <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold">
                      Dashboard
                    </Button>
                  </Link>
                ) : (
                  <Link href="/connect">
                    <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold">
                      Connect World ID
                    </Button>
                  </Link>
                )}
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
                <Globe className="w-3 h-3 mr-1" />
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
              <Link href={isConnected ? "/dashboard" : "/connect"}>
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
                  <Shield className="w-5 h-5 text-violet-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">End-to-End Encrypted</h3>
                  <p className="text-sm text-muted-foreground">AES-GCM + RSA encryption</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
                  <Globe className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">World ID Verified</h3>
                  <p className="text-sm text-muted-foreground">Proof of unique identity</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
                  <Zap className="w-5 h-5 text-blue-400" />
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
                  <div className="w-20 h-20 bg-gradient-to-r from-violet-500 to-purple-600 rounded-2xl mx-auto flex items-center justify-center">
                    <FileText className="w-10 h-10 text-white" />
                  </div>
                  <div className="flex items-center justify-center space-x-4">
                    <div className="w-2 h-2 bg-violet-400 rounded-full animate-pulse"></div>
                    <div className="w-2 h-2 bg-violet-400 rounded-full animate-pulse delay-100"></div>
                    <div className="w-2 h-2 bg-violet-400 rounded-full animate-pulse delay-200"></div>
                  </div>
                  <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-green-600 rounded-xl mx-auto flex items-center justify-center">
                    <Globe className="w-8 h-8 text-white" />
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
              <div className="w-6 h-6 bg-gradient-to-r from-violet-500 to-purple-600 rounded-md flex items-center justify-center">
                <Shield className="w-4 h-4 text-white" />
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
