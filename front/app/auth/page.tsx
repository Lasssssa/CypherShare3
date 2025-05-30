"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ThemeToggle } from "@/components/theme-toggle";
import { Wallet, User, Stethoscope, Shield, Lock } from "lucide-react";
import Link from "next/link";

export default function AuthPage() {
  const [mounted, setMounted] = useState(false);
  const [userType, setUserType] = useState<"patient" | "doctor">("patient");
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleConnect = () => {
    setIsConnecting(true);

    // Simulate connection
    setTimeout(() => {
      setIsConnecting(false);
      setIsConnected(true);

      // Redirect to appropriate dashboard after a brief delay
      setTimeout(() => {
        router.push(
          userType === "patient" ? "/dashboard/patient" : "/dashboard/doctor"
        );
      }, 1000);
    }, 1500);
  };

  if (!mounted) {
    return null;
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
          <Link href="/" className="flex items-center gap-2">
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
          </Link>
          <ThemeToggle />
        </header>

        <div className="flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="max-w-md w-full space-y-8"
          >
            <div className="text-center">
              <h2 className="mt-6 text-3xl font-extrabold">
                Connect to Your Medical Records
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Secure, private, and decentralized healthcare on the blockchain
              </p>
            </div>

            <Tabs
              defaultValue="patient"
              className="w-full"
              onValueChange={(value) =>
                setUserType(value as "patient" | "doctor")
              }
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger
                  value="patient"
                  className="flex items-center gap-2"
                >
                  <User className="h-4 w-4" />
                  Patient
                </TabsTrigger>
                <TabsTrigger value="doctor" className="flex items-center gap-2">
                  <Stethoscope className="h-4 w-4" />
                  Doctor
                </TabsTrigger>
              </TabsList>

              <TabsContent value="patient" className="space-y-4 mt-6">
                <Card className="border border-purple-500/20 bg-background/60 backdrop-blur-lg">
                  <CardContent className="pt-6">
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="patient-id">Patient ID</Label>
                          <span className="text-xs text-muted-foreground">
                            Optional
                          </span>
                        </div>
                        <Input
                          id="patient-id"
                          placeholder="Enter your patient ID if you have one"
                        />
                      </div>

                      <div className="space-y-4">
                        <div className="relative">
                          <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-primary/20"></span>
                          </div>
                          <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-background px-2 text-muted-foreground">
                              Or connect with wallet
                            </span>
                          </div>
                        </div>

                        <AnimatePresence>
                          {!isConnected ? (
                            <motion.div
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              transition={{ duration: 0.3 }}
                            >
                              <Button
                                className="w-full bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white"
                                onClick={handleConnect}
                                disabled={isConnecting}
                              >
                                {isConnecting ? (
                                  <>
                                    <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin mr-2"></div>
                                    Connecting...
                                  </>
                                ) : (
                                  <>
                                    <Wallet className="mr-2 h-4 w-4" />
                                    Connect Wallet
                                  </>
                                )}
                              </Button>
                            </motion.div>
                          ) : (
                            <motion.div
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.3 }}
                              className="text-center space-y-4"
                            >
                              <div className="flex items-center justify-center gap-2 text-green-500">
                                <Shield className="h-5 w-5" />
                                <span>Wallet Connected Successfully</span>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                Redirecting to your dashboard...
                              </p>
                              <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin mx-auto"></div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      <div className="text-xs text-center text-muted-foreground">
                        <div className="flex items-center justify-center gap-1">
                          <Lock className="h-3 w-3" />
                          <span>End-to-end encrypted & HIPAA compliant</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="doctor" className="space-y-4 mt-6">
                <Card className="border border-cyan-500/20 bg-background/60 backdrop-blur-lg">
                  <CardContent className="pt-6">
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="license-id">Medical License ID</Label>
                        <Input
                          id="license-id"
                          placeholder="Enter your medical license ID"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="hospital-id">Hospital/Clinic ID</Label>
                        <Input
                          id="hospital-id"
                          placeholder="Enter your hospital or clinic ID"
                        />
                      </div>

                      <div className="space-y-4">
                        <div className="relative">
                          <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-primary/20"></span>
                          </div>
                          <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-background px-2 text-muted-foreground">
                              Or connect with wallet
                            </span>
                          </div>
                        </div>

                        <AnimatePresence>
                          {!isConnected ? (
                            <motion.div
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              transition={{ duration: 0.3 }}
                            >
                              <Button
                                className="w-full bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white"
                                onClick={handleConnect}
                                disabled={isConnecting}
                              >
                                {isConnecting ? (
                                  <>
                                    <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin mr-2"></div>
                                    Connecting...
                                  </>
                                ) : (
                                  <>
                                    <Wallet className="mr-2 h-4 w-4" />
                                    Connect Wallet
                                  </>
                                )}
                              </Button>
                            </motion.div>
                          ) : (
                            <motion.div
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.3 }}
                              className="text-center space-y-4"
                            >
                              <div className="flex items-center justify-center gap-2 text-green-500">
                                <Shield className="h-5 w-5" />
                                <span>Wallet Connected Successfully</span>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                Redirecting to your dashboard...
                              </p>
                              <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin mx-auto"></div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      <div className="text-xs text-center text-muted-foreground">
                        <div className="flex items-center justify-center gap-1">
                          <Lock className="h-3 w-3" />
                          <span>End-to-end encrypted & HIPAA compliant</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
