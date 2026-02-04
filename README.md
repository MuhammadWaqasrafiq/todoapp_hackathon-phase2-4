# 🤖 Taskoo AI: Spec-Driven Fullstack Assistant

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Python](https://img.shields.io/badge/backend-FastAPI-009688.svg)
![Next.js](https://img.shields.io/badge/frontend-Next.js-black.svg)
![Status](https://img.shields.io/badge/status-Active-success.svg)

**Taskoo AI** is an intelligent, spec-driven task management assistant designed to revolutionize how you organize your day. Built with a stateless, scalable architecture, it leverages the power of **AI Agents** and the **Model Context Protocol (MCP)** to understand your natural language and perform complex task operations effortlessly.

---

## 🚀 About The Project

Traditional todo apps are rigid. Taskoo AI brings the flexibility of human conversation to productivity. Instead of clicking buttons and filling forms, just say *"Remind me to buy milk tomorrow"* or *"Clear all my completed tasks"*, and watch it happen.

### Key Capabilities

*   **💬 Natural Language Interface**: Chat naturally with your assistant to manage your workload.
*   **🧠 Intelligent Agent**: Powered by OpenAI's Agents SDK to understand context and intent.
*   **🛠️ MCP Standard**: Utilizes the **Model Context Protocol** to standardize how the AI invokes tools for creating, listing, updating, and deleting tasks.
*   **🔒 Secure & Private**: Built with **Better Auth** for robust, stateless authentication and strict user data isolation.
*   **☁️ Cloud Native**: Designed for serverless deployment with a stateless Python backend and Neon PostgreSQL.

---

## 🏗️ Architecture

Taskoo AI follows a modern, decoupled architecture designed for scalability and maintainability.

```mermaid
graph TD
    User[👤 User] -->|Interacts| Frontend[💻 Next.js Frontend]
    Frontend -->|Auth (JWT)| Auth[🔐 Better Auth]
    Frontend -->|Chat Request| Backend[🐍 FastAPI Backend]
    
    subgraph "Backend System"
        Backend -->|Invoke| Agent[🤖 OpenAI Agent]
        Agent -->|Use Tool| MCP[🛠️ MCP Server]
        MCP -->|CRUD| DB[(🗄️ Neon PostgreSQL)]
    end

    Backend -->|Persist History| DB
```

### The Flow
1.  **Frontend**: Captures user input and handles authentication via **Better Auth**.
2.  **API**: Sends the user's message + JWT to the **FastAPI** backend.
3.  **Agent**: The **OpenAI Agent** processes the message, retrieving conversation history from the DB.
4.  **MCP**: If an action is required (e.g., "add task"), the agent calls the appropriate tool via the **MCP Server**.
5.  **Database**: The tool executes the operation on **Neon PostgreSQL** using **SQLModel**.
6.  **Response**: The agent generates a natural language confirmation, sent back to the user.

---

## 💻 Tech Stack

### Frontend
*   **Framework**: [Next.js 16](https://nextjs.org/) (React 19)
*   **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
*   **AI SDK**: [Vercel AI SDK](https://sdk.vercel.ai/docs)
*   **Icons**: Lucide React

### Backend
*   **Server**: [FastAPI](https://fastapi.tiangolo.com/) (Python 3.11+)
*   **ORM**: [SQLModel](https://sqlmodel.tiangolo.com/)
*   **AI Framework**: OpenAI Agents SDK
*   **Tooling Protocol**: [Model Context Protocol (MCP)](https://modelcontextprotocol.io/)

### Infrastructure & Data
*   **Database**: [Neon](https://neon.tech/) (Serverless PostgreSQL)
*   **Authentication**: [Better Auth](https://better-auth.com/)
*   **Validation**: Pydantic

---

## 🏁 Getting Started

Follow these steps to set up Taskoo AI locally.

### Prerequisites
*   **Python 3.11+**
*   **Node.js 18+**
*   **OpenAI API Key**
*   **PostgreSQL Database** (Local or Neon)

### 1️⃣ Backend Setup

1.  **Navigate to the backend directory:**
    ```bash
    cd backend
    ```

2.  **Create and activate a virtual environment:**
    ```bash
    python -m venv .venv
    # Windows
    .venv\Scripts\activate
    # macOS/Linux
    source .venv/bin/activate
    ```

3.  **Install dependencies:**
    ```bash
    pip install -r requirements.txt
    ```

4.  **Configure Environment:**
    Create a `.env` file based on `.env.example`:
    ```env
    DATABASE_URL=postgresql://user:pass@host/db
    OPENAI_API_KEY=sk-...
    BETTER_AUTH_SECRET=your_secret_key
    ```

5.  **Initialize Database:**
    ```bash
    python -m src.db_init
    ```

6.  **Start the Server:**
    ```bash
    uvicorn src.main:app --reload
    ```
    ✅ Backend running at `http://localhost:8000`

### 2️⃣ Frontend Setup

1.  **Navigate to the frontend directory:**
    ```bash
    cd frontend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Configure Environment:**
    Create a `.env.local` file based on `.env.example`:
    ```env
    NEXT_PUBLIC_API_URL=http://localhost:8000
    BETTER_AUTH_URL=http://localhost:3000
    BETTER_AUTH_SECRET=your_secret_key # Must match backend
    NEXT_PUBLIC_OPENAI_DOMAIN_KEY=...
    ```

4.  **Run Database Migrations (for Auth):**
    ```bash
    npm run db:migrate
    ```

5.  **Start the Application:**
    ```bash
    npm run dev
    ```
    ✅ Frontend running at `http://localhost:3000`

---

## 🕹️ Usage Examples

Once everything is running, open `http://localhost:3000` and try these commands:

*   **Create**: "Add a task to finish the presentation by Friday."
*   **List**: "What do I have to do today?"
*   **Update**: "Change the presentation task to high priority."
*   **Complete**: "Mark the grocery shopping task as done."
*   **Contextual**: "Delete that last task."

---

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

<p align="center">
  Built with ❤️ during the Spec-Driven Development Hackathon
</p>
