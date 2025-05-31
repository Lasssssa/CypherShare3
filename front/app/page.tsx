"use client"

import {useEffect, useState} from "react"
import {Button} from "@/components/ui/button"
import {Card, CardContent} from "@/components/ui/card"
import {Badge} from "@/components/ui/badge"
import {FileText, Shield, Zap, Menu, X, Globe, Wallet} from "lucide-react"
import Link from "next/link"
import {MiniKit } from '@worldcoin/minikit-js'
import { useWallet } from "@/contexts/WalletContext"
import { Header } from "@/components/shared/Header"

export default function HomePage() {
  const { isConnected, walletAddress, isVerifying, signInWithWallet } = useWallet()

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
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
