// src/s3/s3Service.js
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  ListObjectsV2Command,
  GetObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import dotenv from 'dotenv';

dotenv.config();

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// ✅ List files from AWS S3 with signed URLs
export const listFilesFromS3 = async (userId) => {
  const listCommand = new ListObjectsV2Command({
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Prefix: `${userId}/`,
  });

  const response = await s3.send(listCommand);

  if (!response.Contents || response.Contents.length === 0) {
    console.log(`⚠️ No files found for user ${userId}`);
    return [];
  }

  const urls = await Promise.all(
    response.Contents.map((file) =>
      getSignedUrl(
        s3,
        new GetObjectCommand({
          Bucket: process.env.AWS_S3_BUCKET_NAME,
          Key: file.Key,
        }),
        { expiresIn: 3600 }
      )
    )
  );

  return urls;
};

// ✅ Upload a file to AWS S3
export const uploadFileToS3 = async (userId, filePromise) => {
  const { createReadStream, filename, mimetype } = await filePromise;
  const stream = createReadStream();

  const key = `${userId}/${filename}`;

  const uploadCommand = new PutObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: key,
    Body: stream,
    ContentType: mimetype,
  });

  await s3.send(uploadCommand);

  return `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
};

// ✅ Delete a file from AWS S3
export const deleteFileFromS3 = async (url) => {
  const bucket = process.env.AWS_S3_BUCKET_NAME;
  const region = process.env.AWS_REGION;

  const possibleDomains = [
    `https://${bucket}.s3.${region}.amazonaws.com/`,
    `https://${bucket}.s3.amazonaws.com/`,
  ];

  let key = null;

  for (const domain of possibleDomains) {
    if (url.startsWith(domain)) {
      key = decodeURIComponent(url.replace(domain, ''));
      break;
    }
  }

  if (!key) {
    console.warn('🚨 Invalid file URL (no match for S3 domains):', url);
    return;
  }

  console.log('🧹 Deleting file from S3 key:', key);

  try {
    const deleteCommand = new DeleteObjectCommand({
      Bucket: bucket,
      Key: key,
    });

    await s3.send(deleteCommand);
    console.log(`🗑️ S3 file deleted: ${key}`);
  } catch (err) {
    console.error('❌ Failed to delete from S3:', err);
    throw err;
  }
};