import fs from "fs";
import path from "path";
import s3 from "./../config/aws.js";
import { S3_BUCKET_NAME } from "../config/config.js";

export async function uploadFileToS3(
  localFilePath,
  s3Key,
  contentType = "text/plain"
) {
  const fileContent = fs.readFileSync(localFilePath);

  const params = {
    Bucket: S3_BUCKET_NAME,
    Key: s3Key,
    Body: fileContent,
    ContentType: contentType,
  };

  const uploadResult = await s3.upload(params).promise();
  fs.unlinkSync(localFilePath); // delete local file after upload
  return uploadResult.Location; // public URL
}

export const deleteFileFromS3 = async (s3Key) => {
  try {
    const params = {
      Bucket: S3_BUCKET_NAME,
      Key: s3Key, // the full path to the file in the bucket
    };

    await s3.deleteObject(params).promise();
    console.log(`🗑️ File deleted from S3: ${s3Key}`);
  } catch (err) {
    console.error(`❌ Failed to delete file from S3: ${s3Key}`, err);
    throw err;
  }
};
// Download file from S3
export const downloadFileFromS3 = async (key) => {
  const params = {
    Bucket: S3_BUCKET_NAME,
    Key: key,
  };

  const data = await s3.getObject(params).promise();
  return data.Body.toString("utf-8");
};
