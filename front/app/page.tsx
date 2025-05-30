"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { WalletConnect } from "@/components/wallet-connect"
import { HeroSection } from "@/components/hero-section"
import { Features } from "@/components/features"
import { ThemeToggle } from "@/components/theme-toggle"
import { useRouter } from "next/navigation"

export default function Home() {
  const [mounted, setMounted] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-background to-background/90 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[30%] -left-[10%] w-[70%] h-[70%] rounded-full bg-purple-500/10 blur-[120px]" />
        <div className="absolute -bottom-[30%] -right-[10%] w-[70%] h-[70%] rounded-full bg-cyan-500/10 blur-[120px]" />
        <div className="absolute top-[20%] right-[5%] w-[40%] h-[40%] rounded-full bg-indigo-500/10 blur-[100px]" />
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        <header className="flex justify-between items-center py-6">
          <div className="flex items-center gap-2">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-400 to-purple-600 flex items-center justify-center"
            >
              <span className="text-white font-bold text-xl">M</span>
            </motion.div>
            <motion.h1
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-600"
            >
              MedLedger
            </motion.h1>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <WalletConnect />
          </div>
        </header>

        <HeroSection />

        <Tabs defaultValue="patient" className="mt-20">
          <div className="flex justify-center mb-8">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="patient">For Patients</TabsTrigger>
              <TabsTrigger value="doctor">For Doctors</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="patient" className="space-y-8">
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5 }}>
              <Card className="border border-purple-500/20 bg-background/60 backdrop-blur-lg">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-4">Patient Dashboard</h3>
                  <p className="text-muted-foreground mb-6">
                    Securely manage your medical records, control access permissions, and share documents with
                    healthcare providers.
                  </p>
                  <div className="flex justify-center">
                    <Button
                      className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white"
                      onClick={() => router.push("/dashboard/patient")}
                    >
                      Explore Patient Features
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="doctor" className="space-y-8">
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5 }}>
              <Card className="border border-cyan-500/20 bg-background/60 backdrop-blur-lg">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-4">Doctor Dashboard</h3>
                  <p className="text-muted-foreground mb-6">
                    Access patient records with permission, certify documents on the blockchain, and manage appointments
                    securely.
                  </p>
                  <div className="flex justify-center">
                    <Button
                      className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white"
                      onClick={() => router.push("/dashboard/doctor")}
                    >
                      Explore Doctor Features
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
        </Tabs>

        <Features />
      </div>
    </main>
  )
}

