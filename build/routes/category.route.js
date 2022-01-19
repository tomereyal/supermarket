"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const category_controller_1 = require("../controllers/category.controller");
const router = express_1.default.Router();
router.get("/", category_controller_1.getCategories);
router.post("/create", category_controller_1.createCategory);
router.put("/update/:categoryId", category_controller_1.updateCategory);
router.delete("/delete/:categoryId", category_controller_1.deleteCategory);
module.exports = router;
