"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Activity, Clock, Zap, ArrowLeft } from "lucide-react"

const FibonacciGraphic = () => (
  <motion.div 
    className="absolute inset-0 z-0 flex items-center justify-center overflow-hidden pointer-events-none opacity-[0.15] dark:opacity-[0.07] text-blue-600 dark:text-blue-400"
    initial={{ rotate: 0 }}
    animate={{ rotate: 360 }}
    transition={{ duration: 150, repeat: Infinity, ease: "linear" }}
  >
    <motion.svg viewBox="-200 -200 1400 1400" className="w-[150vw] h-[150vw] max-w-[1200px] max-h-[1200px]">
      <motion.path
        d="M 500 500 a 10 10 0 0 1 10 -10 a 10 10 0 0 1 10 10 a 20 20 0 0 1 -20 20 a 30 30 0 0 1 -30 -30 a 50 50 0 0 1 50 -50 a 80 80 0 0 1 80 80 a 130 130 0 0 1 -130 130 a 210 210 0 0 1 -210 -210 a 340 340 0 0 1 340 -340 a 550 550 0 0 1 550 550"
        fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ duration: 10, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
      />
    </motion.svg>
  </motion.div>
)

export default function TelemetryDashboard() {
  const [metrics, setMetrics] = useState<any[]>([])
  const [avgLatency, setAvgLatency] = useState(0)

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/metrics")
        const data = await response.json()
        setMetrics(data.data)
        
        if (data.data.length > 0) {
          const totalLatency = data.data.reduce((sum: number, item: any) => sum + item.latency, 0)
          setAvgLatency(Number((totalLatency / data.data.length).toFixed(2)))
        }
      } catch (error) {
        console.error("Failed to fetch telemetry", error)
      }
    }
    fetchMetrics()
    const interval = setInterval(fetchMetrics, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <main className="relative min-h-screen bg-slate-50 dark:bg-slate-950 p-8 overflow-hidden">
      <div className="absolute inset-0 z-0 h-full w-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      <FibonacciGraphic />

      <div className="relative z-10 max-w-5xl mx-auto">
        {/* Return Button */}
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-50 mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Exit to Portfolio
        </Link>

        <h1 className="text-3xl font-bold mb-8 flex items-center gap-3 bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-500 dark:from-slate-100 dark:to-slate-400">
          <Activity className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          System Telemetry & Observability
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="backdrop-blur-md bg-white/70 dark:bg-slate-950/70 border-2 shadow-lg shadow-blue-900/5">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Tracked Requests</CardTitle>
              <Zap className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-extrabold">{metrics.length}</div>
            </CardContent>
          </Card>
          
          <Card className="backdrop-blur-md bg-white/70 dark:bg-slate-950/70 border-2 shadow-lg shadow-blue-900/5">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg API Latency</CardTitle>
              <Clock className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-extrabold">{avgLatency}s</div>
              <p className="text-xs text-muted-foreground mt-1">Groq LLM + ElevenLabs TTS</p>
            </CardContent>
          </Card>
        </div>

        <Card className="col-span-4 backdrop-blur-md bg-white/80 dark:bg-slate-950/80 border-2 shadow-xl shadow-blue-900/10">
          <CardHeader>
            <CardTitle>API Latency (Last 20 Requests)</CardTitle>
            <CardDescription>Real-time processing times for /api/chat and /api/voice endpoints</CardDescription>
          </CardHeader>
          <CardContent className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={metrics} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-800" />
                <XAxis dataKey="time" className="text-xs font-medium" />
                <YAxis unit="s" className="text-xs font-medium" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', color: '#f8fafc', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ color: '#60a5fa', fontWeight: 'bold' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="latency" 
                  stroke="#2563eb" 
                  strokeWidth={4}
                  activeDot={{ r: 8, fill: '#2563eb', stroke: '#bfdbfe', strokeWidth: 4 }} 
                  name="Processing Time"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}