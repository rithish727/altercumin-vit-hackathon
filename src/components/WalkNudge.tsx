import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ActivityData, Notification, Quest } from '../types'

interface WalkNudgeProps {
  data: ActivityData
  onUpdate: (data: ActivityData) => void
  onAddNotification: (notification: Omit<Notification, 'id'>) => void
}

const WalkNudge: React.FC<WalkNudgeProps> = ({ data, onUpdate, onAddNotification }) => {
  const [showQuest, setShowQuest] = useState(false)
  const [currentQuest, setCurrentQuest] = useState<Quest | null>(null)
  const [isIdle, setIsIdle] = useState(false)
  const [idleTime, setIdleTime] = useState(0)

  // Mock quests
  const quests: Quest[] = [
    {
      id: 'steps-50',
      title: 'Quick Steps Quest',
      description: 'Take 50 steps to level up your stamina!',
      target: 50,
      current: Math.min(50, data.steps),
      reward: '+10 XP',
      type: 'steps'
    },
    {
      id: 'steps-100',
      title: 'Power Walk',
      description: 'Complete 100 steps for a health boost!',
      target: 100,
      current: Math.min(100, data.steps),
      reward: '+25 XP',
      type: 'steps'
    },
    {
      id: 'steps-500',
      title: 'Daily Explorer',
      description: 'Walk 500 steps to unlock the Explorer badge!',
      target: 500,
      current: Math.min(500, data.steps),
      reward: '🏆 Explorer Badge',
      type: 'steps'
    }
  ]

  // Detect inactivity
  useEffect(() => {
    let idleTimer: NodeJS.Timeout

    const resetIdleTimer = () => {
      clearTimeout(idleTimer)
      setIsIdle(false)
      setIdleTime(0)
      
      idleTimer = setTimeout(() => {
        setIsIdle(true)
        setIdleTime(Date.now())
      }, 5 * 60 * 1000) // 5 minutes of inactivity
    }

    const handleActivity = () => {
      if (isIdle) {
        setIsIdle(false)
        setIdleTime(0)
        onUpdate({
          ...data,
          steps: data.steps + Math.floor(Math.random() * 10) + 1,
          lastActivity: Date.now()
        })
      }
      resetIdleTimer()
    }

    // Listen for user activity
    document.addEventListener('mousemove', handleActivity)
    document.addEventListener('keypress', handleActivity)
    document.addEventListener('click', handleActivity)

    resetIdleTimer()

    return () => {
      clearTimeout(idleTimer)
      document.removeEventListener('mousemove', handleActivity)
      document.removeEventListener('keypress', handleActivity)
      document.removeEventListener('click', handleActivity)
    }
  }, [isIdle, data, onUpdate])

  // Show quest when idle
  useEffect(() => {
    if (isIdle && !showQuest) {
      const randomQuest = quests[Math.floor(Math.random() * quests.length)]
      setCurrentQuest(randomQuest)
      setShowQuest(true)
      
      onAddNotification({
        type: 'activity',
        title: '🎯 New Quest Available!',
        message: randomQuest.description,
        icon: '🎯'
      })
    }
  }, [isIdle, showQuest, onAddNotification])

  const completeQuest = () => {
    if (currentQuest) {
      onUpdate({
        ...data,
        steps: data.steps + currentQuest.target,
        streak: data.streak + 1,
        lastActivity: Date.now()
      })

      onAddNotification({
        type: 'activity',
        title: '🎉 Quest Completed!',
        message: `You earned ${currentQuest.reward}!`,
        icon: '🎉'
      })

      setShowQuest(false)
      setCurrentQuest(null)
    }
  }

  const dismissQuest = () => {
    setShowQuest(false)
    setCurrentQuest(null)
  }

  const getActivityStatus = () => {
    if (data.streak >= 7) return { text: 'On Fire! 🔥', color: 'text-orange-400' }
    if (data.streak >= 3) return { text: 'Great streak!', color: 'text-green-400' }
    if (data.streak >= 1) return { text: 'Getting started', color: 'text-blue-400' }
    return { text: 'Ready to move!', color: 'text-slate-400' }
  }

  const status = getActivityStatus()

  return (
    <div className="relative bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-6 h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
            <span className="text-xl">🚶‍♂️</span>
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Walk Nudge</h3>
            <p className="text-sm text-slate-400">{status.text}</p>
          </div>
        </div>
        
        {isIdle && (
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
            className="w-3 h-3 bg-red-500 rounded-full"
          />
        )}
      </div>

      {/* Activity Stats */}
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-slate-800/50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-white">{data.steps}</div>
            <div className="text-sm text-slate-400">Steps Today</div>
          </div>
          <div className="bg-slate-800/50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-green-400">{data.streak}</div>
            <div className="text-sm text-slate-400">Day Streak</div>
          </div>
        </div>

        {/* Activity Level Indicator */}
        <div className="bg-slate-800/50 rounded-lg p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-slate-400">Activity Level</span>
            <span className={`text-sm font-medium ${status.color}`}>
              {status.text}
            </span>
          </div>
          <div className="w-full bg-slate-700/50 rounded-full h-2">
            <motion.div
              className="h-2 rounded-full bg-gradient-to-r from-green-500 to-emerald-500"
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(100, (data.steps / 1000) * 100)}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-2">
          <button
            onClick={() => {
              onUpdate({
                ...data,
                steps: data.steps + 50,
                lastActivity: Date.now()
              })
            }}
            className="w-full bg-gradient-to-r from-green-500/20 to-emerald-500/20 hover:from-green-500/30 hover:to-emerald-500/30 border border-green-500/50 rounded-lg p-3 text-sm font-medium transition-all duration-200 hover:scale-105"
          >
            🚶‍♂️ Quick Walk (50 steps)
          </button>
          <button
            onClick={() => {
              onUpdate({
                ...data,
                steps: data.steps + 100,
                streak: data.streak + 1,
                lastActivity: Date.now()
              })
            }}
            className="w-full bg-gradient-to-r from-emerald-500/20 to-teal-500/20 hover:from-emerald-500/30 hover:to-teal-500/30 border border-emerald-500/50 rounded-lg p-3 text-sm font-medium transition-all duration-200 hover:scale-105"
          >
            🏃‍♂️ Power Walk (100 steps)
          </button>
        </div>
      </div>

      {/* Quest Card */}
      <AnimatePresence>
        {showQuest && currentQuest && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className="absolute inset-4 bg-gradient-to-br from-amber-900/90 to-orange-900/90 backdrop-blur-sm rounded-xl border-2 border-amber-500/50 p-6 quest-card"
          >
            <div className="text-center">
              <div className="text-4xl mb-2">🎯</div>
              <h4 className="text-xl font-bold text-amber-400 mb-2">
                {currentQuest.title}
              </h4>
              <p className="text-amber-200 mb-4">
                {currentQuest.description}
              </p>
              
              {/* Quest Progress */}
              <div className="mb-4">
                <div className="flex justify-between text-sm text-amber-300 mb-1">
                  <span>Progress</span>
                  <span>{currentQuest.current}/{currentQuest.target}</span>
                </div>
                <div className="w-full bg-amber-800/50 rounded-full h-2">
                  <motion.div
                    className="h-2 rounded-full bg-gradient-to-r from-amber-500 to-orange-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${(currentQuest.current / currentQuest.target) * 100}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>

              {/* Quest Actions */}
              <div className="flex space-x-3">
                <button
                  onClick={completeQuest}
                  className="flex-1 bg-gradient-to-r from-green-500/20 to-emerald-500/20 hover:from-green-500/30 hover:to-emerald-500/30 border border-green-500/50 rounded-lg p-3 text-sm font-medium transition-all duration-200 hover:scale-105"
                >
                  ✅ Complete
                </button>
                <button
                  onClick={dismissQuest}
                  className="flex-1 bg-gradient-to-r from-slate-500/20 to-gray-500/20 hover:from-slate-500/30 hover:to-gray-500/30 border border-slate-500/50 rounded-lg p-3 text-sm font-medium transition-all duration-200 hover:scale-105"
                >
                  ❌ Dismiss
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Idle Warning */}
      {isIdle && !showQuest && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute top-4 right-4 bg-red-500/20 border border-red-500/50 rounded-lg p-2 text-xs text-red-400"
        >
          ⚠️ Inactive
        </motion.div>
      )}
    </div>
  )
}

export default WalkNudge
