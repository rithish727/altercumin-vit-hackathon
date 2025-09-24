# Health Guardian 🛡️

A magical health companion app that gamifies your wellness journey with three core modules:

- **🧚‍♀️ Posture Pixie** - Webcam-based posture detection with fairy notifications
- **💧 Hydration Halo** - Water tracking with glowing orb visualization  
- **🚶‍♂️ Walk Nudge** - Activity detection with RPG-style quest cards

## Features

### 🎮 Gamified Experience
- RPG-style dashboard with glowing cards
- XP system and level progression
- Animated notifications with magical effects
- Quest system for activity challenges

### 🧚‍♀️ Posture Pixie
- Real-time webcam posture detection
- Animated fairy notifications when slouching detected
- Posture scoring system (0-100)
- Quick stretch reminders

### 💧 Hydration Halo  
- Beautiful water orb visualization
- Level-based progression system
- Multiple water intake options (250ml, 500ml, 1L)
- Glowing effects and sparkle animations

### 🚶‍♂️ Walk Nudge
- Inactivity detection (5+ minutes)
- Dynamic quest cards with rewards
- Step tracking and streak system
- Activity level indicators

### ⚙️ Settings Panel
- Customizable reminder frequencies
- Theme selection (Dark/Light)
- Individual module controls
- Real-time settings updates

## Tech Stack

### Frontend
- **React 18** with TypeScript
- **TailwindCSS** for styling
- **Framer Motion** for animations
- **Vite** for build tooling

### Backend
- **Node.js** with Express
- **CORS** enabled for cross-origin requests
- RESTful API endpoints
- In-memory storage (easily upgradeable to database)

## Getting Started

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd health-guardian
   ```

2. **Install frontend dependencies**
   ```bash
   npm install
   ```

3. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

4. **Start the development servers**

   **Backend (Terminal 1):**
   ```bash
   cd backend
   npm run dev
   ```

   **Frontend (Terminal 2):**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3001

## API Endpoints

### Health Data
- `GET /api/health` - Get current health data
- `PUT /api/health` - Update health data

### Settings
- `GET /api/settings` - Get user settings
- `PUT /api/settings` - Update settings

### Notifications
- `GET /api/notifications` - Get all notifications
- `POST /api/notifications` - Add new notification
- `DELETE /api/notifications/:id` - Remove notification

### Stats
- `GET /api/stats` - Get user statistics
- `GET /api/health-check` - API health check

## Project Structure

```
health-guardian/
├── src/
│   ├── components/
│   │   ├── Dashboard.tsx          # Main dashboard layout
│   │   ├── PosturePixie.tsx       # Posture detection module
│   │   ├── HydrationHalo.tsx      # Water tracking module
│   │   ├── WalkNudge.tsx          # Activity tracking module
│   │   ├── NotificationSystem.tsx # Notification display
│   │   └── SettingsPanel.tsx      # Settings interface
│   ├── types.ts                   # TypeScript type definitions
│   ├── App.tsx                    # Main app component
│   └── main.tsx                   # App entry point
├── backend/
│   ├── server.js                  # Express server
│   └── package.json              # Backend dependencies
└── README.md
```

## Customization

### Adding New Health Modules
1. Create a new component in `src/components/`
2. Add the module to the Dashboard
3. Update the types in `src/types.ts`
4. Add corresponding API endpoints

### Styling
- Modify `tailwind.config.js` for custom animations
- Update `src/index.css` for global styles
- Component-specific styles use Tailwind classes

### Backend Integration
- Replace in-memory storage with a database
- Add user authentication
- Implement data persistence
- Add real-time features with WebSockets

## Browser Compatibility

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Future Enhancements

- [ ] Real ML-based posture detection
- [ ] Integration with fitness trackers
- [ ] Social features and challenges
- [ ] Mobile app version
- [ ] Advanced analytics dashboard
- [ ] Voice reminders
- [ ] Integration with calendar apps

---

**Health Guardian** - Your magical companion for a healthier lifestyle! ✨
