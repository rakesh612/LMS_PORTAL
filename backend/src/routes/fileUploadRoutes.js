import express from "express";
import AWS from "aws-sdk";
import multer from "multer";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();
const upload = multer();

const s3 = new AWS.S3({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.SECRET_ACCESS_KEY,
});

router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      console.error(" No file received in request.");
      return res.status(400).json({ error: "No file uploaded." });
    }

    console.log("File received:", {
      originalname: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
    });

    const key = `videos/${Date.now()}-${file.originalname}`;
    const params = {
      Bucket: process.env.BUCKET_NAME,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
      ACL: "public-read", 
    };
    const uploadResult = await s3.upload(params).promise();
    res.status(200).json({
      success: true,
      message: "File uploaded successfully",
      fileUrl: uploadResult.Location,
    });
  } catch (err) {
    console.error("Upload error:");
    console.error(JSON.stringify(err, null, 2));

    res.status(500).json({
      error: "File upload failed",
      details: err.message || "Unknown error",
    });
  }
});

export default router;