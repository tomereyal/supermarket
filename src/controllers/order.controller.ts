import { Request, Response } from "express";
import IOrder from "../interfaces/order.interface";
import Order from "../models/order.model";
import Cart from "../models/cart.model";
import { ok, err } from "../_helpers";
import moment from "moment";
export const getOrder = async (req: Request, res: Response) => {};
export const getOrderCount = async (req: Request, res: Response) => {
  try {
    const orderCount = await Order.countDocuments({});
    ok(res, { orderCount });
  } catch (error) {
    err(res, error);
  }
};

export const createOrder = async (req: Request, res: Response) => {
  const {
    customer,
    cart,
    totalPrice,
    destination,
    timeOfArrival,
    paymentDigits,
  } = req.body;
  try {
    const newOrder = await Order.create(req.body);
    if (!cart._id) throw new Error("Order is missing cart");

    const wasUserCartEmptied = await Cart.findByIdAndUpdate(
      cart?._id,
      {
        cartItems: [],
      },
      {
        new: true,
        upsert: true,
        rawResult: true, // Return the raw result from the MongoDB driver
      }
    );
    console.log(`wasUserCartEmptied`, wasUserCartEmptied);
    //@ts-ignore
    ok(res, { newOrderId: newOrder._id, createdAt: newOrder.createdAt });
  } catch (error) {
    err(res, error);
  }
};
export const isDateAvailable = async (req: Request, res: Response) => {
  const { date } = req.params;

  try {
    const ordersWithSameDate = await Order.find({ timeOfArrival: date });
    ok(res, { isDateAvailable: ordersWithSameDate.length < 2 });
  } catch (error) {
    err(res, error);
  }
};

export const getForbiddenDates = async (req: Request, res: Response) => {
  const MAX_ORDERS_PER_DAY = 3;
  try {
    let forbiddenDates = {};
    const today = moment().startOf("day");
    const orders = await Order.find({
      timeOfArrival: {
        $gte: today.toDate(),
      },
    });

    //MAKE A HASHED MAP WITH key = DATE , value = COUNTER
    //convert the date value to the correct format of the client component..
    const hashedDateMap = orders.reduce(
      (prev: { [key: string]: number }, cur: IOrder) => {
        const date = cur.timeOfArrival.toString();
        const fDate = moment(date).toISOString().split("T")[0];
        if (!prev[fDate]) prev[fDate] = 1;
        else prev[fDate]++;
        return prev;
      },
      {}
    );
    //FILTER THROUGH OBJECT AND REMOVE ALL ENRTIES WITH COUNTER VALUE GTE 3.
    for (let date in hashedDateMap) {
      if (hashedDateMap[date] >= MAX_ORDERS_PER_DAY)
        forbiddenDates[date] = true;
    }
    //Result format should be an object list with key: full ISO string date, value : boolean

    ok(res, { forbiddenDates });
  } catch (error) {
    err(res, error);
  }
};

export const getCustomersPreviousOrders = async (
  req: Request,
  res: Response
) => {
  const { _id } = req.user as { _id: string };
  try {
    const previousOrders = await Order.find({ "customer._id": _id });
    ok(res, { previousOrders });
  } catch (error) {
    err(res, error);
  }
};

export default {
  getOrder,
  getOrderCount,
  createOrder,
  isDateAvailable,
  getCustomersPreviousOrders,
  getForbiddenDates,
};
