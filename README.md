# Call Captioner

A real-time speech transcription app with AI-powered emotion detection. Converts speech to text and analyzes sentiment using ChatGPT to detect emotions from transcribed text.

## Features

- **Real-time Transcription**: Uses Web Speech API for live speech-to-text
- **AI-Powered Emotion Detection**: Uses ChatGPT to analyze sentiment and emotional tone from transcribed text
- **Modern UI**: Clean, professional interface with real-time captions
- **Text-Based Analysis**: Emotion detection based on text content and context
- **Live Updates**: Real-time transcription with interim and final results
- **Context Awareness**: Maintains conversation context for better emotion detection

## Tech Stack

- **Frontend**: React + Vite + TailwindCSS + Lucide React
- **Backend**: FastAPI + Python
- **AI Integration**: OpenAI GPT API for sentiment analysis
- **Real-time Communication**: WebSocket for live updates

## Quick Start

### Prerequisites

- Python 3.9+
- Node.js 16+
- Chrome or Edge browser (for Web Speech API)
- OpenAI API key

### Environment Setup

1. Create a `.env` file in the backend directory:
```bash
OPENAI_API_KEY=your_openai_api_key_here
```

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
2. **WebSocket Communication**: Real-time communication between frontend and backend
3. **Text Analysis**: Transcribed text is sent to ChatGPT for sentiment analysis
4. **Context Awareness**: Maintains conversation context for better emotion detection
5. **Live Updates**: Shows interim transcription results and final emotion analysis


## Development

### Backend Endpoints

- `GET /health` - Health check and API status
- `WebSocket /ws` - Real-time communication for transcription and emotion analysis

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
- **All emotions show "neutral"**: Check browser console for errors, ensure backend is running and OpenAI API key is set
- **Backend won't start**: Check if port 8000 is already in use, kill existing processes
- **OpenAI API errors**: Verify your API key is correct and you have sufficient credits
- **WebSocket connection issues**: Ensure backend is running before starting frontend

## Testing Emotion Detection

To verify the system works correctly:

1. **Test Case**: Say different emotional phrases
2. **Happy phrases**: "I'm so excited!" should detect "excited" or "happy"
3. **Sad phrases**: "I'm feeling down" should detect "sad" or "depressed"
4. **Neutral phrases**: "The weather is nice" should detect "neutral"

The system analyzes the text content and context to determine emotions.

## Notes

- Requires a valid OpenAI API key with sufficient credits
- The system uses text-based emotion detection via ChatGPT
- Context is maintained throughout the conversation for better accuracy
- Real-time transcription shows interim results while speaking