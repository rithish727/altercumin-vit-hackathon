import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Notification } from '../types'

interface NotificationSystemProps {
  notifications: Notification[]
  onRemoveNotification: (id: number) => void
}

const NotificationSystem: React.FC<NotificationSystemProps> = ({ 
  notifications, 
  onRemoveNotification 
}) => {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      <AnimatePresence>
        {notifications.map((notification) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, x: 300, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 300, scale: 0.8 }}
            transition={{ 
              type: "spring", 
              stiffness: 300, 
              damping: 30 
            }}
            className="relative max-w-sm"
          >
            <motion.div
              className="bg-gradient-to-r from-slate-800/95 to-slate-900/95 backdrop-blur-sm border border-slate-600/50 rounded-xl p-4 shadow-2xl"
              whileHover={{ scale: 1.02 }}
              onAnimationComplete={() => {
                // Auto-remove after duration
                setTimeout(() => {
                  onRemoveNotification(notification.id)
                }, notification.duration || 5000)
              }}
            >
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl blur-sm -z-10" />
              
              <div className="flex items-start space-x-3">
                <div className="text-2xl animate-bounce">
                  {notification.icon}
                </div>
                
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold text-white mb-1">
                    {notification.title}
                  </h4>
                  <p className="text-xs text-slate-300">
                    {notification.message}
                  </p>
                </div>
                
                <button
                  onClick={() => onRemoveNotification(notification.id)}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  ✕
                </button>
              </div>
              
              {/* Progress bar for auto-dismiss */}
              <motion.div
                className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-b-xl"
                initial={{ scaleX: 1 }}
                animate={{ scaleX: 0 }}
                transition={{ 
                  duration: (notification.duration || 5000) / 1000,
                  ease: "linear"
                }}
              />
            </motion.div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

export default NotificationSystem
