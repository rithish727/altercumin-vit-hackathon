// Test backend endpoints
const testBackend = async () => {
    try {
        const response = await fetch('http://localhost:3000/api/health');
        console.log('Backend status:', response.status);
    } catch (error) {
        console.log('Backend not running:', error.message);
    }
};

testBackend();
