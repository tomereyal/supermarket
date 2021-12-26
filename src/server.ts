import http from "http";
import express from "express";
import bodyParser from "body-parser";
import logging from "./config/logging";
import config from "./config/config";
import topicRoutes from "./routes/topic.route";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import cors from "cors";
import expressJwt from "express-jwt";

const NAMESPACE = "Server";
const app = express();

//==========================================================
//                 CONNECTION TO MONGODB
//==========================================================
mongoose
  .connect(config.mongo.url, config.mongo.options)
  .then((result) => {
    logging.info(NAMESPACE, "connected to mongoDB~!");
  })
  .catch((error) => {
    logging.error(NAMESPACE, error.message, error);
  });

//==========================================================
//             TRACKING REQUESTS DURING DEVELOPMENT
//==========================================================

app.use((req, res, next) => {
  logging.info(
    NAMESPACE,
    `METHOD - [${req.method}], URL - [${req.url}], IP - [${req.socket.remoteAddress}]`
  );
  res.on("finish", () => {
    logging.info(
      NAMESPACE,
      `METHOD - [${req.method}], URL - [${req.url}], IP - [${req.socket.remoteAddress}], STATUS - [${res.statusCode}]`
    );
  });
  next();
});

//==========================================================
//                   INCOMING DATA EXTRACTION
//==========================================================

//parse incoming req data
app.use(bodyParser.urlencoded({ extended: false }));
//JSON every response we send back
app.use(bodyParser.json());
//For extracting tokens
app.use(cookieParser());

//==========================================================
//             SERVER SECURITY AND ALLOWED REQUESTS
//==========================================================

//this allows for requests to come from ANYWHERE
//usually we remove this in production and predefine a list of IP adresseses that we validate as safe..

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin,X-Requested-with, Content-Type, Accept, Authorization"
  );

  //this is for specifing which methods we allow.. when working with other coders on the project
  if (req.method == "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "GET PATCH DELETE POST PUT");
    return res.status(200).json({});
  }
  next();
});

app.use(cors(config.cors));

// comment out this line if you want to bypass JWT check during development
// When client attaches "bearer token" , expressJwt verifies it and if it is authenticated it will
// app.use(
//   expressJwt({
//     secret: config.jwtSecret,
//     algorithms: ["HS256"],
//     requestProperty: "user",  //default token claims available under req.user
//   }).unless({
//     path: [
//       "/api/users/register",
//       "/api/users/login",
//       "/api/users/logout",
//       "/api/users",
//     ],
//   })
// );

//==========================================================
//                     ROUTERS
//==========================================================
app.use("/api/topics", topicRoutes);

//==========================================================
//                  ERROR HANDLING
//==========================================================
app.use((req, res, next) => {
  const error = new Error("not found");

  return res.status(404).json({ message: error.message });
});

//==========================================================
//                 SERVER INITIALIZATION
//==========================================================

const httpServer = http.createServer(app);
httpServer.listen(config.server.port, () => {
  logging.info(
    NAMESPACE,
    `Server running on ${config.server.hostname}:${config.server.port}`
  );
});
