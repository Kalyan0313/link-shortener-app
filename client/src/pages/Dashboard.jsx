import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import toast from 'react-hot-toast';
import { api } from "../services/api";

export default function Dashboard() {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const [targetUrl, setTargetUrl] = useState("");
  const [customCode, setCustomCode] = useState("");
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadLinks();
  }, [search]);

  const loadLinks = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await api.fetchLinks(search);
      setLinks(data.data.links || []);
    } catch (err) {
      console.error("error in fetching links", err);
      setError("Failed to load links. Make sure the server is running.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    if (!targetUrl.trim()) {
      setFormError("Please enter a URL");
      return;
    }

    try {
      setSubmitting(true);
      await api.createLink(targetUrl, customCode);
      setTargetUrl("");
      setCustomCode("");
      loadLinks();
    } catch (err) {
      setFormError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (code) => {
    if (!confirm(`Delete link ${code}?`)) return;

    try {
      await api.deleteLink(code);
      toast.success('Link deleted successfully');
      loadLinks();
    } catch (err) {
      console.error("Failed to delete", err);
      toast.error(err.message || 'Failed to delete link');
    }
  };

  const copyToClipboard = (code) => {
    const url = `http://localhost:5000/${code}`;
    navigator.clipboard.writeText(url);
    toast.success('Copied to clipboard!');
  };

  const formatDate = (date) => {
    if (!date) return "Never";
    return new Date(date).toLocaleString();
  };

  return (
    <div className="container">
      <header>
        <h1>TinyLink</h1>
        <p>URL Shortener</p>
      </header>

      <div className="add-link-section">
        <h2>Create Short Link</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <input
              type="url"
              placeholder="Enter your long URL (https://...)"
              value={targetUrl}
              onChange={(e) => setTargetUrl(e.target.value)}
              disabled={submitting}
              required
            />
            <input
              type="text"
              placeholder="Custom code (optional)"
              value={customCode}
              onChange={(e) => setCustomCode(e.target.value)}
              disabled={submitting}
              pattern="[A-Za-z0-9]{6,8}"
              title="6-8 alphanumeric characters"
            />
            <button type="submit" disabled={submitting}>
              {submitting ? "Creating..." : "Shorten"}
            </button>
          </div>
          {formError && <p className="error">{formError}</p>}
        </form>
      </div>

      <div className="links-section">
        <div className="section-header">
          <h2>Your Links</h2>
          <input
            type="text"
            placeholder="Search links..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
          />
        </div>

        {loading && <p>Loading...</p>}
        {error && <p className="error">{error}</p>}

        {!loading && !error && links.length === 0 && (
          <p className="empty-state">
            No links yet. Create your first one above!
          </p>
        )}

        {!loading && !error && links.length > 0 && (
          <table>
            <thead>
              <tr>
                <th>Short Code</th>
                <th>Target URL</th>
                <th>Clicks</th>
                <th>Last Clicked</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {links.map((link) => (
                <tr key={link.id}>
                  <td>
                    <Link to={`/code/${link.shortCode}`} className="code-link">
                      {link.shortCode}
                    </Link>
                  </td>
                  <td className="url-cell" title={link.targetUrl}>
                    {link.targetUrl}
                  </td>
                  <td>{link.totalClicks}</td>
                  <td>{formatDate(link.lastClicked)}</td>
                  <td>
                    <button
                      onClick={() => copyToClipboard(link.shortCode)}
                      className="btn-small"
                    >
                      Copy
                    </button>
                    <button
                      onClick={() => handleDelete(link.shortCode)}
                      className="btn-small btn-danger"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
