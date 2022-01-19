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
exports.uploadImage = void 0;
const config_1 = __importDefault(require("../config/config"));
const _helpers_1 = require("../_helpers");
const cloudinary = require("cloudinary").v2;
cloudinary.config(config_1.default.cloudinary);
exports.uploadImage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const fileStr = req.body.data; // a base-64-encoded file
        const uploadResponse = yield cloudinary.uploader.upload(fileStr, {
            upload_preset: `ml_default`,
        });
        console.log(`uploadResponse`, uploadResponse);
        const url = uploadResponse.url;
        _helpers_1.ok(res, { url });
    }
    catch (error) {
        console.log(`error`, error);
        _helpers_1.err(res, error);
    }
});
exports.default = { uploadImage: exports.uploadImage };
