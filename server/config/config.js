import dotenv from 'dotenv';
dotenv.config();

export const MONGO_URI = process.env.MONGO_URI;
export const JWT_SECRET = process.env.JWT_SECRET;
export const CLIENT_URL = process.env.CLIENT_URL;
export const COMPILER_API_URL = process.env.COMPILER_API_URL;
export const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
export const PORT = process.env.PORT || 5000;
export const S3_ACCESS_KEY_ID= process.env.S3_ACCESS_KEY_ID;
export const S3_SECRET_ACCESS_KEY= process.env.S3_SECRET_ACCESS_KEY;
export const S3_REGION= process.env.S3_REGION;
export const S3_BUCKET_NAME = process.env.S3_BUCKET_NAME;
export const TC_API_URL = process.env.TC_API_URL;