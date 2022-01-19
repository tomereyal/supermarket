import { Request, Response } from "express";
import logging from "../config/logging";

export function ok(res: Response, body?: Object, debug?: boolean) {
  if (debug) {
    console.log(`[RESPONSE]`, body);
  }
  return res.status(200).json(body);
}

export function err(res: Response, error: Error) {
  console.log(`error`, error);
  return res.status(500).json({ message: error.message, error });
}

export function errMissing(res: Response) {
  console.log("ERROR: MISSING REQUEST PARAMS");
  return res.status(500).json({ message: "Missing request parameter" });
}

/**
 *
 * @param req The request received from client
 * @param body The body the controller expects
 * @param params The params the controller expect
 * @param query The query the controller expect
 *
 * The function will print the received vs expected.
 */
export function debugClient(
  req: Request,
  expected: { body?: any; params?: any; query?: any }
) {
  console.log("======================================");
  if (expected?.body) {
    console.log("REQ BODY:     ", req.body);
    console.log("EXPECTED BODY:  ", expected.body);
  }
  if (expected?.params) {
    console.log("REQ PARAMS:   ", req.params);
    console.log("EXPECTED PARAMS:  ", expected.params);
  }
  if (expected?.query) {
    console.log("REQ QUERY:    ", req.query);
    console.log("EXPECTED QUERY:  ", expected.query);
  }
  console.log("======================================");
}
