import React from 'react'
import { Mic } from 'lucide-react'

const RecordingIndicator = () => {
  return (
    <div className="flex items-center space-x-3 bg-red-50 rounded-lg px-4 py-2 border border-red-200 mt-4">
      <div className="relative">
        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
        <div className="absolute inset-0 w-2 h-2 bg-red-500 rounded-full animate-ping"></div>
      </div>
      <Mic className="w-4 h-4 text-red-500" />
      <span className="text-red-700 font-medium text-sm">Recording in progress...</span>
    </div>
  )
}

export default RecordingIndicator
