# ⭐️Custom Rate-Limited URL Shortener

A high-performance, full-stack URL shortening application to handle scalable link generation, secure redirection, and real-time click tracking. 

Built with a focus on robust architecture and strict API security, this application actively mitigates DoS vulnerabilities through a **custom-built, in-memory rate-limiting engine**.

---

## 🛠 Tech Stack

### Frontend
![React](https://img.shields.io/badge/React-20232a?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)
![Chart.js](https://img.shields.io/badge/chart.js-F5788D.svg?style=for-the-badge&logo=chart.js&logoColor=white)
![Lucide](https://img.shields.io/badge/Lucide-React-FDE047?style=for-the-badge&logo=lucide&logoColor=black)

### Backend
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)
![SQLite](https://img.shields.io/badge/SQLite-07405E?style=for-the-badge&logo=sqlite&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

### Logic & DevOps
![Sliding Window](https://img.shields.io/badge/Algorithm-Sliding_Window-blue?style=for-the-badge)
![Base62](https://img.shields.io/badge/Encoding-Base62-orange?style=for-the-badge)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)

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
