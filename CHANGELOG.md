# Changelog

All notable changes to this project will be documented in this file.

### Added

* **Backend (FastAPI)**
* Initialized FastAPI application (`DavosHack API`) with version `0.1.0`.


* Integrated **Volue Insight API** for real-time and historical energy market data.


* Implemented `/v1/europe/prices` endpoint to fetch hourly day-ahead prices for 14 European energy areas.


* Developed `/v1/volatility` endpoint utilizing **GARCH(1,1)** models for volatility estimation and **Median Absolute Deviation (MAD)** for price anomaly detection.


* Added a specialized `/v1/dashboard/swiss-smart` endpoint providing localized consumption advice for Switzerland based on price forecasts.




* **AI Agent Intelligence**
* Integrated `smolagents` to power the Energy Market Agent.


* Equipped the agent with custom tools: `fetch_energy_data` for Volue curve access and `WebSearchTool` for external market context.


* Implemented a stateful chat system (`/v1/chat`) with session memory management to allow context-aware follow-up questions.




* **Frontend (React + Vite)**
* Built a high-performance dashboard using **React**, **Vite**, and **Tailwind CSS**.


* Implemented the `ChatInterface` component, a floating AI assistant with support for real-time message streaming and dynamic Chart.js visualizations.


* Developed `SwissSmartDashboard`, a specialized component for visualizing Swiss price forecasts and "best time to consume" insights.


* Integrated **Chart.js** for interactive data visualizations including price trends and volatility regimes.


* Established a global `HighlightContext` for UI-wide data synchronization.




* **Infrastructure & Styling**
* Configured **PostCSS** and **Tailwind CSS** for modern, responsive styling.


* Integrated **Lucide React** for consistent iconography.


* Set up **ESLint** with TypeScript support for code quality and consistency.





### Fixed

* Resolved timezone mismatch issues when processing Volue time-series data to ensure hourly alignment with the Berlin timezone.


* Implemented a recursive `clean_for_json` utility to handle `NaN` and `Inf` float values in agent responses, ensuring JSON compatibility.


* Enhanced the frontend chart renderer with an "auto-correction" layer to handle varied data structures returned by the AI agent (e.g., mapping `x`/`y` keys to standard Chart.js datasets).



### Dependencies

* 
**Backend:** `fastapi`, `volue-insight-timeseries`, `pandas`, `arch`, `scikit-learn`, `smolagents`, `python-dotenv`.


* 
**Frontend:** `react`, `framer-motion`, `chart.js`, `react-chartjs-2`, `lucide-react`, `@tanstack/react-query`.