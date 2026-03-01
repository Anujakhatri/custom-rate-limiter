/**
 * Request Logger Middleware
 */
const logger = (req, res, next) => {
    const start = Date.now();
    const { method, originalUrl, ip } = req;

    // Log the request once it finishes to capture the status code
    res.on('finish', () => {
        const duration = Date.now() - start;
        const statusCode = res.statusCode;
        console.log(`[${new Date().toISOString()}] ${ip} - ${method} ${originalUrl} ${statusCode} - ${duration}ms`);
    });

    next();
};

module.exports = logger;
