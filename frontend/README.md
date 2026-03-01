# URL Shortener – JavaScript Frontend

A modern, responsive, and performance-driven URL shortener frontend built with **React** and **Vite**. This application focuses on a seamless user experience, intelligent state management, and real-time data visualization.

## 🌟 Overview

The frontend is built with a deep understanding of the **Request-Response cycle** and a strict **Separation of Concerns**. All business logic and data persistence are handled by the backend, while the frontend focus on:
- **Presentation Layer:** Clean, intuitive UI components.
- **State Layer:** Managing application "memory" (URL lists, countdown timers, analytics charts).
- **Communication Layer:** Robustly consuming API responses and handling diverse HTTP status codes.

---

## 🛡 Logic & Problem-Solving

Designed to handle both ideal and non-ideal conditions:
- **Intelligent Status Code Handling:** The UI parses specific backend response types:
    - **`201 Created`**: Success, update the URL list state.
    - **`429 Too Many Requests`**: Trigger the countdown cooler algorithm.
    - **`400 Bad Request`**: Deliver inline validation feedback.
- **Cooldown Logic:** If a rate limit is triggered, a recursive internal timer calculates the remaining duration and programmatically locks inputs. This ensures stable UI behavior and prevents redundant network traffic.
- **Validation:** Performs client-side URL validation before hitting the API, ensuring faster feedback and reducing server load.

---

## 📊 Data Management & Visualization

Demonstrates the ability to transform backend data into meaningful user insights:
- **Data Consumption:** The app fetches raw time-series click data from the backend and maps it directly onto the **Chart.js** interface.
- **Stateful Rendering:** When the user clicks the "Refresh" button, the app selectively re-renders only the charting component, fetching fresh analytics without any page-flicker or full reloads.
- **Dynamic Mapping:** Transforms the backend's JSON objects into a chronological format (e.g., matching the X-axis labels to dates and Y-axis to click counts).

---

## 🛠 Tech Stack

- **React:** Component-based UI logic.
- **Vite:** Next-generation frontend build tool.
- **Chart.js:** Sophisticated line-chart visualizations.
- **Fetch API:** Standardized backend communication.
- **ESLint:** Code quality & standard enforcement.

---

## 🚀 Frontend Features

### A. The Creator (URL Shortening Form)
- **Problem-Solving:** Handles asynchronous `POST` requests and implements an automatic re-activation mechanism once the 429 cooldown expires.
- **User Interface:** Simple, accessible input and immediate feedback display.

### B. Analytics Dashboard
- **Data Management:** Fetches the entire directory of shortened links from the `urls` table.
- **Visualization:** On selecting a URL, the dashboard initiates a series of `GET` requests to display a 7-day performance trend.

---

## 📂 Folder Structure

```text
src/
 ├── components/
 │    ├── UrlForm.jsx        # Business logic for shortening & rate limits
 │    ├── Dashboard.jsx      # Parent container managing the URL list state
 │    └── ChartComponent.jsx # Pure presentation component for Chart.js
 ├── App.jsx                 # Entry point & layout orchestration
 ├── App.css                 # Theme & UI styling
 ├── main.jsx                # React root
Dockerfile                   # Container configuration
index.html                   # HTML Entry template
```

---

## ⚙️ Setup Instructions

### 1. Installation
```bash
cd frontend
npm install
```

### 2. Configuration
Create a `.env` in the `frontend` folder:
```env
VITE_API_URL=http://localhost:3000
```

### 3. Execution
```bash
npm run dev
```
Dashboard available: `http://localhost:5173`
