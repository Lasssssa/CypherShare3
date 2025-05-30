"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { Bell, Menu } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useMobile } from "@/hooks/use-mobile"

interface DashboardHeaderProps {
  userType: "patient" | "doctor"
}

export function DashboardHeader({ userType }: DashboardHeaderProps) {
  const isMobile = useMobile()

  return (
    <header className="sticky top-0 z-40 w-full border-b border-primary/10 bg-background/80 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between py-4">
        <div className="flex items-center gap-2">
          {isMobile && (
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="mr-2">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="border-primary/10 bg-background/95 backdrop-blur-xl">
                <div className="flex flex-col gap-4 mt-8">
                  <Link href={`/dashboard/${userType}`} className="text-lg font-semibold">
                    Dashboard
                  </Link>
                  <Link href={`/dashboard/${userType}/messages`} className="text-lg font-semibold">
                    Messages
                  </Link>
                  <Link href={`/dashboard/${userType}/appointments`} className="text-lg font-semibold">
                    Appointments
                  </Link>
                  {userType === "patient" ? (
                    <Link href="/dashboard/patient/access" className="text-lg font-semibold">
                      Access Control
                    </Link>
                  ) : (
                    <Link href="/dashboard/doctor/patients" className="text-lg font-semibold">
                      Patients
                    </Link>
                  )}
                  <Link href={`/dashboard/${userType}/settings`} className="text-lg font-semibold">
                    Settings
                  </Link>
                </div>
              </SheetContent>
            </Sheet>
          )}

          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-purple-600 flex items-center justify-center"
          >
            <span className="text-white font-bold text-lg">M</span>
          </motion.div>
          <motion.h1
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-600"
          >
            MedLedger
          </motion.h1>
        </div>

        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-cyan-500 rounded-full text-[10px] text-white flex items-center justify-center">
              3
            </span>
          </Button>
          <ThemeToggle />
          <Button variant="outline" className="hidden md:flex border-primary/20 bg-primary/5 hover:bg-primary/10">
            <span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span>
            0x1a2b...3c4d
          </Button>
        </div>
      </div>
    </header>
  )
}

