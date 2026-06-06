# LiveMetrics — Real-Time Analytics Dashboard

A production-style real-time analytics dashboard built with React, Vite, Tailwind CSS, and Recharts. Features live-updating charts simulating WebSocket data streams.

## Features

- Real-time KPI cards (Requests/sec, Active Users, Latency, Revenue)
- Live area charts, line charts, and bar charts updating every 1.2s
- Latency health status indicator (healthy / degraded / critical)
- Dark theme with monospace aesthetic
- Live clock in the header

## Tech Stack

- React 18 + Vite
- Tailwind CSS v3
- Recharts
- Lucide React
- Space Mono (Google Fonts)

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Build for Production

```bash
npm run build
# output is in /dist
```

## Deploy to Vercel

1. Push this repo to GitHub
2. Go to [vercel.com](https://vercel.com) → New Project → Import your repo
3. Vercel auto-detects Vite — click **Deploy**

## Deploy to Netlify

1. Push this repo to GitHub
2. Go to [netlify.com](https://netlify.com) → Add new site → Import from Git
3. Set **Build command**: `npm run build`
4. Set **Publish directory**: `dist`
5. Click **Deploy**
