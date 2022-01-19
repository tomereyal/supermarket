import { Request, Response, NextFunction } from "express";
import logging from "../config/logging";
import ICart from "../interfaces/cart.interface";
import ICartItem from "../interfaces/cartItem.interface";
import Cart from "../models/cart.model";
import Product from "../models/product.model";
import { ok, err, errMissing, debugClient } from "../_helpers";

const NAMESPACE = "product.controller.ts";

export const getProductsByCategory = async (req: Request, res: Response) => {
  const customerId = (req.user as { _id: string })._id;
  const categoryId = req.params?.categoryId;
  const query = categoryId
    ? { categoryRef: categoryId }
    : { categoryRef: "UNKNOWN" };

  try {
    // const customerCart: any = await Cart.find({ customerId });
    // const cartItems = customerCart.cartItems as ICartItem[];
    // //mark each product that is already in the specific user's cart..
    // const products = await Product.find(query).map((product) => {
    //   // const isInCart= cartItems.includes(product._id)
    //   return product;
    // });
    const products = await Product.find(query);

    ok(res, { products });
  } catch (error) {
    err(res, error);
    debugClient(req, {
      params: { categoryId: "string" },
    });
  }
};
export const getProductsByName = async (req: Request, res: Response) => {
  const searchText = req.params?.searchText;
  if (!searchText) ok(res, []); //return empty array if searchText is empty
  const query = { name: { $regex: "^" + searchText, $options: "i" } };

  try {
    const products = await Product.find(query);
    console.log(`products`, products);
    ok(res, { products });
  } catch (error) {
    err(res, error);
    debugClient(req, {
      params: { searchText: "string" },
    });
  }
};

export const getProductCount = async (req: Request, res: Response) => {
  try {
    const productCount = await Product.countDocuments({});
    ok(res, { productCount });
  } catch (error) {
    err(res, error);
  }
};

export const createProduct = async (req: Request, res: Response) => {
  const { name, price, url, categoryRef } = req.body;
  try {
    const newProduct = new Product({ name, price, url, categoryRef });
    await newProduct.save();
    ok(res, { newProduct });
  } catch (error) {
    err(res, error);
    debugClient(req, {
      body: {
        name: "string",
        price: "number",
        url: "string optional",
        categoryRef: "objectId or string",
      },
    });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  const { update } = req.body;
  const { productId } = req.params;

  try {
    const updatedProduct = await Product.findByIdAndUpdate(productId, update, {
      new: true,
    });
    ok(res, { updatedProduct });
  } catch (error) {
    err(res, error);
    debugClient(req, {
      params: { productId: "string" },
      body: { update: { key: "value" } },
    });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  const { productId } = req.params;
  try {
    await Product.findByIdAndRemove(productId);
    ok(res, { deleted: true });
  } catch (error) {
    err(res, error);
    debugClient(req, { params: { productId: "string" } });
  }
};

export default {
  getProductsByCategory,
  getProductsByName,
  getProductCount,
  createProduct,
  updateProduct,
  deleteProduct,
};
