# 🧠 Xtract Research Paper Recommendation System

> Empowering researchers with intelligent recommendations for relevant research papers.

---

## 🚀 Overview

**Xtract** is a research paper recommendation system designed to assist students, researchers, and academicians in discovering relevant academic papers based on their interests, search queries, or reading history.

It leverages **Natural Language Processing (NLP)** and **transformer-based embeddings** to understand the semantic similarity between research papers — going beyond simple keyword matching to deliver context-aware recommendations.

---

## 🧩 Key Features


- 🔍 **Semantic Recommendations:** Finds research papers based on meaning, not just keywords.  
- 🧠 **Powered by Transformer Models:** Tested with both **SciBERT** and **SBERT** models for high-quality contextual embeddings.  
- 💻 **Interactive Frontend:** Modern, responsive UI for searching and exploring papers.  
- ☁️ **Deployed on Vercel:** Seamless cloud hosting for easy access and scalability.  
- 📓 **Notebook Support:** Jupyter notebooks for data preprocessing, embedding generation, and experiments.  
- 🧱 **Modular Design:** Separate modules for backend, frontend, and notebook experimentation.   

---


## 🗂️ Repository Structure

```bash
📦 Xtract-Recommendation_System
├── 📁 backend/                     # Core backend logic
│   ├── ⚙️ xtract-api/              
│   ├── 📜 requirements.txt         # Python dependencies
│   └── 🧩 (other backend modules)
│
├── 📁 xtract-notebook/             # Jupyter notebooks for data exploration & embeddings
│   ├── 📘 data_preprocessing.ipynb
│   ├── 📘 embedding_generation.ipynb
│   └── 🧠 model_experiments.ipynb
│
├── 💻 xtract-ui/                   # Frontend web interface
│   ├── 🪄 src/                     # Source code (React/TypeScript components)
│   ├── 🎨 public/                  # Static assets
│   └── 📦 package.json             # UI dependencies
│
├── 🔒 .gitignore                   # Ignored files and folders
└── 📖 README.md                    # Project documentation

