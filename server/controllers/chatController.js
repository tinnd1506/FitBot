// Import the generateChatResponse function from the Vertex AI configuration file
const { generateChatResponse } = require('../config/vertexAI');

// Function to handle incoming chat messages from the client
async function handleChatMessage(req, res) {
  try {
    // Extract the message from the request body
    const { message } = req.body;

    // Check if the message is provided, if not, return a 400 Bad Request response
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Call the generateChatResponse function to get the chatbot's response
    const responseContent = await generateChatResponse(message);

    // Return the generated response from the AI model as JSON
    res.json({ response: responseContent });
  } catch (error) {
    // Log any errors that occur and return a 500 Internal Server Error response
    console.error('Error generating response:', error);
    res.status(500).json({ error: 'An error occurred while processing your request' });
  }
}

// Export the handleChatMessage function so it can be used in other routes
module.exports = { handleChatMessage };
