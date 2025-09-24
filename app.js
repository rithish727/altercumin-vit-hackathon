// Minecraft Ambient Health Guardian - Enhanced JavaScript

// Global state
let currentUser = null;
let selectedMood = null;
let currentSound = null;
let aiPanelOpen = false;

// Data storage (localStorage for demo - would use backend in production)
const storage = {
    get: (key) => JSON.parse(localStorage.getItem(key) || '{}'),
    set: (key, data) => localStorage.setItem(key, JSON.stringify(data)),
    getArray: (key) => JSON.parse(localStorage.getItem(key) || '[]'),
    setArray: (key, data) => localStorage.setItem(key, JSON.stringify(data))
};

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    currentUser = storage.get('currentUser');
    if (currentUser.username) {
        showMainApp();
    }
    
    initializeEventListeners();
    loadSettings();
    loadData();
});

// Authentication
function initializeEventListeners() {
    // Login/Signup
    document.getElementById('login-btn').addEventListener('click', handleLogin);
    document.getElementById('signup-btn').addEventListener('click', handleSignup);
    
    // Theme toggle
    document.getElementById('theme-toggle').addEventListener('click', toggleTheme);
    
    // Logout
    document.getElementById('logout-btn').addEventListener('click', handleLogout);
    
    // Mood tracker
    document.querySelectorAll('.mood-option').forEach(option => {
        option.addEventListener('click', selectMood);
    });
    document.getElementById('log-mood').addEventListener('click', logMood);
    
    // UV meter
    document.getElementById('get-uv').addEventListener('click', getUVData);
    
    // Sound player
    document.getElementById('play-sound').addEventListener('click', playAmbientSound);
    document.getElementById('stop-sound').addEventListener('click', stopAmbientSound);
    document.getElementById('volume-control').addEventListener('input', adjustVolume);
    
    // AI Assistant
    document.getElementById('ai-button').addEventListener('click', toggleAIPanel);
    document.getElementById('ai-input').addEventListener('keypress', handleAIInput);
    
    // Existing trackers (enhanced)
    initializeExistingTrackers();
}

async function handleLogin() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    if (!username || !password) {
        alert('Please enter username and password');
        return;
    }
    
    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });
        
        if (response.ok) {
            const data = await response.json();
            currentUser = data.user;
            currentUser.token = data.token;
            storage.set('currentUser', currentUser);
            showWorldCreation();
        } else {
            const error = await response.json();
            alert(error.error || 'Login failed');
        }
    } catch (error) {
        console.error('Login error:', error);
        alert('Login failed. Please try again.');
    }
}

async function handleSignup() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    if (!username || !password) {
        alert('Please enter username and password');
        return;
    }
    
    try {
        const response = await fetch('/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });
        
        if (response.ok) {
            const data = await response.json();
            currentUser = data.user;
            currentUser.token = data.token;
            storage.set('currentUser', currentUser);
            showWorldCreation();
        } else {
            const error = await response.json();
            alert(error.error || 'Registration failed');
        }
    } catch (error) {
        console.error('Signup error:', error);
        alert('Registration failed. Please try again.');
    }
}

function showWorldCreation() {
    document.querySelector('.login-form').style.display = 'none';
    document.getElementById('world-creating').style.display = 'block';
    
    setTimeout(() => {
        showMainApp();
    }, 2000);
}

function showMainApp() {
    document.getElementById('login-page').style.display = 'none';
    document.getElementById('main-app').style.display = 'block';
    document.getElementById('ai-assistant').style.display = 'block';
    startWaterReminders();
    initializeGuardianOrb();
    
}

function handleLogout() {
    // Clear user data
    currentUser = null;
    storage.set('currentUser', {});
    
    // Clear all user-specific data
    localStorage.removeItem('stepHistory');
    localStorage.removeItem('moodHistory');
    localStorage.removeItem('sleepHistory');
    localStorage.removeItem('medicines');
    localStorage.removeItem('workouts');
    
    // Show login page
    document.getElementById('main-app').style.display = 'none';
    document.getElementById('ai-assistant').style.display = 'none';
    document.getElementById('login-page').style.display = 'flex';
    
    // Reset login form
    document.getElementById('username').value = '';
    document.getElementById('password').value = '';
    
    animateGuardian('click');
}

