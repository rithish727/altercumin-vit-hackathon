# 🟫 Minecraft Ambient Health Guardian

A Minecraft-themed health tracking application with ambient features, mood tracking, UV monitoring, and AI assistance.

## 🎮 Features

### Core Health Tracking
- **Step Tracker**: Log daily steps with progress visualization
- **Water Tracker**: Monitor hydration levels
- **Sleep Tracker**: Log sleep hours and quality
- **Workout Timer**: Track exercise sessions
- **Medicine Tracker**: Manage medication schedules

### New Enhanced Features
- **Mood Tracker**: Log moods with notes and view timeline history
- **UV Meter**: Get real-time UV index with safety recommendations
- **Ambient Sound Player**: Background sounds (rain, forest, ocean, fireplace)
- **AI Assistant**: Floating chat helper for health tips
- **Dark/Light Mode**: Toggle theme with persistent settings
- **User Authentication**: Secure login/signup system

### Minecraft Flavor
- Pixel-art inspired UI design
- Dirt texture login background
- "Creating world..." loading animation
- Pixel icons throughout the interface
- Retro gaming aesthetics

## 🚀 Quick Start

### Frontend Only (Simple)
1. Open `index.html` in your browser
2. Use demo mode with localStorage for data persistence

### Full Stack Setup (Recommended)

#### Prerequisites
- Node.js 16+ installed
- npm or yarn package manager

#### Installation
```bash
# Clone or download the project
cd minecraft-ambient-health-guardian

# Install dependencies
npm install

# Start the server
npm start
```

#### Development Mode
```bash
# Start with auto-reload
npm run dev
```

The application will be available at `http://localhost:3000`

## 🛠️ Technical Stack

### Frontend
- **HTML5** with semantic structure
- **CSS3** with custom properties and animations
- **Vanilla JavaScript** for interactivity
- **Press Start 2P** font for retro gaming feel

### Backend
- **Node.js** with Express framework
- **lowdb** for lightweight JSON database
- **JWT** for authentication
- **bcrypt** for password hashing
- **CORS** enabled for cross-origin requests

## 📁 Project Structure

```
minecraft-ambient-health-guardian/
├── index.html          # Main frontend application
├── app.js              # Frontend JavaScript logic
├── server.js           # Backend Express server
├── package.json        # Node.js dependencies
├── README.md           # This file
└── db.json            # Database file (created automatically)
```

## 🔧 Configuration

### Environment Variables
Create a `.env` file for production:
```bash
PORT=3000
JWT_SECRET=your-secure-secret-key
```

### API Endpoints
- `POST /api/register` - User registration
- `POST /api/login` - User login
- `GET/POST /api/steps` - Step tracking
- `GET/POST /api/water` - Water intake
- `GET/POST /api/mood` - Mood tracking
- `GET/POST /api/sleep` - Sleep logging
- `GET/POST /api/workouts` - Workout tracking
- `GET/POST /api/medicines` - Medicine management
- `GET /api/uv` - UV index data
- `GET/POST /api/settings` - User settings
- `GET /api/summary` - Health summary

## 🎯 Usage Guide

### Getting Started
1. **Sign Up**: Create a new account on the login page
2. **Explore**: Navigate through different health tracking cards
3. **Log Data**: Start tracking your daily activities
4. **Customize**: Toggle dark/light mode and adjust settings

### Key Features
- **Mood Tracking**: Select emoji moods and add optional notes
- **UV Monitoring**: Click "Get UV Data" to check current UV levels
- **Ambient Sounds**: Select and play background sounds for relaxation
- **AI Assistant**: Click the robot button for health tips and guidance

### Data Persistence
- **Frontend Only**: Data stored in browser localStorage
- **Full Stack**: Data saved to JSON database with user accounts

## 🔒 Security Features

- Password hashing with bcrypt
- JWT token authentication
- CORS protection
- Input validation and sanitization
- User data isolation

## 🚀 Extending the Application

### Adding New Trackers
1. Add HTML structure in `index.html`
2. Implement JavaScript logic in `app.js`
3. Create backend endpoints in `server.js`
4. Update database schema as needed

### Custom Ambient Sounds
Replace the placeholder audio URLs in `app.js` with actual sound files:
```javascript
const soundUrls = {
    rain: '/sounds/rain.mp3',
    forest: '/sounds/forest.mp3',
    // Add more sounds
};
```

### External API Integration
For production UV data, integrate with:
- OpenUV API
- OpenWeatherMap UV Index
- Weather.gov API

Example UV API integration:
```javascript
// In server.js, replace mock UV data
const response = await fetch(`https://api.openuv.io/api/v1/uv?lat=${lat}&lng=${lon}`, {
    headers: { 'x-access-token': process.env.OPENUV_API_KEY }
});
```

## 🐛 Troubleshooting

### Common Issues
1. **Database not found**: The `db.json` file is created automatically on first run
2. **Port in use**: Change the PORT in package.json or environment
3. **Audio not playing**: Browser autoplay policies may block audio

### Development Tips
- Use browser dev tools to debug frontend issues
- Check server console for backend errors
- Ensure all dependencies are installed with `npm install`

## 📈 Future Enhancements

- Mobile app version with React Native
- Advanced analytics and charts
- Social features and challenges
- Integration with fitness wearables
- Export data functionality
- Medication reminders with notifications

## 📄 License

MIT License - feel free to modify and distribute!

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

---

**Enjoy your health journey with Minecraft vibes!** 🎮💚
