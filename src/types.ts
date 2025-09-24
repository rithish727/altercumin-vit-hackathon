export interface PostureData {
  score: number
  isSlouching: boolean
  lastCheck: number
}

export interface HydrationData {
  current: number
  target: number
  lastDrink: number
}

export interface ActivityData {
  steps: number
  streak: number
  lastActivity: number
}

export interface HealthData {
  posture: PostureData
  hydration: HydrationData
  activity: ActivityData
}

export interface ReminderSettings {
  enabled: boolean
  frequency: number // minutes
}

export interface Settings {
  postureReminders: ReminderSettings
  hydrationReminders: ReminderSettings
  activityReminders: ReminderSettings
  theme: 'light' | 'dark'
}

export interface Notification {
  id: number
  type: 'posture' | 'hydration' | 'activity'
  title: string
  message: string
  icon: string
  duration?: number
}

export interface Quest {
  id: string
  title: string
  description: string
  target: number
  current: number
  reward: string
  type: 'steps' | 'water' | 'posture'
}
