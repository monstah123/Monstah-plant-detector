import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { imageUrl } = req.body;
    // Ensure it's actually an AWS URL we are trying to delete
    if (!imageUrl || !imageUrl.includes('.amazonaws.com/')) {
      return res.status(400).json({ error: 'Invalid AWS URL' });
    }

    // Extract the exact object Key (e.g. "uploads/uuid.jpeg") from the public S3 URL
    const urlParts = imageUrl.split('.amazonaws.com/');
    if (urlParts.length !== 2) return res.status(400).json({ error: 'Failed to extract S3 Key' });
    const s3Key = urlParts[1];

    const s3Client = new S3Client({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });

    const command = new DeleteObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: s3Key,
    });

    await s3Client.send(command);

    return res.status(200).json({ success: true, message: 'Deleted from AWS S3' });
  } catch (error) {
    console.error('Delete S3 Error:', error);
    return res.status(500).json({ error: 'Failed to delete from AWS' });
  }
}
