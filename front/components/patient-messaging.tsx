"use client"

import { useState, useRef, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Send, Paperclip, FileText, Image, Clock, CheckCircle, MessageSquare, Download } from "lucide-react"

interface Doctor {
  id: string
  name: string
  specialty: string
  hospital: string
  online: boolean
  avatar?: string
  lastSeen?: string
}

interface Message {
  id: string
  senderId: string
  receiverId: string
  text: string
  timestamp: string
  read: boolean
  attachmentType?: "document" | "image"
  attachmentUrl?: string
  attachmentName?: string
}

interface PatientMessagingProps {
  onClose: () => void
  doctors: Doctor[]
}

export function PatientMessaging({ onClose, doctors }: PatientMessagingProps) {
  const [activeDoctor, setActiveDoctor] = useState<Doctor | null>(null)
  const [messageText, setMessageText] = useState("")
  const [messages, setMessages] = useState<Message[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Sample messages for demo
  useEffect(() => {
    if (activeDoctor) {
      // Simulate loading messages for the selected doctor
      const demoMessages: Message[] = [
        {
          id: "msg1",
          senderId: "patient",
          receiverId: activeDoctor.id,
          text: "Hello Dr. " + activeDoctor.name.split(" ")[1] + ", I have a question about my recent test results.",
          timestamp: "10:30 AM",
          read: true,
        },
        {
          id: "msg2",
          senderId: activeDoctor.id,
          receiverId: "patient",
          text: "Hello! I'd be happy to help. What specific concerns do you have about your results?",
          timestamp: "10:32 AM",
          read: true,
        },
        {
          id: "msg3",
          senderId: "patient",
          receiverId: activeDoctor.id,
          text: "I noticed my cholesterol levels were slightly elevated. Should I be concerned?",
          timestamp: "10:35 AM",
          read: true,
        },
        {
          id: "msg4",
          senderId: activeDoctor.id,
          receiverId: "patient",
          text: "Based on your overall health profile, a slight elevation isn't immediately concerning. However, I'd recommend some dietary adjustments to help bring those numbers down naturally.",
          timestamp: "10:40 AM",
          read: true,
        },
        {
          id: "msg5",
          senderId: "patient",
          receiverId: activeDoctor.id,
          text: "That's a relief. Could you recommend some specific dietary changes?",
          timestamp: "10:42 AM",
          read: true,
        },
        {
          id: "msg6",
          senderId: activeDoctor.id,
          receiverId: "patient",
          text: "I've attached a nutrition guide specifically for managing cholesterol levels. Try to incorporate more omega-3 rich foods like fish, nuts, and reduce saturated fats.",
          timestamp: "10:45 AM",
          read: true,
          attachmentType: "document",
          attachmentUrl: "#",
          attachmentName: "Cholesterol_Management_Guide.pdf",
        },
      ]

      setMessages(demoMessages)
    } else {
      setMessages([])
    }
  }, [activeDoctor])

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = () => {
    if (!messageText.trim() || !activeDoctor) return

    const newMessage: Message = {
      id: `msg${messages.length + 1}`,
      senderId: "patient",
      receiverId: activeDoctor.id,
      text: messageText,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      read: false,
    }

    setMessages([...messages, newMessage])
    setMessageText("")

    // Simulate doctor response after a delay
    setTimeout(() => {
      const doctorResponse: Message = {
        id: `msg${messages.length + 2}`,
        senderId: activeDoctor.id,
        receiverId: "patient",
        text: "I've received your message. I'll review and get back to you shortly.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        read: false,
      }

      setMessages((prev) => [...prev, doctorResponse])
    }, 2000)
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl border border-primary/20 bg-background/95 backdrop-blur-xl p-0 overflow-hidden">
        <div className="flex h-[600px]">
          {/* Contacts sidebar */}
          <div className="w-1/3 border-r border-primary/10">
            <DialogHeader className="p-4 border-b border-primary/10">
              <DialogTitle>Secure Messaging</DialogTitle>
            </DialogHeader>

            <ScrollArea className="h-[calc(600px-57px)]">
              <div className="p-2">
                {doctors.map((doctor) => (
                  <motion.div
                    key={doctor.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${activeDoctor?.id === doctor.id ? "bg-primary/10" : "hover:bg-primary/5"}`}
                    onClick={() => setActiveDoctor(doctor)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <Avatar>
                          <AvatarImage src={doctor.avatar || `/placeholder.svg?height=40&width=40`} />
                          <AvatarFallback>
                            {doctor.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <span
                          className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-background ${doctor.online ? "bg-green-500" : "bg-gray-400"}`}
                        ></span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center">
                          <p className="font-medium truncate">{doctor.name}</p>
                          <span className="text-xs text-muted-foreground">2h</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <p className="text-sm text-muted-foreground truncate">{doctor.specialty}</p>
                          {!doctor.online && doctor.lastSeen && (
                            <span className="text-xs text-muted-foreground">Last seen: {doctor.lastSeen}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </ScrollArea>
          </div>

          {/* Chat area */}
          <div className="flex-1 flex flex-col">
            {activeDoctor ? (
              <>
                <div className="p-4 border-b border-primary/10 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={activeDoctor.avatar || `/placeholder.svg?height=40&width=40`} />
                      <AvatarFallback>
                        {activeDoctor.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{activeDoctor.name}</p>
                      <div className="flex items-center gap-1">
                        <span
                          className={`w-2 h-2 rounded-full ${activeDoctor.online ? "bg-green-500" : "bg-gray-400"}`}
                        ></span>
                        <p className="text-sm text-muted-foreground">{activeDoctor.online ? "Online" : "Offline"}</p>
                      </div>
                    </div>
                  </div>

                  <Tabs defaultValue="chat">
                    <TabsList className="grid w-[200px] grid-cols-2">
                      <TabsTrigger value="chat">Chat</TabsTrigger>
                      <TabsTrigger value="files">Files</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>

                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.senderId === "patient" ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[80%] rounded-lg p-3 ${
                            message.senderId === "patient"
                              ? "bg-gradient-to-r from-cyan-500/20 to-purple-600/20 ml-12"
                              : "bg-primary/10 mr-12"
                          }`}
                        >
                          <p className="text-sm">{message.text}</p>

                          {message.attachmentType && (
                            <div className="mt-2 bg-background/40 rounded p-2 flex items-center gap-2">
                              {message.attachmentType === "document" ? (
                                <FileText className="h-4 w-4 text-blue-500" />
                              ) : (
                                <Image className="h-4 w-4 text-green-500" />
                              )}
                              <span className="text-xs font-medium truncate">{message.attachmentName}</span>
                              <Button variant="ghost" size="sm" className="h-6 w-6 p-0 ml-auto">
                                <Download className="h-3 w-3" />
                              </Button>
                            </div>
                          )}

                          <div className="flex justify-end items-center gap-1 mt-1">
                            <span className="text-xs text-muted-foreground">{message.timestamp}</span>
                            {message.senderId === "patient" &&
                              (message.read ? (
                                <CheckCircle className="h-3 w-3 text-green-500" />
                              ) : (
                                <Clock className="h-3 w-3 text-muted-foreground" />
                              ))}
                          </div>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>

                <div className="p-4 border-t border-primary/10">
                  <div className="flex gap-2">
                    <Button variant="outline" size="icon" className="shrink-0 border-primary/20 hover:bg-primary/5">
                      <Paperclip className="h-4 w-4" />
                    </Button>
                    <Input
                      placeholder="Type a message..."
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault()
                          handleSendMessage()
                        }
                      }}
                      className="border-primary/20"
                    />
                    <Button
                      className="shrink-0 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white"
                      onClick={handleSendMessage}
                      disabled={!messageText.trim()}
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground text-center mt-2">
                    End-to-end encrypted • Stored on IPFS
                  </p>
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-4">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <MessageSquare className="h-8 w-8 text-primary/40" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Select a conversation</h3>
                <p className="text-muted-foreground text-center max-w-xs">
                  Choose a healthcare provider from the list to start a secure, encrypted conversation.
                </p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

