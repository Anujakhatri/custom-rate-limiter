/**
 * CUSTOM RATE LIMITER

 * Algorithm: Fixed Window Counter
 * Tracks the timestamps of requests made by a specific IP within a 1-minute window.
 */

const rateLimitData = new Map(); // Tracks requests per IP in-memory

const rateLimiter = (req, res, next) => {
    // Read from environment or use defaults
    const windowSeconds = parseInt(process.env.RATE_WINDOW || '60', 10);
    const maxRequests = parseInt(process.env.RATE_LIMIT || '5', 10);
    const windowMs = windowSeconds * 1000;

    //  identify the user by IP address
    const userIP = req.ip || req.connection.remoteAddress;
    const now = Date.now();

    //  initialize tracking array for this IP if new
    if (!rateLimitData.has(userIP)) {
        rateLimitData.set(userIP, []);
    }

    // retrieve the tracked requests
    let requests = rateLimitData.get(userIP);

    // remove timestamps that are older than 60-second window
    requests = requests.filter(timestamp => now - timestamp < windowMs);

    // update the Map with the clean array
    rateLimitData.set(userIP, requests);

    // check if they have reached the limit
    if (requests.length >= maxRequests) {

        const oldestRequestTimestamp = requests[0];
        const timeElapsedSinceOldest = now - oldestRequestTimestamp;
        const retryAfterMs = windowMs - timeElapsedSinceOldest;
        const retryAfterSeconds = Math.ceil(retryAfterMs / 1000);

        return res.status(429).json({
            success: false,
            error: 'Too many requests',
            retryAfter: retryAfterSeconds
        });
    }

    // limit not reached then add current request timestamp and allow to proceed
    requests.push(now);
    next();
};

module.exports = rateLimiter;
