import axios from 'axios';

function base64ToBlob(base64, mime) {
  const binary = atob(base64.split(',')[1]);
  const array = [];
  for (let i = 0; i < binary.length; i++) {
    array.push(binary.charCodeAt(i));
  }
  return new Blob([new Uint8Array(array)], { type: mime });
}

export async function identifyPlant(imageBase64) {
  try {
    // 1. Get image details
    const mimeType = imageBase64.split(';')[0].split(':')[1];
    const blob = base64ToBlob(imageBase64, mimeType);

    // 2. Ask our Vercel backend for a secure AWS S3 ticket
    const uploadRes = await axios.post('/api/upload', { fileType: mimeType });
    const { uploadUrl, publicUrl } = uploadRes.data;

    // 3. Blast the image straight to AWS using the ticket!
    await axios.put(uploadUrl, blob, {
      headers: { 'Content-Type': mimeType }
    });

    // 4. Ask OpenAI to analyze the new AWS Image link
    const analyzeRes = await axios.post('/api/analyze', { imageUrl: publicUrl });
    
    return {
      ...analyzeRes.data,
      imageUrl: publicUrl, // Returned so the dashboard uses S3, not base64!
      detectedAt: new Date().toISOString()
    };
  } catch (error) {
    console.error("Pipeline Error:", error);
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

export async function deletePlantFromS3(imageUrl) {
  try {
    await axios.post('/api/delete', { imageUrl });
  } catch (error) {
    console.error("Failed to delete from S3:", error);
  }
}
