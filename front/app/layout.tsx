import type React from "react"
import type {Metadata} from "next"
import {Inter} from "next/font/google"
import "./globals.css"
import {Toaster} from "@/components/ui/toaster"
import {MiniKitProvider} from "@worldcoin/minikit-js/minikit-provider"
import { useEffect } from "react"

const inter = Inter({subsets: ["latin"]})

export const metadata: Metadata = {
  title: "CypherShare - Secure File Sharing with World ID",
  description: "Share encrypted files securely with verified World ID users via Filecoin and World Chain",
  generator: 'v0.dev'
}

// Client component to handle World ID connection status
function WorldIdStatus() {
  useEffect(() => {
    // Check World ID connection status on mount
    const isConnected = localStorage.getItem("worldid-connected") === "true"
    const worldId = localStorage.getItem("world-id")
    
    console.log("World ID Connection Status:", {
      isConnected,
      worldId: worldId || "Not connected",
      timestamp: new Date().toISOString()
    })
  }, [])

  return null
}

export default function RootLayout({
                                     children,
                                   }: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
    <MiniKitProvider>
        <body className={inter.className}>
          <WorldIdStatus />
          {children}
          <Toaster/>
        </body>
    </MiniKitProvider>
    </html>
  )
}
