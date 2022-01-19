import express from "express";
import {
  getOrder,
  createOrder,
  isDateAvailable,
  getOrderCount,
  getCustomersPreviousOrders,
  getForbiddenDates,
} from "../controllers/order.controller";
const router = express.Router();

router.get("/count", getOrderCount);
router.get("/previous", getCustomersPreviousOrders);
router.post("/create", createOrder);
router.get("/forbiddenOrderDates", getForbiddenDates);
router.get("/isDateAvailable/:date", isDateAvailable);
router.get("/:orderId", getOrder);

export = router;
