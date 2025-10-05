// <CHANGE> backend README
# ResumeRAG Backend

Express + MongoDB API for uploading resumes (PDF/TXT), creating jobs, generating embeddings, and matching via cosine similarity.

## Endpoints

- GET /api/health
- GET /api/resumes
- POST /api/resumes (multipart/form-data)
  - fields: name (required), email, skills (comma separated), file (PDF/TXT) OR text
- POST /api/resumes/search
  - body: { queryText?: string, jobId?: string, topK?: number }
- GET /api/jobs
- POST /api/jobs
  - body: { title: string, company?: string, description: string }
- GET /api/jobs/:id/matches?topK=10

## Setup

- Create `.env` from the example and set MONGO_URI.
- Optionally set OPENAI_API_KEY to use OpenAI embeddings (text-embedding-3-small); otherwise a hashing fallback is used.

\`\`\`
npm install
npm run dev
