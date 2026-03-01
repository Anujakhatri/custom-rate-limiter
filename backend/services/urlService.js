const UrlModel = require('../models/urlModel');
const ClickModel = require('../models/clickModel');
const HashService = require('../utils/hashService');

class UrlService {
    static async shortenUrl(originalUrl) {
        // Normalize URL
        const normalizedUrl = new URL(originalUrl).toString();

        // Prevent Duplicate URLs
        const existingUrl = await UrlModel.findByOriginalUrl(normalizedUrl);
        if (existingUrl) {
            return {
                alias: existingUrl.alias,
                shortUrl: `http://localhost:${process.env.PORT || 3000}/${existingUrl.alias}`
            };
        }

        // Generate a 6-character unique alias with up to 5 retries for collision handling
        let alias = '';
        let retries = 0;
        let isUnique = false;

        while (retries < 5) {
            alias = HashService.generateAlias();
            const existingAlias = await UrlModel.findByAlias(alias);
            if (!existingAlias) {
                isUnique = true;
                break;
            }
            retries++;
        }

        if (!isUnique) {
            throw new Error('Alias collision limits exceeded. Try again.');
        }

        // Save to Database
        await UrlModel.create(normalizedUrl, alias);

        return {
            alias,
            shortUrl: `http://localhost:${process.env.PORT || 3000}/${alias}`
        };
    }

    static async getOriginalUrlAndTrackClick(alias, ipAddress) {
        const urlEntry = await UrlModel.findByAlias(alias);
        if (!urlEntry) {
            return null; // Signals a 404
        }

        // Track the click analytics
        await ClickModel.logClick(urlEntry.id, ipAddress);
        await UrlModel.incrementClicks(urlEntry.id);

        return urlEntry.original_url;
    }

    static async getAnalytics(alias) {
        const urlEntry = await UrlModel.findByAlias(alias);
        if (!urlEntry) {
            return null; // Signals a 404
        }

        const clickData = await ClickModel.getAnalytics7Days(urlEntry.id);

        return {
            shortId: alias,
            originalUrl: urlEntry.original_url,
            totalClicks: urlEntry.total_clicks,
            clickData: clickData
        };
    }

    static async getAllUrls() {
        const urls = await UrlModel.getAll();
        return urls.map(u => ({
            alias: u.alias,
            originalUrl: u.original_url,
            shortUrl: `http://localhost:${process.env.PORT || 3000}/${u.alias}`,
            totalClicks: u.total_clicks,
            createdAt: u.created_at
        }));
    }
}

module.exports = UrlService;
