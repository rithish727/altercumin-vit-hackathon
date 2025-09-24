import React from 'react'
import { motion } from 'framer-motion'
import { Settings } from '../types'

interface SettingsPanelProps {
  settings: Settings
  onUpdateSettings: (settings: Settings) => void
  onClose: () => void
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({ 
  settings, 
  onUpdateSettings, 
  onClose 
}) => {
  const updateReminder = (type: keyof Settings, field: string, value: any) => {
    onUpdateSettings({
      ...settings,
      [type]: {
        ...settings[type],
        [field]: value
      }
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-sm rounded-xl border border-slate-700/50 p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Settings</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors text-2xl"
          >
            ✕
          </button>
        </div>

        <div className="space-y-6">
          {/* Posture Reminders */}
          <div className="bg-slate-800/50 rounded-lg p-4">
            <div className="flex items-center space-x-3 mb-4">
              <span className="text-2xl">🧚‍♀️</span>
              <h3 className="text-lg font-semibold text-white">Posture Reminders</h3>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-slate-300">Enable reminders</span>
                <button
                  onClick={() => updateReminder('postureReminders', 'enabled', !settings.postureReminders.enabled)}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    settings.postureReminders.enabled ? 'bg-blue-500' : 'bg-slate-600'
                  }`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                    settings.postureReminders.enabled ? 'translate-x-6' : 'translate-x-0.5'
                  }`} />
                </button>
              </div>
              
              <div>
                <label className="block text-slate-300 mb-2">
                  Reminder frequency (minutes)
                </label>
                <input
                  type="range"
                  min="5"
                  max="60"
                  value={settings.postureReminders.frequency}
                  onChange={(e) => updateReminder('postureReminders', 'frequency', parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-slate-400 mt-1">
                  <span>5min</span>
                  <span className="text-blue-400">{settings.postureReminders.frequency}min</span>
                  <span>60min</span>
                </div>
              </div>
            </div>
          </div>

          {/* Hydration Reminders */}
          <div className="bg-slate-800/50 rounded-lg p-4">
            <div className="flex items-center space-x-3 mb-4">
              <span className="text-2xl">💧</span>
              <h3 className="text-lg font-semibold text-white">Hydration Reminders</h3>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-slate-300">Enable reminders</span>
                <button
                  onClick={() => updateReminder('hydrationReminders', 'enabled', !settings.hydrationReminders.enabled)}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    settings.hydrationReminders.enabled ? 'bg-blue-500' : 'bg-slate-600'
                  }`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                    settings.hydrationReminders.enabled ? 'translate-x-6' : 'translate-x-0.5'
                  }`} />
                </button>
              </div>
              
              <div>
                <label className="block text-slate-300 mb-2">
                  Reminder frequency (minutes)
                </label>
                <input
                  type="range"
                  min="15"
                  max="120"
                  value={settings.hydrationReminders.frequency}
                  onChange={(e) => updateReminder('hydrationReminders', 'frequency', parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-slate-400 mt-1">
                  <span>15min</span>
                  <span className="text-blue-400">{settings.hydrationReminders.frequency}min</span>
                  <span>120min</span>
                </div>
              </div>
            </div>
          </div>

          {/* Activity Reminders */}
          <div className="bg-slate-800/50 rounded-lg p-4">
            <div className="flex items-center space-x-3 mb-4">
              <span className="text-2xl">🚶‍♂️</span>
              <h3 className="text-lg font-semibold text-white">Activity Reminders</h3>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-slate-300">Enable reminders</span>
                <button
                  onClick={() => updateReminder('activityReminders', 'enabled', !settings.activityReminders.enabled)}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    settings.activityReminders.enabled ? 'bg-blue-500' : 'bg-slate-600'
                  }`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                    settings.activityReminders.enabled ? 'translate-x-6' : 'translate-x-0.5'
                  }`} />
                </button>
              </div>
              
              <div>
                <label className="block text-slate-300 mb-2">
                  Reminder frequency (minutes)
                </label>
                <input
                  type="range"
                  min="10"
                  max="90"
                  value={settings.activityReminders.frequency}
                  onChange={(e) => updateReminder('activityReminders', 'frequency', parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-slate-400 mt-1">
                  <span>10min</span>
                  <span className="text-blue-400">{settings.activityReminders.frequency}min</span>
                  <span>90min</span>
                </div>
              </div>
            </div>
          </div>

          {/* Theme Settings */}
          <div className="bg-slate-800/50 rounded-lg p-4">
            <div className="flex items-center space-x-3 mb-4">
              <span className="text-2xl">🎨</span>
              <h3 className="text-lg font-semibold text-white">Appearance</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-slate-300 mb-2">Theme</label>
                <div className="flex space-x-2">
                  <button
                    onClick={() => onUpdateSettings({ ...settings, theme: 'dark' })}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      settings.theme === 'dark' 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-slate-600 text-slate-300 hover:bg-slate-500'
                    }`}
                  >
                    🌙 Dark
                  </button>
                  <button
                    onClick={() => onUpdateSettings({ ...settings, theme: 'light' })}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      settings.theme === 'light' 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-slate-600 text-slate-300 hover:bg-slate-500'
                    }`}
                  >
                    ☀️ Light
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-slate-700/50">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-slate-600 hover:bg-slate-500 text-white rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-lg transition-all duration-200 hover:scale-105"
            >
              Save Settings
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default SettingsPanel
