import "server-only";

import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import {
  IMAGE_EXTENSION_BY_MIME_TYPE,
  MAX_IMAGE_SIZE,
} from "@/constants/image";

export const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function deleteFileFromS3(key: string) {
  const command = new DeleteObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET,
    Key: key,
  });

  await s3.send(command);
}

export async function uploadFileToS3(file: File) {
  const extension = IMAGE_EXTENSION_BY_MIME_TYPE[file.type];

  if (!extension) {
    throw new Error("Unsupported image type");
  }

  if (file.size === 0) {
    throw new Error("File is empty");
  }

  if (file.size > MAX_IMAGE_SIZE) {
    throw new Error("File too large");
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const key = `events/${crypto.randomUUID()}.${extension}`;

  const command = new PutObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET,
    Key: key,
    Body: buffer,
    ContentType: file.type,
  });

  await s3.send(command);

  return key;
}
