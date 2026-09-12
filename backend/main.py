import os
import base64
import requests
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

class ChatRequest(BaseModel):
    message: str

# Updated to reflect your CV
SYSTEM_PROMPT = """
You are the official AI assistant for Eli Wahome Kobia's portfolio website. 
Eli is a Software Engineer specializing in Computational Logic and Scalable Backend Systems. He holds a B.Sc. in Business Information Technology from Jomo Kenyatta University of Agriculture and Technology (JKUAT).
His technical stack includes Python, Java (Spring Boot), JavaScript, SQL, FastAPI, and PostgreSQL.
Key Experience:
1. Software Developer (Freelance): Developed a high-precision Python toolkit to automate Eurocode 3 structural calculations.
2. IT Intern (Diamond Trust Bank - DTB): Designed an Enterprise Role-Based Access Control (RBAC) system using Java Spring Boot, PostgreSQL, JWT, and React.js.
3. SmartStock: Architected a unified inventory and personnel management system using Python and SQLAlchemy.
Answer questions professionally, concisely, and accurately based solely on this context.
"""

def generate_tts_audio(text: str):
    """Fetches audio from ElevenLabs and encodes it as Base64."""
    elevenlabs_key = os.environ.get("ELEVENLABS_API_KEY")
    if not elevenlabs_key:
        print("ERROR: ELEVENLABS_API_KEY not found in environment variables.")
        return None
        
# Using 'Adam', a standard default voice available on the free tier API
    url = "https://api.elevenlabs.io/v1/text-to-speech/pNInz6obpgDQGcFmaJgB"    
    headers = {
        "xi-api-key": elevenlabs_key,
        "Content-Type": "application/json"
    }
    
    payload = {
        "text": text,
        "model_id": "eleven_multilingual_v2", 
        "voice_settings": {"stability": 0.5, "similarity_boost": 0.5}
    }
    
    print(f"Requesting audio for text: {text[:30]}...")
    response = requests.post(url, json=payload, headers=headers)
    
    if response.status_code == 200:
        print("SUCCESS: ElevenLabs audio generated.")
        return base64.b64encode(response.content).decode("utf-8")
    else:
        print(f"ELEVENLABS ERROR: {response.status_code} - {response.text}")
        return None

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
        
        bot_reply = chat_completion.choices[0].message.content
        audio_base64 = generate_tts_audio(bot_reply)
        
        return {"reply": bot_reply, "audio_base64": audio_base64}
        
    except Exception as e:
        return {"reply": f"Error connecting to AI logic: {str(e)}"}

@app.post("/api/voice")
async def voice_endpoint(audio: UploadFile = File(...)):
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
        
        return {"user_text": user_text, "reply": bot_reply, "audio_base64": audio_base64}

    except Exception as e:
        return {"reply": f"Voice processing error: {str(e)}"}

@app.get("/")
async def root():
    return {"status": "FastAPI is running with Groq and ElevenLabs integration"}