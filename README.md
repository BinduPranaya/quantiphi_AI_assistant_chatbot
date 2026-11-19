# 🤖 AI Chat Assistant

An intelligent, real-time AI Chat Assistant built using **React, Flask, OpenAI API, and MongoDB Atlas**. The application provides a smooth conversational experience with streaming AI responses, conversation history, customizable response tones, and persistent chat storage.

---

## ✨ Features

### 💬 1. Real-Time AI Chat
- Interactive chat interface with separate user and AI message bubbles.
- Send prompts and receive AI-generated responses.
- Streaming responses displayed character by character.
- Scrollable conversation window for a seamless chat experience.

### 🧠 2. AI-Powered Responses
- Integrated with the OpenAI API.
- Generates contextual responses based on user prompts.
- Supports continuous conversations.

### 🎨 3. Customizable Response Tones
Choose how the AI communicates using three available tones:

| Tone | Description |
|---|---|
| 💼 Professional | Formal, structured, and professional responses |
| 😊 Casual | Friendly and conversational responses |
| ⚡ Concise | Short and direct responses |

The selected tone is passed to the backend and incorporated into the AI system instructions.

### 📚 4. Conversation History
- Displays previous conversations in a sidebar.
- Allows users to revisit earlier chat sessions.
- Stores conversation data in MongoDB Atlas.
- Maintains conversation history across application restarts.

### 📋 5. Copy AI Responses
- Copy AI-generated messages with a single click.
- Easily reuse generated content.

### 🔄 6. Regenerate Responses
- Generate another response for the same user prompt.
- Useful when the initial response does not meet expectations.

---

## 🛠️ Technology Stack

| Technology | Purpose |
|---|---|
| ⚛️ React | Frontend user interface |
| ⚡ Vite | Frontend development server and build tool |
| 🎨 CSS | Application styling |
| 🐍 Python | Backend programming language |
| 🌶️ Flask | Backend API framework |
| 🤖 OpenAI API | AI-powered response generation |
| 🍃 MongoDB Atlas | Cloud database |
| 🔌 PyMongo | MongoDB connectivity |
| 📡 Server-Sent Events (SSE) | Streaming AI responses |
| 🔧 Git & GitHub | Version control and source code management |

---

## 🏗️ System Architecture

The application follows a frontend-backend architecture.

```text
             👤 USER
                |
                ▼
       ⚛️ REACT FRONTEND
                |
                | HTTP Requests
                ▼
         🐍 FLASK BACKEND
                |
          ┌─────┴─────┐
          ▼           ▼
     🤖 OPENAI     🍃 MONGODB
        API          ATLAS
          |           |
          ▼           ▼
    AI RESPONSE   CHAT HISTORY
          |
          ▼
   📡 STREAMING SSE
          |
          ▼
    ⚛️ REACT UI
          |
          ▼
   💬 DISPLAY RESPONSE
```

### 🔄 Application Workflow

1. The user enters a prompt in the React chat interface.
2. The selected response tone is sent along with the prompt.
3. The Flask backend receives the request.
4. The backend communicates with the OpenAI API.
5. The AI response is streamed to the frontend using Server-Sent Events (SSE).
6. The conversation is stored in MongoDB Atlas.
7. The frontend displays the generated response.
8. Previous conversations can be retrieved through the history sidebar.

---

## 📁 Project Structure

```text
quantiphi-chat-assistant/
│
├── backend/
│   ├── app.py
│   ├── config.py
│   ├── requirements.txt
│   ├── .env.example
│   │
│   ├── database/
│   │   └── db.py
│   │
│   ├── routes/
│   │   ├── chat.py
│   │   └── conversations.py
│   │
│   └── services/
│       └── ai_service.py
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ChatSidebar.jsx
│   │   │   ├── ToneSelector.jsx
│   │   │   ├── ChatMessage.jsx
│   │   │   └── ChatWindow.jsx
│   │   │
│   │   ├── services/
│   │   │   └── chatService.js
│   │   │
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.jsx
│   │
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── .gitignore
└── README.md
```

### 📌 Backend Components

- **app.py:** Initializes the Flask application and registers routes.
- **config.py:** Manages application configuration.
- **database/db.py:** Handles MongoDB database connectivity.
- **routes/chat.py:** Handles chat-related API requests.
- **routes/conversations.py:** Handles conversation history operations.
- **services/ai_service.py:** Manages communication with the OpenAI API and AI response generation.

### 📌 Frontend Components

- **App.jsx:** Main application component.
- **ChatSidebar.jsx:** Displays conversation history.
- **ChatWindow.jsx:** Displays the active conversation and chat input.
- **ChatMessage.jsx:** Renders individual chat messages.
- **ToneSelector.jsx:** Allows users to select their preferred response tone.
- **chatService.js:** Handles communication between the frontend and backend.

---

## ⚙️ Installation and Setup

### 📋 Prerequisites

Make sure the following tools are installed:

