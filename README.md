# Eli Kobia | Interactive AI Portfolio

A full-stack developer portfolio featuring an integrated, voice-enabled AI agent capable of answering questions about my engineering background, serving my CV, and generating direct contact links.

## 🏗️ System Architecture

This project operates on a decoupled frontend/backend architecture, communicating via REST API.

*   **Frontend (Vercel):** Built with Next.js and TypeScript. Features an asymmetrical Bento Grid UI and handles client-side audio recording for voice-to-text queries.
*   **Backend (Render):** Built with Python and FastAPI. Serves as the orchestration layer for AI integrations and maintains a SQLite database for telemetry logging.

## 🧠 AI Integrations

*   **LLM Processing:** Utilizes Groq (GPT-OSS-20B) for high-speed, conversational responses strictly grounded in a custom system prompt detailing my technical resume.
*   **Transcription:** Groq Whisper-large-v3 converts user WebM voice queries into text.
*   **Text-to-Speech:** ElevenLabs API converts the AI's textual responses into low-latency audio streams.

## 🚀 Deployment
*   Frontend hosted on [Vercel](https://vercel.com)
*   Backend hosted on [Render](https://render.com)