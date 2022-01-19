"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const cart_controller_1 = require("../controllers/cart.controller");
const router = express_1.default.Router();
router.get("/getCart", cart_controller_1.getCart);
router.post("/create", cart_controller_1.createCart);
router.put("/addCartItem", cart_controller_1.addCartItem);
router.put("/updateCartItemAmount/:cartItemId", cart_controller_1.updateCartItemAmount);
router.put("/deleteAllCartItems", cart_controller_1.deleteAllCartItems);
router.delete("/deleteCartItem/:cartItemId", cart_controller_1.deleteCartItem);
router.delete("/:cartId", cart_controller_1.deleteCart);
module.exports = router;
