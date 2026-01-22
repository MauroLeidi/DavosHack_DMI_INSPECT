# DavosHack_DMI_INSPECT
This repository contains the solution for the prestigious Hack@DAVOS (https://hackathon-davos.com) of team INSPECT.
Our solution consists in a AI-powered daily intelligence on European energy markets.  
It combines a **FastAPI backend** with an **interactive React + TypeScript frontend**, enriched by an LLM-based market agent.

---

## Features of the Solution

The system delivers **plain-English market insights** for energy traders, analysts, and researchers by combining:

- Day-ahead and forecasted electricity prices across Europe  
- Volatility and anomaly detection using statistical models (GARCH, MAD)  
- Weather, load, wind, and solar forecast context  
- An interactive chat-based **Market Intelligence Agent**  
- Rich visual dashboards (maps, charts, metrics)

---

## Architecture Overview

### Backend (FastAPI)
Located in `/backend`

Core responsibilities:
- Fetch and normalize time-series data from **Volue Insight**
- Expose REST APIs for prices, volatility, forecasts, and chat
- Run an LLM-powered agent with memory and tool usage

Key components:
- `app.py` – Main FastAPI application and API endpoints
- `agent.py` – LLM agent logic, tools, session memory

Main endpoints:
- `GET /v1/europe/prices` – Hourly day-ahead prices by country
- `GET /v1/dashboard/swiss-smart` – Smart CH price forecast (48h)
- `POST /v1/volatility` – Volatility regime & anomaly detection
- `POST /v1/chat` – Conversational market intelligence agent

Statistical methods:
- GARCH(1,1) for volatility estimation
- Median Absolute Deviation (MAD) for anomaly detection
- Min–Max normalization for multi-forecast comparison

---

### Frontend (React + TypeScript + Vite)
Located in `/energy-sensemaker`

Core features:
- Interactive **Daily Energy Market Brief**
- Europe-wide hourly price heatmap
- Volatility and driver relationship charts
- AI chat interface with inline visualizations
- Swiss “Smart Energy” advisory dashboard

Tech stack:
- React + TypeScript
- Vite
- TailwindCSS
- Chart.js & Recharts
- Leaflet (geospatial maps)
- React Query

Key UI modules:
- `EuropePriceMap` – Hourly European price heatmap
- `ChatInterface` – Floating AI market agent
- `SwissSmartDashboard` – Best-time-to-consume analysis
- `DriverChart` – Price vs residual load relationship

---

## Market Intelligence Agent

The agent is powered by an LLM and enhanced with **tool calling**:

Available tools:
- `fetch_energy_data` – Pull historical curves from Volue Insight
- `final_answer` – Return structured text + chart output
- Web search (optional)

Features:
- Conversational memory via session IDs
- Context-aware follow-up questions
- Automatic chart generation
- JSON-safe outputs for frontend rendering

---

## Environment Variables

Create a `.env` file in the project root:

```
CLIENT_ID=your_volue_client_id
CLIENT_SECRET=your_volue_client_secret
OPENAI_API_KEY=your_openai_key
```

---

## How to Run Locally

### Backend
```
cd backend
pip install -r requirements.txt
uvicorn app:app --reload --port 8000
```

Runs on: `http://localhost:8000`

### Frontend
```
cd energy-sensemaker
npm install
npm run dev
```

Runs on: `http://localhost:8080`

---

## Data Sources

- **Volue Insight** – Power, gas, wind, solar, and load forecasts
- Weather model runs (EC00 / EC06)
- Internal statistical analysis

---

## Use Cases

- Daily trader briefing in under 5 minutes
- Detect unusual price behavior early
- Understand *why* prices move, not just *that* they move
- Explore market dynamics visually and conversationally

---

## ⚠️ Disclaimer

This tool is for **informational and analytical purposes only**.  
It does **not** constitute trading advice.

---

## 📄 License

MIT License
