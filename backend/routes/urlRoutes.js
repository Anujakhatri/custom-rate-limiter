const express = require('express');
const router = express.Router();
const UrlService = require('../services/urlService');
const rateLimiter = require('../middleware/rateLimiter');
const validateUrl = require('../middleware/validateUrl');

// --- 1. Shorten URL Endpoint ---
router.post('/shorten', rateLimiter, validateUrl, async (req, res, next) => {
    try {
        const { url } = req.body;
        const result = await UrlService.shortenUrl(url);

        res.status(201).json({
            success: true,
            data: result
        });
    } catch (err) {
        if (err.message === 'Alias collision limits exceeded. Try again.') {
            err.statusCode = 500;
        }
        next(err);
    }
});

// --- 2. Get Analytics Endpoint ---
router.get('/analytics/:alias', async (req, res, next) => {
    try {
        const { alias } = req.params;
        const analytics = await UrlService.getAnalytics(alias);

        if (!analytics) {
            return res.status(404).json({ success: false, error: 'URL Alias not found' });
        }

        res.json({
            success: true,
            data: analytics
        });
    } catch (err) {
        next(err);
    }
});

// --- 3. Get All URLs Endpoint ---
router.get('/urls', async (req, res, next) => {
    try {
        const urls = await UrlService.getAllUrls();
        res.json({
            success: true,
            data: urls
        });
    } catch (err) {
        next(err);
    }
});

// --- 4. Redirection Endpoint ---
router.get('/:alias', async (req, res, next) => {
    try {
        const { alias } = req.params;
        const userIP = req.ip || req.connection.remoteAddress;

        const originalUrl = await UrlService.getOriginalUrlAndTrackClick(alias, userIP);

        if (!originalUrl) {
            return res.status(404).json({ success: false, error: 'URL not found or expired.' });
        }

        res.redirect(302, originalUrl);
    } catch (err) {
        next(err);
    }
});

module.exports = router;
