import json
import os
from dotenv import load_dotenv
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from openai import OpenAI

load_dotenv()

# Initialize OpenAI client
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global conversation context for ChatGPT
conversation_context = []

def reset_conversation_context():
    """Reset the conversation context for a new session"""
    global conversation_context
    conversation_context = []

def detect_emotion_from_text(text: str) -> dict:
    """Detect sentiment and emotional tone using ChatGPT API"""
    if len(text.strip()) < 3:
        return {
            "emotion": "neutral",
            "color": "gray",
            "explanation": "Text too short for analysis",
        }
    
    result = analyze_sentiment_with_chatgpt(text)
    return result if result else {
        "emotion": "neutral",
        "color": "gray",
        "explanation": "Analysis unavailable",
    }

def analyze_sentiment_with_chatgpt(text: str) -> dict:
    """Uses GPT model to classify sentiment naturally"""
    global conversation_context
    
    try:
        # Initialize system prompt if first message
        if not conversation_context:
            conversation_context = [{
                "role": "system",
                "content": (
                    "You are analyzing transcribed speech from a live conversation. "
                    "Analyze the emotional tone and sentiment:\n\n"
                    "- Look for positive emotions: happiness, excitement, joy, enthusiasm, etc.\n"
                    "- Look for negative emotions: sadness, anger, frustration, disappointment, sarcasm, etc.\n"
                    "- Consider neutral statements: facts, greetings, questions, etc.\n"
                    "- Sometimes, the user might be sarcastic or ironic. Detect this and respond accordingly.\n\n"
                    
                    "Respond with ONLY JSON (do NOT add extra fields).\n"
                    "- 'emotion': a single-word emotion label (e.g., happy, sad, angry, excited, neutral, anxious, calm, disgusted, surprised).\n"
                    "- 'emoji': a single emoji matching that emotion.\n"
                    "- 'color': one of EXACT strings: green | red | gray (green=positive, red=negative, gray=neutral).\n"
                    "- 'explanation': a brief explanation.\n"
                    "{\"emotion\": \"one_word\", \"emoji\": \"🙂\", \"color\": \"green|red|gray\", \"explanation\": \"brief reason\"}"
                ),
            }]
        
        # Add current text to conversation
        conversation_context.append({
            "role": "user",
            "content": f"'{text}'",
        })
        
        # Keep only last 10 messages to avoid context overflow
        if len(conversation_context) > 11:  # 1 system + 10 user messages
            conversation_context = [conversation_context[0]] + conversation_context[-10:]
        
        response = client.chat.completions.create(
            model="gpt-5-mini",  # Updated model name
            messages=conversation_context,
            max_tokens=80,
            temperature=0.1,
        )

        content = response.choices[0].message.content.strip()

        # Extract JSON from response
        start_idx = content.find("{")
        end_idx = content.rfind("}") + 1
        if start_idx == -1 or end_idx == 0:
            raise ValueError("No valid JSON object found in model response")

        json_str = content[start_idx:end_idx]
        result = json.loads(json_str)

        emotion = result.get("emotion", "neutral").lower()
        emoji = result.get("emoji", "")
        color = result.get("color", "").lower()
        explanation = result.get("explanation", "No explanation provided")

        # Validate color from model; fallback by emotion buckets if invalid
        allowed_colors = {"green", "red", "gray"}
        if color not in allowed_colors:
            green_set = {"happy", "joy", "excited", "proud", "relieved", "grateful", "optimistic", "content"}
            red_set = {"sad", "angry", "frustrated", "annoyed", "upset", "depressed", "disappointed", "resentful", "afraid", "fear", "anxious", "nervous", "stressed", "disgusted"}
            
            if emotion in green_set:
                color = "green"
            elif emotion in red_set:
                color = "red"
            else:
                color = "gray"

        return {
            "emotion": emotion,
            "color": color,
            "emoji": emoji,
            "explanation": explanation,
        }
        
    except Exception:
        return None

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    """WebSocket endpoint for real-time text sentiment analysis"""
    await websocket.accept()

    try:
        while True:
            data = await websocket.receive()

            if data["type"] == "websocket.receive" and "text" in data:
                try:
                    message = json.loads(data["text"])
                    
                    if message.get("type") == "clear":
                        reset_conversation_context()
                        await websocket.send_text(json.dumps({
                            "type": "context_reset",
                            "message": "ChatGPT conversation context cleared"
                        }))
                        continue
                    
                    if message.get("type") in ["text", "final", "interim"] and "transcript" in message:
                        transcript = message["transcript"]

                        # Reset context if user says "start"
                        if message.get("type") == "final" and "start" in transcript.lower():
                            reset_conversation_context()

                        if message.get("type") == "final":
                            emotion_result = detect_emotion_from_text(transcript)
                            
                            result = {
                                "transcript": transcript,
                                "emotion": emotion_result["emotion"],
                                "color": emotion_result["color"],
                                "explanation": emotion_result["explanation"],
                                "detection_type": "chatgpt_sentiment",
                                "transcript_type": "final",
                            }
                        else:
                            result = {
                                "transcript": transcript,
                                "emotion": "neutral",
                                "color": "gray",
                                "explanation": "Live transcription...",
                                "detection_type": "live_transcription",
                                "transcript_type": message.get("type", "interim"),
                            }

                        await websocket.send_text(json.dumps(result))
                except json.JSONDecodeError:
                    pass

    except WebSocketDisconnect:
        pass
    except Exception:
        pass
    finally:
        try:
            await websocket.close()
        except:
            pass

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "emotion_detection_type": "chatgpt_sentiment",
        "chatgpt_available": True,
        "version": "5.0.0",
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
