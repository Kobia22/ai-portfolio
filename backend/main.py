import os
from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
from groq import Groq

load_dotenv()

app = FastAPI(title="Eli's AI Portfolio Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

client = Groq(api_key=os.environ.get("GROQ_API_KEY"))

class ChatRequest(BaseModel):
    message: str

SYSTEM_PROMPT = """
You are the official AI assistant for Eli Kobia's portfolio website. 
Eli is an AI Professional and Backend Engineer who holds a Bachelor's degree in Business Information Technology. 
His technical stack includes Python, FastAPI, Next.js, and Tailwind CSS, and he utilizes tools like VSCode, IntelliJ IDEA, and Windows Subsystem for Linux (WSL).
Currently, he is focused on building AI-driven solutions, automated business workflows, and evaluating AI models. 
Always answer questions professionally, concisely, and accurately based on this context. Do not invent skills or experiences not mentioned here.
"""

@app.post("/api/chat")
async def chat_endpoint(request: ChatRequest):
    try:
        chat_completion = client.chat.completions.create(
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": request.message}
            ],
            model="openai/gpt-oss-20b", 
            temperature=0.5,
            max_tokens=250,
        )
        return {"reply": chat_completion.choices[0].message.content}
    except Exception as e:
        return {"reply": f"Error connecting to AI logic: {str(e)}"}

# --- NEW VOICE ENDPOINT ---
@app.post("/api/voice")
async def voice_endpoint(audio: UploadFile = File(...)):
    try:
        # 1. Transcribe the audio using Whisper
        audio_bytes = await audio.read()
        transcription = client.audio.transcriptions.create(
            file=("audio.webm", audio_bytes),
            model="whisper-large-v3",
        )
        user_text = transcription.text

        # 2. Feed the transcription to the LLM
        chat_completion = client.chat.completions.create(
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": user_text}
            ],
            model="openai/gpt-oss-20b", 
            temperature=0.5,
            max_tokens=250,
        )
        bot_reply = chat_completion.choices[0].message.content
        
        # Return both what the user said and the AI's response
        return {"user_text": user_text, "reply": bot_reply}

    except Exception as e:
        return {"reply": f"Voice processing error: {str(e)}"}

@app.get("/")
async def root():
    return {"status": "FastAPI is running with Groq integration"}