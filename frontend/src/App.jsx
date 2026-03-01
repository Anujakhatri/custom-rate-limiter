import { useState, useEffect } from 'react';
import UrlForm from './components/UrlForm';
import Dashboard from './components/Dashboard';
import './App.css';


function App() {
  // --- Shorten URL state ---
  const [url, setUrl] = useState('');
  const [shortUrlData, setShortUrlData] = useState(null);
  const [copySuccess, setCopySuccess] = useState(false);
  const [countdown, setCountdown] = useState(0);

  // --- Analytics state ---
  const [analyticsId, setAnalyticsId] = useState('');
  const [analyticsData, setAnalyticsData] = useState(null);

  // --- All URLs list ---
  const [allUrls, setAllUrls] = useState([]);

  // --- Shared loading & error state ---
  const [loadingObj, setLoadingObj] = useState({ shorten: false, analytics: false });
  const [errorObj, setErrorObj] = useState({ shorten: '', analytics: '' });

  const API_URL = 'http://localhost:3000/api';

  // Countdown timer for rate-limit lock
  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [countdown]);

  // Fetch the full list of shortened URLs from the backend
  const fetchAllUrls = async () => {
    try {
      const response = await fetch(`${API_URL}/urls`);
      const data = await response.json();
      if (response.ok && data.success) {
        setAllUrls(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch all URLs:', err);
    }
  };

  // Load the URL list on mount
  useEffect(() => {
    fetchAllUrls();
  }, []);

  // Handle URL shortening form submission
  const handleShorten = async (e) => {
    e.preventDefault();
    if (countdown > 0) return;

    setLoadingObj({ ...loadingObj, shorten: true });
    setErrorObj({ ...errorObj, shorten: '' });
    setShortUrlData(null);
    setCopySuccess(false);

    try {
      const response = await fetch(`${API_URL}/shorten`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url })
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 429 && data.retryAfter) {
          setCountdown(data.retryAfter);
          throw new Error('Too many requests. Please wait a minute and try again.');
        }
        throw new Error(data.error || 'Failed to shorten URL');
      }

      setShortUrlData(data.data);
      setUrl('');
      fetchAllUrls(); // Refresh the URL list after a new one is created
    } catch (err) {
      setErrorObj({ ...errorObj, shorten: err.message });
    } finally {
      setLoadingObj({ ...loadingObj, shorten: false });
    }
  };

  // Handle analytics lookup (This function runs in two situations: form submit OR clicking a URL item)
  const handleGetAnalytics = async (e, forceId = null) => {
    if (e) e.preventDefault();
    const queryId = forceId || analyticsId;
    if (!queryId) return;

    setLoadingObj({ ...loadingObj, analytics: true });
    setErrorObj({ ...errorObj, analytics: '' });
    setAnalyticsData(null);

    // Extract alias from full short URL if user pasted it
    let finalQueryId = queryId;
    if (finalQueryId.includes('/')) {
      finalQueryId = finalQueryId.split('/').pop();
    }

    setAnalyticsId(finalQueryId);

    try {
      const response = await fetch(`${API_URL}/analytics/${finalQueryId}`);
      const data = await response.json();

      if (!response.ok) throw new Error(data.error || 'Failed to fetch analytics');

      const payload = data.data;

      // Build chart labels and data points from grouped daily click data
      const labels = [];
      const dataPoints = [];

      payload.clickData.forEach((row) => {
        labels.push(row.click_date);
        dataPoints.push(row.click_count);
      });

      // Ensure at least one point so chart renders on 0 clicks
      if (labels.length === 0) {
        labels.push(new Date().toISOString().split('T')[0]);
        dataPoints.push(0);
      }

      setAnalyticsData({
        ...payload,
        chartData: {
          labels,
          datasets: [
            {
              label: 'Clicks per Day',
              data: dataPoints,
              borderColor: '#3b82f6',
              backgroundColor: '#3b82f6',
              tension: 0.1,
              pointRadius: 4,
              pointHoverRadius: 6,
            }
          ]
        }
      });
    } catch (err) {
      setErrorObj({ ...errorObj, analytics: err.message });
    } finally {
      setLoadingObj({ ...loadingObj, analytics: false });
    }
  };

  // Copy the generated short URL to clipboard
  const copyToClipboard = () => {
    if (shortUrlData?.shortUrl) {
      navigator.clipboard.writeText(shortUrlData.shortUrl);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }
  };

  return (
    <div className="app-container">
      <header className="header">
        <h1>Transform Long links into Short, Trackable Links</h1>
        <p>Custom Rate-Limited URL Shortener with Analytics</p>
      </header>

      {/* URL Shortening Form */}
      <UrlForm
        url={url}
        setUrl={setUrl}
        countdown={countdown}
        loadingObj={loadingObj}
        errorObj={errorObj}
        shortUrlData={shortUrlData}
        copySuccess={copySuccess}
        onSubmit={handleShorten}
        onCopy={copyToClipboard}
      />

      {/* All URLs list + Analytics Dashboard */}
      <Dashboard
        allUrls={allUrls}
        analyticsId={analyticsId}
        setAnalyticsId={setAnalyticsId}
        analyticsData={analyticsData}
        loadingObj={loadingObj}
        errorObj={errorObj}
        onGetAnalytics={handleGetAnalytics}
      />
    </div>
  );
}

export default App;
