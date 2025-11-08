import { Suspense } from "react";
import PaperDetailContent from "./PaperDetailContent";
import "./PaperDetail.css";

// Force dynamic rendering - disable static generation
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function PaperDetailPage() {
  return (
    <Suspense fallback={
      <div className="paper-detail-container">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading paper details...</p>
        </div>
      </div>
    }>
      <PaperDetailContent />
    </Suspense>
  );
}