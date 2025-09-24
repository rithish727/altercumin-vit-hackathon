const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// In-memory storage (in production, use a database)
let healthData = {
  posture: { score: 85, isSlouching: false, lastCheck: Date.now() },
  hydration: { current: 1200, target: 2000, lastDrink: Date.now() },
  activity: { steps: 0, streak: 0, lastActivity: Date.now() }
};

let settings = {
  postureReminders: { enabled: true, frequency: 30 },
  hydrationReminders: { enabled: true, frequency: 60 },
  activityReminders: { enabled: true, frequency: 45 },
  theme: 'dark'
};

let notifications = [];

// Routes

// Get all health data
app.get('/api/health', (req, res) => {
  res.json(healthData);
});

// Update health data
app.put('/api/health', (req, res) => {
  const { posture, hydration, activity } = req.body;
  
  if (posture) healthData.posture = { ...healthData.posture, ...posture };
  if (hydration) healthData.hydration = { ...healthData.hydration, ...hydration };
  if (activity) healthData.activity = { ...healthData.activity, ...activity };
  
  res.json(healthData);
});

// Get settings
app.get('/api/settings', (req, res) => {
  res.json(settings);
});

// Update settings
app.put('/api/settings', (req, res) => {
  settings = { ...settings, ...req.body };
  res.json(settings);
});

// Get notifications
app.get('/api/notifications', (req, res) => {
  res.json(notifications);
});

// Add notification
app.post('/api/notifications', (req, res) => {
  const notification = {
    id: uuidv4(),
    ...req.body,
    timestamp: Date.now()
  };
  notifications.push(notification);
  res.json(notification);
});

// Delete notification
app.delete('/api/notifications/:id', (req, res) => {
  const { id } = req.params;
  notifications = notifications.filter(n => n.id !== id);
  res.json({ success: true });
});

// Get user stats
app.get('/api/stats', (req, res) => {
  const stats = {
    totalSteps: healthData.activity.steps,
    hydrationLevel: (healthData.hydration.current / healthData.hydration.target) * 100,
    postureScore: healthData.posture.score,
    streak: healthData.activity.streak,
    lastActivity: healthData.activity.lastActivity
  };
  res.json(stats);
});

// Health check endpoint
app.get('/api/health-check', (req, res) => {
  res.json({ status: 'OK', timestamp: Date.now() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Health Guardian API running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health-check`);
});
