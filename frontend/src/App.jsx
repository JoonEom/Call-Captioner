import React, { useState, useRef, useEffect, useCallback } from 'react'
import { Mic, Square } from 'lucide-react'
import CaptionDisplay from './components/CaptionDisplay'
import RecordingIndicator from './components/RecordingIndicator'

const WEBSOCKET_URL = 'ws://localhost:8000/ws'

function App() {
  const [isRecording, setIsRecording] = useState(false)
  const [captions, setCaptions] = useState([])
  const [interimText, setInterimText] = useState('')
  const [connectionStatus, setConnectionStatus] = useState('disconnected')
  
  const websocketRef = useRef(null)
  const recognitionRef = useRef(null)
  const isRecordingRef = useRef(false)

  const connectWebSocket = useCallback(() => {
    try {
      websocketRef.current = new WebSocket(WEBSOCKET_URL)
      
      websocketRef.current.onopen = () => {
        setConnectionStatus('connected')
      }
      
      websocketRef.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)
          if (data.transcript && data.transcript.trim()) {
            // Handle interim vs final transcripts
            if (data.transcript_type === 'interim') {
              setInterimText(data.transcript)
            } else {
              // Final transcript - add to captions and clear interim
              setCaptions(prev => [{
                id: Date.now(),
                text: data.transcript,
                emotion: data.emotion,
                color: data.color,
                emoji: data.emoji,
                explanation: data.explanation || 'No explanation available',
                detection_type: data.detection_type || 'chatgpt',
                timestamp: new Date()
              }, ...prev])
              setInterimText('')
            }
          }
        } catch (error) {
          // Handle parsing errors silently
        }
      }
      
      websocketRef.current.onclose = () => {
        setConnectionStatus('disconnected')
      }
      
      websocketRef.current.onerror = (error) => {
        setConnectionStatus('error')
      }
    } catch (error) {
      setConnectionStatus('error')
    }
  }, [])

  const startRecording = async () => {
    try {
      if (!websocketRef.current || websocketRef.current.readyState !== WebSocket.OPEN) {
        alert('Not connected to server. Please wait for connection and try again.')
        return
      }
      
      if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        alert('Web Speech API is not supported in this browser. Please use Chrome or Edge.')
        return
      }

      // Set up Web Speech API for transcription
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      const recognition = new SpeechRecognition()
      
      recognition.continuous = true  // Continuous recording
      recognition.interimResults = true
      recognition.lang = 'en-US'
      recognition.maxAlternatives = 1
      
      recognition.onend = () => {
        if (isRecordingRef.current) {
          recognition.start()
        }
      }
      
      recognition.onstart = () => {
        setIsRecording(true)
        isRecordingRef.current = true
      }
      
      recognition.onresult = (event) => {
        let finalTranscript = ''
        let interimTranscript = ''
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript
          if (event.results[i].isFinal) {
            finalTranscript += transcript
          } else {
            interimTranscript += transcript
          }
        }
        
        if (interimTranscript.trim()) {
          if (websocketRef.current && websocketRef.current.readyState === WebSocket.OPEN) {
            websocketRef.current.send(JSON.stringify({
              type: 'interim',
              transcript: interimTranscript.trim()
            }))
          }
        }
        
        if (finalTranscript.trim()) {
          if (websocketRef.current && websocketRef.current.readyState === WebSocket.OPEN) {
            websocketRef.current.send(JSON.stringify({
              type: 'final',
              transcript: finalTranscript.trim()
            }))
          }
        }
      }
      
      recognition.onerror = (event) => {
        setIsRecording(false)
        isRecordingRef.current = false
      }
      
      recognitionRef.current = recognition
      recognition.start()
      
    } catch (error) {
      alert('Error starting recording. Please try again.')
    }
  }

  const stopRecording = () => {
    setIsRecording(false)
    isRecordingRef.current = false
    
    if (recognitionRef.current) {
      recognitionRef.current.stop()
      recognitionRef.current = null
    }
    
    setInterimText('')
  }

  const clearCaptions = () => {
    setCaptions([])
    setInterimText('')
    
    if (websocketRef.current && websocketRef.current.readyState === WebSocket.OPEN) {
      websocketRef.current.send(JSON.stringify({
        type: 'clear'
      }))
    }
  }

  useEffect(() => {
    connectWebSocket()
    
    return () => {
      if (websocketRef.current) {
        websocketRef.current.close()
      }
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
    }
  }, [connectWebSocket])

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="min-h-screen flex flex-col">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 shadow-sm">
          <div className="max-w-4xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">
                  Call Captioner
                </h1>
                <p className="text-sm text-gray-500 mt-0.5">Real-time transcription with AI emotion detection</p>
              </div>
              
              {/* Controls */}
              <div className="flex items-center space-x-3">
                {/* Status */}
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${
                    connectionStatus === 'connected' ? 'bg-green-500' : 
                    connectionStatus === 'error' ? 'bg-red-500' : 'bg-yellow-500'
                  }`}></div>
                  <span className="text-xs text-gray-500 font-medium">
                    {connectionStatus === 'connected' ? 'Connected' : 
                     connectionStatus === 'error' ? 'Error' : 'Connecting...'}
                  </span>
                </div>
                
                {/* Main Button */}
                <button
                  onClick={isRecording ? stopRecording : startRecording}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isRecording 
                      ? 'bg-red-50 text-red-700 hover:bg-red-100 border border-red-200' 
                      : 'bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200'
                  }`}
                >
                  <div className={`w-4 h-4 transition-transform duration-200 ${
                    isRecording ? 'animate-pulse' : ''
                  }`}>
                    {isRecording ? (
                      <Square className="w-4 h-4" />
                    ) : (
                      <Mic className="w-4 h-4" />
                    )}
                  </div>
                  <span>{isRecording ? 'Stop' : 'Start'}</span>
                </button>
                
                {/* Clear Button */}
                <button
                  onClick={clearCaptions}
                  className="flex items-center space-x-2 px-3 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg text-gray-600 hover:text-gray-800 text-sm font-medium transition-all duration-200 border border-gray-200"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  <span>Clear</span>
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 px-6 py-8">
          <div className="max-w-4xl mx-auto">
            <CaptionDisplay captions={captions} interimText={interimText} />
            {isRecording && <RecordingIndicator />}
          </div>
        </main>
      </div>
    </div>
  )
}

export default App

