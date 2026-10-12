import { S3Client } from '@aws-sdk/client-s3';

const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID || '';
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID || '';
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY || '';

export const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME || 'lppkpdmjogja-storage';
export const R2_PUBLIC_DOMAIN = process.env.R2_PUBLIC_DOMAIN || 'https://pub-75569bb9cb0a485b933e7b4f4c7f4080.r2.dev';

export const isR2Configured = Boolean(
  R2_ACCOUNT_ID && 
  R2_ACCESS_KEY_ID && 
  R2_SECRET_ACCESS_KEY && 
  !R2_ACCESS_KEY_ID.includes('your_')
);

export const r2Client = new S3Client({
  region: 'auto',
  endpoint: R2_ACCOUNT_ID ? `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com` : 'https://placeholder.r2.cloudflarestorage.com',
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY,
  },
  forcePathStyle: true,
});
