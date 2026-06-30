require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function main() {
  try {
    console.log('API Key:', process.env.GEMINI_API_KEY ? 'Present' : 'Missing');
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    
    // In @google/generative-ai, we can list models using the REST API or client methods if available.
    // Let's perform a simple request to list models using fetch.
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();
    console.log('Response status:', response.status);
    console.log('Models:', JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error:', error);
  }
}

main();