// Theme toggle
function toggleTheme() {
    const body = document.body;
    const currentTheme = body.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    body.setAttribute('data-theme', newTheme);
    storage.set('theme', { theme: newTheme });
    
    // Update toggle button
    const themeButton = document.getElementById('theme-toggle');
    themeButton.textContent = newTheme === 'light' ? '🌙' : '🌓';
    
    // Animate the guardian
    animateGuardian('click');
}

function loadSettings() {
    const settings = storage.get('theme');
    if (settings.theme) {
        document.body.setAttribute('data-theme', settings.theme);
        document.getElementById('theme-toggle').textContent = settings.theme === 'light' ? '🌙' : '🌓';
    }
}

// Mood Tracker
function selectMood(event) {
    document.querySelectorAll('.mood-option').forEach(opt => opt.classList.remove('selected'));
    event.target.classList.add('selected');
    selectedMood = {
        emoji: event.target.dataset.mood,
        name: event.target.textContent
    };
}

function logMood() {
    if (!selectedMood) {
        alert('Please select a mood first');
        return;
    }
    
    const notes = document.getElementById('mood-notes').value;
    const moodEntry = {
        date: new Date(),
        mood: selectedMood,
        notes: notes,
        user: currentUser.username
    };
    
    const moodHistory = storage.getArray('moodHistory');
    moodHistory.push(moodEntry);
    storage.setArray('moodHistory', moodHistory);
    
    document.getElementById('mood-notes').value = '';
    document.querySelectorAll('.mood-option').forEach(opt => opt.classList.remove('selected'));
    selectedMood = null;
    
    updateMoodHistory();
    animateGuardian('success');
}

function updateMoodHistory() {
    const moodHistory = storage.getArray('moodHistory')
        .filter(entry => entry.user === currentUser.username)
        .slice(-5); // Show last 5 entries
    
    const historyContainer = document.getElementById('mood-history');
    historyContainer.innerHTML = '';
    
    moodHistory.reverse().forEach(entry => {
        const entryDiv = document.createElement('div');
        entryDiv.className = 'mood-entry';
        entryDiv.innerHTML = `
            <div class="mood-entry-date">${new Date(entry.date).toLocaleDateString()}</div>
            <div class="mood-entry-mood">${entry.mood.emoji} ${entry.mood.name}</div>
            ${entry.notes ? `<div class="mood-entry-notes">"${entry.notes}"</div>` : ''}
        `;
        historyContainer.appendChild(entryDiv);
    });
}

// UV Meter
async function getUVData() {
    if (!navigator.geolocation) {
        alert('Geolocation is not supported by this browser');
        return;
    }
    
    navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        
        try {
            // Using OpenUV API (would need API key in production)
            // For demo, we'll simulate UV data
            const uvIndex = Math.floor(Math.random() * 11); // 0-10 scale
            
            document.getElementById('uv-level').textContent = uvIndex;
            
            let recommendation = '';
            let color = '';
            
            if (uvIndex <= 2) {
                recommendation = '✅ Safe to go outside! Minimal protection needed.';
                color = '#55ff55';
            } else if (uvIndex <= 5) {
                recommendation = '⚠️ Moderate UV. Wear sunscreen if outside for extended periods.';
                color = '#ffaa55';
            } else if (uvIndex <= 7) {
                recommendation = '🧴 High UV! Wear sunscreen and protective clothing.';
                color = '#ff8855';
            } else {
                recommendation = '🚫 Very high UV! Avoid sun exposure. Stay indoors if possible.';
                color = '#ff5555';
            }
            
            document.getElementById('uv-level').style.color = color;
            document.getElementById('uv-recommendation').textContent = recommendation;
            
            animateGuardian('success');
        } catch (error) {
            alert('Could not fetch UV data. Please try again later.');
        }
    }, () => {
        alert('Unable to get your location. Please enable location services.');
    });
}

