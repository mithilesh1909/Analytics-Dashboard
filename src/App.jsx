import React, { useState, useEffect, useRef } from 'react'
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts'
import { Activity, Users, Zap, TrendingUp, TrendingDown, Circle } from 'lucide-react'

// --- Data generators ---
const generatePoint = (prev, min, max, volatility = 0.15) => {
  const change = (Math.random() - 0.5) * volatility * (max - min)
  return Math.max(min, Math.min(max, (prev || (min + max) / 2) + change))
}

const initialTraffic = Array.from({ length: 20 }, (_, i) => ({
  t: i, v: Math.floor(200 + Math.random() * 600)
}))
const initialRevenue = Array.from({ length: 20 }, (_, i) => ({
  t: i, v: Math.floor(4000 + Math.random() * 8000)
}))
const initialLatency = Array.from({ length: 20 }, (_, i) => ({
  t: i, v: Math.floor(20 + Math.random() * 120)
}))
const initialBarData = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map(d => ({
  day: d, req: Math.floor(3000 + Math.random() * 9000)
}))

// --- Custom tooltip ---
const CustomTooltip = ({ active, payload, prefix = '', suffix = '' }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#0d1420] border border-[#1e2d42] rounded px-3 py-2 text-xs font-mono">
        <span className="text-cyan-400">{prefix}{payload[0].value.toLocaleString()}{suffix}</span>
      </div>
    )
  }
  return null
}

