const invokeUrl = 'https://integrate.api.nvidia.com/v1/chat/completions';

const generationConfig = {
  max_tokens: 16384,
  temperature: 1,
  top_p: 1,
};

const systemInstruction = `You are FitBot, a professional fitness coach. Respond in clean plain text only. Do not use markdown, headings, bold markers, asterisks, numbered sections, or decorative formatting. Keep responses concise, practical, and natural, usually under 120 words unless the user explicitly asks for detail. Prefer short paragraphs over lists. Ask at most one brief follow-up question when needed. Focus on actionable fitness advice, safe technique, nutrition basics, recovery, and motivation.`;

const modelName = process.env.NVIDIA_MODEL || 'moonshotai/kimi-k2.5';

function buildPrompt(prompt, history) {
  const historyText = Array.isArray(history) && history.length > 0
    ? history
        .map((entry) => {
          const role = entry?.role || 'user';
          const parts = Array.isArray(entry?.parts)
            ? entry.parts.map((part) => part?.text).filter(Boolean).join('\n')
            : '';
          return `${role}: ${parts}`;
        })
        .join('\n')
    : '';

  return [
    systemInstruction,
    historyText ? `Conversation history:\n${historyText}` : '',
    `User: ${prompt}`,
  ]
    .filter(Boolean)
    .join('\n\n');
}

// Function to generate a chatbot response based on user input
async function generateChatResponse(prompt, history) {
  const composedPrompt = buildPrompt(prompt, history);

  try {
    if (!process.env.NVIDIA_API_KEY) {
      throw new Error('NVIDIA_API_KEY is not configured');
    }

    const response = await fetch(invokeUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.NVIDIA_API_KEY}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: modelName,
        messages: [
          { role: 'user', content: composedPrompt },
        ],
        ...generationConfig,
        stream: false,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data?.error?.message || `NVIDIA API request failed with status ${response.status}`);
    }

    const text = data?.choices?.[0]?.message?.content;

    if (!text) {
      throw new Error('No valid response from NVIDIA model');
    }

    return {
      role: 'model',
      parts: [{ text }],
    };
  } catch (error) {
    console.error('Error generating chat response:', error);
    throw new Error('Failed to generate response from NVIDIA AI');
  }
}

module.exports = { generateChatResponse };
