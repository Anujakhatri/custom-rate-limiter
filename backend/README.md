# 🛡️ URL Shortener Backend API

A high-performance, modular REST API built with **Node.js** and **Express**. This backend serves as the core engine for our URL shortening service, handling URL persistence, advanced redirection logic, and custom-engineered rate limiting.

> **Backend Core:** Secure URL transformation, real-time click tracking, in-memory rate limiting, and time-series data aggregation.

---

## ✨ Key Features

- **🛡️ Custom Rate Limiter:** An in-memory sliding window implementation to prevent API abuse.
- **🚀 Ultra-Fast Redirection:** High-speed URL resolution using indexed SQLite lookups.
- **📊 Real-time Analytics:** Aggregates raw click logs into daily trends for frontend consumption.
- **🔗 Base62 Encoding:** Generates collision-resistant, short-form aliases.
- **📂 Clean Architecture:** Strict separation of concerns (Models, Services, Controllers, Middleware).

---

## 🛠 Tech Stack

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)
![SQLite](https://img.shields.io/badge/SQLite-07405E?style=for-the-badge&logo=sqlite&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)

---

## 🧠 Core Concept: Sliding Window Rate Limiting

The backend uses a **Sliding Window Log** algorithm to protect the `/api/shorten` endpoint without the overhead of external databases like Redis.

### How it works:
1.  **Request Tracking:** Every incoming request is identified by the user's IP.
2.  **In-Memory Storage:** We maintain a `Map` where the key is the IP and the value is an array of request timestamps.
3.  **Dynamic Pruning:** For every new request, we filter (prune) timestamps older than the configured window (e.g., 60 seconds).
4.  **Threshold Enforcement:** If the count of valid timestamps exceeds the limit (e.g., 5 requests), we reject the request with a `429 Too Many Requests` status and calculate the exact `retryAfter` time.

---

## 🏗️ Backend core logic

### 1. In-Memory Protection (Middleware)
We use custom middleware to intercept requests before they hit the business logic. This ensures that malicious or excessive traffic is killed at the entry point.
*   **Example:**
    ```javascript
    let requests = rateLimitData.get(userIP);
    requests = requests.filter(timestamp => now - timestamp < windowMs);
    if (requests.length >= maxRequests) return res.status(429).json({ retryAfter });
    ```
*   **Why?** This keeps the database safe from spam and ensures resources are available for legitimate users.

### 2. Relational Analytics (Data Layer)
Instead of just incrementing a simple counter, we log every unique click. This allows us to provide deep insights over time.
*   **Example (Database Schema):**
    ```sql
    CREATE TABLE clicks (
      id INTEGER PRIMARY KEY,
      url_alias TEXT,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (url_alias) REFERENCES urls(alias) ON DELETE CASCADE
    );
    ```
*   **How it works:** This relational mapping ensures that if a URL is deleted, its entire click history is automatically cleaned up (Referential Integrity).

### 3. Data Aggregation (SQL Grouping)
The backend does the "heavy lifting" so the frontend doesn't have to. We aggregate thousands of click logs into a simple trend array.
*   **Example (Query Logic):**
    ```sql
    SELECT date(timestamp) as click_date, COUNT(*) as click_count
    FROM clicks
    WHERE url_id = ? 
    GROUP BY date(timestamp) -- Reduces raw logs to a daily count
    ```
*   **Result:** A lightweight JSON response that the frontend can instantly map to a chart.

---

## 🚀 API Architecture & Routes

| Endpoints | Method | Expected Status | Description |
| :--- | :---: | :---: | :--- |
| `/api/shorten` | `POST` | `201` / `429` | Creates short URL (Protected by Rate Limiter) |
| `/api/urls` | `GET` | `200` | Returns all links with aggregate click counts |
| `/api/analytics/:alias` | `GET` | `200` / `404` | Returns daily click trends for a specific link |
| `/:alias` | `GET` | `302` / `404` | Redirects to original URL and logs the arrival |

---

## 📂 Folder Structure

```text
backend/
 ├── config/            # DB initialization & setup
 ├── middleware/        # Security Layer (Rate Limiter, Error Handling)
 ├── models/            # Data Layer (SQL queries & model logic)
 ├── routes/            # Express Route definitions
 ├── services/          # Business Logic (Base62 conversion)
 ├── utils/             # Helper functions & constants
 └── server.js          # main entry point
```

---

## ⚙️ Quick Start

### 1. Installation
Navigate to the backend directory and install dependencies:
```bash
cd backend
npm install
```

### 2. Configure Environment
Create a `.env` file or use the defaults:
```env
PORT=3000
RATE_LIMIT=5        # Max requests per window
RATE_WINDOW=60      # Window size in seconds
```

### 3. Launch Server
```bash
npm run dev
```
API is live at: `http://localhost:3000`

---

## 🔐 Security & Performance
- **SQL Injection Prevention:** All queries use parameterized inputs via `sqlite3`.
- **Base62 Collisions:** We check for existing aliases before generating new ones to ensure 100% uniqueness.
- **Index Optimization:** Database tables are indexed on the `alias` column for sub-millisecond lookups.
