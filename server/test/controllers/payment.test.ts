import request from "supertest";

import app from "../../app";
import connect, { MongoHelper } from "../db-helper";
import { CreateUserInput } from "../../types/User";
import { newOrderData } from "../../types/Order";
import OrderService from "../../services/ordersService";
import UserService from "../../services/usersService";
import ProductRepo from "../../models/ProductModel";
import PaymentRepo from "../../models/PaymentModel";
import CategoryRepo from "../../models/CategoryModel";
import { authenticateUser } from "../utils/authenticateUser";
import { NextFunction, Request, Response } from "express";

jest.mock("../../middlewares/checkAuth", () => {
  return () => async (req: Request, res: Response, next: NextFunction) => {
    next();
  };
});
jest.mock("../../middlewares/checkRoles", () => {
  return () => async (req: Request, res: Response, next: NextFunction) => {
    next();
  };
});
jest.mock("../../middlewares/checkPermissions", () => {
  return () => async (req: Request, res: Response, next: NextFunction) => {
    next();
  };
});

async function createBodyPayment() {
  const categoryInstance = new CategoryRepo({
    name: "mobile",
    images: ["fdfgdf"],
  });
  const category = await categoryInstance.save();
  const iphoneProduct = new ProductRepo({
    name: "iphone",
    description: "super phone",
    price: 123,
    categoryId: category._id.toString(),
    images: ["fdfgdf"],
    stock: 12,
  });
  const productOne = await iphoneProduct.save();

  const bodyUser: CreateUserInput = {
    name: "Sirko",
    email: "te112@gmail.com",
    password: "1234567",
  };
  const user = await UserService.createUser(bodyUser);

  const bodyOrder: newOrderData = {
    userId: user._id.toString(),
    products: [{ productId: productOne._id.toString(), quantity: 1 }],
  };
  const order = await OrderService.createOrder(bodyOrder);

  if (!order?._id) {
    return;
  }

  const bodyPayment = {
    method: "paypal",
    userId: user._id.toString(),
    ordersId: [order._id.toString()],
    bankName: "OTP",
    accountNumber: "sdfdsfdsf",
    shipmentInfo: {
      address: "new Street 1",
      shippingPrice: 10,
      city: "Oulu",
      postalCode: "12412",
      country: "Finland",
    },
  };

  return bodyPayment;
}

describe("Payment controller", () => {
  let mongoHelper: MongoHelper;

  beforeAll(async () => {
    mongoHelper = await connect();
  });

  afterEach(async () => {
    await mongoHelper.clearDatabase();
  });

  afterAll(async () => {
    await mongoHelper.closeDatabase();
  });

  it("Should create a payment", async () => {
    const bodyPayment = await createBodyPayment();
    const response = await request(app).post("/payments").send(bodyPayment);
    expect(response.body.payment[0].bankName).toEqual("OTP");
    expect(response.body.message).toEqual("Payment is created");
    expect(response.body.payment[0].userId).toEqual(bodyPayment?.userId);
  });

  it("Should return all payments", async () => {
    const bodyPayment = await createBodyPayment();
    const newPayment = new PaymentRepo({
      ...bodyPayment,
      orderId: bodyPayment?.ordersId[0],
    });
    await newPayment.save();
    const response = await request(app).get(`/payments`);
    console.log(response.body);
  });
  it("Should return one payment", async () => {
    const bodyPayment = await createBodyPayment();
    const newPayment = new PaymentRepo({
      ...bodyPayment,
      orderId: bodyPayment?.ordersId[0],
    });
    await newPayment.save();
    const response = await request(app).get(`/payments/${newPayment?._id}`);
    console.log("response.body", response.body);
    // expect(response.body.payment?._id).toEqual(newPayment?._id.toString());
  });
});
