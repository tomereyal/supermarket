import { Request, Response, NextFunction } from "express";
import logging from "../config/logging";
import User from "../models/user.model";
import { ok, err, errMissing, debugClient } from "../_helpers";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import config from "../config/config";
const NAMESPACE = "user.controller.ts";

export const getUser = (req: Request, res: Response, next: NextFunction) => {
  logging.info(NAMESPACE, "getUser function called");
  const { email, password } = req.body;
  User.findOne({ email })

    .then(async (user) => {
      const {
        password: savedPassword,
        _id,
        firstName,
        lastName,
        email,
        isAdmin,
        address,
      } = user;
      const isCorrectPassword = await bcrypt.compare(password, savedPassword);
      if (!isCorrectPassword) {
        logging.error(NAMESPACE, "username and password don't match");
        throw new Error("username and password don't match");
      }
      console.log(`user`, user);
      const token = jwt.sign({ _id, isAdmin }, config.jwtSecret);
      const userFound = {
        _id,
        firstName,
        lastName,
        email,
        address,
        isAdmin,
        token,
      };

      ok(res, { user: userFound }, true);
    })
    .catch((error) => {
      logging.error(NAMESPACE, "Error retrieving user from DB");
      err(res, error);
    });
};

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logging.info(NAMESPACE, "register function called");

  const { firstName, lastName, email, password, address } = req.body;

  const saltedPassword = await bcrypt.hash(password, 10);
  // const newUser = new User({
  //   firstName,
  //   lastName,
  //   email,
  //   password: saltedPassword,
  //   address,
  // });

  User.create({
    firstName,
    lastName,
    email,
    password: saltedPassword,
    address,
  })
    .then((newUser) => {
      const token = jwt.sign(
        { _id: newUser._id, isAdmin: newUser.isAdmin },
        config.jwtSecret
      );
      ok(res, { user: newUser, token });
    })
    .catch((error) => {
      err(res, error);
    });
};

export const isEmailTaken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email } = req.body;
  if (!email) errMissing(res);

  User.findOne({ email })
    .then((user) => {
      console.log(`found user with this email:`, user);
      if (user) return ok(res, { isEmailTaken: true }, true);
      return ok(res, { isEmailTaken: false });
    })
    .catch((error) => {
      return err(res, error);
    });
};

export default { getUser, register, isEmailTaken };
