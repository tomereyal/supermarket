"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const logging_1 = __importDefault(require("./config/logging"));
const config_1 = __importDefault(require("./config/config"));
const mongoose_1 = __importDefault(require("mongoose"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const user_route_1 = __importDefault(require("./routes/user.route"));
const product_route_1 = __importDefault(require("./routes/product.route"));
const category_route_1 = __importDefault(require("./routes/category.route"));
const cart_route_1 = __importDefault(require("./routes/cart.route"));
const upload_route_1 = __importDefault(require("./routes/upload.route"));
const order_route_1 = __importDefault(require("./routes/order.route"));
const express_jwt_1 = __importDefault(require("express-jwt"));
const NAMESPACE = "Server";
const app = express_1.default();
//==========================================================
//                 CONNECTION TO MONGODB
//==========================================================
mongoose_1.default
    .connect(config_1.default.mongo.url, config_1.default.mongo.options)
    .then((result) => {
    logging_1.default.info(NAMESPACE, "connected to mongoDB~!");
})
    .catch((error) => {
    logging_1.default.error(NAMESPACE, error.message, error);
});
//==========================================================
//             TRACKING REQUESTS DURING DEVELOPMENT
//==========================================================
app.use((req, res, next) => {
    logging_1.default.info(NAMESPACE, `METHOD - [${req.method}], URL - [${req.url}], IP - [${req.socket.remoteAddress}]`);
    res.on("finish", () => {
        logging_1.default.info(NAMESPACE, `METHOD - [${req.method}], URL - [${req.url}], IP - [${req.socket.remoteAddress}], STATUS - [${res.statusCode}]`);
    });
    next();
});
//==========================================================
//                   INCOMING DATA EXTRACTION
//==========================================================
//parse incoming req data
app.use(body_parser_1.default.urlencoded({ limit: "50mb", extended: true }));
//JSON every response we send back
app.use(body_parser_1.default.json({ limit: "50mb" }));
//For extracting tokens
app.use(cookie_parser_1.default());
//==========================================================
//             SERVER SECURITY AND ALLOWED REQUESTS
//==========================================================
//this allows for requests to come from ANYWHERE
//usually we remove this in production and predefine a list of IP adresseses that we validate as safe..
app.use(cors_1.default(config_1.default.cors));
// comment out this line if you want to bypass JWT check during development
// When client attaches "bearer token" , expressJwt verifies it and if it is authenticated it will
app.use(express_jwt_1.default({
    secret: config_1.default.jwtSecret,
    algorithms: ["HS256"],
    requestProperty: "user",
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
}));
//==========================================================
//                     ROUTERS
//==========================================================
app.use("/api/users", user_route_1.default);
app.use("/api/products", product_route_1.default);
app.use("/api/categories", category_route_1.default);
app.use("/api/orders", order_route_1.default);
app.use("/api/carts", cart_route_1.default);
app.use("/api/uploads", upload_route_1.default);
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
const httpServer = http_1.default.createServer(app);
httpServer.listen(config_1.default.server.port, () => {
    logging_1.default.info(NAMESPACE, `Server running on ${config_1.default.server.hostname}:${config_1.default.server.port}`);
});
