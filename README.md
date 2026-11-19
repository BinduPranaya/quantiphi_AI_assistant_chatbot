# Quantiphi AI Chat Assistant

A full-stack AI chat application built for the Quantiphi Vibe Coding assessment.

## Features
- React + Vite chat interface with conversation sidebar
- OpenAI-powered responses (streamed using Server-Sent Events)
- Professional, Casual, and Concise tone selector
- MongoDB persistence for conversations and messages
- Copy and regenerate AI responses
- New chat, conversation history, loading and error states

## Requirements
- Node.js 18+
- Python 3.10+
- MongoDB running locally or a MongoDB Atlas connection string
- OpenAI API key

## Run locally

### 1. Backend
```bash
cd backend
python -m venv .venv
# Windows:
.venv\Scripts\activate
# macOS/Linux:
source .venv/bin/activate
pip install -r requirements.txt
copy .env.example .env   # Windows
# cp .env.example .env   # macOS/Linux
```
Edit `backend/.env` and add your `OPENAI_API_KEY` and `MONGO_URI`.

```bash
python app.py
```
Backend runs at http://localhost:5000.

### 2. Frontend (new terminal)
```bash
cd frontend
npm install
npm run dev
```
Open the URL printed by Vite (normally http://localhost:5173).

## Environment variables
- `OPENAI_API_KEY`: required for AI responses.
- `OPENAI_MODEL`: optional; defaults to `gpt-4o-mini`.
- `MONGO_URI`: MongoDB connection string; defaults to local MongoDB.
- `MONGO_DB`: database name; defaults to `quantiphi_chat`.
- `PORT`: backend port; defaults to `5000`.
- `FRONTEND_ORIGIN`: frontend origin; defaults to `http://localhost:5173`.

## API
- `GET /api/health` - backend and database status
- `GET /api/conversations` - list conversations
- `POST /api/conversations` - create a conversation
- `GET /api/conversations/<id>` - fetch conversation and messages
- `DELETE /api/conversations/<id>` - delete a conversation
- `POST /api/chat/stream` - stream an AI response as SSE

## Notes
- MongoDB must be available for persistence.
- Never commit `.env`; the repository includes `.env.example`.
- The OpenAI key is used only by the backend.
- During the assessment, verify API key access, database connectivity, and GitHub visibility before submission.
