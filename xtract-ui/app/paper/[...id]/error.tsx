"use client";
import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="paper-detail-container">
      <div className="error-state">
        <h2>Something went wrong!</h2>
        <p>{error.message}</p>
        <div className="error-actions">
          <button onClick={() => reset()} className="retry-button">
            Try again
          </button>
          <Link href="/" className="back-button">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}