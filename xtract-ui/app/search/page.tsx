"use client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import "./SearchPage.css";

interface SearchResult {
  id: string;
  title: string;
  authors: string;
  update_date: string;
  abstract?: string;
  citations?: number;
}

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (query) {
      setLoading(true);
      setError(null);
      fetch(`http://127.0.0.1:8000/search?query=${encodeURIComponent(query)}`)
        .then((res) => {
          if (!res.ok) {
            throw new Error('Failed to fetch results');
          }
          return res.json();
        })
        .then((data) => setResults(data))
        .catch((err) => setError(err.message))
        .finally(() => setLoading(false));
    }
  }, [query]);

  return (
    <section className="search-page">
      <div className="search-header">
        <h1 className="search-title">
          Search Results for: <span className="search-query">"{query}"</span>
        </h1>
        {results.length > 0 && (
          <p className="results-count">{results.length} papers found</p>
        )}
      </div>

      {loading ? (
        <div className="loading-state">
          <div className="loading-spinner"></div>
          Searching research papers...
        </div>
      ) : error ? (
        <div className="no-results">
          <p>Error loading results: {error}</p>
          <p>Please try again later.</p>
        </div>
      ) : results.length > 0 ? (
        <div className="results-grid">
          {results.map((item, index) => (
            <Link
              key={index}
              href={`/paper/${encodeURIComponent(item.id)}`}
              className="result-card-link"
            >
              <article className="result-card">
                <h2 className="result-title">{item.title}</h2>
                <p className="result-author">By {item.authors}</p>
                <p className="result-year">Published: {item.update_date}</p>
                {item.abstract && (
                  <p className="result-abstract">
                    {item.abstract.substring(0, 150)}...
                  </p>
                )}
              </article>
            </Link>
          ))}
        </div>
      ) : query ? (
        <div className="no-results">
          <p>No research papers found for "{query}"</p>
          <p>Try different keywords or check your spelling.</p>
        </div>
      ) : (
        <div className="no-results">
          <p>Enter a search term to find research papers</p>
        </div>
      )}
    </section>
  );
}