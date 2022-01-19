import express from "express";
import {
  getCart,
  createCart,
  deleteAllCartItems,
  deleteCart,
  addCartItem,
  deleteCartItem,
  updateCartItemAmount,
} from "../controllers/cart.controller";
const router = express.Router();

router.get("/getCart", getCart);
router.post("/create", createCart);

router.put("/addCartItem", addCartItem);
router.put("/updateCartItemAmount/:cartItemId", updateCartItemAmount);
router.put("/deleteAllCartItems", deleteAllCartItems);
router.delete("/deleteCartItem/:cartItemId", deleteCartItem);
router.delete("/:cartId", deleteCart);

export = router;
