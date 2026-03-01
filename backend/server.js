require('dotenv').config();
const express = require('express');
const cors = require('cors');

// Import Middleware
const logger = require('./middleware/logger');
const errorHandler = require('./middleware/errorHandler');

// Import Database to ensure initialization on startup
require('./config/db');

// Import Routes
const urlRoutes = require('./routes/urlRoutes');

// Initialize Express
const app = express();

// --- Global Middleware Setup ---
app.use(express.json()); // Parse JSON bodies

// Configure CORS and Custom Headers
app.use(cors({
    origin: '*', // For demo purposes, allow all. In prod, restrict this.
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Add Custom Headers
app.use((req, res, next) => {
    res.setHeader('X-Powered-By', 'Node.js/Express URL Shortener');
    res.setHeader('X-Custom-Rate-Limiter', 'Active');
    next();
});

// Request Logging
app.use(logger);

// --- API Routes ---
app.use('/api', urlRoutes);

// redirect route to the root since short URLs look like domain.com/aB3kP9
app.use('/', urlRoutes);

// --- Centralized Error Handling ---
app.use(errorHandler);

// Start the Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`URL Shortener Backend is running!
        ---------------------------------
        => Listening on Port : ${PORT}
        => Database: SQLite (database.db)
        => Architecture: Clean Modular
        ------------------------------------
    `);
});