// Sound Player
function playAmbientSound() {
    const soundSelect = document.getElementById('sound-select');
    const selectedSound = soundSelect.value;
    
    if (!selectedSound) {
        alert('Please select a sound first');
        return;
    }
    
    stopAmbientSound(); // Stop any current sound
    
    const audio = document.getElementById('ambient-audio');
    
    // Working YouTube non-copyright music and ambient sounds
    const soundUrls = {
        rain: 'https://www.soundjay.com/misc/sounds/rain-01.mp3',
        forest: 'https://www.soundjay.com/nature/sounds/forest-01.mp3',
        ocean: 'https://www.soundjay.com/nature/sounds/ocean-01.mp3',
        fireplace: 'https://www.soundjay.com/misc/sounds/fireplace-01.mp3',
        ncs1: 'https://www.bensound.com/bensound-music/bensound-sunny.mp3',
        ncs2: 'https://www.bensound.com/bensound-music/bensound-creativeminds.mp3',
        ncs3: 'https://www.bensound.com/bensound-music/bensound-relaxing.mp3'
    };
    
    const trackNames = {
        rain: 'Rain Sounds',
        forest: 'Forest Ambience',
        ocean: 'Ocean Waves',
        fireplace: 'Fireplace Crackling',
        ncs1: 'NCS: Chill Vibes',
        ncs2: 'NCS: Focus Mode',
        ncs3: 'NCS: Relaxation'
    };
    
    // Show now playing
    document.getElementById('now-playing').style.display = 'block';
    document.getElementById('current-track').textContent = trackNames[selectedSound];
    
    // Try to load the audio
    audio.src = soundUrls[selectedSound];
    audio.volume = document.getElementById('volume-control').value / 100;
    
    // Handle audio events
    audio.onloadstart = () => {
        console.log('Loading audio...');
    };
    
    audio.oncanplay = () => {
        audio.play().then(() => {
            currentSound = selectedSound;
            animateGuardian('success');
            console.log('Audio started playing');
        }).catch(error => {
            console.log('Audio play failed:', error);
            // Fallback to demo mode
            playDemoSound(selectedSound);
        });
    };
    
    audio.onerror = () => {
        console.log('Audio load failed, using demo mode');
        playDemoSound(selectedSound);
    };
}

function playDemoSound(selectedSound) {
    // Demo mode - create a simple tone for demonstration
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    // Different frequencies for different sounds
    const frequencies = {
        rain: 200,
        forest: 300,
        ocean: 150,
        fireplace: 100,
        ncs1: 400,
        ncs2: 500,
        ncs3: 350
    };
    
    oscillator.frequency.setValueAtTime(frequencies[selectedSound] || 300, audioContext.currentTime);
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 2);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 2);
    
    currentSound = selectedSound;
    animateGuardian('success');
    
    // Show now playing
    document.getElementById('now-playing').style.display = 'block';
    document.getElementById('current-track').textContent = selectedSound.toUpperCase() + ' (Demo Mode)';
}

function stopAmbientSound() {
    const audio = document.getElementById('ambient-audio');
    audio.pause();
    audio.currentTime = 0;
    currentSound = null;
    
    // Hide now playing
    document.getElementById('now-playing').style.display = 'none';
    document.getElementById('current-track').textContent = 'None';
}

function adjustVolume() {
    const audio = document.getElementById('ambient-audio');
    audio.volume = document.getElementById('volume-control').value / 100;
}

// AI Assistant
function toggleAIPanel() {
    const panel = document.getElementById('ai-panel');
    aiPanelOpen = !aiPanelOpen;
    panel.classList.toggle('show', aiPanelOpen);
}

