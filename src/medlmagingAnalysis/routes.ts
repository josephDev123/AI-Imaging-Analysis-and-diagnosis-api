import { Router } from "express";
import type { IConfig } from "../config.js";
import { MedImagingController } from "./MedImagingController.js";
import multer from "multer";
import { MedImagingService } from "./MedImagingService.js";
import { model } from "../lib/models/ChatGpt.js";

export function MedImagingRouter(config: IConfig) {
  const router = Router();
  const llm = model;
  const service = new MedImagingService(llm);
  const controller = new MedImagingController(service);
  const storage = multer.memoryStorage();
  const upload = multer({
    storage,
    limits: {
      fileSize: 5 * 1024 * 1024,
    },
  });

  router.post(
    "/create",
    upload.single("MedFileupload"),
    controller.create.bind(controller),
  );
  router.get("/", controller.find);

  return router;
}
