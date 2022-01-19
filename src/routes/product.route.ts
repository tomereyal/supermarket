import { getProductCount } from "./../controllers/product.controller";
import express from "express";
import {
  getProductsByCategory,
  getProductsByName,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/product.controller";
const router = express.Router();

router.get("/category/:categoryId", getProductsByCategory);
router.get("/name/:searchText", getProductsByName);
router.get("/count", getProductCount);
router.post("/create", createProduct);
router.put("/update/:productId", updateProduct);
router.delete("/delete/:productId", deleteProduct);

export = router;
