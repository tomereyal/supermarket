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
exports.isEmailTaken = exports.register = exports.getUser = void 0;
const logging_1 = __importDefault(require("../config/logging"));
const user_model_1 = __importDefault(require("../models/user.model"));
const _helpers_1 = require("../_helpers");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../config/config"));
const NAMESPACE = "user.controller.ts";
exports.getUser = (req, res, next) => {
    logging_1.default.info(NAMESPACE, "getUser function called");
    const { email, password } = req.body;
    user_model_1.default.findOne({ email })
        .then((user) => __awaiter(void 0, void 0, void 0, function* () {
        const { password: savedPassword, _id, firstName, lastName, email, isAdmin, address, } = user;
        const isCorrectPassword = yield bcrypt_1.default.compare(password, savedPassword);
        if (!isCorrectPassword) {
            logging_1.default.error(NAMESPACE, "username and password don't match");
            throw new Error("username and password don't match");
        }
        console.log(`user`, user);
        const token = jsonwebtoken_1.default.sign({ _id, isAdmin }, config_1.default.jwtSecret);
        const userFound = {
            _id,
            firstName,
            lastName,
            email,
            address,
            isAdmin,
            token,
        };
        _helpers_1.ok(res, { user: userFound }, true);
    }))
        .catch((error) => {
        logging_1.default.error(NAMESPACE, "Error retrieving user from DB");
        _helpers_1.err(res, error);
    });
};
exports.register = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    logging_1.default.info(NAMESPACE, "register function called");
    const { firstName, lastName, email, password, address } = req.body;
    const saltedPassword = yield bcrypt_1.default.hash(password, 10);
    // const newUser = new User({
    //   firstName,
    //   lastName,
    //   email,
    //   password: saltedPassword,
    //   address,
    // });
    user_model_1.default.create({
        firstName,
        lastName,
        email,
        password: saltedPassword,
        address,
    })
        .then((newUser) => {
        const token = jsonwebtoken_1.default.sign({ _id: newUser._id, isAdmin: newUser.isAdmin }, config_1.default.jwtSecret);
        _helpers_1.ok(res, { user: newUser, token });
    })
        .catch((error) => {
        _helpers_1.err(res, error);
    });
});
exports.isEmailTaken = (req, res, next) => {
    const { email } = req.body;
    if (!email)
        _helpers_1.errMissing(res);
    user_model_1.default.findOne({ email })
        .then((user) => {
        console.log(`found user with this email:`, user);
        if (user)
            return _helpers_1.ok(res, { isEmailTaken: true }, true);
        return _helpers_1.ok(res, { isEmailTaken: false });
    })
        .catch((error) => {
        return _helpers_1.err(res, error);
    });
};
exports.default = { getUser: exports.getUser, register: exports.register, isEmailTaken: exports.isEmailTaken };
