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
exports.deleteProduct = exports.updateProduct = exports.createProduct = exports.getProductCount = exports.getProductsByName = exports.getProductsByCategory = void 0;
const product_model_1 = __importDefault(require("../models/product.model"));
const _helpers_1 = require("../_helpers");
const NAMESPACE = "product.controller.ts";
exports.getProductsByCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const customerId = req.user._id;
    const categoryId = (_a = req.params) === null || _a === void 0 ? void 0 : _a.categoryId;
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
        const products = yield product_model_1.default.find(query);
        _helpers_1.ok(res, { products });
    }
    catch (error) {
        _helpers_1.err(res, error);
        _helpers_1.debugClient(req, {
            params: { categoryId: "string" },
        });
    }
});
exports.getProductsByName = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    const searchText = (_b = req.params) === null || _b === void 0 ? void 0 : _b.searchText;
    if (!searchText)
        _helpers_1.ok(res, []); //return empty array if searchText is empty
    const query = { name: { $regex: "^" + searchText, $options: "i" } };
    try {
        const products = yield product_model_1.default.find(query);
        console.log(`products`, products);
        _helpers_1.ok(res, { products });
    }
    catch (error) {
        _helpers_1.err(res, error);
        _helpers_1.debugClient(req, {
            params: { searchText: "string" },
        });
    }
});
exports.getProductCount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const productCount = yield product_model_1.default.countDocuments({});
        _helpers_1.ok(res, { productCount });
    }
    catch (error) {
        _helpers_1.err(res, error);
    }
});
exports.createProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, price, url, categoryRef } = req.body;
    try {
        const newProduct = new product_model_1.default({ name, price, url, categoryRef });
        yield newProduct.save();
        _helpers_1.ok(res, { newProduct });
    }
    catch (error) {
        _helpers_1.err(res, error);
        _helpers_1.debugClient(req, {
            body: {
                name: "string",
                price: "number",
                url: "string optional",
                categoryRef: "objectId or string",
            },
        });
    }
});
exports.updateProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { update } = req.body;
    const { productId } = req.params;
    try {
        const updatedProduct = yield product_model_1.default.findByIdAndUpdate(productId, update, {
            new: true,
        });
        _helpers_1.ok(res, { updatedProduct });
    }
    catch (error) {
        _helpers_1.err(res, error);
        _helpers_1.debugClient(req, {
            params: { productId: "string" },
            body: { update: { key: "value" } },
        });
    }
});
exports.deleteProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { productId } = req.params;
    try {
        yield product_model_1.default.findByIdAndRemove(productId);
        _helpers_1.ok(res, { deleted: true });
    }
    catch (error) {
        _helpers_1.err(res, error);
        _helpers_1.debugClient(req, { params: { productId: "string" } });
    }
});
exports.default = {
    getProductsByCategory: exports.getProductsByCategory,
    getProductsByName: exports.getProductsByName,
    getProductCount: exports.getProductCount,
    createProduct: exports.createProduct,
    updateProduct: exports.updateProduct,
    deleteProduct: exports.deleteProduct,
};
