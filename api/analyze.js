import axios from 'axios';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { imageBase64 } = req.body;
  if (!imageBase64) {
    return res.status(400).json({ error: 'No image provided' });
  }

  const API_KEY = process.env.OPENAI_API_KEY;
  if (!API_KEY || API_KEY.includes('your_openai_api_key_here')) {
    return res.status(500).json({ error: 'API_KEY_MISSING' });
  }

  const url = 'https://api.openai.com/v1/chat/completions';
  const base64Data = imageBase64.split(',')[1] || imageBase64;
  const mimeType = imageBase64.split(';')[0].split(':')[1] || 'image/jpeg';
  const dataUrl = `data:${mimeType};base64,${base64Data}`;

  const requestData = {
    model: 'gpt-4o',
    response_format: { type: 'json_object' },
    messages: [
      {
        role: 'system',
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
        role: 'user',
        content: [
          { type: 'text', text: 'Identify this plant and its current health.' },
          {
            type: 'image_url',
            image_url: { url: dataUrl }
          }
        ]
      }
    ]
  };

  try {
    const response = await axios.post(url, requestData, {
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    const resultContent = response.data.choices[0].message.content;
    const plantData = JSON.parse(resultContent);
    
    return res.status(200).json(plantData);
  } catch (error) {
    console.error('OpenAI API Error:', error.response?.data || error.message);
    return res.status(500).json({ error: 'Analysis failed' });
  }
}
