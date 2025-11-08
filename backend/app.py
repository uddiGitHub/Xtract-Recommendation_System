from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pandas as pd
import numpy as np
import faiss
from sentence_transformers import SentenceTransformer
import os
import gdown

app = FastAPI(title="Research Paper Recommendation API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow Next.js frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

print("🔄 Loading dataset and FAISS index...")
def download_from_drive(file_id, output):
    if not os.path.exists(output):
        print(f"📥 Downloading {output} from Google Drive...")
        url = f"https://drive.google.com/uc?id={file_id}"
        gdown.download(url, output, quiet=False)
    else:
        print(f"✅ {output} already exists, skipping download.")

download_from_drive("1ME6Bb5WjVbIYr4-0iF0kUa35-82DTsUn", "papers_with_embeddings.csv")
download_from_drive("1IwOkhBu-odM2GYmvZdS1Q5AHkf0pDV02", "embeddings.npy")
download_from_drive("1MEB_4ZGunbxi65jW9UN0L8bnp9VUCH8s", "papers_index.faiss")

try:
    df = pd.read_csv("papers_with_embeddings.csv")
    embeddings = np.load("embeddings.npy")
    index = faiss.read_index("papers_index.faiss")
except Exception as e:
    raise RuntimeError(f" Failed to load files: {e}")

model = SentenceTransformer("allenai/specter2_base")

print(f" Loaded {len(df)} papers and FAISS index with {index.ntotal} vectors.")

class Paper(BaseModel):
    id: str
    title: str
    authors: str
    update_date: str
    abstract: str | None = None
    category_code: str | None = None

def get_recommendations(paper_id: str, top_k: int = 6):
    paper = df[df["id"].astype(str) == str(paper_id)]
    if paper.empty:
        raise HTTPException(status_code=404, detail="Paper not found")

    text = f"{paper.iloc[0]['title']}. {paper.iloc[0]['abstract']}"
    query_vec = model.encode([text], normalize_embeddings=True)

    D, I = index.search(query_vec, top_k + 1)
    recs = df.iloc[I[0]].copy()
    recs["similarity"] = D[0]
    # Exclude the query paper itself
    recs = recs[recs["id"].astype(str) != str(paper_id)]

    return recs[["id", "title", "authors", "update_date", "abstract", "similarity"]].head(top_k).to_dict(orient="records")


def search_papers(query_text: str, top_k: int = 50):
    if not query_text.strip():
        raise HTTPException(status_code=400, detail="Query cannot be empty.")

    query_vec = model.encode([query_text], normalize_embeddings=True)
    D, I = index.search(query_vec, top_k)

    recs = df.iloc[I[0]].copy()
    recs["similarity"] = D[0]
    # Include abstract in output
    return recs[["id", "title", "authors", "update_date", "abstract", "similarity"]].to_dict(orient="records")


@app.get("/")
def root():
    return {"message": "SPECTER + FAISS Recommendation API is running 🚀"}

@app.get("/paper/{paper_id}")
def get_paper(paper_id: str):
    paper = df[df["id"].astype(str) == str(paper_id)]
    if paper.empty:
        raise HTTPException(status_code=404, detail="Paper not found")
    return paper.iloc[0].to_dict()

@app.get("/recommend/{paper_id}")
def recommend_papers(paper_id: str, top_k: int = 6):
    try:
        recs = get_recommendations(paper_id, top_k)
        return recs
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Recommendation error: {e}")

@app.get("/search")
def search_endpoint(query: str = Query(..., description="Search text query"), top_k: int = 50):
    """
    Search for semantically similar papers using SPECTER embeddings.
    Example: /search?query=graph neural networks
    """
    try:
        results = search_papers(query, top_k)
        return results
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Search error: {e}")

