import { type NextFunction, type Request, type Response, Router } from "express";
import multer from "multer";
import { randomUUID } from "node:crypto";
import path from "node:path";
import { uploadFileController } from "../controller/uploadFile.js";

export const policyUploadRouter = Router();

const uploadDir = path.join(process.cwd(), "uploads");

const MulterMiddleware = multer({
  storage: multer.diskStorage({
    destination: (_req, _file, cb) => {
      cb(null, uploadDir);
    },
    filename: (_req, file, cb) => {
      const uploadedFileName = `${randomUUID()}-${file.originalname.trim()}`;
      cb(null, uploadedFileName);
    },
  }),
  limits: { fileSize: 10 * 1024 * 1024 },
});

policyUploadRouter.post("/upload", MulterMiddleware.single("file"), uploadFileController);
