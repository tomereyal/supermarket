"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const product_controller_1 = require("./../controllers/product.controller");
const express_1 = __importDefault(require("express"));
const product_controller_2 = require("../controllers/product.controller");
const router = express_1.default.Router();
router.get("/category/:categoryId", product_controller_2.getProductsByCategory);
router.get("/name/:searchText", product_controller_2.getProductsByName);
router.get("/count", product_controller_1.getProductCount);
router.post("/create", product_controller_2.createProduct);
router.put("/update/:productId", product_controller_2.updateProduct);
router.delete("/delete/:productId", product_controller_2.deleteProduct);
module.exports = router;
