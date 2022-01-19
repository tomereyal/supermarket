"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const upload_controller_1 = require("../controllers/upload.controller");
const router = express_1.default.Router();
router.post("/", upload_controller_1.uploadImage);
module.exports = router;
