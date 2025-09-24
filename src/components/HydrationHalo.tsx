import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { HydrationData, Notification } from '../types'

interface HydrationHaloProps {
  data: HydrationData
  onUpdate: (data: HydrationData) => void
  onAddNotification: (notification: Omit<Notification, 'id'>) => void
}

const HydrationHalo: React.FC<HydrationHaloProps> = ({ data, onUpdate, onAddNotification }) => {
  const [isAnimating, setIsAnimating] = useState(false)
  const [showSparkles, setShowSparkles] = useState(false)
  const [level, setLevel] = useState(1)
  const [xp, setXp] = useState(0)

  const percentage = Math.min(100, (data.current / data.target) * 100)
  const remaining = Math.max(0, data.target - data.current)

  // Calculate level based on total hydration
  useEffect(() => {
    const totalHydration = data.current
    const newLevel = Math.floor(totalHydration / 1000) + 1
    const newXp = totalHydration % 1000
    
    if (newLevel > level) {
      setShowSparkles(true)
      onAddNotification({
        type: 'hydration',
        title: '🎉 Level Up!',
        message: `You've reached Hydration Level ${newLevel}!`,
        icon: '🎉'
      })
      setTimeout(() => setShowSparkles(false), 3000)
    }
    
    setLevel(newLevel)
    setXp(newXp)
  }, [data.current, level, onAddNotification])

  const addWater = (amount: number) => {
    setIsAnimating(true)
    const newAmount = Math.min(data.target, data.current + amount)
    
    onUpdate({
      current: newAmount,
      target: data.target,
      lastDrink: Date.now()
    })

    // Show celebration if target reached
    if (newAmount >= data.target) {
      onAddNotification({
        type: 'hydration',
        title: '💧 Hydration Complete!',
        message: 'You\'ve reached your daily hydration goal!',
        icon: '💧'
      })
    }

    setTimeout(() => setIsAnimating(false), 1000)
  }

  const getHydrationStatus = () => {
    if (percentage >= 100) return { text: 'Hydrated!', color: 'text-green-400', emoji: '💧' }
    if (percentage >= 75) return { text: 'Almost there!', color: 'text-blue-400', emoji: '💙' }
    if (percentage >= 50) return { text: 'Halfway!', color: 'text-yellow-400', emoji: '💛' }
    return { text: 'Need water!', color: 'text-red-400', emoji: '🔥' }
  }

  const status = getHydrationStatus()

  return (
    <div className="relative bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-6 h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-xl">💧</span>
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Hydration Halo</h3>
            <p className="text-sm text-slate-400">Level {level} • {xp}/1000 XP</p>
          </div>
        </div>
      </div>

      {/* Water Orb Visualization */}
      <div className="relative mb-6 flex justify-center">
        <div className="relative w-32 h-32">
          {/* Outer glow ring */}
          <motion.div
            className="absolute inset-0 rounded-full border-4 border-cyan-500/30"
            animate={{
              scale: isAnimating ? [1, 1.1, 1] : 1,
              opacity: [0.3, 0.6, 0.3]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          
          {/* Main water orb */}
          <motion.div
            className="relative w-full h-full rounded-full bg-gradient-to-b from-cyan-400/20 to-blue-600/20 border-2 border-cyan-400/50 flex items-center justify-center"
            animate={{
              scale: isAnimating ? [1, 1.05, 1] : 1,
            }}
            transition={{ duration: 0.5 }}
          >
            {/* Water level indicator */}
            <motion.div
              className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-cyan-400 to-blue-400 rounded-full"
              style={{ height: `${percentage}%` }}
              animate={{ height: `${percentage}%` }}
              transition={{ duration: 0.5 }}
            />
            
            {/* Center content */}
            <div className="relative z-10 text-center">
              <div className="text-2xl">{status.emoji}</div>
              <div className={`text-sm font-bold ${status.color}`}>
                {Math.round(percentage)}%
              </div>
            </div>
          </motion.div>

          {/* Sparkle effects */}
          <AnimatePresence>
            {showSparkles && (
              <>
                {[...Array(8)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ 
                      opacity: [0, 1, 0],
                      scale: [0, 1, 0],
                      x: Math.cos(i * 45 * Math.PI / 180) * 60,
                      y: Math.sin(i * 45 * Math.PI / 180) * 60
                    }}
                    transition={{ 
                      duration: 1.5,
                      delay: i * 0.1
                    }}
                    className="absolute top-1/2 left-1/2 text-yellow-400 text-xl"
                  >
                    ✨
                  </motion.div>
                ))}
              </>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Progress Stats */}
      <div className="space-y-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-white">
            {data.current}ml / {data.target}ml
          </div>
          <p className={`text-sm ${status.color}`}>{status.text}</p>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-700/50 rounded-full h-3">
          <motion.div
            className="h-3 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500"
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>

        {/* Remaining water */}
        <div className="text-center text-slate-400 text-sm">
          {remaining > 0 ? `${remaining}ml remaining` : 'Goal achieved! 🎉'}
        </div>
      </div>

      {/* Water Intake Buttons */}
      <div className="mt-6 space-y-3">
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => addWater(250)}
            disabled={isAnimating}
            className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 hover:from-cyan-500/30 hover:to-blue-500/30 border border-cyan-500/50 rounded-lg p-3 text-sm font-medium transition-all duration-200 hover:scale-105 disabled:opacity-50"
          >
            💧 250ml
          </button>
          <button
            onClick={() => addWater(500)}
            disabled={isAnimating}
            className="bg-gradient-to-r from-blue-500/20 to-indigo-500/20 hover:from-blue-500/30 hover:to-indigo-500/30 border border-blue-500/50 rounded-lg p-3 text-sm font-medium transition-all duration-200 hover:scale-105 disabled:opacity-50"
          >
            🥤 500ml
          </button>
        </div>
        
        <button
          onClick={() => addWater(1000)}
          disabled={isAnimating}
          className="w-full bg-gradient-to-r from-indigo-500/20 to-purple-500/20 hover:from-indigo-500/30 hover:to-purple-500/30 border border-indigo-500/50 rounded-lg p-3 text-sm font-medium transition-all duration-200 hover:scale-105 disabled:opacity-50"
        >
          🍼 1L Bottle
        </button>
      </div>

      {/* Level Progress */}
      <div className="mt-4 bg-slate-800/50 rounded-lg p-3">
        <div className="flex justify-between text-xs text-slate-400 mb-1">
          <span>Level {level}</span>
          <span>{xp}/1000 XP</span>
        </div>
        <div className="w-full bg-slate-700/50 rounded-full h-2">
          <motion.div
            className="h-2 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500"
            initial={{ width: 0 }}
            animate={{ width: `${(xp / 1000) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>
    </div>
  )
}

export default HydrationHalo
