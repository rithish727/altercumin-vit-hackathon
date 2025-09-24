// Minecraft Ambient Health Guardian - Backend Server
// A minimal Node.js server with Express and lowdb for data persistence

const express = require('express');
const path = require('path');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const cors = require('cors');
const fs = require('fs');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'minecraft-health-guardian-secret';

// Initialize Gemini AI
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || 'AIzaSyAUduV-eHAJT4LBP9ZGSwFO9R4S8MdX_Eo';
console.log('🔑 Gemini API Key configured:', GEMINI_API_KEY ? 'Yes' : 'No');
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Simple JSON database implementation
const DB_FILE = 'db.json';

// Initialize database with default data
function initDb() {
    if (!fs.existsSync(DB_FILE)) {
        const defaultData = {
            users: [],
            healthData: {
                steps: [],
                water: [],
                mood: [],
                sleep: [],
                workouts: [],
                medicines: []
            },
            settings: {}
        };
        fs.writeFileSync(DB_FILE, JSON.stringify(defaultData, null, 2));
    }
}

// Database helper functions
function readDb() {
    try {
        const data = fs.readFileSync(DB_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading database:', error);
        return {
            users: [],
            healthData: { steps: [], water: [], mood: [], sleep: [], workouts: [], medicines: [] },
            settings: {}
        };
    }
}

function writeDb(data) {
    try {
        fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
        return true;
    } catch (error) {
        console.error('Error writing database:', error);
        return false;
    }
}

// Authentication middleware
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.sendStatus(401);
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
}

// Routes

