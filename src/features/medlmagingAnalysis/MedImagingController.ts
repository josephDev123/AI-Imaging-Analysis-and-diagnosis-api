import type { NextFunction, Request, Response } from "express";
import { type MedImagingService } from "./MedImagingService.js";
import { GlobalErrorHandler } from "../../lib/shared/GlobalErrorHandler.js";

export class MedImagingController {
  constructor(private readonly medImagingService: MedImagingService) {}

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const fileUpload = req.file;

      if (!fileUpload) {
        // return res.status(400).json({ message: "No file uploaded" });
        next(
          new GlobalErrorHandler(
            "EmptyFileUpload",
            "No file uploaded",
            400,
            true,
          ),
        );
      }

      const result = await this.medImagingService.create(fileUpload!);

      res.status(200).json({ msg: "diagnosis successful", data: result });
    } catch (error) {
      if (error instanceof GlobalErrorHandler) {
        next(
          new GlobalErrorHandler(
            error.name,
            error.message,
            error.statusCode,
            error.operational,
          ),
        );
      }

      if (error instanceof Error) {
        next(new GlobalErrorHandler(error.name, error.message, 500, false));
      }

      next(
        new GlobalErrorHandler("Unknown", "Something went wrong", 500, false),
      );
    }
  }

  async find(req: Request, res: Response, next: NextFunction) {
    try {
      res.status(200).json({ message: "successful" });
    } catch (error) {}
  }
}
