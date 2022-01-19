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
exports.deleteCategory = exports.updateCategory = exports.createCategory = exports.getCategories = void 0;
const category_model_1 = __importDefault(require("../models/category.model"));
const _helpers_1 = require("../_helpers");
const NAMESPACE = "category.controller.ts";
exports.getCategories = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const categories = yield category_model_1.default.find();
        _helpers_1.ok(res, categories);
    }
    catch (error) {
        _helpers_1.err(res, error);
    }
});
exports.createCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name } = req.body;
    try {
        const newCategory = new category_model_1.default({ name });
        yield newCategory.save();
        _helpers_1.ok(res, newCategory);
    }
    catch (error) {
        _helpers_1.err(res, error);
        _helpers_1.debugClient(req, {
            body: {
                name: "string",
            },
        });
    }
});
exports.updateCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { update } = req.body;
    const { categoryId } = req.params;
    try {
        const updatedCategory = yield category_model_1.default.findByIdAndUpdate(categoryId, update, {
            new: true,
        });
        _helpers_1.ok(res, updatedCategory);
    }
    catch (error) {
        _helpers_1.err(res, error);
        _helpers_1.debugClient(req, {
            params: { categoryId: "string" },
            body: { update: { key: "value" } },
        });
    }
});
exports.deleteCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { categoryId } = req.params;
    try {
        yield category_model_1.default.findByIdAndRemove(categoryId);
        _helpers_1.ok(res, { deleted: true });
    }
    catch (error) {
        _helpers_1.err(res, error);
        _helpers_1.debugClient(req, { params: { categoryId: "string" } });
    }
});
exports.default = {
    getCategories: exports.getCategories,
    createCategory: exports.createCategory,
    updateCategory: exports.updateCategory,
    deleteCategory: exports.deleteCategory,
};
