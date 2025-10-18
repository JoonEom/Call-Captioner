# Call Captioner

A real-time speech transcription app with AI-powered emotion detection. Converts speech to text and analyzes both vocal tone and text sentiment to detect emotions.

## Features

- **Real-time Transcription**: Uses Web Speech API for live speech-to-text
- **Pure Audio Emotion Detection**: Detects emotions purely from vocal tone and acoustic features
- **Modern UI**: Clean, professional interface with real-time captions
- **Tone-Based Analysis**: Emotion detection based on audio characteristics, not words spoken
- **Confidence Scores**: Shows confidence levels for emotion detection

## Tech Stack

- **Frontend**: React + Vite + TailwindCSS
- **Backend**: FastAPI + Python
- **AI Models**: 
  - Audio: `superb/hubert-large-superb-er` (Speech Emotion Recognition)
  - Audio Processing: librosa, torchaudio for feature extraction

## Quick Start

### Prerequisites

- Python 3.9+
- Node.js 16+
- Chrome or Edge browser (for Web Speech API)

### Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python main.py
```

Backend will run on `http://localhost:8000`

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend will run on `http://localhost:3001` (or next available port)

## Usage

1. Open `http://localhost:3001` in Chrome/Edge
2. Allow microphone permissions when prompted
3. Click **"Start"** to begin recording
4. Speak naturally - you'll see real-time transcription with emotion detection
5. Click **"Stop"** to end recording

## How It Works

1. **Speech Recognition**: Web Speech API transcribes your speech in real-time
2. **Audio Recording**: MediaRecorder captures audio for tone analysis
3. **Audio Feature Extraction**: Extracts MFCCs, chroma, spectral contrast, pitch, energy
4. **Pure Audio Analysis**: Uses SER model to detect emotions from acoustic features only
5. **Tone-Based Detection**: Emotion detection based purely on vocal characteristics

## Emotion Categories

- **😃 Joy**: Happiness, excitement, positive emotions
- **😢 Sadness**: Sorrow, melancholy, negative emotions  
- **😠 Anger**: Frustration, irritation, negative emotions
- **😨 Fear**: Anxiety, worry, nervousness
- **😍 Love**: Affection, warmth, positive emotions
- **😐 Neutral**: No strong emotional indicators

## Development

### Backend Endpoints

- `GET /health` - Health check and model status
- `GET /debug` - Debug information and feature extraction details
- `POST /test-tone` - Test audio emotion detection with file upload
- `WebSocket /ws` - Real-time communication

### Project Structure

```
Call-Captioner/
├── backend/
│   ├── main.py              # FastAPI server
│   ├── requirements.txt     # Python dependencies
│   └── venv/               # Virtual environment
├── frontend/
│   ├── src/
│   │   ├── App.jsx         # Main React component
│   │   ├── components/     # React components
│   │   └── index.css       # Styles
│   ├── package.json      # Node dependencies
│   └── vite.config.js      # Vite configuration
└── README.md
```

## Troubleshooting

- **No transcription**: Ensure you're using Chrome/Edge and have granted microphone permissions
- **All emotions show "neutral"**: Check browser console for errors, ensure backend is running
- **Backend won't start**: Check if port 8000 is already in use, kill existing processes
- **Models not loading**: Ensure you have internet connection for initial model downloads

## Testing Tone-Based Detection

To verify the system works correctly:

1. **Test Case**: Say "I'm so happy" in different tones
2. **Happy Tone**: Should detect "joy" 
3. **Sad Tone**: Should detect "sadness" (not "joy")
4. **Neutral Tone**: Should detect "neutral"

This proves the system detects emotions from vocal tone, not words spoken.

## Notes

- First run will download AI models (~1-2GB) - this may take a few minutes
- Audio emotion detection requires sufficient audio data (at least 1 second)
- The system uses pure audio analysis - no text-based emotion detection
- Confidence scores show how certain the model is about the detected emotion