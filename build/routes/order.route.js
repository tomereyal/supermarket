"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const order_controller_1 = require("../controllers/order.controller");
const router = express_1.default.Router();
router.get("/count", order_controller_1.getOrderCount);
router.get("/previous", order_controller_1.getCustomersPreviousOrders);
router.post("/create", order_controller_1.createOrder);
router.get("/forbiddenOrderDates", order_controller_1.getForbiddenDates);
router.get("/isDateAvailable/:date", order_controller_1.isDateAvailable);
router.get("/:orderId", order_controller_1.getOrder);
module.exports = router;
