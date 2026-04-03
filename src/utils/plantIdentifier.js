import axios from 'axios';

const API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

export async function identifyPlant(imageBase64) {
  if (!API_KEY || API_KEY.includes('your_openai_api_key_here')) {
    throw new Error('API_KEY_MISSING');
  }

  const url = 'https://api.openai.com/v1/chat/completions';

  const data = {
    model: "gpt-4o", // You can also use gpt-4o-mini to save cost!
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content: `You are an expert botanist AI. Analyze the image to identify the plant, assess its health, and define its specific care needs. 
        You MUST return ONLY a JSON object with this exact structure: 
        {
          "name": "Common Name", 
          "scientific": "Scientific Name", 
          "family": "Family Name", 
          "confidence": 95, 
          "health": 80, 
          "healthStatus": "Good", 
          "light": "Light needs", 
          "water": "Watering schedule", 
          "humidity": "Humidity range", 
          "temperature": "Temp range", 
          "tips": ["actionable tip 1", "actionable tip 2", "actionable tip 3"]
        }`
      },
      {
        role: "user",
        content: [
          { type: "text", text: "Identify this plant and its current health." },
          {
            type: "image_url",
            // OpenAI expects the full base64 string including the data:image/jpeg;base64, prefix
            image_url: { url: imageBase64 }
          }
        ]
      }
    ]
  };

  try {
    const response = await axios.post(url, data, {
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    // Parse the JSON object that GPT returns
    const resultContent = response.data.choices[0].message.content;
    const plantData = JSON.parse(resultContent);

    // Add our timestamp for the dashboard
    return {
      ...plantData,
      detectedAt: new Date().toISOString()
    };

  } catch (error) {
    console.error("OpenAI API Error:", error.response?.data || error);
    throw error;
  }
}

export function getHealthColor(health) {
  if (health >= 85) return '#22c55e';
  if (health >= 70) return '#f59e0b';
  if (health >= 50) return '#f97316';
  return '#ef4444';
}

export function getHealthLabel(health) {
  if (health >= 85) return 'Excellent';
  if (health >= 70) return 'Good';
  if (health >= 50) return 'Fair';
  return 'Needs Attention';
}