function handleAIInput(event) {
    if (event.key === 'Enter') {
        const input = document.getElementById('ai-input');
        const message = input.value.trim();
        
        if (message) {
            addAIMessage('user', message);
            input.value = '';
            
            // Show typing indicator
            const typingIndicator = document.createElement('div');
            typingIndicator.className = 'ai-message';
            typingIndicator.innerHTML = '<strong>🤖 Assistant:</strong> <em>Typing...</em>';
            document.getElementById('ai-chat').appendChild(typingIndicator);
            document.getElementById('ai-chat').scrollTop = document.getElementById('ai-chat').scrollHeight;
            
            // Call Gemini API
            callGeminiAPI(message, typingIndicator);
        }
    }
}

async function callGeminiAPI(message, typingIndicator) {
    try {
        const response = await fetch('/api/ai-chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getAuthToken()}`
            },
            body: JSON.stringify({ message })
        });
        
        if (!response.ok) {
            throw new Error('API request failed');
        }
        
        const data = await response.json();
        
        // Remove typing indicator
        typingIndicator.remove();
        
        // Add AI response
        addAIMessage('ai', data.message);
        
    } catch (error) {
        console.error('AI API error:', error);
        
        // Remove typing indicator
        typingIndicator.remove();
        
        // Show fallback response
        const fallbackResponse = getAIResponse(message);
        addAIMessage('ai', fallbackResponse + ' (Offline mode)');
    }
}

function getAuthToken() {
    // Get token from localStorage or return empty string
    const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
    return user.token || '';
}

function addAIMessage(sender, message) {
    const chat = document.getElementById('ai-chat');
    const messageDiv = document.createElement('div');
    messageDiv.className = 'ai-message';
    messageDiv.innerHTML = `<strong>${sender === 'user' ? 'You' : '🤖 Assistant'}:</strong> ${message}`;
    chat.appendChild(messageDiv);
    chat.scrollTop = chat.scrollHeight;
}

function getAIResponse(message) {
    const responses = {
        'water': 'Drink water regularly. Aim for 8 glasses a day.',
        'sleep': 'Get 7-9 hours of sleep per night for good health.',
        'mood': 'Log your mood daily to track patterns.',
        'exercise': 'Regular exercise boosts mood and energy. Even 10 minutes helps!',
        'uv': 'Check UV index before going outside.',
        'default': 'I can help with health tips and tracking advice. What do you need?'
    };
    
    const lowerMessage = message.toLowerCase();
    for (const [key, response] of Object.entries(responses)) {
        if (lowerMessage.includes(key)) {
            return response;
        }
    }
    
    return responses.default;
}

