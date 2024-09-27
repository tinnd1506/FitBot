const { VertexAI } = require('@google-cloud/vertexai');

// Initialize Vertex AI with Google Cloud project and location
const vertexAI = new VertexAI({
  project: process.env.GOOGLE_CLOUD_PROJECT,  // Project ID from environment variables
  location: process.env.GOOGLE_CLOUD_LOCATION, // Location/region for the Vertex AI service
});

// Define the generative model to be used (e.g., Gemini 1.5 Flash)
const model = 'gemini-1.5-flash-001';

// Instantiate the generative model with configuration settings
const generativeModel = vertexAI.preview.getGenerativeModel({
  model: model, // Specify the model version

  generationConfig: {
    maxOutputTokens: 8192,  // Maximum number of tokens in the generated response
    temperature: 0,  // Controls randomness (0 means deterministic output)
    topP: 0.95,  // Controls diversity (95% probability mass of the output)
  },

  // Set safety configurations to block harmful content in the responses
  safetySettings: [
    { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_MEDIUM_AND_ABOVE' }, // Block hate speech at medium level and above
    { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' }, // Block dangerous content
    { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' }, // Block sexually explicit content
    { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' }, // Block harassment content
  ],

  // System instruction that sets the context and behavior of the chatbot (FitBot persona)
  systemInstruction: {
    parts: [
      {
        text: `You are FitBot, a professional fitness coach. Your primary role is to provide expert guidance on fitness, nutrition, exercise techniques, and overall well-being. Respond with a friendly yet professional tone, offering actionable advice tailored to the user's goals. Prioritize safety, proper form, and long-term progress. When giving explanations, ensure they are easy to understand but backed by scientific knowledge. Encourage users to stay consistent with their routines, make balanced choices, and remain motivated. Adapt your responses based on the user's experience level, goals, and any specific challenges they mention.`
      }
    ],
  },
});

// Function to generate a chatbot response based on user input (prompt)
async function generateChatResponse(prompt, history) {
  const chat = generativeModel.startChat({}); // Start a new chat session

  // Send the user's message (prompt) to the model and get the response
  const result = await chat.sendMessage(prompt);
  const response = result.response;

  // Check if there are valid response candidates
  if (response.candidates && response.candidates.length > 0) {
    return response.candidates[0].content;  // Return the first response candidate's content
  } else {
    throw new Error('No valid response from the model'); // Throw an error if no valid response is returned
  }
}

// Export the generateChatResponse function to be used in other parts of the application
module.exports = { generateChatResponse };
