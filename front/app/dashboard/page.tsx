"use client";

import type React from "react";

import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Upload,
  Inbox,
  SendHorizontal,
  Zap,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useWallet } from "@/contexts/WalletContext";
import { Header } from "@/components/shared/Header";
import SentFilesTab from "@/app/dashboard/tabs/SentFilesTab";
import ReceivedFilesTab from "@/app/dashboard/tabs/ReceivedFilesTab";
import {useState} from "react";
import SendFileTab from "@/app/dashboard/tabs/SendFileTab";

export default function DashboardPage() {
  const { isConnected } = useWallet()
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("send");

  // if (!isConnected) {
  //   router.push("/");
  //   return null;
  // }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard</h1>
          <p className="text-muted-foreground">
            Send and manage your encrypted files securely with World ID
            verification
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="glass">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <SendHorizontal className="w-6 h-6 text-violet-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    5
                  </p>
                  <p className="text-muted-foreground text-sm">Files Sent</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="glass">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center">
                  <Inbox className="w-6 h-6 text-green-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    10
                  </p>
                  <p className="text-muted-foreground text-sm">
                    Files Received
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="glass">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
                  <Zap className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    30
                  </p>
                  <p className="text-muted-foreground text-sm">MB Total</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Mobile Layout */}
        <div className="md:hidden">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="space-y-4"
          >
            <TabsList className="grid w-full grid-cols-3 bg-muted border border-border p-1">
              <TabsTrigger
                value="send"
                className="data-[state=active]:bg-background data-[state=active]:text-foreground text-muted-foreground"
              >
                <SendHorizontal className="w-4 h-4" />
              </TabsTrigger>
              <TabsTrigger
                value="sent"
                className="data-[state=active]:bg-background data-[state=active]:text-foreground text-muted-foreground"
              >
                <Upload className="w-4 h-4" />
              </TabsTrigger>
              <TabsTrigger
                value="received"
                className="data-[state=active]:bg-background data-[state=active]:text-foreground text-muted-foreground"
              >
                <Inbox className="w-4 h-4" />
              </TabsTrigger>
            </TabsList>

            {/* Mobile content - optimized versions of desktop tabs */}
            <TabsContent value="send">
              <SendFileTab />
            </TabsContent>

            {/* Mobile Sent Files */}
            <TabsContent value="sent">
              <SentFilesTab />
            </TabsContent>

            {/* Mobile Received Files */}
            <TabsContent value="received">
              <ReceivedFilesTab />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
