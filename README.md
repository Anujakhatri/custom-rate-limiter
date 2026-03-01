# Custom Rate-Limited URL Shortener

A high-performance, full-stack URL shortening service engineered to handle scalable link generation, secure redirection, and real-time click tracking. 

Built with a focus on robust architecture and strict API security, this application actively mitigates DoS vulnerabilities through a custom-built, in-memory rate-limiting engine.

---

## 🏗 Full-Stack Architecture & Design

This project is built with a deep emphasis on the **Request-Response cycle** and a strict **Separation of Concerns**. 

- **Frontend (UI Layer):** Handles user interactions, state management, and real-time visualization. It is entirely decoupled from the backend's implementation details, communicating only via standardized JSON payloads.
- **Backend (API Layer):** Manages business logic, alias generation, and data persistence. It enforces security and rate limits before any database interaction occurs.
- **Data Layer (SQLite):** Ensures high-speed retrieval and consistent storage of URL mappings and chronological click logs.

---

## 🛡 Logic & Problem-Solving

The system is designed to remain stable and performant under non-ideal conditions:
- **Custom Rate-Limiting Algorithm:** Implements a **Fixed Window** strategy that tracks IP-based request frequency in-memory. This prevents endpoint exhaustion while providing clear `429 Too Many Requests` status codes to the client.
- **Base62 Encoding:** Efficiently translates database IDs into compact, user-friendly strings, ensuring billions of unique permutations with just 6 characters.
- **Edge Case Resilience:** 
    - **Validation:** Both layers prevent empty or malformed URL inputs.
    - **Self-Healing UI:** The frontend intelligently polls the API to refresh state and handles network failures gracefully without crashing.
    - **Cooldown Management:** Programmatic locking of inputs during rate-limit windows.

---

## 📊 Data Integrity & Management

A key challenge solved in this project is the **transformation of raw data into meaningful insights**:
- **Schema Design:** Optimized SQLite schema with indexing on the `alias` column for sub-millisecond redirect lookups.
- **Data Aggregation:** The backend performs complex SQL aggregations to transform thousands of individual click timestamps into a structured "7-day trend" array.
- **Frontend Mapping:** The UI layer consumes this transformed data and maps it directly to a responsive **Chart.js** interface, ensuring performance even with high click volumes.

---

## 🛠 Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 19, Vite, Chart.js, Lucide Icons, Vanilla CSS |
| **Backend** | Node.js, Express, SQLite, Dotenv |
| **Security** | Custom In-Memory Rate Limiter (Fixed Window) |
| **DevOps** | Docker, Docker Compose |

---

## 🚀 Quick Start

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

The application will be available at `http://localhost:5173`.

### 3. Docker Deployment (Recommended)
To spin up the entire infrastructure with one command:
```bash
docker-compose up --build
```

---

## 📂 Project Structure

```text
.
├── backend/            # Express API & SQLite Logic
│    └── README.md      # Detailed backend docs (Logic & Integrity)
├── frontend/           # React Dashboard & Charting
│    └── README.md      # Detailed frontend docs (UI & State)
├── docker-compose.yml  # Orchestration for the stack
└── README.md           # This file
```

---

## 📖 Component Documentation

- **[Frontend Guide](./frontend/README.md):** Detailed info on React components, state management, and charting.
- **[Backend Guide](./backend/README.md):** Deep dive into API endpoints, database schema, and the rate-limiting algorithm.
