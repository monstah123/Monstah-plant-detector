import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { v4 as uuidv4 } from 'uuid';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { fileType } = req.body;
    if (!fileType) return res.status(400).json({ error: 'fileType is required' });

    // Link the Vercel env variables to AWS SDK
    const s3Client = new S3Client({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });

    const fileExtension = fileType.split('/')[1] || 'jpeg';
    const fileName = `uploads/${uuidv4()}.${fileExtension}`;

    const command = new PutObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: fileName,
      ContentType: fileType,
    });

    // Ask AWS for a secure URL good for exactly 5 minutes
    const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 300 });
    
    // The permanent public URL where the image will live
    const publicUrl = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;

    return res.status(200).json({ uploadUrl, publicUrl });
  } catch (error) {
    console.error('S3 Presigner Error:', error);
    return res.status(500).json({ error: 'Failed to generate upload URL' });
  }
}
