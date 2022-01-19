import http from "http";
import express from "express";
import bodyParser from "body-parser";
import logging from "./config/logging";
import config from "./config/config";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import cors from "cors";
import userRoute from "./routes/user.route";
import productRoute from "./routes/product.route";
import categoryRoute from "./routes/category.route";
import cartRoute from "./routes/cart.route";
import uploadRoute from "./routes/upload.route";
import orderRoute from "./routes/order.route";
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
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
//JSON every response we send back
app.use(bodyParser.json({ limit: "50mb" }));
//For extracting tokens
app.use(cookieParser());

//==========================================================
//             SERVER SECURITY AND ALLOWED REQUESTS
//==========================================================

//this allows for requests to come from ANYWHERE
//usually we remove this in production and predefine a list of IP adresseses that we validate as safe..

app.use(cors(config.cors));

// comment out this line if you want to bypass JWT check during development
// When client attaches "bearer token" , expressJwt verifies it and if it is authenticated it will
app.use(
  expressJwt({
    secret: config.jwtSecret,
    algorithms: ["HS256"],
    requestProperty: "user", //default token claims available under req.user
  }).unless({
    path: [
      "/api/users/register",
      "/api/users/isEmailTaken",
      "/api/users/getUser",
      "/api/users/logout",
      "/api/users",
      "/api/products/count",
      "/api/orders/count",
    ],
  })
);

//==========================================================
//                     ROUTERS
//==========================================================
app.use("/api/users", userRoute);
app.use("/api/products", productRoute);
app.use("/api/categories", categoryRoute);
app.use("/api/orders", orderRoute);
app.use("/api/carts", cartRoute);
app.use("/api/uploads", uploadRoute);
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
