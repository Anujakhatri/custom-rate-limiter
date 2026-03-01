const crypto = require('crypto');

class HashService {
    static generateAlias(length = 6) {
        const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let alias = '';
        for (let i = 0; i < length; i++) {
            const randomIndex = crypto.randomInt(0, charset.length);
            alias += charset[randomIndex];
        }
        return alias;
    }
}

module.exports = HashService;
