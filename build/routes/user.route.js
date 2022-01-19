"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const user_controller_1 = __importDefault(require("../controllers/user.controller"));
const router = express_1.default.Router();
router.post("/getUser", user_controller_1.default.getUser);
router.post("/register", user_controller_1.default.register);
router.post("/isEmailTaken", user_controller_1.default.isEmailTaken);
module.exports = router;
