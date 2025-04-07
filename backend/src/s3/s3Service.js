// src/s3/s3Service.js
import AWS from 'aws-sdk';
import dotenv from 'dotenv';

dotenv.config();

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

// List files from AWS S3
export const listFilesFromS3 = async (userId) => {
  const params = {
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Prefix: `${userId}/`,
  };

  const response = await s3.listObjectsV2(params).promise();

  if (!response.Contents || response.Contents.length === 0) {
    console.log(`⚠️ No files found for user ${userId}`);
    return [];
  }

  return response.Contents.map((file) =>
    s3.getSignedUrl('getObject', {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: file.Key,
      Expires: 3600,
    })
  );
};

// Upload a file to AWS S3
export const uploadFileToS3 = async (userId, filePromise) => {
  const { createReadStream, filename, mimetype } = await filePromise;
  const stream = createReadStream();

  const params = {
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: filename,
    Body: stream,
    ContentType: mimetype,
  };

  const res = await s3.upload(params).promise();
  return res.Location;
};

// Delete a file from AWS S3
export const deleteFileFromS3 = async (url) => {
  const bucket = process.env.AWS_S3_BUCKET_NAME;
  const region = process.env.AWS_REGION;

  const possibleDomains = [
    `https://${bucket}.s3.${region}.amazonaws.com/`,
    `https://${bucket}.s3.amazonaws.com/`, // 👈 fallback nếu URL không chứa region
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
    await s3.deleteObject({
      Bucket: bucket,
      Key: key,
    }).promise();

    console.log(`🗑️ S3 file deleted: ${key}`);
  } catch (err) {
    console.error('❌ Failed to delete from S3:', err);
    throw err;
  }
};