// User Authentication
app.post('/api/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        
        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password required' });
        }

        const db = readDb();
        
        // Check if user already exists
        const existingUser = db.users.find(u => u.username === username);
        if (existingUser) {
            return res.status(400).json({ error: 'Username already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Create new user
        const newUser = {
            id: Date.now().toString(),
            username,
            password: hashedPassword,
            createdAt: new Date().toISOString()
        };

        db.users.push(newUser);
        writeDb(db);

        // Generate JWT token
        const token = jwt.sign(
            { userId: newUser.id, username: newUser.username },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({
            token,
            user: { id: newUser.id, username: newUser.username }
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/api/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        
        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password required' });
        }

        const db = readDb();
        
        // Find user
        const user = db.users.find(u => u.username === username);
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Check password
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Generate JWT token
        const token = jwt.sign(
            { userId: user.id, username: user.username },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({
            token,
            user: { id: user.id, username: user.username }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Health Data Routes

// Steps
app.get('/api/steps', authenticateToken, (req, res) => {
    const db = readDb();
    const userSteps = db.healthData.steps.filter(entry => entry.userId === req.user.userId);
    res.json(userSteps);
});

app.post('/api/steps', authenticateToken, (req, res) => {
    try {
        const { steps, date } = req.body;
        
        const stepEntry = {
            id: Date.now().toString(),
            userId: req.user.userId,
            steps: parseInt(steps),
            date: date || new Date().toISOString(),
            createdAt: new Date().toISOString()
        };

        const db = readDb();
        db.healthData.steps.push(stepEntry);
        writeDb(db);

        res.json(stepEntry);
    } catch (error) {
        console.error('Steps logging error:', error);
        res.status(500).json({ error: 'Failed to log steps' });
    }
});

// Water
app.get('/api/water', authenticateToken, async (req, res) => {
    await db.read();
    const userWater = db.data.healthData.water.filter(entry => entry.userId === req.user.userId);
    res.json(userWater);
});

app.post('/api/water', authenticateToken, async (req, res) => {
    try {
        const { amount, date } = req.body;
        
        const waterEntry = {
            id: Date.now().toString(),
            userId: req.user.userId,
            amount: parseFloat(amount),
            date: date || new Date().toISOString(),
            createdAt: new Date().toISOString()
        };

        await db.read();
        db.data.healthData.water.push(waterEntry);
        await db.write();

        res.json(waterEntry);
    } catch (error) {
        console.error('Water logging error:', error);
        res.status(500).json({ error: 'Failed to log water intake' });
    }
});

// Mood
app.get('/api/mood', authenticateToken, async (req, res) => {
    await db.read();
    const userMood = db.data.healthData.mood.filter(entry => entry.userId === req.user.userId);
    res.json(userMood);
});

app.post('/api/mood', authenticateToken, async (req, res) => {
    try {
        const { mood, notes, date } = req.body;
        
        const moodEntry = {
            id: Date.now().toString(),
            userId: req.user.userId,
            mood,
            notes: notes || '',
            date: date || new Date().toISOString(),
            createdAt: new Date().toISOString()
        };

        await db.read();
        db.data.healthData.mood.push(moodEntry);
        await db.write();

        res.json(moodEntry);
    } catch (error) {
        console.error('Mood logging error:', error);
        res.status(500).json({ error: 'Failed to log mood' });
    }
});

// Sleep
app.get('/api/sleep', authenticateToken, async (req, res) => {
    await db.read();
    const userSleep = db.data.healthData.sleep.filter(entry => entry.userId === req.user.userId);
    res.json(userSleep);
});

app.post('/api/sleep', authenticateToken, async (req, res) => {
    try {
        const { hours, quality, date } = req.body;
        
        const sleepEntry = {
            id: Date.now().toString(),
            userId: req.user.userId,
            hours: parseFloat(hours),
            quality: parseInt(quality),
            date: date || new Date().toISOString(),
            createdAt: new Date().toISOString()
        };

        await db.read();
        db.data.healthData.sleep.push(sleepEntry);
        await db.write();

        res.json(sleepEntry);
    } catch (error) {
        console.error('Sleep logging error:', error);
        res.status(500).json({ error: 'Failed to log sleep' });
    }
});

// Workouts
app.get('/api/workouts', authenticateToken, async (req, res) => {
    await db.read();
    const userWorkouts = db.data.healthData.workouts.filter(entry => entry.userId === req.user.userId);
    res.json(userWorkouts);
});

app.post('/api/workouts', authenticateToken, async (req, res) => {
    try {
        const { type, duration, date } = req.body;
        
        const workoutEntry = {
            id: Date.now().toString(),
            userId: req.user.userId,
            type,
            duration: parseInt(duration),
            date: date || new Date().toISOString(),
            createdAt: new Date().toISOString()
        };

        await db.read();
        db.data.healthData.workouts.push(workoutEntry);
        await db.write();

        res.json(workoutEntry);
    } catch (error) {
        console.error('Workout logging error:', error);
        res.status(500).json({ error: 'Failed to log workout' });
    }
});

// Medicines
app.get('/api/medicines', authenticateToken, async (req, res) => {
    await db.read();
    const userMedicines = db.data.healthData.medicines.filter(entry => entry.userId === req.user.userId);
    res.json(userMedicines);
});

app.post('/api/medicines', authenticateToken, async (req, res) => {
    try {
        const { name, count } = req.body;
        
        const medicineEntry = {
            id: Date.now().toString(),
            userId: req.user.userId,
            name,
            count: parseInt(count),
            createdAt: new Date().toISOString()
        };

        await db.read();
        db.data.healthData.medicines.push(medicineEntry);
        await db.write();

        res.json(medicineEntry);
    } catch (error) {
        console.error('Medicine logging error:', error);
        res.status(500).json({ error: 'Failed to add medicine' });
    }
});

app.put('/api/medicines/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const { count } = req.body;

        await db.read();
        const medicineIndex = db.data.healthData.medicines.findIndex(
            entry => entry.id === id && entry.userId === req.user.userId
        );

        if (medicineIndex === -1) {
            return res.status(404).json({ error: 'Medicine not found' });
        }

        db.data.healthData.medicines[medicineIndex].count = parseInt(count);
        db.data.healthData.medicines[medicineIndex].updatedAt = new Date().toISOString();
        await db.write();

        res.json(db.data.healthData.medicines[medicineIndex]);
    } catch (error) {
        console.error('Medicine update error:', error);
        res.status(500).json({ error: 'Failed to update medicine' });
    }
});

// UV Index API (mock - in production use OpenUV or OpenWeatherMap)
app.get('/api/uv', async (req, res) => {
    try {
        const { lat, lon } = req.query;
        
        if (!lat || !lon) {
            return res.status(400).json({ error: 'Latitude and longitude required' });
        }

        // Mock UV data (in production, integrate with OpenUV API)
        const uvIndex = Math.floor(Math.random() * 11); // 0-10 scale
        
        let recommendation = '';
        if (uvIndex <= 2) {
            recommendation = 'Safe to go outside! Minimal protection needed.';
        } else if (uvIndex <= 5) {
            recommendation = 'Moderate UV. Wear sunscreen if outside for extended periods.';
        } else if (uvIndex <= 7) {
            recommendation = 'High UV! Wear sunscreen and protective clothing.';
        } else {
            recommendation = 'Very high UV! Avoid sun exposure. Stay indoors if possible.';
        }

        res.json({
            uvIndex,
            recommendation,
            location: { lat: parseFloat(lat), lon: parseFloat(lon) },
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('UV API error:', error);
        res.status(500).json({ error: 'Failed to get UV data' });
    }
});

// Settings
app.get('/api/settings', authenticateToken, async (req, res) => {
    await db.read();
    const userSettings = db.data.settings[req.user.userId] || {};
    res.json(userSettings);
});

app.post('/api/settings', authenticateToken, async (req, res) => {
    try {
        const settings = req.body;
        
        await db.read();
        db.data.settings[req.user.userId] = {
            ...db.data.settings[req.user.userId],
            ...settings,
            updatedAt: new Date().toISOString()
        };
        await db.write();

        res.json(db.data.settings[req.user.userId]);
    } catch (error) {
        console.error('Settings save error:', error);
        res.status(500).json({ error: 'Failed to save settings' });
    }
});

// AI Chat endpoint
app.post('/api/ai-chat', authenticateToken, async (req, res) => {
    try {
        const { message } = req.body;
        
        if (!message || message.trim().length === 0) {
            return res.status(400).json({ error: 'Message is required' });
        }

        // Get user's health data for context
        const db = readDb();
        const userId = req.user.userId;
        
        const userSteps = db.healthData.steps.filter(entry => entry.userId === userId);
        const userMoods = db.healthData.mood.filter(entry => entry.userId === userId);
        const userSleep = db.healthData.sleep.filter(entry => entry.userId === userId);
        const userWater = db.healthData.water.filter(entry => entry.userId === userId);
        
        // Create context for the AI
        const healthContext = `
User's Health Data:
- Steps logged: ${userSteps.length} entries
- Moods logged: ${userMoods.length} entries  
- Sleep logged: ${userSleep.length} entries
- Water logged: ${userWater.length} entries
- Recent mood: ${userMoods.length > 0 ? userMoods[userMoods.length - 1].mood.name : 'No data'}
- Average sleep: ${userSleep.length > 0 ? (userSleep.reduce((sum, entry) => sum + entry.hours, 0) / userSleep.length).toFixed(1) + ' hours' : 'No data'}
        `.trim();

        const prompt = `
You are a helpful health assistant. Be concise and practical.

User's Health Context:
${healthContext}

User's Question: ${message}

Give a brief, helpful response (under 50 words). Focus on practical health advice.
        `;

        console.log('🤖 Calling Gemini API with prompt length:', prompt.length);
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const aiResponse = response.text();
        console.log('✅ Gemini API response received, length:', aiResponse.length);

        res.json({
            message: aiResponse,
            timestamp: new Date().toISOString()
        });
        
    } catch (error) {
        console.error('AI Chat error:', error);
        
        // Fallback response if Gemini API fails
        const fallbackResponses = [
            "I'm here to help with your health!",
            "Stay hydrated and get enough sleep.",
            "Your health matters - I'm here to help!",
            "Every step towards better health counts!",
            "Keep up the great work on your wellness goals!"
        ];
        
        const randomResponse = fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
        
        res.json({
            message: randomResponse,
            timestamp: new Date().toISOString(),
            fallback: true
        });
    }
});

// Health summary endpoint
app.get('/api/summary', authenticateToken, (req, res) => {
    try {
        const db = readDb();
        
        const userId = req.user.userId;
        const today = new Date().toISOString().split('T')[0];
        
        // Get today's data
        const todaySteps = db.healthData.steps
            .filter(entry => entry.userId === userId && entry.date.startsWith(today))
            .reduce((sum, entry) => sum + entry.steps, 0);
            
        const todayWater = db.healthData.water
            .filter(entry => entry.userId === userId && entry.date.startsWith(today))
            .reduce((sum, entry) => sum + entry.amount, 0);
            
        const recentMoods = db.healthData.mood
            .filter(entry => entry.userId === userId)
            .slice(-7);
            
        const recentSleep = db.healthData.sleep
            .filter(entry => entry.userId === userId)
            .slice(-7);
            
        const avgSleep = recentSleep.length > 0 
            ? recentSleep.reduce((sum, entry) => sum + entry.hours, 0) / recentSleep.length 
            : 0;

        res.json({
            todaySteps,
            todayWater,
            avgSleep: Math.round(avgSleep * 10) / 10,
            recentMoods: recentMoods.length,
            totalWorkouts: db.healthData.workouts.filter(entry => entry.userId === userId).length
        });
    } catch (error) {
        console.error('Summary error:', error);
        res.status(500).json({ error: 'Failed to get health summary' });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({ error: 'Internal server error' });
});

// Serve the main app
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({ error: 'Not found' });
});

// Start server
function startServer() {
    initDb();
    
    app.listen(PORT, () => {
        console.log(`🟫 Minecraft Ambient Health Guardian Server running on port ${PORT}`);
        console.log(`📱 Visit http://localhost:${PORT} to access the app`);
        console.log(`🗃️  Database file: ${DB_FILE}`);
        console.log(`🔧 API endpoints available at /api/*`);
    });
}

// Handle graceful shutdown
process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down server gracefully...');
    process.exit(0);
});

process.on('SIGTERM', () => {
    console.log('\n🛑 Shutting down server gracefully...');
    process.exit(0);
});

startServer();
