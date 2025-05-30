"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowRight, Shield, Lock, FileText } from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link";

export function HeroSection() {
  const router = useRouter()

  return (
    <section className="py-20">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="space-y-6"
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600">
              Decentralized
            </span>{" "}
            Medical Records on Blockchain
          </h1>
          <p className="text-xl text-muted-foreground">
            Secure, private, and patient-controlled health records using IPFS storage and Polygon blockchain
            verification.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Button
              size="lg"
              className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white"
              onClick={() => router.push("/auth")}
            >
              Get Started
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Link href="/about">
              <Button size="lg" variant="outline" className="border-primary/20 hover:bg-primary/10">
                Learn More
              </Button>
            </Link>
          </div>
          <div className="flex flex-wrap gap-6 pt-6">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-cyan-400" />
              <span className="text-sm">HIPAA Compliant</span>
            </div>
            <div className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-purple-400" />
              <span className="text-sm">End-to-End Encrypted</span>
            </div>
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-400" />
              <span className="text-sm">Blockchain Verified</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative"
        >
          <div className="relative w-full aspect-square max-w-md mx-auto">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-purple-600/20 rounded-3xl blur-3xl" />
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-blue-500/10 to-purple-600/10 rounded-3xl backdrop-blur-xl border border-white/10" />

            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-3/4 h-3/4 rounded-2xl bg-background/80 backdrop-blur-sm border border-white/10 p-4 flex flex-col">
                <div className="h-1/2 rounded-lg bg-gradient-to-br from-cyan-500/20 to-purple-600/20 mb-3 flex items-center justify-center">
                  <FileText className="h-12 w-12 text-primary/70" />
                </div>
                <div className="space-y-2">
                  <div className="h-3 w-3/4 bg-primary/20 rounded-full" />
                  <div className="h-3 w-1/2 bg-primary/20 rounded-full" />
                  <div className="h-3 w-2/3 bg-primary/20 rounded-full" />
                </div>
                <div className="mt-auto flex justify-between">
                  <div className="h-6 w-20 bg-cyan-500/30 rounded-md" />
                  <div className="h-6 w-20 bg-purple-500/30 rounded-md" />
                </div>
              </div>
            </div>

            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-gradient-to-br from-indigo-500/30 to-purple-600/30 rounded-full blur-2xl" />
            <div className="absolute -top-6 -left-6 w-32 h-32 bg-gradient-to-br from-cyan-500/30 to-blue-600/30 rounded-full blur-2xl" />
          </div>
        </motion.div>
      </div>
    </section>
  )
}

