import os
import time
import base64
import sqlite3
from datetime import datetime
from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from groq import Groq
import requests
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = FastAPI()

# ==========================================
# CORS Configuration (The Fix)
# ==========================================
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows your Vercel frontend to connect
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==========================================
# Client Initialization
# ==========================================
client = Groq(api_key=os.environ.get("GROQ_API_KEY"))
ELEVENLABS_API_KEY = os.environ.get("ELEVENLABS_API_KEY")

# ==========================================
# Telemetry Database Setup
# ==========================================
def init_db():
    conn = sqlite3.connect("telemetry.db")
    c = conn.cursor()
    c.execute('''CREATE TABLE IF NOT EXISTS metrics
                 (id INTEGER PRIMARY KEY AUTOINCREMENT,
                  time TEXT,
                  latency REAL,
                  endpoint TEXT,
                  query TEXT)''')
    conn.commit()
    conn.close()

init_db()

def log_telemetry(latency: float, endpoint: str, query: str):
    conn = sqlite3.connect("telemetry.db")
    c = conn.cursor()
    time_str = datetime.now().strftime("%H:%M:%S")
    c.execute("INSERT INTO metrics (time, latency, endpoint, query) VALUES (?, ?, ?, ?)",
              (time_str, latency, endpoint, query))
    conn.commit()
    conn.close()

# ==========================================
# AI Context & Helpers
# ==========================================
# This equips the AI with your exact engineering background and contact links
SYSTEM_PROMPT = """You are the interactive AI agent for Eli Wahome Kobia, a Software Engineer specializing in Backend & Computational Logic. 
He holds a Bachelor's degree in Business Information Technology.
His tech stack includes Python, FastAPI, Next.js, PostgreSQL, SQLAlchemy, Java Spring Boot, and Linux/WSL. 
He focuses on automated workflows and structured engineering solutions.

If the user asks for contact links, provide them exactly using these markdown formats:
- GitHub: [GitHub](https://github.com/Kobia22)
- LinkedIn: [LinkedIn](https://linkedin.com/in/eli-kobia)
- Email: [Email](mailto:kobiaeli2@gmail.com)
- CV: [CV](/cv.pdf)

Keep responses concise, professional, and conversational."""

class ChatRequest(BaseModel):
    message: str

def generate_audio(text: str) -> str:
    """Converts text to speech using ElevenLabs API and returns a Base64 string."""
    if not ELEVENLABS_API_KEY:
        return ""
    
    # Using the default 'Rachel' voice ID (replace if you have a custom cloned voice)
    url = "https://api.elevenlabs.io/v1/text-to-speech/21m00Tcm4TlvDq8ikWAM"
    headers = {
        "Accept": "audio/mpeg",
        "Content-Type": "application/json",
        "xi-api-key": ELEVENLABS_API_KEY
    }
    data = {
        "text": text,
        "model_id": "eleven_monolingual_v1",
        "voice_settings": {"stability": 0.5, "similarity_boost": 0.5}
    }
    try:
        response = requests.post(url, json=data, headers=headers)
        if response.status_code == 200:
            return base64.b64encode(response.content).decode("utf-8")
    except Exception as e:
        print(f"TTS Error: {e}")
    return ""

# ==========================================
# API Routes
# ==========================================
@app.post("/api/chat")
async def chat_endpoint(req: ChatRequest):
    start_time = time.time()
    user_text = req.message
    
    # 1. Get LLM Response from Groq
    completion = client.chat.completions.create(
        model="llama3-8b-8192",
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": user_text}
        ]
    )
    reply_text = completion.choices[0].message.content

    # 2. Convert reply to Audio
    audio_base64 = generate_audio(reply_text)

    # 3. Log to Dashboard
    latency = round(time.time() - start_time, 2)
    log_telemetry(latency, "/api/chat", user_text)

    return {"reply": reply_text, "audio_base64": audio_base64}


@app.post("/api/voice")
async def voice_endpoint(audio: UploadFile = File(...)):
    start_time = time.time()
    
    # 1. Save incoming WebM audio temporarily
    temp_file_path = f"temp_{audio.filename}"
    with open(temp_file_path, "wb") as f:
        f.write(await audio.read())
    
    # 2. Transcribe voice to text using Groq Whisper
    try:
        with open(temp_file_path, "rb") as file:
            transcription = client.audio.transcriptions.create(
              file=(temp_file_path, file.read()),
              model="whisper-large-v3",
              response_format="json",
              language="en"
            )
        user_text = transcription.text
    finally:
        os.remove(temp_file_path)

    # Intercept dashboard shortcut command
    if "sudo telemetry" in user_text.lower():
        return {"user_text": user_text, "reply": "Opening telemetry dashboard...", "audio_base64": ""}

    # 3. Get LLM Response
    completion = client.chat.completions.create(
        model="llama3-8b-8192",
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": user_text}
        ]
    )
    reply_text = completion.choices[0].message.content

    # 4. Convert reply to Audio
    audio_base64 = generate_audio(reply_text)

    # 5. Log to Dashboard
    latency = round(time.time() - start_time, 2)
    log_telemetry(latency, "/api/voice", user_text)

    return {"user_text": user_text, "reply": reply_text, "audio_base64": audio_base64}


@app.get("/api/metrics")
async def metrics_endpoint():
    """Serves the SQLite telemetry data to the Next.js Dashboard."""
    conn = sqlite3.connect("telemetry.db")
    conn.row_factory = sqlite3.Row
    c = conn.cursor()
    c.execute("SELECT time, latency, endpoint, query FROM metrics ORDER BY id ASC")
    rows = c.fetchall()
    conn.close()
    
    data = [dict(row) for row in rows]
    return {"data": data}