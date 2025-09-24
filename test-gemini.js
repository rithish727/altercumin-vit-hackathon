// Test Gemini API
const testGemini = async () => {
    try {
        const response = await fetch('http://localhost:3000/api/ai-chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message: 'Test message' })
        });
        console.log('Gemini test:', response.status);
    } catch (error) {
        console.log('Gemini test failed:', error.message);
    }
};

testGemini();
