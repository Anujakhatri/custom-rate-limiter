# URL Shortener – Node.js Backend API

A high-performance, modular REST API built with **Node.js** and **Express**. This backend serves as the core engine for our URL shortening service, handling URL persistence, advanced redirection logic, and custom-engineered rate limiting.

## 🌟 Overview

The backend is designed for speed, reliability, and security. It provides a robust interface for the frontend to manage links and retrieve analytics while protecting the underlying infrastructure from abuse.

Key responsibilities include:
- **URL Transformation:** Generating secure, collision-resistant aliases.
- **Efficient Redirection:** Handling high-speed HTTP redirects with visitor logging.
- **In-Memory Rate Limiting:** Protecting endpoints without the overhead of heavy external dependencies like Redis.
- **Analytics Aggregation:** Processing raw click data into meaningful time-series results.

---

## � System Design: Core Implementations

In this project, these System Design concepts are not just abstract ideas—they are implemented in the core logic of the application. Here is exactly where they live:

### 1. Rate-Limiting Algorithms (Fixed Window)
The "Fixed Window" algorithm is implemented as custom middleware to protect the backend from over-use.
- **Location:** `backend/middleware/rateLimiter.js`
- **How it's used:**
  - **In-Memory Storage:** Uses a JavaScript `Map()` to store IP addresses as keys and arrays of timestamps as values.
  - **Window Logic:** When a request hits `/api/shorten`, the code filters the timestamp array to only keep requests from the last **60 seconds**.
  - **Enforcement:** If the array length > 5, it triggers a `429 Too Many Requests` response.
  - **Client Feedback:** It mathematically calculates `retryAfter` (the seconds remaining until the window resets), which the React frontend uses to display the countdown.

### 2. Database Schema for Analytics
The database follows a relational, time-series logging pattern specifically designed for high-performance retrieval.
- **Location:** `backend/models/db.js`
- **How it's used:**
  - **Separation of Concerns:** We don't just increment a counter on the `urls` table. Instead, we have a separate `clicks` table.
  - **Granular Logging:** Every click creates a new row with a `timestamp` and `ip_address`. This allows us to perform any type of historical analysis later.
  - **Relational Mapping:** A **Foreign Key** (`url_alias`) connects every click to its parent URL, ensuring data integrity (if a URL is deleted, its click history is safely removed via `ON DELETE CASCADE`).

### 3. Data Transformation (Transforming Raw Logs)
The "System Design" aspect of analytics also includes how we transform raw database growth into frontend-ready data.
- **Location:** `backend/models/clickModel.js`
- **The Logic:** In the `getAnalytics7Days` function, we use a specific SQL query:
  ```sql
  SELECT date(timestamp) as click_date, COUNT(*) as click_count
  FROM clicks
  WHERE url_id = ? AND timestamp >= datetime('now', '-7 days')
  GROUP BY date(timestamp)
  ```
- **Why this matters:** Instead of sending 10,000 raw click records to the browser, the backend "reduces" and "aggregates" the data into a simple 7-item array. This keeps the application fast and reduces the memory load on the user's browser.

#### **Summary of System Design Implementation**

| Concept | Implementation File | Key Mechanism |
| :--- | :--- | :--- |
| **Fixed Window** | `rateLimiter.js` | IP Tracking + Timestamp Filtering |
| **Analytics Schema** | `db.js` | Relational Clicks Table + Foreign Keys |
| **Data Aggregation** | `clickModel.js` | SQL `GROUP BY` for Time-Series Trends |

---

## 🛡 Logic & Problem-Solving (Additional Details)

- **Base62 Encoding:** Converts database IDs into 6-character short strings (e.g., `aB3kP9`). This allows for billions of unique URL permutations without collisions.
- **Separation of Concerns:** Business logic (Alias generation), Data access (Models), and Middleware (Rate Limiting) are strictly separated into distinct directories to maximize maintainability.
- **Error Management:** A centralized `errorHandler.js` normalizes all server exceptions, preventing data leaks and providing predictable API feedback.

---

## 🛠 Tech Stack

- **[Node.js](https://nodejs.org/):** Modern JavaScript runtime environment.
- **[Express](https://expressjs.com/):** Minimalist web framework for routing and middleware.
- **[SQLite](https://www.sqlite.org/):** Lightweight, serverless relational database for persistent storage.
- **[Dotenv](https://www.npmjs.com/package/dotenv):** Environment variable management for secure configurations.
- **[CORS](https://www.npmjs.com/package/cors):** Cross-Origin Resource Sharing for secure frontend-backend communication.

---

## 🚀 API Architecture & Routes

| Endpoints | Method | Expected Status | Description |
| :--- | :---: | :---: | :--- |
| `/api/shorten` | `POST` | `201` / `429` | Creates short URL (Protected by Rate Limiter) |
| `/api/urls` | `GET` | `200` | Returns all links with aggregate click counts |
| `/api/analytics/:alias` | `GET` | `200` / `404` | Returns time-series data for a specific link |
| `/:alias` | `GET` | `302` / `404` | Redirects to original URL and logs click |

---

## 📂 Folder Structure

```text
backend/
 ├── config/            # DB initialization and connection
 ├── middleware/        # Security Layer (Rate Limiter, Error Handling)
 ├── models/            # Data Layer (SQL queries and indexing logic)
 ├── routes/            # Express Route definitions
 ├── services/          # Business Logic (Base62 conversion)
 ├── utils/             # Helper functions
 ├── server.js          # Main Entry point
 └── database.db        # Persistent Storage
```

---

## ⚙️ Setup Instructions

### 1. Installation & Config
```bash
cd backend
npm install
# Ensure .env exists with PORT, RATE_LIMIT, and RATE_WINDOW
```

### 2. Startup
```bash
npm run dev
```
API is live at `http://localhost:3000`.