- Python 3.10 or later
- Node.js and npm
- Git
- Visual Studio Code
- MongoDB Atlas account
- OpenAI API key

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/quantiphi-chat-assistant.git
```

Navigate into the project:

```bash
cd quantiphi-chat-assistant
```

### 2️⃣ Backend Setup

Navigate to the backend directory:

```bash
cd backend
```

Create a Python virtual environment:

```bash
python -m venv .venv
```

Activate the virtual environment on Windows:

```bash
.venv\Scripts\activate
```

Install the required dependencies:

```bash
pip install -r requirements.txt
```

### 3️⃣ Environment Configuration

Create a `.env` file inside the `backend` directory.

Add the following configuration:

```env
OPENAI_API_KEY=your_openai_api_key
OPENAI_MODEL=gpt-4o-mini

MONGO_URI=your_mongodb_atlas_connection_string
MONGO_DB=ai_assistant

PORT=5000
FRONTEND_ORIGIN=http://localhost:5173
```

**🔐 Important Security Notes:**
- Replace the placeholder values with your actual credentials.
- Never upload your `.env` file to GitHub.
- Never expose your OpenAI API key or MongoDB password in frontend code.
- Keep all sensitive credentials on the backend.

### 4️⃣ Start the Backend Server

Make sure you are inside the `backend` directory and your virtual environment is activated.

Run:

```bash
python app.py
```

The Flask backend should start at:

```text
http://localhost:5000
```

### 5️⃣ Frontend Setup

Open a new terminal in VS Code.

Navigate to the frontend directory:

```bash
cd frontend
```

Install the dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open the application in your browser:

```text
http://localhost:5173
```

---

## 🍃 MongoDB Atlas Configuration

This project uses MongoDB Atlas to store conversation history.

### Setup Steps

1. Create an account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Create a project.
3. Create a free MongoDB cluster.
4. Configure a database user under **Security → Database Access**.
5. Configure your IP access list under **Security → Network Access**.
6. Select **Connect → Drivers**.
7. Copy your MongoDB connection string.
8. Add the connection string to `backend/.env`.
9. Set the database name to `ai_assistant`.

The database and collections can be created automatically when the application first stores conversation data.

---

## 🔑 OpenAI API Configuration

1. Visit the [OpenAI Platform](https://platform.openai.com/).
2. Sign in to your account.
3. Navigate to API Keys.
4. Create a new secret key.
5. Add the key to your backend `.env` file.

```env
OPENAI_API_KEY=your_openai_api_key
OPENAI_MODEL=gpt-4o-mini
```

**Note:** API usage may incur charges depending on your account and model usage. Check your API billing and usage limits.

---

## ▶️ Running the Application

You need two terminal sessions to run the complete application.

| Terminal | Directory | Command |
|---|---|---|
| 🐍 Terminal 1 | `backend` | `python app.py` |
| ⚛️ Terminal 2 | `frontend` | `npm run dev` |

Once both servers are running, visit:

🌐 **http://localhost:5173**

---

## 🧪 Application Testing Checklist

After launching the application, verify the following:

- [ ] Application loads successfully.
- [ ] User can start a new conversation.
- [ ] User can send a prompt.
- [ ] AI generates a response successfully.
- [ ] Response streams character by character.
- [ ] Professional tone works correctly.
- [ ] Casual tone works correctly.
- [ ] Concise tone works correctly.
- [ ] Previous conversations appear in the sidebar.
- [ ] Conversation history persists after restarting the application.
- [ ] Copy response functionality works.
- [ ] Regenerate response functionality works.
- [ ] MongoDB stores conversation data successfully.

---

## 🛡️ Security Considerations

- API keys are stored in backend environment variables.
- MongoDB credentials are not exposed to the frontend.
- Database access should be restricted using MongoDB Atlas Network Access settings.
- The `.env` file is excluded from version control.
- The backend handles communication with external AI services.

---

## 🐛 Troubleshooting

| Problem | Possible Solution |
|---|---|
| MongoDB authentication failed | Verify the database username and password in `MONGO_URI`. |
| MongoDB connection timeout | Check Atlas Network Access and your internet connection. |
| OpenAI authentication error | Verify the API key in `.env`. |
| Module not found | Activate the virtual environment and run `pip install -r requirements.txt`. |
| npm not recognized | Install Node.js and restart the terminal. |
| Frontend cannot connect to backend | Ensure Flask is running on port 5000. |
| Port already in use | Stop the existing process or configure another port. |
| AI response not streaming | Check the backend logs and OpenAI API response. |

---

## 🚀 Future Enhancements

Some possible improvements for future versions:

- 🔐 User authentication and personalized chat history.
- 📎 File upload and document-based conversations.
- 🌍 Support for multiple AI models.
- 🗣️ Voice input and speech responses.
- 🔍 Search across previous conversations.
- 🌙 Dark and light themes.
- 📊 Usage analytics and conversation insights.

---

## 🎯 Project Objective

The objective of this project is to develop an interactive AI-powered chat application that demonstrates real-time AI integration, streaming responses, backend API development, database persistence, and customizable conversational experiences.

The project combines frontend development, backend integration, AI services, and cloud database management into one practical application.

---

## 👨‍💻 Developed With

❤️ Built using React, Flask, OpenAI API, and MongoDB Atlas.

**Project:** AI Chat Assistant  
**Purpose:** Quantiphi Vibe Coding Assessment  
**Status:** Development

---

⭐ If you find this project useful, consider giving the repository a star!

