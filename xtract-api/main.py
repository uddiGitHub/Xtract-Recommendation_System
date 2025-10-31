from fastapi import FastAPI, Query, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import urllib.parse

app = FastAPI(title="Xtract API")

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

print("Xtract API is starting...")
df = pd.read_csv("/Users/apple/Documents/ML/Xtract/xtract-api/DataSet/arxiv_processed.csv")
print(f"Data loaded successfully: {len(df)} records")

# Check available columns and set up ID handling
print(f"Available columns: {df.columns.tolist()}")

# Create a proper ID column - use arXiv ID if available, otherwise create one
if 'id' not in df.columns:
    # Try to find arXiv ID column
    arxiv_cols = [col for col in df.columns if 'arxiv' in col.lower() or 'id' in col.lower()]
    if arxiv_cols:
        df['id'] = df[arxiv_cols[0]].astype(str)
        print(f"Using '{arxiv_cols[0]}' as ID column")
    else:
        df['id'] = [f"paper_{i}" for i in range(len(df))]
        print("Created 'id' column from index")

@app.get("/search")
async def search(query: str = Query(None, description="Search query string")):
    if not query or not query.strip():
        return []

    q_lower = query.lower()
    search_cols = ["title", "abstract"]
    available_cols = [col for col in search_cols if col in df.columns]
    
    if not available_cols:
        return []

    results = df[
        df[available_cols]
        .apply(lambda row: row.astype(str).str.lower().str.contains(q_lower).any(), axis=1)
    ]

    records = results.head(50).to_dict(orient="records")
    
    # Standardize response format
    standardized_records = []
    for record in records:
        standardized_records.append({
            'id': record.get('id', 'unknown'),
            'title': record.get('title', 'No title'),
            'authors': record.get('authors', 'Unknown authors'),
            'update_date': record.get('update_date', 
                                    record.get('date', 
                                    record.get('published_date', 'Unknown date'))),
            'abstract': record.get('abstract', ''),
            'citations': record.get('citations', record.get('citation_count', 0))
        })
    
    return standardized_records

@app.get("/paper/{paper_id:path}")
async def get_paper(paper_id: str):
    """
    Get detailed information for a specific paper by ID
    Uses :path to handle IDs with slashes
    """
    try:
        # URL decode the paper_id in case it was encoded
        paper_id = urllib.parse.unquote(paper_id)
        
        print(f"Looking for paper with ID: {paper_id}")
        
        # Try to find paper by id column
        if 'id' in df.columns:
            paper = df[df['id'].astype(str) == paper_id]
        else:
            paper = pd.DataFrame()
        
        if paper.empty:
            # Try case-insensitive search
            paper = df[df['id'].astype(str).str.lower() == paper_id.lower()]
        
        if paper.empty:
            # Try partial match for arXiv IDs
            paper = df[df['id'].astype(str).str.contains(paper_id, case=False, na=False)]
        
        if paper.empty:
            raise HTTPException(status_code=404, detail=f"Paper not found: {paper_id}")
        
        paper_data = paper.iloc[0].to_dict()
        
        # Standardize the response
        standardized_data = {
            'id': paper_data.get('id', paper_id),
            'title': paper_data.get('title', 'No title'),
            'authors': paper_data.get('authors', 'Unknown authors'),
            'update_date': paper_data.get('update_date', 
                                        paper_data.get('date', 
                                        paper_data.get('published_date', 'Unknown date'))),
            'abstract': paper_data.get('abstract', ''),
            'citations': paper_data.get('citations', paper_data.get('citation_count', 0)),
            'journal': paper_data.get('journal', paper_data.get('venue', 'arXiv')),
            'doi': paper_data.get('doi', '')
        }
        
        return standardized_data
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching paper: {str(e)}")

@app.get("/")
async def root():
    return {"message": "Xtract API is running", "records": len(df)}

@app.get("/health")
async def health():
    return {"status": "healthy", "records": len(df)}