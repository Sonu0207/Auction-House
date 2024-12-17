import mysql from 'mysql';
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";



export const handler = async (event) => {
  const imageID = event.imageID;
  const uploadImageToS3 = async (imageName, imageBase64) => {
    const buffer = Buffer.from(imageBase64, 'base64');
    const s3 = new S3Client();
    const params = {
      Bucket: "clipsauctionphotos",
      Key: `${imageID}.jpg`,
      Body: buffer,
      ContentEncoding: 'base64',
      ContentType: 'image/jpeg'
    };

    return s3.send(new PutObjectCommand(params));
  }
  try {
    await uploadImageToS3(event.imageName, event.imageBase64);
    return{
      statusCode: 200,
      body: {"imageID" : imageID}
    }
  } catch (uploadError) {
    console.error("Error uploading image to S3:", uploadError);
    return{ 
      statusCode: 400, 
      body: {"response" : "Image upload failed"}
    }
    throw new Error("Image upload failed");
  }
};