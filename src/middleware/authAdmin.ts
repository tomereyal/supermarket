import { Response, Request, NextFunction } from "express";
import { err } from "../_helpers";

export function authAdmin(req: Request, res: Response, next: NextFunction) {
  const user = req.user as { isAdmin: boolean };
  if (!user.isAdmin)
    return err(
      res,
      new Error("Request not autherized. Admin credentials are required")
    );

  next();
}
