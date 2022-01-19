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
exports.getCustomersPreviousOrders = exports.getForbiddenDates = exports.isDateAvailable = exports.createOrder = exports.getOrderCount = exports.getOrder = void 0;
const order_model_1 = __importDefault(require("../models/order.model"));
const cart_model_1 = __importDefault(require("../models/cart.model"));
const _helpers_1 = require("../_helpers");
const moment_1 = __importDefault(require("moment"));
exports.getOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () { });
exports.getOrderCount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const orderCount = yield order_model_1.default.countDocuments({});
        _helpers_1.ok(res, { orderCount });
    }
    catch (error) {
        _helpers_1.err(res, error);
    }
});
exports.createOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { customer, cart, totalPrice, destination, timeOfArrival, paymentDigits, } = req.body;
    try {
        const newOrder = yield order_model_1.default.create(req.body);
        if (!cart._id)
            throw new Error("Order is missing cart");
        const wasUserCartEmptied = yield cart_model_1.default.findByIdAndUpdate(cart === null || cart === void 0 ? void 0 : cart._id, {
            cartItems: [],
        }, {
            new: true,
            upsert: true,
            rawResult: true,
        });
        console.log(`wasUserCartEmptied`, wasUserCartEmptied);
        //@ts-ignore
        _helpers_1.ok(res, { newOrderId: newOrder._id, createdAt: newOrder.createdAt });
    }
    catch (error) {
        _helpers_1.err(res, error);
    }
});
exports.isDateAvailable = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { date } = req.params;
    try {
        const ordersWithSameDate = yield order_model_1.default.find({ timeOfArrival: date });
        _helpers_1.ok(res, { isDateAvailable: ordersWithSameDate.length < 2 });
    }
    catch (error) {
        _helpers_1.err(res, error);
    }
});
exports.getForbiddenDates = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const MAX_ORDERS_PER_DAY = 3;
    try {
        let forbiddenDates = {};
        const today = moment_1.default().startOf("day");
        const orders = yield order_model_1.default.find({
            timeOfArrival: {
                $gte: today.toDate(),
            },
        });
        //MAKE A HASHED MAP WITH key = DATE , value = COUNTER
        //convert the date value to the correct format of the client component..
        const hashedDateMap = orders.reduce((prev, cur) => {
            const date = cur.timeOfArrival.toString();
            const fDate = moment_1.default(date).toISOString().split("T")[0];
            if (!prev[fDate])
                prev[fDate] = 1;
            else
                prev[fDate]++;
            return prev;
        }, {});
        //FILTER THROUGH OBJECT AND REMOVE ALL ENRTIES WITH COUNTER VALUE GTE 3.
        for (let date in hashedDateMap) {
            if (hashedDateMap[date] >= MAX_ORDERS_PER_DAY)
                forbiddenDates[date] = true;
        }
        //Result format should be an object list with key: full ISO string date, value : boolean
        _helpers_1.ok(res, { forbiddenDates });
    }
    catch (error) {
        _helpers_1.err(res, error);
    }
});
exports.getCustomersPreviousOrders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { _id } = req.user;
    try {
        const previousOrders = yield order_model_1.default.find({ "customer._id": _id });
        _helpers_1.ok(res, { previousOrders });
    }
    catch (error) {
        _helpers_1.err(res, error);
    }
});
exports.default = {
    getOrder: exports.getOrder,
    getOrderCount: exports.getOrderCount,
    createOrder: exports.createOrder,
    isDateAvailable: exports.isDateAvailable,
    getCustomersPreviousOrders: exports.getCustomersPreviousOrders,
    getForbiddenDates: exports.getForbiddenDates,
};
