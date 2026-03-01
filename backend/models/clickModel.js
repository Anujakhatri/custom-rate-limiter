const { dbRun, dbAll } = require('../config/db');

class ClickModel {
    static async logClick(urlId, ipAddress) {
        const sql = `INSERT INTO clicks (url_id, ip_address) VALUES (?, ?)`;
        await dbRun(sql, [urlId, ipAddress]);
    }

    static async getAnalytics(urlId) {
        const sql = `SELECT timestamp, ip_address FROM clicks WHERE url_id = ? ORDER BY timestamp ASC`;
        return await dbAll(sql, [urlId]);
    }

    static async getAnalytics7Days(urlId) {
        const sql = `
            SELECT date(timestamp) as click_date, COUNT(*) as click_count
            FROM clicks
            WHERE url_id = ? AND timestamp >= datetime('now', '-7 days')
            GROUP BY date(timestamp)
            ORDER BY click_date ASC
        `;
        return await dbAll(sql, [urlId]);
    }
}

module.exports = ClickModel;
