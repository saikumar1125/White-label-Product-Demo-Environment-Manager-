# 🚀 BrandSparkX Environment Manager

> An interactive management and provisioning portal for **white-label product demonstration environments** — powered by React, Supabase, and Google Gemini AI.

---

## ✨ Features

- 🏗️ **Environment Provisioning** — Instantly create and configure white-label demo environments for clients
- 📊 **Health Metrics & Real-Time Status** — Monitor load states, health scores, and environment uptime at a glance
- 📋 **Audit Logs** — Full activity trail with `info`, `warn`, `error`, and `success` log levels per client
- 📦 **Product Distribution Analytics** — Visualize how CRM, HRMS, and ERP demos are distributed across clients
- 🔐 **User Authentication** — Secure login system backed by Supabase with Row Level Security
- 🤖 **AI-Powered Insights** — Integrated with Google Gemini API for intelligent environment recommendations
- 🎨 **Multi-Product Support** — Manage demos across data presets: Retail, Fintech, Healthcare, and Empty

---

## 🛠️ Tech Stack

| Layer       | Technology                          |
|-------------|--------------------------------------|
| Frontend    | React 19, Vite, Tailwind CSS v4      |
| Backend     | Node.js, Express                     |
| Database    | Supabase (PostgreSQL)                |
| AI          | Google Gemini API (`@google/genai`)  |
| Charts      | Recharts                             |
| Animations  | Motion (Framer Motion)               |
| Icons       | Lucide React                         |
| Deployment  | Vercel                               |

---

## 🚀 Getting Started

### Prerequisites
- Node.js >= 18
- A [Supabase](https://supabase.com) project
- A [Gemini API Key](https://aistudio.google.com/apikey)

### Installation

```bash
git clone https://github.com/saikumar1125/White-label-Product-Demo-Environment-Manager-.git
cd White-label-Product-Demo-Environment-Manager-
npm install
```

### Configuration

Copy `.env.example` to `.env` and fill in your credentials:

```bash
cp .env.example .env
```

| Variable | Description |
|---|---|
| `GEMINI_API_KEY` | Your Google Gemini API key |
| `SUPABASE_URL` | Your Supabase project URL |
| `SUPABASE_ANON_KEY` | Your Supabase anon public key |

### Database Setup

Run the SQL in [`supabase_schema.sql`](./supabase_schema.sql) in your Supabase SQL Editor to create all required tables.

### Run Locally

```bash
npm run dev
```

The app runs frontend on `http://localhost:3000` and the Express backend concurrently.

---

## 📁 Project Structure

```
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── DashboardView.jsx
│   │   ├── EnvironmentsView.jsx
│   │   ├── AnalyticsView.jsx
│   │   ├── CreateView.jsx
│   │   ├── AdminPortalView.jsx
│   │   └── ...
│   ├── App.jsx             # Main application & routing
│   ├── data.js             # Static/seed data
│   └── index.css           # Global styles
├── server/                 # Express backend (Gemini API proxy)
├── api/                    # Serverless API routes (Vercel)
├── supabase_schema.sql     # Database schema
└── vercel.json             # Vercel deployment config
```

---

## 🌐 Live Demo

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/saikumar1125/White-label-Product-Demo-Environment-Manager-)

---

## 📄 License

MIT © [saikumar1125](https://github.com/saikumar1125)
