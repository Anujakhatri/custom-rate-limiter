# URL Shortener – JavaScript Frontend

A modern, responsive, and performance-driven URL shortener frontend built with **React** and **Vite**. This application provides a clean interface for creating short links and visualizing click analytics with real-time feedback.

## 🌟 Overview

This project serves as the user interface for our URL Shortening service. It allows users to:
- **Generate Short URLs:** Instantly convert long, cumbersome links into tidy, shareable aliases.
- **Track Performance:** View detailed analytics of clicks over the last 7 days through intuitive visualizations.
- **Resilient User Experience:** Built-in support for **rate limiting** with smooth UI feedback to prevent API abuse while keeping the user informed.

The frontend communicates with a backend REST API to manage URL records and retrieve time-series click data.

---

## 🛠 Tech Stack

- **[React](https://react.dev/):** A component-based JavaScript library for building interactive user interfaces.
- **[Vite](https://vitejs.dev/):** A lightning-fast build tool and development server with Hot Module Replacement (HMR).
- **[Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API):** Modern browser API for asynchronous backend communication.
- **[Chart.js](https://www.chartjs.org/):** Powerful data visualization library used for rendering analytics line charts.
- **[ESLint](https://eslint.org/):** Ensuring code quality and consistent coding standards.

---

## 🚀 Frontend Features

### A. The Creator (URL Shortening Form)
The primary entry point where users transform their links.
- **Simple Interface:** A clean input field and a "Shorten" button.
- **Backend Sync:** Sends a `POST` request to the backend with the original URL.
- **Smart Rate Limiting (429 handling):**
  - If the backend returns a `429 Too Many Requests` error, the UI automatically triggers a **countdown timer**.
  - The input field and button are **disabled temporarily** to prevent further requests.
  - Controls are **automatically re-enabled** once the cooldown period expires.
- **Instant Result:** Displays the shortened URL immediately upon success.

### B. Analytics Dashboard
A dedicated space to monitor the success of your links.
- **URL Selection:** Fetch a list of all shortened URLs from the database.
- **Interactive Visualization:** When a URL is selected, the app fetches specific analytics.
- **Line Chart Visualization:** Displays a trend of clicks for the **last 7 days** using `Chart.js`.
- **Dynamic Refresh:** A "Refresh" button allows users to fetch the latest analytics data without a full page reload, keeping the dashboard up-to-date and responsive.

---

## 📂 Folder Structure

```text
src/
 ├── components/
 │    ├── UrlForm.jsx        # Handles URL input and rate-limiting logic
 │    ├── Dashboard.jsx      # Main analytics container and URL list
 │    └── ChartComponent.jsx # Reusable Chart.js wrapper for analytics
 ├── App.jsx                 # Root component and layout
 ├── App.css                 # Main styling and theme
 ├── main.jsx                # Entry point for React
 Dockerfile                   # Containerization configuration
index.html                   # HTML template
```

---

## 🧠 How It Works (Simply Explained)

### 1. Shortening a URL
When you click "Shorten", React collects the string from the input field and sends a piece of data (JSON) to our backend. The backend saves it and gives back a unique "alias".

### 2. When Rate Limits Hit
If you try to shorten too many URLs too fast, the backend says "Wait a second (429 Error)". React catches this message, calculates the time until you can try again, and hides the button so you don't keep clicking. This protects the server!

### 3. Smooth Updates (No Page Reloads)
In traditional websites, you often have to refresh the whole page to see new data. Here, the "Refresh" button only tells React to "go fetch the analytics again". When the data arrives, **React State** updates.

### 4. React State & Re-rendering
Think of **State** as the "memory" of a component (like the countdown timer or the chart data). When this memory changes, React automatically "re-renders"—it recalculates what the screen should look like based on the new information and updates only those specific parts of the page. This is why everything feels so fast and snappy!

---

## ⚙️ Setup Instructions

### Prerequisites
- [Node.js](https://nodejs.org/) (Latest LTS version recommended)

### 1. Installation
Clone the repository and install dependencies from the `frontend` directory:
```bash
cd frontend
npm install
```

### 2. Environment Configuration
Create a `.env` file in the root of the `frontend` folder to point to your backend:
```env
VITE_API_URL=http://localhost:3000
```
*(Note: Replace `http://localhost:3000` with your actual backend URL if different.)*

### 3. Development Mode
Start the local development server:
```bash
cd frontend
npm run dev
```
Open your browser to the URL shown in your terminal (usually `http://localhost:5173`).

### 4. Code Quality
To check for code errors or stylistic issues:
```bash
cd frontend
npm run lint
```
