"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, MessageSquare, Calendar, Shield, Database, Key } from "lucide-react"

const features = [
  {
    icon: <FileText className="h-10 w-10 text-cyan-400" />,
    title: "Secure Medical Records",
    description: "Store and manage your medical documents with IPFS decentralized storage and blockchain verification.",
  },
  {
    icon: <Key className="h-10 w-10 text-purple-400" />,
    title: "Access Control",
    description:
      "Grant and revoke access to your medical data with granular permission settings for healthcare providers.",
  },
  {
    icon: <Shield className="h-10 w-10 text-cyan-400" />,
    title: "Document Certification",
    description: "Create and verify medical certificates with blockchain-based cryptographic proofs.",
  },
]

export function Features() {
  return (
    <section className="py-20">
      <div className="text-center mb-16">
        <motion.h2
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-3xl font-bold mb-4"
        >
          Key Features
        </motion.h2>
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          viewport={{ once: true }}
          className="text-xl text-muted-foreground max-w-2xl mx-auto"
        >
          MedLedger combines blockchain security with user-friendly interfaces for complete medical record management.
        </motion.p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
          >
            <Card className="h-full border border-primary/10 bg-background/60 backdrop-blur-sm hover:border-primary/30 transition-all duration-300">
              <CardHeader>
                <div className="mb-4">{feature.icon}</div>
                <CardTitle>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">{feature.description}</CardDescription>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