// Enhanced existing trackers
function initializeExistingTrackers() {
    // Guardian orb interactions
    const guardian = document.getElementById('guardian');
    


    // Step Tracker
    let steps = 0;
    const stepGoal = 10000;
    let stepHistory = storage.getArray('stepHistory');
    
    document.getElementById('log-steps').addEventListener('click', () => {
        const stepInput = document.getElementById('step-input');
        const newSteps = parseInt(stepInput.value) || 0;
        
        if (newSteps > 0) {
            steps += newSteps;
            stepHistory.push({date: new Date(), steps: newSteps, user: currentUser.username});
            storage.setArray('stepHistory', stepHistory);
            updateStepDisplay();
            stepInput.value = '';
            animateGuardian('success');
        } else {
            alert('Please enter a valid number of steps');
            animateGuardian('click');
        }
    });
    
    document.getElementById('reset-steps').addEventListener('click', () => {
        steps = 0;
        updateStepDisplay();
        animateGuardian('click');
    });
    
    function updateStepDisplay() {
        const progress = Math.min((steps / stepGoal) * 100, 100);
        document.getElementById('step-progress').style.width = `${progress}%`;
        document.getElementById('step-text').textContent = `${steps.toLocaleString()} / ${stepGoal.toLocaleString()} steps`;
        
        // Calculate averages
        const userSteps = stepHistory.filter(entry => entry.user === currentUser.username);
        if (userSteps.length > 0) {
            const totalSteps = userSteps.reduce((sum, entry) => sum + entry.steps, 0);
            const dailyAvg = totalSteps / userSteps.length;
            document.getElementById('daily-avg').textContent = Math.round(dailyAvg).toLocaleString();
            
            // Weekly average (last 7 entries)
            const recentSteps = userSteps.slice(-7).reduce((sum, entry) => sum + entry.steps, 0);
            const weeklyAvg = recentSteps / Math.min(userSteps.length, 7);
            document.getElementById('weekly-avg').textContent = Math.round(weeklyAvg).toLocaleString();
        }
    }

    // Water Tracker
    let waterIntake = 0;
    const waterGoal = 2.0;
    
    document.getElementById('log-water').addEventListener('click', () => {
        const waterInput = document.getElementById('water-input');
        const amount = parseFloat(waterInput.value) || 0;
        
        if (amount > 0) {
            waterIntake += amount;
            updateWaterDisplay();
            waterInput.value = '';
            animateGuardian('success');
        } else {
            alert('Please enter a valid amount of water');
            animateGuardian('click');
        }
    });
    
    document.getElementById('reset-water').addEventListener('click', () => {
        waterIntake = 0;
        updateWaterDisplay();
        animateGuardian('click');
    });
    
    function updateWaterDisplay() {
        const progress = Math.min((waterIntake / waterGoal) * 100, 100);
        document.getElementById('water-progress').style.width = `${progress}%`;
        document.getElementById('water-text').textContent = `${waterIntake.toFixed(1)} / ${waterGoal} L`;
    }

    // Medicine Tracker
    let medicines = storage.getArray('medicines').filter(med => med.user === currentUser.username);
    
    document.getElementById('add-medicine').addEventListener('click', () => {
        const medicineName = document.getElementById('medicine-name').value.trim();
        
        if (medicineName) {
            const newMedicine = {
                name: medicineName,
                count: 0,
                user: currentUser.username
            };
            
            medicines.push(newMedicine);
            const allMedicines = storage.getArray('medicines');
            allMedicines.push(newMedicine);
            storage.setArray('medicines', allMedicines);
            
            updateMedicineList();
            document.getElementById('medicine-name').value = '';
            animateGuardian('success');
        } else {
            alert('Please enter a medicine name');
            animateGuardian('click');
        }
    });
    
    function updateMedicineList() {
        const medicineList = document.getElementById('medicine-list');
        medicineList.innerHTML = '';
        
        medicines.forEach((medicine, index) => {
            const medicineItem = document.createElement('div');
            medicineItem.className = 'medicine-item';
            
            medicineItem.innerHTML = `
                <span class="medicine-name">${medicine.name}</span>
                <div>
                    <button class="pixel-button decrease-med" data-index="${index}">-</button>
                    <span style="margin: 0 10px; font-size: 10px;">${medicine.count}</span>
                    <button class="pixel-button increase-med" data-index="${index}">+</button>
                </div>
            `;
            
            medicineList.appendChild(medicineItem);
        });
        
        // Add event listeners to the new buttons
        document.querySelectorAll('.increase-med').forEach(button => {
            button.addEventListener('click', (e) => {
                const index = parseInt(e.target.getAttribute('data-index'));
                medicines[index].count++;
                updateMedicineStorage();
                updateMedicineList();
                animateGuardian('success');
            });
        });
        
        document.querySelectorAll('.decrease-med').forEach(button => {
            button.addEventListener('click', (e) => {
                const index = parseInt(e.target.getAttribute('data-index'));
                if (medicines[index].count > 0) {
                    medicines[index].count--;
                    updateMedicineStorage();
                    updateMedicineList();
                    animateGuardian('click');
                }
            });
        });
    }

    function updateMedicineStorage() {
        const allMedicines = storage.getArray('medicines');
        medicines.forEach(userMed => {
            const medIndex = allMedicines.findIndex(med => 
                med.name === userMed.name && med.user === userMed.user);
            if (medIndex !== -1) {
                allMedicines[medIndex] = userMed;
            }
        });
        storage.setArray('medicines', allMedicines);
    }

    // Sleep Tracker
    let sleepHistory = storage.getArray('sleepHistory').filter(entry => entry.user === currentUser.username);
    
    document.getElementById('log-sleep').addEventListener('click', () => {
        const sleepHours = parseFloat(document.getElementById('sleep-hours').value) || 0;
        
        if (sleepHours > 0 && sleepHours <= 24) {
            const sleepEntry = {
                date: new Date(),
                hours: sleepHours,
                quality: calculateSleepQuality(sleepHours),
                user: currentUser.username
            };
            
            sleepHistory.push(sleepEntry);
            const allSleep = storage.getArray('sleepHistory');
            allSleep.push(sleepEntry);
            storage.setArray('sleepHistory', allSleep);
            
            document.getElementById('sleep-hours').value = '';
            alert(`Logged ${sleepHours} hours of sleep`);
            animateGuardian('success');
        } else {
            alert('Please enter a valid number of hours (0-24)');
            animateGuardian('click');
        }
    });
    
    document.getElementById('view-sleep-summary').addEventListener('click', () => {
        if (sleepHistory.length === 0) {
            alert('No sleep data available');
            animateGuardian('click');
            return;
        }
        
        const totalHours = sleepHistory.reduce((sum, entry) => sum + entry.hours, 0);
        const avgHours = totalHours / sleepHistory.length;
        const avgQuality = sleepHistory.reduce((sum, entry) => sum + entry.quality, 0) / sleepHistory.length;
        
        alert(`Sleep Summary:\nAverage Hours: ${avgHours.toFixed(1)}\nAverage Quality: ${avgQuality.toFixed(1)}/10`);
        animateGuardian('click');
    });
    
    function calculateSleepQuality(hours) {
        if (hours >= 7 && hours <= 9) return 10;
        if (hours >= 6 && hours < 7) return 7;
        if (hours > 9 && hours <= 10) return 8;
        if (hours < 6) return 5;
        return 3;
    }

    // Workout Tracker
    let workoutTimer = null;
    let workoutSeconds = 0;
    let isWorkoutRunning = false;
    
    document.getElementById('start-workout').addEventListener('click', () => {
        if (!isWorkoutRunning) {
            isWorkoutRunning = true;
            workoutTimer = setInterval(() => {
                workoutSeconds++;
                updateWorkoutTimer();
            }, 1000);
            animateGuardian('click');
        }
    });
    
    document.getElementById('pause-workout').addEventListener('click', () => {
        if (isWorkoutRunning) {
            clearInterval(workoutTimer);
            isWorkoutRunning = false;
            animateGuardian('click');
        }
    });
    
    document.getElementById('reset-workout').addEventListener('click', () => {
        clearInterval(workoutTimer);
        workoutSeconds = 0;
        isWorkoutRunning = false;
        updateWorkoutTimer();
        animateGuardian('click');
    });
    
    document.getElementById('log-workout').addEventListener('click', () => {
        if (workoutSeconds > 0) {
            const workoutType = document.getElementById('workout-type').value;
            const hours = Math.floor(workoutSeconds / 3600);
            const minutes = Math.floor((workoutSeconds % 3600) / 60);
            const seconds = workoutSeconds % 60;
            
            const workoutEntry = {
                date: new Date(),
                type: workoutType,
                duration: workoutSeconds,
                user: currentUser.username
            };
            
            const workouts = storage.getArray('workouts');
            workouts.push(workoutEntry);
            storage.setArray('workouts', workouts);
            
            alert(`Logged ${workoutType} workout: ${hours}h ${minutes}m ${seconds}s`);
            
            // Reset timer after logging
            clearInterval(workoutTimer);
            workoutSeconds = 0;
            isWorkoutRunning = false;
            updateWorkoutTimer();
            animateGuardian('success');
        } else {
            alert('Please start a workout first');
            animateGuardian('click');
        }
    });
    
    function updateWorkoutTimer() {
        const hours = Math.floor(workoutSeconds / 3600);
        const minutes = Math.floor((workoutSeconds % 3600) / 60);
        const seconds = workoutSeconds % 60;
        
        const timeString = 
            `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        document.getElementById('workout-timer').textContent = timeString;
    }

    // Initialize displays
    updateStepDisplay();
    updateWaterDisplay();
    updateMedicineList();
    updateWorkoutTimer();
}

// Enhanced Guardian Orb functionality
function initializeGuardianOrb() {
    const guardian = document.getElementById('guardian');
    
    // Click interactions
    guardian.addEventListener('click', () => {
        showGuardianMessage();
        animateGuardian('success');
    });
    
    // Hover effects
    guardian.addEventListener('mouseenter', () => {
        guardian.style.transform = 'scale(1.1)';
        guardian.style.boxShadow = '0 0 40px #55aaff, 0 0 80px #55ff55, 0 0 120px #ffaa55';
    });
    
    guardian.addEventListener('mouseleave', () => {
        guardian.style.transform = '';
        guardian.style.boxShadow = '0 0 30px #55aaff, 0 0 60px #55ff55, 0 0 90px #ffaa55';
    });
    
    // Random floating animation
    setInterval(() => {
        if (!guardian.matches(':hover')) {
            const randomFloat = Math.random() * 10 - 5;
            guardian.style.transform = `translateY(${randomFloat}px)`;
        }
    }, 3000);
}

function showGuardianMessage() {
    const messages = [
        "🌟 Keep up the great work on your health journey!",
        "💧 Remember to stay hydrated today!",
        "😊 Your mood matters - log how you're feeling!",
        "🏃‍♂️ Every step counts towards your goals!",
        "😴 Good sleep is essential for your well-being!",
        "🎵 Music can boost your mood and focus!",
        "☀️ Check the UV index before going outside!",
        "💊 Don't forget to take your medications!",
        "🤖 I'm here to help with any health questions!",
        "🎮 Minecraft vibes for a healthy lifestyle!"
    ];
    
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    
    // Create temporary notification above the guardian orb
    const guardian = document.getElementById('guardian');
    const guardianRect = guardian.getBoundingClientRect();
    
    const notification = document.createElement('div');
    notification.className = 'notification show';
    notification.style.position = 'fixed';
    notification.style.top = (guardianRect.top - 80) + 'px';
    notification.style.left = (guardianRect.left + guardianRect.width / 2) + 'px';
    notification.style.transform = 'translateX(-50%)';
    notification.style.zIndex = '2000';
    notification.style.background = 'var(--accent)';
    notification.style.color = '#000';
    notification.style.padding = '15px';
    notification.style.border = '3px solid #000';
    notification.style.fontSize = '10px';
    notification.style.textAlign = 'center';
    notification.style.maxWidth = '250px';
    notification.style.borderRadius = '0';
    notification.style.boxShadow = '0 4px 8px rgba(0,0,0,0.3)';
    notification.textContent = randomMessage;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Utility functions
function animateGuardian(type) {
    const guardian = document.getElementById('guardian');
    guardian.style.transform = 'scale(1.2)';
    guardian.style.boxShadow = '0 0 50px #55ff55, 0 0 100px #55aaff, 0 0 150px #ffaa55';
    
    setTimeout(() => {
        guardian.style.transform = '';
        guardian.style.boxShadow = '0 0 30px #55aaff, 0 0 60px #55ff55, 0 0 90px #ffaa55';
    }, 500);
}



function loadData() {
    // Load user-specific data
    if (currentUser && currentUser.username) {
        updateMoodHistory();
    }
}

// Water reminder system
function startWaterReminders() {
    setTimeout(showWaterReminder, 60 * 60 * 1000); // First reminder after 1 hour
}

function showWaterReminder() {
    const notification = document.getElementById('water-reminder');
    notification.classList.add('show');
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 5000);
    
    // Schedule next reminder in 1 hour
    setTimeout(showWaterReminder, 60 * 60 * 1000);
}

// Add click sound to all buttons
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('pixel-button')) {
        animateGuardian('click');
    }
});
