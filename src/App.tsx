import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Dashboard from './components/Dashboard'
import PosturePixie from './components/PosturePixie'
import HydrationHalo from './components/HydrationHalo'
import WalkNudge from './components/WalkNudge'
import SettingsPanel from './components/SettingsPanel'
import NotificationSystem from './components/NotificationSystem'
import { HealthData, Settings } from './types'

function App() {
  const [healthData, setHealthData] = useState<HealthData>({
    posture: { score: 85, isSlouching: false, lastCheck: Date.now() },
    hydration: { current: 1200, target: 2000, lastDrink: Date.now() },
    activity: { steps: 0, streak: 0, lastActivity: Date.now() }
  })

  const [settings, setSettings] = useState<Settings>({
    postureReminders: { enabled: true, frequency: 30 },
    hydrationReminders: { enabled: true, frequency: 60 },
    activityReminders: { enabled: true, frequency: 45 },
    theme: 'dark'
  })

  const [notifications, setNotifications] = useState<any[]>([])
  const [showSettings, setShowSettings] = useState(false)

  // Mock data updates for demonstration
  useEffect(() => {
    const interval = setInterval(() => {
      setHealthData(prev => ({
        ...prev,
        posture: {
          ...prev.posture,
          score: Math.max(60, Math.min(100, prev.posture.score + (Math.random() - 0.5) * 10))
        }
      }))
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const addNotification = (notification: any) => {
    setNotifications(prev => [...prev, { ...notification, id: Date.now() }])
  }

  const removeNotification = (id: number) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <header className="p-6 border-b border-slate-700/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-2xl">🛡️</span>
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Health Guardian
                </h1>
                <p className="text-slate-400">Your magical health companion</p>
              </div>
            </div>
            
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-3 bg-slate-800/50 hover:bg-slate-700/50 rounded-lg border border-slate-600/50 transition-all duration-200 hover:border-blue-500/50"
            >
              <span className="text-xl">⚙️</span>
            </button>
          </div>
        </header>

        {/* Main Content */}
        <main className="p-6">
          <Dashboard 
            healthData={healthData} 
            onUpdateHealthData={setHealthData}
            onAddNotification={addNotification}
          />
        </main>

        {/* Settings Panel */}
        <AnimatePresence>
          {showSettings && (
            <SettingsPanel
              settings={settings}
              onUpdateSettings={setSettings}
              onClose={() => setShowSettings(false)}
            />
          )}
        </AnimatePresence>

        {/* Notification System */}
        <NotificationSystem
          notifications={notifications}
          onRemoveNotification={removeNotification}
        />
      </div>
    </div>
  )
}

export default App
