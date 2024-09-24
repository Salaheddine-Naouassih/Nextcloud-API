import express from "express";
import "dotenv/config";
import cors from "cors";
import fileUpload from "express-fileupload";
import { NextCloudClient } from "./services/NextCloud/nextCloud.service";
import { getConfig } from "./utils/config";
import { v4 as uuid } from "uuid";
import { validateBody } from "./middlewares/joiValidation";
import { uploadFileSchema } from "./middlewares/validation";

const { NEXTCLOUD_USERNAME, NEXTCLOUD_PASSWORD, NEXTCLOUD_URL } = getConfig();

export const getApp = () => {
  const app = express();
  const client = new NextCloudClient({
    baseUrl: NEXTCLOUD_URL,
    username: NEXTCLOUD_USERNAME,
    password: NEXTCLOUD_PASSWORD,
  });

  app.use(express.static("client"));
  app.use(express.json());
  app.use(cors());

  app.post(
    "/upload-video",
    validateBody(uploadFileSchema),
    fileUpload(),
    async (req, res) => {
      try {
        console.log(req.body);
        const file = req.files as fileUpload.FileArray;
        const { product } = req.body;
        const fileName = `CID_${product}_${uuid()}.mp4`;
        const video = file.video as fileUpload.UploadedFile;
        if (video.mimetype !== "video/mp4") {
          return res.status(400).json({ message: "File must be mp4" });
        }
        if (await client.uploadFile(fileName, video.data)) {
          res.status(200).json({ message: "File uploaded successfully" });
        } else {
          res.status(500).json({ message: "Failed to upload file" });
        }
      } catch (err) {
        res.status(500).json({ status: "error", message: "Failed upload" });
      }
    }
  );

  app.post("/auth", async (req, res) => {
    try {
      const token = await client.getToken();
      res.status(200).json({ token });
    } catch (err) {
      res.status(500).json({ status: "error", message: "Failed To Get Token" });
    }
  });

  return app;
};
