const { dbRun, dbGet, dbAll } = require('../config/db');

class UrlModel {
    static async create(originalUrl, alias) {
        const sql = `INSERT INTO urls (original_url, alias) VALUES (?, ?)`;
        await dbRun(sql, [originalUrl, alias]);
        return this.findByAlias(alias);
    }

    static async findByAlias(alias) {
        const sql = `SELECT * FROM urls WHERE alias = ?`;
        return await dbGet(sql, [alias]);
    }

    static async findByOriginalUrl(originalUrl) {
        const sql = `SELECT * FROM urls WHERE original_url = ?`;
        return await dbGet(sql, [originalUrl]);
    }

    static async incrementClicks(id) {
        const sql = `UPDATE urls SET total_clicks = total_clicks + 1 WHERE id = ?`;
        await dbRun(sql, [id]);
    }

    static async getAll() {
        const sql = `SELECT * FROM urls ORDER BY created_at DESC`;
        return await dbAll(sql);
    }
}

module.exports = UrlModel;
