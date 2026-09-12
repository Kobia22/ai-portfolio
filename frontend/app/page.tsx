"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Bot, Send, User, Mic, Square, Loader2 } from "lucide-react"

export default function PortfolioHome() {
  const [input, setInput] = useState("")
  const [isRecording, setIsRecording] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [messages, setMessages] = useState([
    { role: "ai", content: "Hi! I'm an AI assistant trained on Eli's portfolio. You can type or use the microphone to ask me about his tech stack or projects." }
  ])
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])

  // Helper to play base64 audio
  const playAudio = (base64String: string) => {
    if (!base64String) return;
    const audio = new Audio(`data:audio/mp3;base64,${base64String}`);
    audio.play();
  };

  const handleSendText = async () => {
    if (!input.trim()) return
    const userText = input
    setInput("") 
    setMessages((prev) => [...prev, { role: "user", content: userText }])
    setIsProcessing(true)

    try {
      const response = await fetch("http://localhost:8000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userText }),
      })
      const data = await response.json()
      setMessages((prev) => [...prev, { role: "ai", content: data.reply }])
      
      if (data.audio_base64) {
        playAudio(data.audio_base64)
      }
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
            const response = await fetch("http://localhost:8000/api/voice", {
              method: "POST",
              body: formData,
            })
            const data = await response.json()
            
            if (data.user_text) {
              setMessages((prev) => [...prev, { role: "user", content: data.user_text }])
            }
            setMessages((prev) => [...prev, { role: "ai", content: data.reply }])
            
            if (data.audio_base64) {
              playAudio(data.audio_base64)
            }
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
    <main className="flex min-h-screen flex-col items-center p-8 bg-slate-50 dark:bg-slate-950">
      <div className="max-w-4xl w-full mb-12 text-center mt-12">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-4">
          Eli Wahome Kobia
        </h1>
        <p className="text-xl text-muted-foreground">
          Software Engineer | Backend & Computational Logic
        </p>
      </div>

      <Card className="w-full max-w-2xl border-2 shadow-lg">
        <CardHeader className="bg-slate-100 dark:bg-slate-900 border-b">
          <CardTitle className="flex items-center gap-2">
            <Bot className="w-6 h-6" />
            Chat with my Portfolio
          </CardTitle>
          <CardDescription>Ask my AI assistant about my Spring Boot, Python, and system logic expertise.</CardDescription>
        </CardHeader>
        
        <CardContent className="p-0">
          <ScrollArea className="h-[400px] p-4">
            <div className="flex flex-col gap-4">
              {messages.map((msg, index) => (
                <div key={index} className={`flex gap-3 text-sm ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === "user" ? "bg-slate-200 dark:bg-slate-700" : "bg-blue-100 dark:bg-blue-900"}`}>
                    {msg.role === "user" ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5 text-blue-600 dark:text-blue-400" />}
                  </div>
                  <div className={`p-3 rounded-lg ${msg.role === "user" ? "bg-primary text-primary-foreground rounded-tr-none" : "bg-slate-100 dark:bg-slate-800 rounded-tl-none"}`}>
                    {msg.content}
                  </div>
                </div>
              ))}
              
              {isProcessing && (
                <div className="flex gap-3 text-sm">
                  <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center shrink-0">
                    <Loader2 className="w-5 h-5 text-blue-600 dark:text-blue-400 animate-spin" />
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          <div className="p-4 border-t bg-slate-50 dark:bg-slate-950 flex gap-2">
            <Button 
              size="icon" 
              variant={isRecording ? "destructive" : "secondary"} 
              onClick={handleRecordToggle}
              className="shrink-0"
            >
              {isRecording ? <Square className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </Button>
            
            <Input 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendText()}
              placeholder={isRecording ? "Recording... Click stop when done." : "Type a message..."} 
              className="flex-1"
              disabled={isRecording}
            />
            
            <Button size="icon" onClick={handleSendText} disabled={isRecording || !input.trim()}>
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </main>
  )
}