// Test AI chat functionality
const testAIChat = async () => {
    try {
        const response = await fetch('http://localhost:3000/api/ai-chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer test-token'
            },
            body: JSON.stringify({ message: 'Hello' })
        });
        console.log('AI Chat test:', response.status);
    } catch (error) {
        console.log('AI Chat test failed:', error.message);
    }
};

testAIChat();