// --- KPI Card ---
const KPICard = ({ icon: Icon, label, value, unit, delta, color }) => {
  const isUp = delta >= 0
  return (
    <div className="relative overflow-hidden rounded-xl border border-[#1a2640] bg-[#0d1420] p-5 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-mono text-slate-500 tracking-widest uppercase">{label}</span>
        <Icon size={14} color={color} />
      </div>
      <div className="flex items-end gap-2">
        <span className="text-3xl font-mono font-bold" style={{ color }}>{value}</span>
        <span className="text-slate-500 text-sm mb-1 font-mono">{unit}</span>
      </div>
      <div className={`flex items-center gap-1 text-xs font-mono ${isUp ? 'text-emerald-400' : 'text-red-400'}`}>
        {isUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
        <span>{isUp ? '+' : ''}{delta}% vs last hour</span>
      </div>
      <div
        className="absolute top-0 right-0 w-24 h-24 rounded-full opacity-5"
        style={{ background: color, filter: 'blur(30px)', transform: 'translate(30%, -30%)' }}
      />
    </div>
  )
}

// --- Live dot ---
const LiveDot = () => (
  <span className="flex items-center gap-1.5 text-xs font-mono text-emerald-400">
    <span className="relative flex h-2 w-2">
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
    </span>
    LIVE
  </span>
)

// --- Clock ---
const Clock = () => {
  const [time, setTime] = useState(new Date().toLocaleTimeString())
  useEffect(() => {
    const id = setInterval(() => setTime(new Date().toLocaleTimeString()), 1000)
    return () => clearInterval(id)
  }, [])
  return (
    <span className="text-xs font-mono text-slate-600 border border-[#1a2640] rounded px-2 py-1">
      {time}
    </span>
  )
}

export default function App() {
  const [traffic, setTraffic] = useState(initialTraffic)
  const [revenue, setRevenue] = useState(initialRevenue)
  const [latency, setLatency] = useState(initialLatency)
  const [barData, setBarData] = useState(initialBarData)
  const [kpis, setKpis] = useState({
    rps: 847, users: 12403, latency: 42, revenue: 18290
  })
  const [deltas] = useState({ rps: 12.4, users: 3.1, latency: -8.2, revenue: 22.7 })
  const tickRef = useRef(0)

  useEffect(() => {
    const interval = setInterval(() => {
      tickRef.current += 1

      setTraffic(prev => [
        ...prev.slice(-19),
        { t: tickRef.current, v: Math.floor(generatePoint(prev[prev.length - 1]?.v, 150, 900)) }
      ])
      setRevenue(prev => [
        ...prev.slice(-19),
        { t: tickRef.current, v: Math.floor(generatePoint(prev[prev.length - 1]?.v, 3000, 12000)) }
      ])
      setLatency(prev => [
        ...prev.slice(-19),
        { t: tickRef.current, v: Math.floor(generatePoint(prev[prev.length - 1]?.v, 15, 140)) }
      ])
      setKpis(prev => ({
        rps: Math.floor(generatePoint(prev.rps, 400, 1200)),
        users: Math.floor(generatePoint(prev.users, 8000, 18000)),
        latency: Math.floor(generatePoint(prev.latency, 15, 140)),
        revenue: Math.floor(generatePoint(prev.revenue, 10000, 28000)),
      }))
      if (tickRef.current % 5 === 0) {
        setBarData(prev => prev.map(d => ({
          ...d, req: Math.floor(generatePoint(d.req, 2000, 12000))
        })))
      }
    }, 1200)
    return () => clearInterval(interval)
  }, [])

  const latencyColor = kpis.latency < 50 ? '#34d399' : kpis.latency < 100 ? '#fbbf24' : '#f87171'

  return (
    <div className="min-h-screen bg-[#080c14] p-6 font-sans">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-mono font-bold text-white tracking-tight">
            Live<span className="text-cyan-400">Metrics</span>
          </h1>
          <p className="text-slate-500 text-xs font-mono mt-0.5">Real-time platform analytics dashboard</p>
        </div>
        <div className="flex items-center gap-4">
          <LiveDot />
          <Clock />
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <KPICard icon={Activity}    label="Req / sec"    value={kpis.rps.toLocaleString()}                    unit="rps" delta={deltas.rps}     color="#22d3ee" />
        <KPICard icon={Users}       label="Active Users" value={kpis.users.toLocaleString()}                  unit="usr" delta={deltas.users}   color="#a78bfa" />
        <KPICard icon={Zap}         label="Avg Latency"  value={kpis.latency}                                 unit="ms"  delta={deltas.latency} color={latencyColor} />
        <KPICard icon={TrendingUp}  label="Revenue"      value={`$${(kpis.revenue / 1000).toFixed(1)}k`}     unit="/hr" delta={deltas.revenue}  color="#34d399" />
      </div>

      {/* Charts row 1 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {/* Traffic */}
        <div className="rounded-xl border border-[#1a2640] bg-[#0d1420] p-5">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-mono text-slate-400 tracking-widest uppercase">Request Traffic</span>
            <LiveDot />
          </div>
          <ResponsiveContainer width="100%" height={160}>
            <AreaChart data={traffic}>
              <defs>
                <linearGradient id="tg" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#22d3ee" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#22d3ee" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1a2640" />
              <XAxis hide />
              <YAxis hide />
              <Tooltip content={<CustomTooltip suffix=" rps" />} />
              <Area type="monotone" dataKey="v" stroke="#22d3ee" strokeWidth={2} fill="url(#tg)" dot={false} isAnimationActive={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Revenue */}
        <div className="rounded-xl border border-[#1a2640] bg-[#0d1420] p-5">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-mono text-slate-400 tracking-widest uppercase">Revenue Stream</span>
            <LiveDot />
          </div>
          <ResponsiveContainer width="100%" height={160}>
            <AreaChart data={revenue}>
              <defs>
                <linearGradient id="rg" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#34d399" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#34d399" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1a2640" />
              <XAxis hide />
              <YAxis hide />
              <Tooltip content={<CustomTooltip prefix="$" />} />
              <Area type="monotone" dataKey="v" stroke="#34d399" strokeWidth={2} fill="url(#rg)" dot={false} isAnimationActive={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts row 2 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Latency */}
        <div className="rounded-xl border border-[#1a2640] bg-[#0d1420] p-5">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-mono text-slate-400 tracking-widest uppercase">API Latency</span>
            <span className="text-xs font-mono" style={{ color: latencyColor }}>
              {kpis.latency < 50 ? '● HEALTHY' : kpis.latency < 100 ? '● DEGRADED' : '● CRITICAL'}
            </span>
          </div>
          <ResponsiveContainer width="100%" height={160}>
            <LineChart data={latency}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1a2640" />
              <XAxis hide />
              <YAxis hide />
              <Tooltip content={<CustomTooltip suffix=" ms" />} />
              <Line type="monotone" dataKey="v" stroke={latencyColor} strokeWidth={2} dot={false} isAnimationActive={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Bar */}
        <div className="rounded-xl border border-[#1a2640] bg-[#0d1420] p-5">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-mono text-slate-400 tracking-widest uppercase">Weekly Requests</span>
            <Circle size={10} className="text-violet-400 fill-violet-400" />
          </div>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={barData} barSize={18}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1a2640" vertical={false} />
              <XAxis dataKey="day" tick={{ fill: '#475569', fontSize: 10, fontFamily: 'Space Mono' }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip content={<CustomTooltip suffix=" req" />} />
              <Bar dataKey="req" fill="#7c3aed" radius={[4, 4, 0, 0]} isAnimationActive={false} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-6 text-center text-xs font-mono text-slate-700">
        Built by <span className="text-slate-500">Ayodhya Mithilesh Singh</span> · Updating every 1.2s
      </div>
    </div>
  )
}
