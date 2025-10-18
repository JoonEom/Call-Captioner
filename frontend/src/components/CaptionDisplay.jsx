import React from 'react'

const CaptionDisplay = ({ captions, interimText }) => {
  const emotionSets = {
    green: new Set(['happy','joy','excited','proud','relieved','grateful','optimistic','content']),
    red: new Set(['sad','angry','frustrated','annoyed','upset','depressed','disappointed','resentful','afraid','fear','anxious','nervous','stressed','disgusted']),
    yellow: new Set(['surprised','shock','shocked','surprise']),
    gray: new Set(['calm','neutral'])
  }

  const emotionEmojis = {
    happy: '😊', joy: '😄', excited: '🤩', proud: '😌', relieved: '😮‍💨', grateful: '🙏', optimistic: '🙂', content: '🙂',
    sad: '😢', angry: '😠', frustrated: '😤', annoyed: '😒', upset: '😞', depressed: '😞', disappointed: '🙁', resentful: '😑',
    afraid: '😨', fear: '😨', anxious: '😰', nervous: '😬', stressed: '😟', disgusted: '🤢',
    surprised: '😮', shock: '😮', shocked: '😲', surprise: '😮',
    calm: '😐', neutral: '😐'
  }

  const getEmotionCategory = (emotion) => {
    const e = (emotion || '').toLowerCase()
    for (const [category, emotions] of Object.entries(emotionSets)) {
      if (emotions.has(e)) return category
    }
    return 'gray'
  }

  const getEmotionEmoji = (emotion) => {
    return emotionEmojis[(emotion || '').toLowerCase()] || '😐'
  }

  const getEmotionColor = (emotion) => {
    const category = getEmotionCategory(emotion)
    const colors = {
      green: 'bg-green-50 border-green-200 text-green-900',
      red: 'bg-red-50 border-red-200 text-red-900',
      yellow: 'bg-yellow-50 border-yellow-200 text-yellow-900',
      gray: 'bg-gray-50 border-gray-200 text-gray-900'
    }
    return colors[category]
  }

  const getEmotionIconColor = (emotion) => {
    const category = getEmotionCategory(emotion)
    const colors = {
      green: 'bg-green-100 text-green-600',
      red: 'bg-red-100 text-red-600',
      yellow: 'bg-yellow-100 text-yellow-600',
      gray: 'bg-gray-100 text-gray-600'
    }
    return colors[category]
  }

  const getDotColorClass = (emotion) => {
    const category = getEmotionCategory(emotion)
    const colors = {
      green: 'bg-green-500',
      red: 'bg-red-500',
      yellow: 'bg-yellow-500',
      gray: 'bg-gray-500'
    }
    return colors[category]
  }

  return (
    <div className="w-full">
      {/* Main Caption Container */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm min-h-[500px] max-h-[700px] overflow-y-auto">
        <div className="p-6">
          <div className="space-y-4">
            {/* Interim Text Display */}
            {interimText && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <span className="text-lg">🎤</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-base font-medium text-blue-900 mb-2">
                      {interimText}
                    </p>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                      <span className="text-xs font-medium text-blue-600">Listening...</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {captions.length === 0 && !interimText ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Ready to Transcribe</h3>
                <p className="text-gray-500 max-w-md text-sm">
                  Click the microphone button to start real-time speech transcription with AI-powered emotion detection
                </p>
              </div>
            ) : (
              captions.map((caption, index) => (
                <div
                  key={caption.id}
                  className={`${getEmotionColor(caption.emotion)} rounded-lg border p-4 transition-all duration-300 hover:shadow-sm group overflow-hidden`}
                >
                  <div className="flex items-start space-x-3">
                    {/* Emotion Icon */}
                    <div className={`flex-shrink-0 w-8 h-8 ${getEmotionIconColor(caption.emotion)} rounded-lg flex items-center justify-center`}>
                      <span className="text-lg">
                        {caption.emoji || getEmotionEmoji(caption.emotion)}
                      </span>
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <p className="text-base font-medium text-gray-900 mb-2">
                        {caption.text}
                      </p>
                      
                      {/* Metadata */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center space-x-1">
                            <div className={`w-2 h-2 rounded-full ${getDotColorClass(caption.emotion)}`}></div>
                            <span className="text-xs font-medium capitalize text-gray-600">
                              {caption.emotion}
                            </span>
                          </div>
                          
                          <div className="text-gray-400 text-xs">
                            {caption.timestamp.toLocaleTimeString()}
                          </div>
                        </div>
                        
                        {/* Live Indicator */}
                        <div className="flex items-center space-x-1 text-green-600 text-xs">
                          <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                          <span className="font-medium">Live</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Expandable Explanation */}
                  <div className="mt-3 max-h-0 group-hover:max-h-20 transition-all duration-300 ease-in-out overflow-hidden">
                    <div className="pt-3 border-t border-gray-200/60">
                      <div className="flex items-start space-x-2">
                        <div className="flex-shrink-0 w-5 h-5 bg-gray-100 rounded-full flex items-center justify-center">
                          <svg className="w-3 h-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <div className="text-xs font-medium text-gray-700 mb-1">AI Analysis:</div>
                          <div className="text-sm text-gray-600 leading-relaxed">{caption.explanation}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CaptionDisplay
