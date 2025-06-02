import AWS from "aws-sdk";
import { S3_ACCESS_KEY_ID, S3_SECRET_ACCESS_KEY, S3_REGION } from "./config.js";

AWS.config.update({
  accessKeyId: process.env.S3_ACCESS_KEY_ID,
  secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
  region: process.env.S3_REGION || "ap-south-1",
});
const s3 = new AWS.S3();
// Optional: Check connection by listing buckets
s3.listBuckets((err, data) => {
  if (err) {
    console.error("❌ S3 connection failed:", err.message);
  } else {
    console.log(
      "✅ S3 connected successfully. Buckets:",
      data.Buckets.map((b) => b.Name)
    );
  }
});

export default s3;
