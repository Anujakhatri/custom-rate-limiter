# 🌐 URL Shortener Frontend

A sleek, intuitive, and highly responsive dashboard for the **Custom Rate-Limited URL Shortener**. Built with **React 19** and **Vite**, this frontend provides real-time link generation, interactive analytics, and a seamless "self-healing" user experience.

> **Frontend Core:** State management, handling asynchronous API polling (rate-limit window checks), and data visualization (integrating a charting library).

---

## ✨ Key Features

- **🚀 Instant Generation:** Create shortened links in milliseconds with one click.
- **🛡️ Rate-Limit Resilience:** Sophisticated handling of API limits with real-time countdown timers.
- **📊 Interactive Analytics:** Visualizes click trends over the last 7 days using dynamic line charts.
- **📋 Clipboard Integration:** One-click copying for generated short links.
- **🎨 Modern UI:** A clean, card-based interface with smooth transitions and glassmorphism touches.

---

## 🛠 Tech Stack

![React](https://img.shields.io/badge/React-20232a?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)
![Chart.js](https://img.shields.io/badge/chart.js-F5788D.svg?style=for-the-badge&logo=chart.js&logoColor=white)
![Lucide](https://img.shields.io/badge/Lucide-React-FDE047?style=for-the-badge&logo=lucide&logoColor=black)
![CSS3](https://img.shields.io/badge/vanilla_css-1572B6?style=for-the-badge&logo=css3&logoColor=white)

---

### How we handle Rate Limiting (HTTP 429)

The most critical part of this frontend is how it interacts with the backend's **Sliding Window Rate Limiter**. Instead of just showing an error, the UI actively manages the cooldown:

1.  **Detection:** When the API returns a `429 Too Many Requests`, the frontend parses the `retryAfter` value (in seconds).
2.  **State Management:** An internal `countdown` state is initialized with this value.
3.  **UI Locking:** The input fields and submission buttons are programmatically disabled, preventing redundant requests and improving UX.
4.  **Ticker Logic:** A `useEffect` hook runs a 1-second interval to decrement the timer.
5.  **Automatic Restoration:** Once the timer hits 0, the UI automatically unlocks, allowing the user to try again immediately.

### Data Visualization Strategy

- **Raw to Visual:** Backend provides time-series data. We transform this JSON into labels (Dates) and data points (Click Counts) for **Chart.js**.
- **Contextual Selection:** Clicking any URL in the "Recent Activity" list automatically fetches and renders that specific URL's performance chart.

---

## �️ Frontend core logic

### 1. State Management
We use React's `useState` to maintain a single source of truth for the application's "memory." For example, the rate-limiting countdown is managed globally.
*   **Example:** `const [countdown, setCountdown] = useState(0);`
*   **Why?** This state dictates whether the UI is locked or active. When the countdown is `> 0`, components like the `UrlForm` automatically disable inputs across the app.

### 2. Asynchronous API Handling
We use the `fetch` API to communicate with the backend asynchronously, ensuring the UI remains responsive while waiting for data.
*   **Example:**
    ```javascript
    const response = await fetch('/api/shorten', { ... });
    if (response.status === 429) {
      const data = await response.json();
      setCountdown(data.retryAfter); // Engaging state with async result
    }
    ```
*   **How it works:** When a "Rate Limit" (429) occurs, the frontend doesn't just crash; it programmatically reads the `retryAfter` value from the headers/body and updates the state.

### 3. Data Visualization
Raw data from the database is often structured for storage, not display. The frontend "engages" the charting library by transforming this data into a visual format.
*   **Example (Raw Data):** `[{ click_date: '2024-03-01', click_count: 5 }]`
*   **Example (Transformed for Chart.js):**
    ```javascript
    const labels = data.map(item => item.click_date);
    const counts = data.map(item => item.click_count);
    // These arrays are then fed directly into the Chart.js dataset.
    ```
*   **Result:** A readable line chart that updates in real-time without a page refresh.

---

## �📂 Project Structure

```text
src/
 ├── components/
 │    ├── UrlForm.jsx        # Handles link input & link result (Logic: Form Submit & Copy)
 │    ├── Dashboard.jsx      # Activity Feed & Analytics Container (Logic: URL List Management)
 │    └── ChartComponent.jsx # Pure UI component for rendering the Line Chart
 ├── App.jsx                 # Global state manager (Logic: API calls & Ratelimit Ticker)
 ├── App.css                 # Responsive layout & theme definitions
 └── main.jsx                # Entry point
```

---

## ⚙️ Quick Start

### 1. Installation
Navigate to the frontend directory and install dependencies:
```bash
cd frontend
npm install
```

### 2. Configure Environment
Ensure the frontend knows where the backend API is located.
```bash
# This is usually handled by the default API_URL in App.jsx (http://localhost:3000/api)
```

### 3. Launch Development Server
```bash
npm run dev
```
Explore the dashboard at: `http://localhost:5173`

---

## 🔐 Security & Optimization

- **Client-Side Validation:** Prevents invalid URL submissions before they reach the server.
- **Selective Re-rendering:** Only the analytics chart refreshes when new data is fetched, ensuring zero "page-flicker".
- **Responsive Architecture:** Flex and Grid layouts ensure the dashboard is usable on everything from mobile phones to 4K monitors.
