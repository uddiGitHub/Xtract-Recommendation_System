"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import logo from "../assets/logo.png";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const quickSearches = [
    "Machine Learning",
    "Artificial Intelligence",
    "Data Science",
    "Computer Vision",
    "Natural Language Processing",
    "Neural Networks",
    "Deep Learning",
    "Reinforcement Learning"
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleQuickSearch = (query: string) => {
    setSearchQuery(query);
    router.push(`/search?q=${encodeURIComponent(query)}`);
  };

  return (
    <>
      <section className="search-section">
        <div className="search-container">
          <div className="logo-container">
            <img src={logo.src} alt="Xtract - AI Research Assistant" />
            <p>Research Paper Recommendation System</p>
          </div>
          
          <form onSubmit={handleSearch}>
            <div className="search-box">
              <input
                type="text"
                className="search-input"
                placeholder="Search research papers, authors, topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit" className="search-button" aria-label="Search">
                <svg 
                  width="20" 
                  height="20" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
              </button>
            </div>
          </form>
          
          <div className="quick-searches">
            <h3>Popular Research Topics</h3>
            <div className="tags">
              {quickSearches.map((topic, index) => (
                <div
                  key={index}
                  className="tag"
                  onClick={() => handleQuickSearch(topic)}
                >
                  {topic}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}