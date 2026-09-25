import type { Request, Response } from "express";
import { uploadFileService } from "../services/uploadFileService/uploadFileService.js";
import path from "node:path";

export async function uploadFileController(req: Request, res: Response) {
  const filedata = req.file;

  const filePath = path.join(process.cwd(), `/uploads/${filedata!.filename}`);
  uploadFileService(filePath);
  res.send("File Recieved!");
}
