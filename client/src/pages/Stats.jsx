import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import toast from 'react-hot-toast';
import { api } from "../services/api";

export default function Stats() {
  const { code } = useParams();
  const [link, setLink] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadStats();
  }, [code]);

  const loadStats = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await api.getLinkStats(code);
      setLink(data.data);
    } catch (err) {
      console.error("Link not found", err);
      setError("Link not found");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    const backendUrl = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';
    const url = `${backendUrl}/${code}`;
    navigator.clipboard.writeText(url);
    toast.success('Copied to clipboard!');
  };

  const formatDate = (date) => {
    if (!date) return "Never";
    return new Date(date).toLocaleString();
  };

  if (loading) {
    return (
      <div className="container">
        <p>Loading...</p>
      </div>
    );
  }

  if (error || !link) {
    return (
      <div className="container">
        <p className="error">{error}</p>
        <Link to="/" className="back-link">
          ← Back to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="container">
      <Link to="/" className="back-link">
        ← Back to Dashboard
      </Link>

      <div className="stats-card">
        <h1>Link Statistics</h1>

        <div className="stats-grid">
          <div className="stat-item">
            <label>Short Code</label>
            <div className="stat-value">
              <code>{link.shortCode}</code>
              <button onClick={copyToClipboard} className="btn-small">
                Copy URL
              </button>
            </div>
          </div>

          <div className="stat-item">
            <label>Target URL</label>
            <div className="stat-value url-value">
              <a
                href={link.targetUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                {link.targetUrl}
              </a>
            </div>
          </div>

          <div className="stat-item">
            <label>Total Clicks</label>
            <div className="stat-value large">{link.totalClicks}</div>
          </div>

          <div className="stat-item">
            <label>Last Clicked</label>
            <div className="stat-value">{formatDate(link.lastClicked)}</div>
          </div>

          <div className="stat-item">
            <label>Created</label>
            <div className="stat-value">{formatDate(link.createdAt)}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
