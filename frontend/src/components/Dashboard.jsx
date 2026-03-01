import { Activity, AlertCircle, RefreshCw } from 'lucide-react';
import ChartComponent from './ChartComponent';

/**
 * Contains the Track Analytics card (input + chart display)
 * and the All Shortened URLs list panel.
 */
function Dashboard({ allUrls, analyticsId, setAnalyticsId, analyticsData, loadingObj, errorObj, onGetAnalytics }) {
    return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem', width: '100%', maxWidth: '1200px', margin: '0 auto' }}>

            <div className="card">
                <h2 className="card-title">
                    <Activity size={24} color="#10b981" />
                    All Shortened URLs
                </h2>

                {allUrls.length === 0 ? (
                    <p style={{ color: '#6b7280' }}>No URLs shortened yet.</p>
                ) : (
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '400px', overflowY: 'auto' }}>
                        {allUrls.map(u => (
                            <li
                                key={u.alias}
                                onClick={() => onGetAnalytics(null, u.alias)}
                                style={{ padding: '12px', border: '1px solid #e5e7eb', borderRadius: '8px', cursor: 'pointer', backgroundColor: '#f9fafb', transition: 'background-color 0.2s', textAlign: 'left' }}
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
                            >
                                <div style={{ fontWeight: 'bold', color: '#3b82f6', marginBottom: '4px' }}>{u.shortUrl}</div>
                                <div style={{ color: '#6b7280', fontSize: '0.8rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{u.originalUrl}</div>
                                <div style={{ color: '#9ca3af', fontSize: '0.75rem', marginTop: '8px', display: 'flex', justifyContent: 'space-between' }}>
                                    <span>Clicks: <strong>{u.totalClicks}</strong></span>
                                    <span>{new Date(u.createdAt).toLocaleDateString()}</span>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {/* --- ANALYTICS CARD (Right) --- */}
            <div className="card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <h2 className="card-title">
                    <Activity size={24} color="#c084fc" />
                    Track Analytics
                </h2>

                <form onSubmit={(e) => onGetAnalytics(e)}>
                    <div className="input-group">
                        <input
                            type="text"
                            className="input"
                            placeholder="Enter Short ID (e.g. a1b2c3) or click a URL from the list"
                            value={analyticsId}
                            onChange={(e) => setAnalyticsId(e.target.value)}
                            required
                        />
                        <button type="submit" className="btn" disabled={loadingObj.analytics}>
                            {loadingObj.analytics ? 'Loading...' : 'View Stats'}
                        </button>
                    </div>
                </form>

                {errorObj.analytics && (
                    <div className="result-box error" style={{ marginTop: '1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <AlertCircle size={18} />
                            <span>{errorObj.analytics}</span>
                        </div>
                    </div>
                )}

                {analyticsData && !errorObj.analytics && (
                    <div style={{ marginTop: '2rem', animation: 'slideDown 0.4s ease-out', flex: 1, display: 'flex', flexDirection: 'column' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                            <div style={{ flex: 1 }}>
                                <h3 style={{ margin: '0 0 0.5rem 0', color: '#111827', fontSize: '1.2rem', fontWeight: 600 }}>
                                    Analytics for {analyticsData.shortId}
                                </h3>
                                <div style={{ color: '#6b7280', fontSize: '0.9rem', wordBreak: 'break-all' }}>{analyticsData.originalUrl}</div>
                            </div>
                            <button
                                onClick={() => onGetAnalytics(null, analyticsData.shortId)}
                                disabled={loadingObj.analytics}
                                style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: 'transparent', border: '1px solid #d1d5db', padding: '0.4rem 0.8rem', borderRadius: '6px', cursor: 'pointer', color: '#374151', fontSize: '0.85rem' }}
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                            >
                                <RefreshCw size={14} className={loadingObj.analytics ? 'spin-animation' : ''} />
                                Refresh
                            </button>
                        </div>

                        <div className="stats-grid" style={{ marginBottom: '2rem' }}>
                            <div className="stat-card" style={{ gridColumn: '1 / -1', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <div className="stat-label">Total Lifetime Clicks</div>
                                <div className="stat-value">{analyticsData.totalClicks}</div>
                            </div>
                        </div>

                        <h3 style={{ marginBottom: '1rem', color: '#111827', fontSize: '1.1rem', fontWeight: 600 }}>
                            Clicks Over Time (Last 7 Days)
                        </h3>

                        <ChartComponent chartData={analyticsData.chartData} />
                    </div>
                )}

                {!analyticsData && !errorObj.analytics && (
                    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af', padding: '3rem 0', fontStyle: 'italic', textAlign: 'center' }}>
                        Select a URL from the list or enter an ID to view its analytics.
                    </div>
                )}
            </div>
        </div>
    );
}

export default Dashboard;
