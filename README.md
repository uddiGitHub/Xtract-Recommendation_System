# Xtract Research Paper Recommendation System

> Empowering researchers with intelligent recommendations for relevant research papers.

---

## Overview

**Xtract** is a research paper recommendation system designed to assist students, researchers, and academicians in discovering relevant academic papers based on their interests, search queries, or reading history.

It leverages **Natural Language Processing (NLP)** and **transformer-based embeddings** to understand the semantic similarity between research papers — going beyond simple keyword matching to deliver context-aware recommendations.

---

## Key Features


- **Semantic Recommendations:** Finds research papers based on meaning, not just keywords.  
- **Powered by Transformer Models:** Tested with both **SciBERT** and **SBERT** models for high-quality contextual embeddings.  
- **Interactive Frontend:** Modern, responsive UI for searching and exploring papers.  
- **Deployed on Vercel:** Seamless cloud hosting for easy access and scalability.  
- **Notebook Support:** Jupyter notebooks for data preprocessing, embedding generation, and experiments.  
- **Modular Design:** Separate modules for backend, frontend, and notebook experimentation.   

---


## Repository Structure

```bash
Xtract-Recommendation_System
├── backend/                     # Core backend logic
│   ├── xtract-api/              
│   ├── requirements.txt         # Python dependencies
│   └── (other backend modules)
│
├── xtract-notebook/             # Jupyter notebooks for data exploration & embeddings
│   ├── data_preprocessing.ipynb
│   ├── embedding_generation.ipynb
│   └── model_experiments.ipynb
│
├── xtract-ui/                   # Frontend web interface
│   ├── src/                     # Source code (React/TypeScript components)
│   ├── public/                  # Static assets
│   └── package.json             # UI dependencies
│
├── .gitignore                   # Ignored files and folders
└── README.md                    # Project documentation

```
Project Preview
---------------

<img width="1920" height="1080" alt="Xtract Recommendation System Preview" src="https://github.com/user-attachments/assets/97825002-e521-4900-b45a-017466250da9" />

*Figure 1: Screenshot of the Xtract Recommendation System interface.*

<img width="1920" height="1080" alt="Xtract Recommendation System Search" src="https://github.com/user-attachments/assets/7fff22f3-3fc1-4d0b-b304-d5f4328398e8" />

*Figure 2: Screenshot of the Xtract Recommendation System Search Result.*

---

## Requirements

- Node.js (v16+)
- Python (v3.8+)
- Git

---

## Installation

Clone the repository:

```bash
git clone https://github.com/hirakjyoti08/Xtract-Recommendation_System.git
cd Xtract-Recommendation_System
```


---

Running the Project
-------------------

### Backend Service

Navigate to the backend directory and install dependencies:

```bash
cd backend
npm install
npm start
```

### API Server

In a new terminal window, start the API server:

```bash
cd xtract-api
npm install
npm run dev
```

### Frontend Application

Start the frontend interface:

```bash
cd xtract-ui
npm install
npm run dev
```


---

Usage
-----

1. Start the backend, API server, and frontend
2. Open the frontend application in the browser
3. Enter research-related keywords or queries
4. View recommended academic papers

---

Technologies Used
-----------------

- Node.js
- Express.js
- React / Next.js
- Python
- Jupyter Notebook

---

Use Cases
---------

- Research paper discovery
- Academic assistance for students and researchers
- Experimentation with recommendation algorithms
- Prototype system for research-based recommendation engines

---

Future Enhancements
-------------------

- Advanced ranking and personalization
- Integration with larger academic datasets
- NLP-based recommendation models
- User feedback-based learning

---

Contributing
------------

Contributions are welcome.  
Please fork the repository, create a feature branch, and submit a pull request.

---

License
-------

This project is licensed under the MIT License.

---

Author
------

@hirakjyoti08
@uddiGitHub

