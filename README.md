# https://www.svgrepo.com/show/19461/url-link.svg Custom Rate-Limited URL Shortener

A high-performance, full-stack URL shortening application to handle scalable link generation, secure redirection, and real-time click tracking. 

Built with a focus on robust architecture and strict API security, this application actively mitigates DoS vulnerabilities through a **custom-built, in-memory rate-limiting engine**.

---

## 🛠 Tech Stack

| Component | Technologies |
| :--- | :--- |
| **Frontend** | [React 19](https://react.dev/), [Vite](https://vitejs.dev/), [Chart.js](https://www.chartjs.org/), [Lucide React](https://lucide.dev/), Vanilla CSS |
| **Backend** | [Node.js](https://nodejs.org/), [Express](https://expressjs.com/), [SQLite](https://www.sqlite.org/), [Dotenv](https://github.com/motdotla/dotenv) |
| **Logic** | Custom Sliding Window Rate Limiter, [Base62 Encoding](https://en.wikipedia.org/wiki/Base62) |
| **DevOps** | [Docker](https://www.docker.com/), [Docker Compose](https://docs.docker.com/compose/) |

---

## ⚙️ How to Run the App

You can choose either a manual setup or use Docker for a one-command deployment.

### 1. Prerequisite
Ensure you have [Node.js](https://nodejs.org/) installed.

### 2. Standard Manual Setup

**Terminal 1: Backend**
```bash
cd backend
npm install
npm run dev
```

**Terminal 2: Frontend**
```bash
cd frontend
npm install
npm run dev
```
The application will be accessible at `http://localhost:5173`.

### 3. Docker Deployment (Recommended)
To spin up the entire infrastructure concurrently:
```bash
docker-compose up --build
```

---

## 🧠 Core Logic: Rate Limiting Implementation

The system implements a **Sliding Window Log** algorithm to manage request frequency by IP address without relying on external dependencies like Redis.

### How it Works:
1. **Request Tracking:** For every incoming request, the middleware retrieves a list of previous request timestamps associated with the user's IP from an in-memory `Map`.
2. **Window Pruning:** It automatically filters out (prunes) any timestamps older than the defined window (e.g., 60 seconds).
3. **Threshold Validation:** If the remaining count of valid timestamps exceeds the allowed limit (e.g., 5 requests per minute), the request is rejected with a `429 Too Many Requests` status.
4. **Retry Calculation:** Unlike fixed-window counters, this logic calculates the exact time until the oldest request in the window expires, providing the client with a precise `retryAfter` value.
5. **Memory Efficiency:** Stale data is cleared on every request, ensuring the memory footprint remains minimal even under high traffic.

---

## 📂 Project Structure

```text
.
├── backend/            # Express API & SQLite Data Logic
│    └── middleware/    # Includes the custom rateLimiter logic
├── frontend/           # React Dashboard & Analytics Charting
├── docker-compose.yml  # Container orchestration
└── README.md           # This file
```

---

## 📊 Key Features
- **Deterministic Redirection:** Sub-millisecond URL resolution using indexed SQLite lookups.
- **Real-time Analytics:** Visualizes click trends over the last 7 days using Chart.js.
- **Self-Healing UI:** Frontend handles rate-limit cooldowns gracefully with countdown timers.
- **Production Ready:** Fully containerized with Docker for consistent environment deployment.
