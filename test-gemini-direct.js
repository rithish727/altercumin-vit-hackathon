// Direct Gemini API test
const testGeminiDirect = async () => {
    try {
        const { GoogleGenerativeAI } = require('@google/generative-ai');
        const genAI = new GoogleGenerativeAI('your-api-key');
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        
        const result = await model.generateContent("Hello");
        console.log('Direct Gemini test successful');
    } catch (error) {
        console.log('Direct Gemini test failed:', error.message);
    }
};

testGeminiDirect();
