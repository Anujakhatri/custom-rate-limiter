import { ArrowRight, AlertCircle, Copy, CheckCircle, Link2 } from 'lucide-react';

/**
 * UrlForm Component
 * Handles URL input, form submission, countdown timer display,
 * and the short link result display with copy functionality.
 */
function UrlForm({ url, setUrl, countdown, loadingObj, errorObj, shortUrlData, copySuccess, onSubmit, onCopy }) {
    return (
        <div className="card">
            <h2 className="card-title">
                <Link2 size={24} color="#3b82f6" />
                Create Short Link
            </h2>

            <form onSubmit={onSubmit}>
                <div className="input-group">
                    <input
                        type="url"
                        className="input"
                        placeholder="Paste your long URL here (https://...)"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        required
                        disabled={countdown > 0}
                    />
                    <button type="submit" className="btn" disabled={loadingObj.shorten || countdown > 0}>
                        {countdown > 0 ? `Wait ${countdown}s` : (loadingObj.shorten ? 'Shortening...' : 'Shorten')}
                        {countdown === 0 && <ArrowRight size={18} />}
                    </button>
                </div>
            </form>

            {errorObj.shorten && (
                <div className="result-box error">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <AlertCircle size={18} />
                        <span>{errorObj.shorten}</span>
                    </div>
                </div>
            )}

            {shortUrlData && !errorObj.shorten && (
                <div className="result-box">
                    <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>Your shortened URL is ready!</p>
                    <div className="result-link-container">
                        <a href={shortUrlData.shortUrl} target="_blank" rel="noopener noreferrer" className="result-link">
                            {shortUrlData.shortUrl}
                        </a>
                        <button onClick={onCopy} className="icon-btn" title="Copy to clipboard">
                            {copySuccess ? <CheckCircle size={20} color="#10b981" /> : <Copy size={20} />}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default UrlForm;
