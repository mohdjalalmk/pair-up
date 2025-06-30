const {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} = require("@aws-sdk/client-s3");

const s3 = new S3Client({
  region: "ap-south-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_S3,
    secretAccessKey: process.env.AWS_SECRET_KEY_S3,
  },
});

module.exports = {
  s3,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
};
