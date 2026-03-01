# Custom Rate-Limited URL Shortener

A high-performance, full-stack URL shortening service engineered to handle scalable link generation and real-time click tracking. 

Built with a focus on robust architecture and strict API security, this application actively solves the business problem of managing high-volume, potentially abusive web traffic. By implementing a custom-built, in-memory rate-limiting algorithm natively on the backend, the system prevents endpoint exhaustion and DoS vulnerabilities without relying on heavy external dependencies like Redis or third-party middleware packages.

The platform provides users with an intuitive, dynamic dashboard to instantly shorten long URLs, securely track their entire library of active links, and visualize chronological 7-day click analytics via an interactive charting layer.

---

## 🛠 Tech Stack

**Frontend**
*   **React (Vite)** - UI component architecture and state management
*   **Chart.js & React-Chartjs-2** - Data visualization for analytics 
*   **Lucide React** - Vector iconography
*   **Vanilla CSS** - Responsive, custom styling

**Backend**
*   **Node.js & Express** - RESTful API routing and server infrastructure
*   **SQLite** - Lightweight, relational disk database for URL & Click persistence
*   **Cors & Dotenv** - Cross-origin resource sharing and environment management

**Infrastructure**
*   **Docker & Docker Compose** - Containerized staging environments

---

## ✨ Features

*   **URL Shortening:** Converts any standard web URL into a secure, collision-resistant 6-character Base62 alias.
*   **Analytics Dashboard:** Instantly view chronological, 7-day click activity mapped directly onto a responsive line chart.
*   **High-Performance Redirection:** Natively handles `302 Found` redirects via the short alias, injecting timezone-aware logs sequentially into the database.
*   **Self-Healing State:** The frontend intelligently polls the API to auto-refresh the master list of generated URLs and analytics.
*   **Active Defense Mechanism:** The frontend UI programmatically locks inputs and displays visual countdowns by parsing custom `429 Too Many Requests` status payloads.

---

## 🛡 Rate Limiter Implementation

The API is protected by a custom **Fixed Window** rate-limiting counter, explicitly engineered in `backend/middleware/rateLimiter.js`. 

### How It Works:
1.  **Placement:** It operates as an Express middleware decorator, intercepting `POST /api/shorten` requests before they reach the controller logic.
2.  **Tracking:** Request signatures are tracked entirely in-memory using a native JavaScript `Map()`. The map securely pairs the incoming `req.ip` string to a custom object tracking their `count` and the initial `startTime`. 
3.  **Enforcement:** The application enforces a strict cap of **5 requests per 1-minute window**.
4.  **Exceeding the Limit:** When an IP address fires request #6 within the 60-second window, the middleware rejects the HTTP connection, throws a `429` status code, and mathematically calculates the remaining time using `Math.ceil((windowMs - timePassed) / 1000)`. It securely transmits this exact delta back to the client as a `retryAfter` JSON property.
5.  **Memory Cleanup:** The algorithm is inherently self-healing; when an IP's timeframe naturally expires, their record is silently deleted from the `Map()`, preventing slow memory leaks.

---

## 🚀 Installation & Setup

Ensure you have [Node.js](https://nodejs.org/) and [Docker](https://www.docker.com/) (optional) installed on your machine.

### Local Development (Manual)

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/custom-rate-limiter.git
    cd custom-rate-limiter
    ```

2.  **Set up the Backend:**
    ```bash
    cd backend
    npm install
    # Create the environment file
    echo "PORT=3000\nRATE_LIMIT=5\nRATE_WINDOW=60000" > .env
    # Boot the REST API
    npm run dev 
    ```

3.  **Set up the Frontend (in a new terminal tab):**
    ```bash
    cd frontend
    npm install
    # Boot the Vite development server
    npm run dev 
    ```
4. **Access the application directly at `http://localhost:5173`** 

### Docker Deployment (Containerized)

To spin up the entire full-stack matrix instantly via Docker Compose:
```bash
docker-compose up --build -d
```
*Frontend will be natively exposed at `localhost:5173` and backend at `localhost:3000`.*

---

## 🔌 API Documentation

### 1. Shorten a URL
*   **Method:** `POST`
*   **Route:** `/api/shorten`
*   **Description:** Consumes a raw URL string, validates it, and generates a new Base62 alias.
*   **Example Request Body:**
    ```json
    {
      "originalUrl": "https://www.google.com/search?q=grepsr"
    }
    ```
*   **Example Response Body:**
    ```json
    {
      "success": true,
      "data": {
        "alias": "aB3kP9",
        "shortUrl": "http://localhost:3000/aB3kP9"
      }
    }
    ```

### 2. Retrieve All Generated URLs
*   **Method:** `GET`
*   **Route:** `/api/urls`
*   **Description:** Fetches the master database array of all URLs created, appending aggregate click counts to each row.
*   **Example Response Body:**
    ```json
    {
      "success": true,
      "data": [
        {
          "alias": "aB3kP9",
          "originalUrl": "https://www.google.com",
          "shortUrl": "http://localhost:3000/aB3kP9",
          "totalClicks": 12,
          "createdAt": "2026-03-01T12:00:00.000Z"
        }
      ]
    }
    ```

### 3. Track URL Analytics
*   **Method:** `GET`
*   **Route:** `/api/analytics/:alias`
*   **Description:** Calculates the total lifetime click volume of a given alias alongside chronological analytics grouped by day over the trailing 7 days.
*   **Example Response Body:**
    ```json
    {
      "success": true,
      "data": {
        "shortId": "aB3kP9",
        "originalUrl": "https://www.google.com",
        "totalClicks": 12,
        "clickData": [
          { "click_date": "2026-02-28", "click_count": 5 },
          { "click_date": "2026-03-01", "click_count": 7 }
        ]
      }
    }
    ```

### 4. Redirect User
*   **Method:** `GET`
*   **Route:** `/:alias`
*   **Description:** Intercepts short URL navigation, sequentially logs the visitor data via SQL insertion, and executes a native 302 Redirection to the parent URL.
