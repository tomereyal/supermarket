import { Request, Response, NextFunction } from "express";
import logging from "../config/logging";
import Category from "../models/category.model";
import { ok, err, errMissing, debugClient } from "../_helpers";

const NAMESPACE = "category.controller.ts";

export const getCategories = async (req: Request, res: Response) => {
  try {
    const categories = await Category.find();
    ok(res, categories);
  } catch (error) {
    err(res, error);
  }
};

export const createCategory = async (req: Request, res: Response) => {
  const { name } = req.body;
  try {
    const newCategory = new Category({ name });
    await newCategory.save();
    ok(res, newCategory);
  } catch (error) {
    err(res, error);
    debugClient(req, {
      body: {
        name: "string",
      },
    });
  }
};

export const updateCategory = async (req: Request, res: Response) => {
  const { update } = req.body;
  const { categoryId } = req.params;
  try {
    const updatedCategory = await Category.findByIdAndUpdate(
      categoryId,
      update,
      {
        new: true,
      }
    );
    ok(res, updatedCategory);
  } catch (error) {
    err(res, error);
    debugClient(req, {
      params: { categoryId: "string" },
      body: { update: { key: "value" } },
    });
  }
};

export const deleteCategory = async (req: Request, res: Response) => {
  const { categoryId } = req.params;
  try {
    await Category.findByIdAndRemove(categoryId);
    ok(res, { deleted: true });
  } catch (error) {
    err(res, error);
    debugClient(req, { params: { categoryId: "string" } });
  }
};

export default {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
};
