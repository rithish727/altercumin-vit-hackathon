// Demo data for testing
const demoData = {
    steps: 8500,
    water: 6,
    mood: 'happy',
    sleep: 7.5,
    workouts: 3,
    medicines: ['Vitamin D', 'Omega-3']
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = demoData;
}
