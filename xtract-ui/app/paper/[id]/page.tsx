"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import "./PaperDetail.css";

interface PaperDetail {
  id: string;
  title: string;
  authors: string;
  update_date: string;
  abstract?: string;
  similarity?: number;
}

export default function PaperDetailPage() {
  const params = useParams();
  const encodedId = params.id as string;
  const id = decodeURIComponent(encodedId);
  
  const [paper, setPaper] = useState<PaperDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [recommended, setRecommended] = useState<PaperDetail[]>([]);
  const [recLoading, setRecLoading] = useState(true);

  useEffect(() => {
    if (id) {
      setLoading(true);
      setError(null);
      fetch(`http://127.0.0.1:8000/paper/${encodeURIComponent(id)}`)
        .then((res) => {
          if (!res.ok) {
            throw new Error('Failed to fetch paper details');
          }
          return res.json();
        })
        .then((data) => setPaper(data))
        .catch((err) => setError(err.message))
        .finally(() => setLoading(false));

      fetch(`http://127.0.0.1:8000/recommend/${encodeURIComponent(id)}`)
        .then((res) => res.json())
        .then((data) => setRecommended(data))
        .catch(() => setRecommended([]))
        .finally(() => setRecLoading(false));
    }
  }, [id]);

  if (loading) {
    return (
      <div className="paper-detail-container">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading research paper...</p>
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
          <Link href="/" className="back-button">
            ← Back to Home
          </Link>
        </div>
      </div>
    );
  }

  if (!paper) {
    return (
      <div className="paper-detail-container">
        <div className="no-paper">
          <h2>Paper not found</h2>
          <p>The requested paper could not be found in our database.</p>
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
      </div>
      
      <article className="paper-detail">
        <header className="paper-header">
          <div className="paper-badge">Research Paper</div>
          <h1 className="paper-title">{paper.title}</h1>
          <div className="authors-section">
            <div className="authors-avatar"></div>
            <p className="paper-authors">👥 : {paper.authors}</p>
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
            {recommended.map((rec) => (
              <Link
                key={rec.id}
                href={`/paper/${encodeURIComponent(rec.id)}`}
                className="recommended-card"
              >
                <div className="card-header">
                  <div className="card-badge">Related</div>
                </div>
                <div className="card-content">
                  <h3 className="rec-title">{rec.title}</h3>
                  <p className="rec-authors">{rec.authors}</p>
                </div>
                <div className="card-footer">
                  <span className="rec-date">{rec.update_date}</span>
                  <span className="rec-date">Similarity Score: {typeof rec.similarity === "number" ? rec.similarity.toFixed(2) : "N/A"}</span>
                  <div className="card-arrow">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
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