# AI Learning Platform

An AI-powered learning platform that transforms PDF documents into interactive learning experiences using Retrieval-Augmented Generation (RAG), semantic search, and multi-model AI orchestration.

Users can upload study materials, interact with documents through natural language, generate flashcards and quizzes, receive AI-powered summaries, and learn concepts through context-aware conversations grounded in the uploaded content.



## Features

### 📄 Document Processing

* Upload PDF documents securely.
* Extract text from PDFs automatically.
* Intelligent text cleaning and preprocessing.
* Semantic chunking with overlap preservation for better context retention.

### 🔍 Retrieval-Augmented Generation (RAG)

* Generate embeddings for document chunks using Gemini Embedding Models.
* Store embeddings in MongoDB Atlas Vector Search.
* Perform semantic similarity search to retrieve the most relevant document sections.
* Context-aware question answering grounded in uploaded documents.
* Reduces hallucinations by ensuring responses are based on retrieved content.

### 🎯 LLM-Based Reranking

* Retrieve multiple candidate chunks using vector search.
* Use an LLM reranker to rank retrieved chunks by relevance.
* Select the highest-quality context before generating responses.
* Improves retrieval precision and answer quality.

### 🤖 Multi-Model AI Pipeline

* Generate responses using multiple Large Language Models.
* Evaluate outputs using an LLM-as-a-Judge architecture.
* Automatically select the highest-quality response.
* Improves reliability compared to relying on a single model.

### 🧠 AI Learning Tools

#### Flashcard Generation

* Automatically generate educational flashcards from uploaded documents.
* Difficulty-based flashcards (Easy, Medium, Hard).
* Store and manage flashcard sets.

#### Quiz Generation

* Generate multiple-choice quizzes directly from study material.
* Automatic answer generation and explanations.
* Difficulty-aware question generation.

#### AI Summaries

* Generate concise and structured summaries.
* Highlight key concepts and important topics.
* Useful for rapid revision.

#### Concept Explanation

* Explain specific concepts from uploaded documents.
* Context-aware explanations based on document content.
* Educational and beginner-friendly responses.

### 💬 Document Chat Assistant

* Ask questions directly about uploaded documents.
* Maintain document-specific chat history.
* Context retrieval powered by vector search and reranking.
* Responses grounded in source material.



## System Architecture

```text
PDF Upload
     │
     ▼
Text Extraction
     │
     ▼
Semantic Chunking
     │
     ▼
Embedding Generation
     │
     ▼
MongoDB Atlas Vector Search
     │
     ▼
Top-K Retrieval
     │
     ▼
LLM Reranking
     │
     ▼
Context Selection
     │
     ▼
Multi-Model Generation
     │
     ▼
LLM Judge Evaluation
     │
     ▼
Best Response
```



## 🛠️ Tech Stack

### Frontend

* React
* JavaScript
* Axios

### Backend

* Node.js
* Express.js

### Database

* MongoDB
* MongoDB Atlas Vector Search

### AI & NLP

* Google Gemini API
* Gemini Embeddings
* Retrieval-Augmented Generation (RAG)
* Semantic Search
* LLM Reranking
* Multi-Model Inference Pipeline
* LLM-as-a-Judge Evaluation

### Authentication

* JWT Authentication
* Protected Routes

### File Processing

* PDF Parsing
* Text Chunking
* Semantic Retrieval



## 🎯 Key Technical Highlights

### Retrieval-Augmented Generation (RAG)

Implemented a complete RAG pipeline by:

* Chunking extracted document text.
* Generating vector embeddings.
* Storing embeddings in MongoDB Atlas.
* Retrieving semantically relevant chunks for user queries.
* Using retrieved context to ground AI responses.

### LLM Reranking

Improved retrieval quality by:

* Retrieving top candidate chunks through vector search.
* Applying LLM-based reranking.
* Selecting the most relevant context before answer generation.

### Multi-Model Answer Selection

Implemented an ensemble-style architecture:

* Multiple AI models generate responses independently.
* A judge model evaluates generated outputs.
* The best response is selected automatically.

### Scalable Architecture

* Separate document and chunk storage.
* Vector-search-based retrieval.
* Modular AI services.
* Extensible multi-model pipeline.



## 📈 Future Improvements

* Hybrid Retrieval (Vector Search + Keyword Search)
* Conversation-Aware Retrieval
* Personalized Learning Recommendations
* Learning Progress Analytics
* Adaptive Quiz Generation
* Real-Time Streaming Responses
* Multi-Document Question Answering



## 🎓 Learning Outcomes

Through this project, I explored:

* Retrieval-Augmented Generation (RAG)
* Vector Databases and Semantic Search
* Embedding Models
* LLM Reranking
* Multi-Model AI Systems
* LLM-as-a-Judge Architectures
* Full-Stack Application Development
* Document Intelligence Systems
