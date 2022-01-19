import { Request, Response, NextFunction } from "express";
import config from "../config/config";
import logging from "../config/logging";
import { ok, err, errMissing, debugClient } from "../_helpers";
const cloudinary = require("cloudinary").v2;
cloudinary.config(config.cloudinary);

export const uploadImage = async (req: Request, res: Response) => {
  try {
    const fileStr = req.body.data; // a base-64-encoded file
    const uploadResponse = await cloudinary.uploader.upload(fileStr, {
      upload_preset: `ml_default`,
    });
    console.log(`uploadResponse`, uploadResponse);
    const url = uploadResponse.url;
    ok(res, { url });
  } catch (error) {
    console.log(`error`, error);
    err(res, error);
  }
};

export default { uploadImage };
