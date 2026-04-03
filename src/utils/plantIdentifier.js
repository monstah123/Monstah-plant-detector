import axios from 'axios';

export async function identifyPlant(imageBase64) {
  try {
    // Send the image to our new secure Vercel backend function!
    const response = await axios.post('/api/analyze', { imageBase64 });
    const plantData = response.data;
    
    return {
      ...plantData,
      detectedAt: new Date().toISOString()
    };
  } catch (error) {
    console.error("Backend API Error:", error.response?.data || error.message);
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
