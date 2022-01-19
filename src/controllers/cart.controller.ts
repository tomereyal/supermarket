import { Request, Response } from "express";
import Cart from "../models/cart.model";
import { err, ok } from "../_helpers";
import CartItem from "../models/cartItem.model";
import { ObjectId, Types } from "mongoose";

export const getCart = async (req: Request, res: Response) => {
  const { _id } = req.user as { _id: string };

  try {
    const cart = await Cart.findOne({
      customerRef: _id,
    })
      .populate({
        path: "cartItems",
        populate: [
          {
            path: "productRef",
            model: "Product",
          },
        ],
      })
      .exec();
    if (!cart) {
      const newCart = await Cart.create({ customerRef: _id });
      return ok(res, { cart: newCart });
    }
    ok(res, { cart });
  } catch (error) {
    err(res, error);
  }
};

export const createCart = async (req: Request, res: Response) => {
  const { _id } = req.user as { _id: string };
  try {
    await Cart.findOneAndRemove({
      customerRef: _id,
    });
    const newCart = await Cart.create({ customerRef: _id });
    ok(res, { cart: newCart });
  } catch (error) {
    err(res, error);
  }
};

export const deleteAllCartItems = async (req: Request, res: Response) => {
  const { _id } = req.user as { _id: string };
  try {
    await Cart.findOneAndUpdate({ customerRef: _id }, { cartItems: [] });
    ok(res, { deleted: true });
  } catch (error) {
    err(res, error);
  }
};

//WILL RETURN THE NEWLY CREATED AND POPULATED CART ITEM (NOT THE WHOLE CART)
export const addCartItem = async (req: Request, res: Response) => {
  const customerId = (req.user as { _id: string })._id;
  const { productRef, amount } = req.body;
  const query = {
    customerRef: customerId,
    "cartItems.productRef": { $ne: productRef },
  };
  const newItem = new CartItem({ productRef, amount });
  // const update = { $set: { cartItems: newItem } };
  const update = {
    $addToSet: { cartItems: { _id: newItem._id, productRef, amount } },
  };

  try {
    const updatedCart = await Cart.findOneAndUpdate(query, update, {
      new: true,
    }).populate({
      path: "cartItems",
      match: { _id: newItem._id },
      populate: { path: "productRef" },
    });
    console.log(`updatedCart`, updatedCart);
    if (!updatedCart) throw new Error("cartItem exists in cart already");
    const cartItem = updatedCart.cartItems.find(({ _id }) =>
      //@ts-ignore
      _id.equals(newItem._id)
    );

    ok(res, { cartItem });
  } catch (error) {
    err(res, error);
  }
};

export const deleteCartItem = async (req: Request, res: Response) => {
  const { _id } = req.user as { _id: string };
  const { cartItemId } = req.params;
  const update = { $pull: { cartItems: { _id: cartItemId } } };
  try {
    await Cart.findOneAndUpdate({ customerRef: _id }, update);
    ok(res, { deleted: true });
  } catch (error) {
    err(res, error);
  }
};

export const updateCartItemAmount = async (req: Request, res: Response) => {
  const { _id } = req.user as { _id: string };
  const { cartItemId } = req.params;
  const { amount } = req.body;
  try {
    await Cart.findOneAndUpdate(
      { customerRef: _id },
      { $set: { [`cartItems.$[outer].amount`]: amount } },
      { arrayFilters: [{ "outer._id": cartItemId }] }
    );
    ok(res, { updated: true });
  } catch (error) {
    err(res, error);
  }
};

export const deleteCart = async (req: Request, res: Response) => {
  const { cartId } = req.params;

  try {
    await Cart.findByIdAndDelete(cartId);
    ok(res, { deleted: true });
  } catch (error) {
    err(res, error);
  }
};

export default {
  getCart,
  createCart,
  addCartItem,
  deleteCartItem,
  updateCartItemAmount,
  deleteAllCartItems,
  deleteCart,
};

//CODE REF: updating subdocument arrays fields
//https://www.codegrepper.com/code-examples/javascript/mongoose+update+subdocument+array+object
