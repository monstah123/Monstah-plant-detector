import axios from 'axios';

export const config = { api: { bodyParser: { sizeLimit: '10mb' } } };

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { imageUrl, imageBase64 } = req.body;
  if (!imageUrl && !imageBase64) return res.status(400).json({ error: 'No image provided' });

  const API_KEY = process.env.OPENAI_API_KEY;
  if (!API_KEY) return res.status(500).json({ error: 'API_KEY_MISSING' });

  const url = 'https://api.openai.com/v1/chat/completions';
  
  // Use S3 URL if available, incredibly faster than base64
  let finalImageUrl;
  if (imageUrl) {
    finalImageUrl = { url: imageUrl };
  } else {
    const base64Data = imageBase64.split(',')[1] || imageBase64;
    const mimeType = imageBase64.split(';')[0].split(':')[1] || 'image/jpeg';
    finalImageUrl = { url: `data:${mimeType};base64,${base64Data}` };
  }

  const requestData = {
    model: 'gpt-4o',
    response_format: { type: 'json_object' },
    messages: [
      {
        role: 'system',
        content: `You are an expert botanist AI. Analyze the image to identify the plant, assess its health, and define its specific care needs. 
        Safety is CRITICAL: You must report if the plant is poisonous and whether it is safe for pets (dogs/cats) and kids.
        
        You MUST return ONLY a JSON object with this exact structure: 
        {"name": "Common Name","scientific": "Scientific Name","family": "Family Name","confidence": 95,"health": 80,"healthStatus": "Good","light": "Light needs","water": "Watering schedule","humidity": "Humidity range","temperature": "Temp range","safety": {"isPoisonous": true/false, "petFriendly": true/false, "kidSafe": true/false, "notes": "Specific safety info for pets/kids"}, "tips": ["actionable tip 1", "actionable tip 2", "actionable tip 3"]}`
      },
      {
        role: 'user',
        content: [
          { type: 'text', text: 'Identify this plant and its current health.' },
          { type: 'image_url', image_url: finalImageUrl }
        ]
      }
    ]
  };

  try {
    const response = await axios.post(url, requestData, {
      headers: { 'Authorization': `Bearer ${API_KEY}`, 'Content-Type': 'application/json' }
    });
    const plantData = JSON.parse(response.data.choices[0].message.content);
    return res.status(200).json(plantData);
  } catch (error) {
    const aiError = error.response?.data?.error?.message || error.message;
    console.error("OpenAI Error Detail:", aiError);
    return res.status(500).json({ error: aiError || 'Analysis failed' });
  }
}
