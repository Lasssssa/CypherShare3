"use client";
import type React from "react"
import {Inter} from "next/font/google"
import "./globals.css"
import {Toaster} from "@/components/ui/toaster"
import {MiniKitProvider} from "@worldcoin/minikit-js/minikit-provider"
import { WalletProvider } from "@/contexts/WalletContext"

const inter = Inter({subsets: ["latin"]})

export default function RootLayout({
                                     children,
                                   }: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
    <MiniKitProvider>
        <WalletProvider>
            <body className={inter.className}>
              {children}
              <Toaster/>
            </body>
        </WalletProvider>
    </MiniKitProvider>
    </html>
  )
}
