import React from 'react'
import { motion } from 'framer-motion'
import PosturePixie from './PosturePixie'
import HydrationHalo from './HydrationHalo'
import WalkNudge from './WalkNudge'
import { HealthData, Notification } from '../types'

interface DashboardProps {
  healthData: HealthData
  onUpdateHealthData: (data: HealthData) => void
  onAddNotification: (notification: Omit<Notification, 'id'>) => void
}

const Dashboard: React.FC<DashboardProps> = ({ 
  healthData, 
  onUpdateHealthData, 
  onAddNotification 
}) => {
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    hover: { scale: 1.02, y: -5 }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto">
      {/* Posture Pixie Card */}
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        whileHover="hover"
        className="relative"
      >
        <PosturePixie 
          data={healthData.posture}
          onUpdate={(postureData) => 
            onUpdateHealthData({ ...healthData, posture: postureData })
          }
          onAddNotification={onAddNotification}
        />
      </motion.div>

      {/* Hydration Halo Card */}
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.1 }}
        whileHover="hover"
        className="relative"
      >
        <HydrationHalo 
          data={healthData.hydration}
          onUpdate={(hydrationData) => 
            onUpdateHealthData({ ...healthData, hydration: hydrationData })
          }
          onAddNotification={onAddNotification}
        />
      </motion.div>

      {/* Walk Nudge Card */}
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.2 }}
        whileHover="hover"
        className="relative"
      >
        <WalkNudge 
          data={healthData.activity}
          onUpdate={(activityData) => 
            onUpdateHealthData({ ...healthData, activity: activityData })
          }
          onAddNotification={onAddNotification}
        />
      </motion.div>
    </div>
  )
}

export default Dashboard
