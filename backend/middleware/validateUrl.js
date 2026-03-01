const validateUrl = (req, res, next) => {
    const { url } = req.body;

    if (!url || typeof url !== 'string' || url.trim() === '') {
        return res.status(400).json({
            success: false,
            error: 'Invalid URL format'
        });
    }

    try {
        new URL(url);
        next();
    } catch (_) {
        return res.status(400).json({
            success: false,
            error: 'Invalid URL format'
        });
    }
};

module.exports = validateUrl;
