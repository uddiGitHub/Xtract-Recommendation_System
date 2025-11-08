"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

interface PaperDetail {
  id: string;
  title: string;
  authors: string;
  update_date: string;
  abstract?: string;
  similarity?: number;
}

export default function PaperDetailContent() {
  const params = useParams();
  const id = params.id as string;
  
  const [paper, setPaper] = useState<PaperDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [recommended, setRecommended] = useState<PaperDetail[]>([]);
  const [recLoading, setRecLoading] = useState(true);

  useEffect(() => {
    if (id) {
      setLoading(true);
      setError(null);
      
      // Fetch paper details
      fetch(`https://uddi12-xtract.hf.space/paper/${id}`)
        .then((res) => {
          if (!res.ok) {
            throw new Error(`Failed to fetch paper: ${res.status} ${res.statusText}`);
          }
          return res.json();
        })
        .then((data) => {
          if (!data || !data.id) {
            throw new Error('Invalid paper data received');
          }
          setPaper(data);
        })
        .catch((err) => {
          console.error('Error fetching paper:', err);
          setError(err.message);
        })
        .finally(() => setLoading(false));

      // Fetch recommendations
      fetch(`https://uddi12-xtract.hf.space/recommend/${id}`)
        .then((res) => {
          if (!res.ok) {
            throw new Error('Failed to fetch recommendations');
          }
          return res.json();
        })
        .then((data) => {
          if (Array.isArray(data)) {
            setRecommended(data);
          } else {
            setRecommended([]);
          }
        })
        .catch((err) => {
          console.error('Error fetching recommendations:', err);
          setRecommended([]);
        })
        .finally(() => setRecLoading(false));
    }
  }, [id]);

  if (loading) {
    return (
      <div className="paper-detail-container">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading research paper...</p>
          <p className="debug-info">Paper ID: {id}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="paper-detail-container">
        <div className="error-state">
          <h2>Error loading paper</h2>
          <p>{error}</p>
          <p className="debug-info">Paper ID: {id}</p>
          <div className="error-actions">
            <Link href="/" className="back-button">
              ← Back to Home
            </Link>
            <button 
              onClick={() => window.location.reload()} 
              className="retry-button"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!paper) {
    return (
      <div className="paper-detail-container">
        <div className="no-paper">
          <h2>Paper not found</h2>
          <p>The paper with ID "{id}" could not be found in our database.</p>
          <p className="debug-info">Please check the paper ID and try again.</p>
          <Link href="/" className="back-button">
            ← Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="paper-detail-container">
      <div className="navigation-header">
        <Link href="/" className="back-button">
          ← Back to Home
        </Link>
        <div className="paper-id-display">Paper ID: {paper.id}</div>
      </div>
      
      <article className="paper-detail">
        <header className="paper-header">
          <div className="paper-badge">Research Paper</div>
          <h1 className="paper-title">{paper.title}</h1>
          <div className="authors-section">
            <div className="authors-icon">👥</div>
            <p className="paper-authors">{paper.authors}</p>
          </div>
          <div className="paper-meta">
            <span className="update-date">Updated: {paper.update_date}</span>
          </div>
        </header>

        {paper.abstract && (
          <section className="paper-abstract">
            <div className="section-header">
              <h2>Abstract</h2>
              <div className="section-divider"></div>
            </div>
            <div className="abstract-content">
              <p>{paper.abstract}</p>
            </div>
          </section>
        )}
      </article>

      <section className="recommended-section">
        <div className="section-header">
          <h2>Related Research</h2>
          <p>Papers you might find interesting</p>
          <div className="section-divider"></div>
        </div>

        {recLoading ? (
          <div className="loading-state small">
            <div className="loading-spinner"></div>
            <p>Loading recommendations...</p>
          </div>
        ) : recommended.length > 0 ? (
          <div className="recommended-grid">
            {recommended.map((rec, index) => (
              <Link
                key={`${rec.id}-${index}`}
                href={`/paper/${rec.id}`}
                className="recommended-card"
              >
                <div className="card-content">
                  <div className="card-meta">
                    <span className="rec-date">{rec.update_date}</span>
                    {typeof rec.similarity === "number" && (
                      <div className="similarity-badge">
                        <span className="similarity-label">Relevance</span>
                        <span className="similarity-score">{(rec.similarity * 100).toFixed(1)}%</span>
                      </div>
                    )}
                  </div>
                  <h3 className="rec-title">{rec.title}</h3>
                  <p className="rec-authors">{rec.authors}</p>
                  <div className="card-footer">
                    <span className="view-paper">
                      View Paper
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="no-recommendations">
            <div className="empty-state">
              <div className="empty-icon">📚</div>
              <h3>No related papers found</h3>
              <p>We couldn't find any related research papers at the moment.</p>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}