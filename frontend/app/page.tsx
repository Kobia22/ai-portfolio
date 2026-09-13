"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Bot, Send, User, Mic, Square, Loader2, Code, Database, ShieldCheck, Terminal, Mail, FileText } from "lucide-react"

// Clean, Official Brand SVGs
const GithubIcon = ({ className }: { className?: string }) => (
  <svg role="img" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
  </svg>
)

const LinkedinIcon = ({ className }: { className?: string }) => (
  <svg role="img" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
)

// Multi-Layer Fibonacci Background
const FibonacciGraphic = () => (
  <div className="absolute inset-0 z-0 flex items-center justify-center overflow-hidden pointer-events-none">
    <motion.div 
      className="absolute opacity-[0.08] dark:opacity-[0.04] text-blue-600 dark:text-blue-400"
      initial={{ rotate: 0, scale: 0.8 }}
      animate={{ rotate: 360, scale: [0.8, 1.1, 0.8] }}
      transition={{ duration: 180, repeat: Infinity, ease: "linear" }}
    >
      <svg viewBox="-200 -200 1400 1400" className="w-[180vw] h-[180vw] max-w-[1400px] max-h-[1400px]">
        <motion.path
          d="M 500 500 a 10 10 0 0 1 10 -10 a 10 10 0 0 1 10 10 a 20 20 0 0 1 -20 20 a 30 30 0 0 1 -30 -30 a 50 50 0 0 1 50 -50 a 80 80 0 0 1 80 80 a 130 130 0 0 1 -130 130 a 210 210 0 0 1 -210 -210 a 340 340 0 0 1 340 -340 a 550 550 0 0 1 550 550"
          fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={{ duration: 15, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
        />
      </svg>
    </motion.div>
    
    <motion.div 
      className="absolute opacity-[0.12] dark:opacity-[0.06] text-blue-500 dark:text-blue-500"
      initial={{ rotate: 360, scale: 1 }}
      animate={{ rotate: 0, scale: [1, 1.2, 1] }}
      transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
    >
      <svg viewBox="-200 -200 1400 1400" className="w-[120vw] h-[120vw] max-w-[1000px] max-h-[1000px]">
        <motion.path
          d="M 500 500 a 10 10 0 0 1 10 -10 a 10 10 0 0 1 10 10 a 20 20 0 0 1 -20 20 a 30 30 0 0 1 -30 -30 a 50 50 0 0 1 50 -50 a 80 80 0 0 1 80 80 a 130 130 0 0 1 -130 130 a 210 210 0 0 1 -210 -210 a 340 340 0 0 1 340 -340 a 550 550 0 0 1 550 550"
          fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"
          initial={{ pathLength: 1 }} animate={{ pathLength: 0 }}
          transition={{ duration: 20, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
        />
      </svg>
    </motion.div>

    <motion.div 
      className="absolute opacity-[0.18] dark:opacity-[0.1] text-blue-400 dark:text-blue-300"
      initial={{ rotate: 0 }}
      animate={{ rotate: 360 }}
      transition={{ duration: 90, repeat: Infinity, ease: "linear" }}
    >
      <svg viewBox="-200 -200 1400 1400" className="w-[80vw] h-[80vw] max-w-[600px] max-h-[600px]">
        <motion.path
          d="M 500 500 a 10 10 0 0 1 10 -10 a 10 10 0 0 1 10 10 a 20 20 0 0 1 -20 20 a 30 30 0 0 1 -30 -30 a 50 50 0 0 1 50 -50 a 80 80 0 0 1 80 80 a 130 130 0 0 1 -130 130 a 210 210 0 0 1 -210 -210 a 340 340 0 0 1 340 -340 a 550 550 0 0 1 550 550"
          fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={{ duration: 8, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
        />
      </svg>
    </motion.div>
  </div>
)

export default function PortfolioHome() {
  const router = useRouter()
  const [input, setInput] = useState("")
  const [isRecording, setIsRecording] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [messages, setMessages] = useState([
    { role: "ai", content: "I am Eli's interactive AI agent. Ask me about his backend engineering experience, or request his CV, email, GitHub, and LinkedIn—I will generate the direct access icons for you right here." }
  ])
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])

  // Dynamic API URL for production and local development
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

  const playAudio = (base64String: string) => {
    if (!base64String) return;
    const audio = new Audio(`data:audio/mp3;base64,${base64String}`);
    audio.play();
  };

  const renderMessage = (content: string) => {
    const parts = content.split(/(\[.*?\]\(.*?\))/g);
    return parts.map((part, i) => {
      const match = part.match(/\[(.*?)\]\((.*?)\)/);
      if (match) {
        const text = match[1];
        const url = match[2];
        const isPdf = url.endsWith('.pdf');
        
        let IconComponent = null;
        if (text.toLowerCase().includes('github') || url.includes('github')) IconComponent = GithubIcon;
        else if (text.toLowerCase().includes('linkedin') || url.includes('linkedin')) IconComponent = LinkedinIcon;
        else if (text.toLowerCase().includes('cv') || text.toLowerCase().includes('resume') || isPdf) IconComponent = FileText;
        else if (text.toLowerCase().includes('email') || url.includes('mailto')) IconComponent = Mail;

        return (
          <a 
            key={i} 
            href={url} 
            target={isPdf ? "_self" : "_blank"} 
            rel="noopener noreferrer" 
            download={isPdf}
            className="inline-flex items-center gap-2 px-3 py-1.5 mx-1 mt-2 text-sm font-semibold bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 rounded-md hover:bg-blue-200 dark:hover:bg-blue-800/60 transition-colors border border-blue-200 dark:border-blue-700 shadow-sm align-middle"
          >
            {IconComponent && <IconComponent className="w-4 h-4" />}
            {text}
          </a>
        );
      }
      return <span key={i}>{part}</span>;
    });
  };

  const handleSendText = async () => {
    if (!input.trim()) return
    const userText = input
    setInput("") 
    
    if (userText.trim() === "/sudo telemetry") {
      router.push('/dashboard')
      return
    }

    setMessages((prev) => [...prev, { role: "user", content: userText }])
    setIsProcessing(true)

    try {
      const response = await fetch(`${apiUrl}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userText }),
      })
      const data = await response.json()
      setMessages((prev) => [...prev, { role: "ai", content: data.reply }])
      if (data.audio_base64) playAudio(data.audio_base64)
    } catch (error) {
      setMessages((prev) => [...prev, { role: "ai", content: "Error: Could not reach the backend." }])
    } finally {
      setIsProcessing(false)
    }
  }

  const handleRecordToggle = async () => {
    if (isRecording) {
      mediaRecorderRef.current?.stop()
      setIsRecording(false)
      setIsProcessing(true)
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
        const mediaRecorder = new MediaRecorder(stream)
        mediaRecorderRef.current = mediaRecorder
        audioChunksRef.current = []

        mediaRecorder.ondataavailable = (e) => {
          if (e.data.size > 0) audioChunksRef.current.push(e.data)
        }

        mediaRecorder.onstop = async () => {
          const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" })
          const formData = new FormData()
          formData.append("audio", audioBlob, "audio.webm")

          try {
            const response = await fetch(`${apiUrl}/api/voice`, {
              method: "POST",
              body: formData,
            })
            const data = await response.json()
            
            if (data.user_text && data.user_text.toLowerCase().includes("sudo telemetry")) {
              router.push('/dashboard')
              return
            }

            if (data.user_text) setMessages((prev) => [...prev, { role: "user", content: data.user_text }])
            setMessages((prev) => [...prev, { role: "ai", content: data.reply }])
            if (data.audio_base64) playAudio(data.audio_base64)
          } catch (error) {
            setMessages((prev) => [...prev, { role: "ai", content: "Error processing voice." }])
          } finally {
            setIsProcessing(false)
            stream.getTracks().forEach(track => track.stop())
          }
        }
        mediaRecorder.start()
        setIsRecording(true)
      } catch (err) {
        console.error("Microphone access denied", err)
        alert("Please allow microphone access to use Voice AI.")
      }
    }
  }

  return (
    <main className="relative flex min-h-screen flex-col items-center p-8 bg-slate-50 dark:bg-slate-950 overflow-hidden">
      <div className="absolute inset-0 z-0 h-full w-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      <FibonacciGraphic />

      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 max-w-4xl w-full mb-12 text-center mt-12"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 rounded-full bg-slate-200/50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-300 text-xs font-medium backdrop-blur-md border border-slate-300 dark:border-slate-700">
          <Terminal className="w-4 h-4" /> Available for Backend Roles
        </div>
        <h1 className="text-5xl font-extrabold tracking-tighter lg:text-7xl mb-4 bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-500 dark:from-slate-100 dark:to-slate-400">
          Eli Wahome Kobia
        </h1>
        <p className="text-xl text-slate-600 dark:text-slate-400 font-light mb-8 tracking-wide">
          Software Engineer | Backend & Computational Logic
        </p>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="relative z-10 w-full max-w-3xl mb-16"
      >
        <Card className="border-2 shadow-xl shadow-blue-900/5 dark:shadow-blue-900/20 backdrop-blur-md bg-white/80 dark:bg-slate-950/80">
          <CardHeader className="bg-slate-100/30 dark:bg-slate-900/30 border-b">
            <CardTitle className="flex items-center gap-2">
              <Bot className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              Interactive AI Agent
            </CardTitle>
            <CardDescription>Ask about my engineering background, or request my CV, GitHub, LinkedIn, and Email to generate direct access links.</CardDescription>
          </CardHeader>
          
          <CardContent className="p-0">
            <ScrollArea className="h-[350px] p-4">
              <div className="flex flex-col gap-4">
                {messages.map((msg, index) => (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    key={index} 
                    className={`flex gap-3 text-sm ${msg.role === "user" ? "flex-row-reverse" : ""}`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm ${msg.role === "user" ? "bg-slate-200 dark:bg-slate-800" : "bg-blue-100 dark:bg-blue-900/50"}`}>
                      {msg.role === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4 text-blue-600 dark:text-blue-400" />}
                    </div>
                    <div className={`p-3 rounded-lg shadow-sm ${msg.role === "user" ? "bg-slate-900 text-slate-50 dark:bg-slate-100 dark:text-slate-900 rounded-tr-none" : "bg-white dark:bg-slate-900 border rounded-tl-none leading-relaxed"}`}>
                      {msg.role === "ai" ? renderMessage(msg.content) : msg.content}
                    </div>
                  </motion.div>
                ))}
                
                {isProcessing && (
                  <div className="flex gap-3 text-sm">
                    <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center shrink-0">
                      <Loader2 className="w-4 h-4 text-blue-600 dark:text-blue-400 animate-spin" />
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            <div className="p-4 border-t bg-slate-50/50 dark:bg-slate-950/50 flex gap-2">
              <Button 
                size="icon" 
                variant={isRecording ? "destructive" : "secondary"} 
                onClick={handleRecordToggle}
                className={`shrink-0 transition-all ${isRecording ? "ring-4 ring-red-500/20 shadow-lg shadow-red-500/20" : ""}`}
              >
                {isRecording ? <Square className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </Button>
              <Input 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendText()}
                placeholder={isRecording ? "Recording... Click stop when done." : "Type a message..."} 
                className="flex-1 focus-visible:ring-blue-500 bg-white/50 dark:bg-slate-900/50"
                disabled={isRecording}
              />
              <Button size="icon" onClick={handleSendText} disabled={isRecording || !input.trim()} className="bg-blue-600 hover:bg-blue-700 text-white">
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="relative z-10 max-w-5xl w-full"
      >
        <h2 className="text-2xl font-bold tracking-tight mb-6">Engineering & Computational Logic</h2>
        
        {/* Bento Box Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:auto-rows-[280px]">
          
          <Card className="md:col-span-2 md:row-span-1 flex flex-col h-full group hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300 backdrop-blur-md bg-white/70 dark:bg-slate-950/70">
            <CardHeader>
              <div className="p-2 w-fit rounded-lg bg-blue-100 dark:bg-blue-900/30 mb-2 group-hover:scale-110 transition-transform">
                <Database className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <CardTitle className="text-xl">SmartStock</CardTitle>
              <CardDescription>Integrated Inventory & Personnel Management</CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <p className="text-sm text-muted-foreground leading-relaxed">
                Architected a unified relational database schema to synchronize inventory tracking with staff performance records, utilizing automated stock replenishment alerts.
              </p>
            </CardContent>
            <CardFooter className="flex flex-wrap gap-2 mt-auto">
              <Badge variant="secondary" className="bg-slate-100/80 dark:bg-slate-800/80">Python</Badge>
              <Badge variant="secondary" className="bg-slate-100/80 dark:bg-slate-800/80">PostgreSQL</Badge>
              <Badge variant="secondary" className="bg-slate-100/80 dark:bg-slate-800/80">SQLAlchemy</Badge>
            </CardFooter>
          </Card>

          <Card className="md:col-span-1 md:row-span-2 flex flex-col h-full group hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300 backdrop-blur-md bg-white/70 dark:bg-slate-950/70">
            <CardHeader>
              <div className="p-2 w-fit rounded-lg bg-blue-100 dark:bg-blue-900/30 mb-2 group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <CardTitle className="text-xl">Enterprise RBAC System</CardTitle>
              <CardDescription>Diamond Trust Bank (DTB)</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col justify-center">
              <p className="text-sm text-muted-foreground leading-relaxed">
                Designed secure, stateless session management using JWT and BCrypt. Built a dynamic administrative dashboard to visualize permissions and approval workflows.
              </p>
            </CardContent>
            <CardFooter className="flex flex-wrap gap-2 mt-auto">
              <Badge variant="secondary" className="bg-slate-100/80 dark:bg-slate-800/80">Java Spring Boot</Badge>
              <Badge variant="secondary" className="bg-slate-100/80 dark:bg-slate-800/80">JWT</Badge>
              <Badge variant="secondary" className="bg-slate-100/80 dark:bg-slate-800/80">React.js</Badge>
            </CardFooter>
          </Card>

          <Card className="md:col-span-2 md:row-span-1 flex flex-col h-full group hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300 backdrop-blur-md bg-white/70 dark:bg-slate-950/70">
            <CardHeader>
              <div className="p-2 w-fit rounded-lg bg-blue-100 dark:bg-blue-900/30 mb-2 group-hover:scale-110 transition-transform">
                <Code className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <CardTitle className="text-xl">Structural Automation</CardTitle>
              <CardDescription>Freelance Engineering Toolkit</CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <p className="text-sm text-muted-foreground leading-relaxed">
                Developed a high-precision Python toolkit to automate Eurocode 3 structural calculations, engineering a modular validation engine that reduced processing time by 60%.
              </p>
            </CardContent>
            <CardFooter className="flex flex-wrap gap-2 mt-auto">
              <Badge variant="secondary" className="bg-slate-100/80 dark:bg-slate-800/80">Python</Badge>
              <Badge variant="secondary" className="bg-slate-100/80 dark:bg-slate-800/80">Pandas</Badge>
              <Badge variant="secondary" className="bg-slate-100/80 dark:bg-slate-800/80">Math Modeling</Badge>
            </CardFooter>
          </Card>

        </div>
      </motion.div>
    </main>
  )
}