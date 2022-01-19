"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCart = exports.updateCartItemAmount = exports.deleteCartItem = exports.addCartItem = exports.deleteAllCartItems = exports.createCart = exports.getCart = void 0;
const cart_model_1 = __importDefault(require("../models/cart.model"));
const _helpers_1 = require("../_helpers");
const cartItem_model_1 = __importDefault(require("../models/cartItem.model"));
exports.getCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { _id } = req.user;
    try {
        const cart = yield cart_model_1.default.findOne({
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
            const newCart = yield cart_model_1.default.create({ customerRef: _id });
            return _helpers_1.ok(res, { cart: newCart });
        }
        _helpers_1.ok(res, { cart });
    }
    catch (error) {
        _helpers_1.err(res, error);
    }
});
exports.createCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { _id } = req.user;
    try {
        yield cart_model_1.default.findOneAndRemove({
            customerRef: _id,
        });
        const newCart = yield cart_model_1.default.create({ customerRef: _id });
        _helpers_1.ok(res, { cart: newCart });
    }
    catch (error) {
        _helpers_1.err(res, error);
    }
});
exports.deleteAllCartItems = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { _id } = req.user;
    try {
        yield cart_model_1.default.findOneAndUpdate({ customerRef: _id }, { cartItems: [] });
        _helpers_1.ok(res, { deleted: true });
    }
    catch (error) {
        _helpers_1.err(res, error);
    }
});
//WILL RETURN THE NEWLY CREATED AND POPULATED CART ITEM (NOT THE WHOLE CART)
exports.addCartItem = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const customerId = req.user._id;
    const { productRef, amount } = req.body;
    const query = {
        customerRef: customerId,
        "cartItems.productRef": { $ne: productRef },
    };
    const newItem = new cartItem_model_1.default({ productRef, amount });
    // const update = { $set: { cartItems: newItem } };
    const update = {
        $addToSet: { cartItems: { _id: newItem._id, productRef, amount } },
    };
    try {
        const updatedCart = yield cart_model_1.default.findOneAndUpdate(query, update, {
            new: true,
        }).populate({
            path: "cartItems",
            match: { _id: newItem._id },
            populate: { path: "productRef" },
        });
        console.log(`updatedCart`, updatedCart);
        if (!updatedCart)
            throw new Error("cartItem exists in cart already");
        const cartItem = updatedCart.cartItems.find(({ _id }) => 
        //@ts-ignore
        _id.equals(newItem._id));
        _helpers_1.ok(res, { cartItem });
    }
    catch (error) {
        _helpers_1.err(res, error);
    }
});
exports.deleteCartItem = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { _id } = req.user;
    const { cartItemId } = req.params;
    const update = { $pull: { cartItems: { _id: cartItemId } } };
    try {
        yield cart_model_1.default.findOneAndUpdate({ customerRef: _id }, update);
        _helpers_1.ok(res, { deleted: true });
    }
    catch (error) {
        _helpers_1.err(res, error);
    }
});
exports.updateCartItemAmount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { _id } = req.user;
    const { cartItemId } = req.params;
    const { amount } = req.body;
    try {
        yield cart_model_1.default.findOneAndUpdate({ customerRef: _id }, { $set: { [`cartItems.$[outer].amount`]: amount } }, { arrayFilters: [{ "outer._id": cartItemId }] });
        _helpers_1.ok(res, { updated: true });
    }
    catch (error) {
        _helpers_1.err(res, error);
    }
});
exports.deleteCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { cartId } = req.params;
    try {
        yield cart_model_1.default.findByIdAndDelete(cartId);
        _helpers_1.ok(res, { deleted: true });
    }
    catch (error) {
        _helpers_1.err(res, error);
    }
});
exports.default = {
    getCart: exports.getCart,
    createCart: exports.createCart,
    addCartItem: exports.addCartItem,
    deleteCartItem: exports.deleteCartItem,
    updateCartItemAmount: exports.updateCartItemAmount,
    deleteAllCartItems: exports.deleteAllCartItems,
    deleteCart: exports.deleteCart,
};
//CODE REF: updating subdocument arrays fields
//https://www.codegrepper.com/code-examples/javascript/mongoose+update+subdocument+array+object
