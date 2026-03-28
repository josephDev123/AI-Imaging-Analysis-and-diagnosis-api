import type { NextFunction, Request, Response } from "express";
import { type MedImagingService } from "./MedImagingService.js";

export class MedImagingController {
  constructor(private readonly medImagingService: MedImagingService) {}

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const fileUpload = req.file;

      if (!fileUpload) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const result = await this.medImagingService.create(fileUpload!);

      res.status(200).json({ msg: "diagnosis successful", data: result });
    } catch (error) {
      console.log(error);
    }
  }

  async find(req: Request, res: Response, next: NextFunction) {
    try {
      res.status(200).json({ message: "successful" });
    } catch (error) {}
  }
}
