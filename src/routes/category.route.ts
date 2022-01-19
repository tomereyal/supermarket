import express from "express";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/category.controller";

const router = express.Router();

router.get("/", getCategories);
router.post("/create", createCategory);
router.put("/update/:categoryId", updateCategory);
router.delete("/delete/:categoryId", deleteCategory);

export = router;
