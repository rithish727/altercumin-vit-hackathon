import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { PostureData, Notification } from '../types'

interface PosturePixieProps {
  data: PostureData
  onUpdate: (data: PostureData) => void
  onAddNotification: (notification: Omit<Notification, 'id'>) => void
}

const PosturePixie: React.FC<PosturePixieProps> = ({ data, onUpdate, onAddNotification }) => {
  const [isDetecting, setIsDetecting] = useState(false)
  const [showFairy, setShowFairy] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  // Mock posture detection (in real app, this would use ML models)
  const detectPosture = () => {
    // Simulate posture analysis
    const mockScore = Math.random() * 40 + 60 // 60-100 range
    const isSlouching = mockScore < 75
    
    onUpdate({
      score: mockScore,
      isSlouching,
      lastCheck: Date.now()
    })

    if (isSlouching) {
      setShowFairy(true)
      onAddNotification({
        type: 'posture',
        title: '🧚‍♀️ Posture Pixie Alert!',
        message: 'Time to straighten up! Try some shoulder rolls.',
        icon: '🧚‍♀️'
      })
    }
  }

  const startDetection = async () => {
    try {
      setIsDetecting(true)
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: 320, 
          height: 240,
          facingMode: 'user'
        } 
      })
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        streamRef.current = stream
        
        // Start posture detection loop
        const detectionInterval = setInterval(detectPosture, 3000)
        
        // Cleanup function
        const cleanup = () => {
          clearInterval(detectionInterval)
          if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop())
          }
        }
        
        // Store cleanup function for later use
        ;(videoRef.current as any).cleanup = cleanup
      }
    } catch (error) {
      console.error('Error accessing camera:', error)
      // Fallback to mock detection
      const mockInterval = setInterval(detectPosture, 5000)
      setTimeout(() => clearInterval(mockInterval), 30000)
    }
  }

  const stopDetection = () => {
    setIsDetecting(false)
    if (videoRef.current && (videoRef.current as any).cleanup) {
      (videoRef.current as any).cleanup()
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-green-400'
    if (score >= 70) return 'text-yellow-400'
    return 'text-red-400'
  }

  const getScoreMessage = (score: number) => {
    if (score >= 85) return 'Excellent posture!'
    if (score >= 70) return 'Good posture'
    return 'Time to adjust!'
  }

  return (
    <div className="relative bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-6 h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-xl">🧚‍♀️</span>
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Posture Pixie</h3>
            <p className="text-sm text-slate-400">Your posture guardian</p>
          </div>
        </div>
        
        <button
          onClick={isDetecting ? stopDetection : startDetection}
          className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
            isDetecting 
              ? 'bg-red-500/20 text-red-400 border border-red-500/50 hover:bg-red-500/30' 
              : 'bg-blue-500/20 text-blue-400 border border-blue-500/50 hover:bg-blue-500/30'
          }`}
        >
          {isDetecting ? 'Stop' : 'Start'} Detection
        </button>
      </div>

      {/* Camera Feed */}
      {isDetecting && (
        <div className="mb-6 relative">
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            className="w-full h-48 object-cover rounded-lg border border-slate-600/50"
          />
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-48 rounded-lg"
            style={{ display: 'none' }}
          />
        </div>
      )}

      {/* Posture Score */}
      <div className="space-y-4">
        <div className="text-center">
          <div className={`text-4xl font-bold ${getScoreColor(data.score)}`}>
            {Math.round(data.score)}
          </div>
          <p className="text-slate-400 text-sm">{getScoreMessage(data.score)}</p>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-700/50 rounded-full h-3">
          <motion.div
            className="h-3 rounded-full bg-gradient-to-r from-red-500 via-yellow-500 to-green-500"
            initial={{ width: 0 }}
            animate={{ width: `${data.score}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>

        {/* Status Indicators */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="bg-slate-800/50 rounded-lg p-3">
            <div className="text-slate-400">Status</div>
            <div className={data.isSlouching ? 'text-red-400' : 'text-green-400'}>
              {data.isSlouching ? '⚠️ Slouching' : '✅ Good'}
            </div>
          </div>
          <div className="bg-slate-800/50 rounded-lg p-3">
            <div className="text-slate-400">Last Check</div>
            <div className="text-white">
              {new Date(data.lastCheck).toLocaleTimeString()}
            </div>
          </div>
        </div>
      </div>

      {/* Floating Fairy Animation */}
      <AnimatePresence>
        {showFairy && (
          <motion.div
            initial={{ opacity: 0, scale: 0, x: -100, y: -100 }}
            animate={{ 
              opacity: 1, 
              scale: 1,
              x: [0, 20, -20, 0],
              y: [0, -20, 20, 0]
            }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ 
              duration: 2,
              repeat: 3,
              repeatType: "reverse"
            }}
            className="absolute top-4 right-4 text-4xl animate-fairy-dance"
            onAnimationComplete={() => setShowFairy(false)}
          >
            🧚‍♀️
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quick Actions */}
      <div className="mt-6 space-y-2">
        <button
          onClick={() => {
            onAddNotification({
              type: 'posture',
              title: '💪 Stretch Reminder',
              message: 'Try these quick posture exercises!',
              icon: '💪'
            })
          }}
          className="w-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 hover:from-blue-500/30 hover:to-purple-500/30 border border-blue-500/50 rounded-lg p-3 text-sm font-medium transition-all duration-200 hover:scale-105"
        >
          💪 Quick Stretch
        </button>
        <button
          onClick={() => {
            onUpdate({
              ...data,
              score: Math.min(100, data.score + 10),
              isSlouching: false
            })
          }}
          className="w-full bg-gradient-to-r from-green-500/20 to-emerald-500/20 hover:from-green-500/30 hover:to-emerald-500/30 border border-green-500/50 rounded-lg p-3 text-sm font-medium transition-all duration-200 hover:scale-105"
        >
          ✅ Posture Reset
        </button>
      </div>
    </div>
  )
}

export default PosturePixie
