import { Response } from "express";
import logging from "../config/logging";

export function ok(res: Response, body?: Object, debug?: boolean) {
  if (debug) {
    console.log(`[RESPONSE]`, body);
  }
  return res.status(200).json(body);
}

export function err(res: Response, error: Error) {
  return res.status(500).json({ message: error.message, error });
}
