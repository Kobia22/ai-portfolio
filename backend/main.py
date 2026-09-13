import os
import base64
import requests
import sqlite3
import time
from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
from groq import Groq

load_dotenv()

app = FastAPI(title="Eli Kobia's AI Portfolio Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

client = Groq(api_key=os.environ.get("GROQ_API_KEY"))

# --- TELEMETRY DATABASE SETUP ---
def init_db():
    conn = sqlite3.connect("telemetry.db")
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS requests (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
            endpoint TEXT,
            latency REAL,
            input_length INTEGER
        )
    ''')
    # Safely add the query_text column if upgrading an existing database
    try:
        cursor.execute("ALTER TABLE requests ADD COLUMN query_text TEXT")
    except sqlite3.OperationalError:
        pass 
    conn.commit()
    conn.close()

init_db()

def log_telemetry(endpoint: str, latency: float, input_length: int, query_text: str):
    conn = sqlite3.connect("telemetry.db")
    cursor = conn.cursor()
    cursor.execute("INSERT INTO requests (endpoint, latency, input_length, query_text) VALUES (?, ?, ?, ?)", 
                   (endpoint, latency, input_length, query_text))
    conn.commit()
    conn.close()
# -------------------------------

class ChatRequest(BaseModel):
    message: str

SYSTEM_PROMPT = """
You are the official AI assistant for Eli Wahome Kobia's portfolio website. 
Eli is a Software Engineer specializing in Computational Logic and Scalable Backend Systems. He holds a B.Sc. in Business Information Technology from Jomo Kenyatta University of Agriculture and Technology (JKUAT).
His technical stack includes Python, Java (Spring Boot), JavaScript, SQL, FastAPI, and PostgreSQL.

If the user asks for Eli's contact information, social profiles, or resume/CV, you MUST provide them using exact Markdown link syntax:
- CV: [Download Eli's CV](/eli_kobia_cv.pdf)
- LinkedIn: [LinkedIn](https://linkedin.com/in/eli-kobia)
- GitHub: [GitHub](https://github.com/Kobia22)
- Email: [kobiaeli04@gmail.com](mailto:kobiaeli04@gmail.com)

Answer questions professionally, concisely, and accurately based solely on this context.
"""

def generate_tts_audio(text: str):
    elevenlabs_key = os.environ.get("ELEVENLABS_API_KEY")
    if not elevenlabs_key:
        return None
    url = "https://api.elevenlabs.io/v1/text-to-speech/pNInz6obpgDQGcFmaJgB"
    headers = {"xi-api-key": elevenlabs_key, "Content-Type": "application/json"}
    payload = {
        "text": text,
        "model_id": "eleven_multilingual_v2", 
        "voice_settings": {"stability": 0.5, "similarity_boost": 0.5}
    }
    response = requests.post(url, json=payload, headers=headers)
    if response.status_code == 200:
        return base64.b64encode(response.content).decode("utf-8")
    return None

@app.post("/api/chat")
async def chat_endpoint(request: ChatRequest):
    start_time = time.time()
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
        bot_reply = chat_completion.choices[0].message.content
        audio_base64 = generate_tts_audio(bot_reply)
        
        latency = time.time() - start_time
        log_telemetry("/api/chat", latency, len(request.message), request.message)
        
        return {"reply": bot_reply, "audio_base64": audio_base64}
    except Exception as e:
        return {"reply": f"Error connecting to AI logic: {str(e)}"}

@app.post("/api/voice")
async def voice_endpoint(audio: UploadFile = File(...)):
    start_time = time.time()
    try:
        audio_bytes = await audio.read()
        transcription = client.audio.transcriptions.create(
            file=("audio.webm", audio_bytes),
            model="whisper-large-v3",
        )
        user_text = transcription.text

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
        audio_base64 = generate_tts_audio(bot_reply)
        
        latency = time.time() - start_time
        log_telemetry("/api/voice", latency, len(user_text), user_text)
        
        return {"user_text": user_text, "reply": bot_reply, "audio_base64": audio_base64}
    except Exception as e:
        return {"reply": f"Voice processing error: {str(e)}"}

@app.get("/api/metrics")
async def get_metrics():
    conn = sqlite3.connect("telemetry.db")
    cursor = conn.cursor()
    cursor.execute("SELECT id, timestamp, endpoint, latency, input_length, query_text FROM requests ORDER BY id DESC LIMIT 20")
    rows = cursor.fetchall()
    conn.close()
    
    metrics = [
        {"id": row[0], "time": row[1][-8:], "endpoint": row[2], "latency": round(row[3], 2), "chars": row[4], "query": row[5] or ""}
        for row in reversed(rows)
    ]
    return {"data": metrics}

@app.get("/")
async def root():
    return {"status": "FastAPI is running with Groq and ElevenLabs integration"}