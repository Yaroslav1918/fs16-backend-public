import request from "supertest";

import connect, { MongoHelper } from "../db-helper";
import app from "../../app";
import { authenticateUser } from "../utils/authenticateUser";
import { createOrder } from "../services/order.test";

describe("Orders Controller", () => {
  let mongoHelper: MongoHelper;
  let accessToken: string;

  beforeEach(async () => {
    accessToken = await authenticateUser();
  });
  beforeAll(async () => {
    mongoHelper = await connect();
  });

  afterEach(async () => {
    await mongoHelper.clearDatabase();
  });

  afterAll(async () => {
    await mongoHelper.closeDatabase();
  });

  const category = {
    name: "test",
    images: ["image1", "image2"],
  };

  it("Should create a new order", async () => {
    const bodyOrder = await createOrder(true);
    const response = await request(app).post("/checkout").send(bodyOrder);
    expect(response.body.message).toEqual("order is created");
    expect(response.body.createdOrder).toHaveProperty("userId");
    expect(response.body.createdOrder).toHaveProperty("totalAmount");
  });

  it("Should delete  order", async () => {
    const order = await createOrder();
    const response = await request(app).delete(`/orders/${order?._id}`);
    expect(response.body.message).toEqual("Order deleted successfully");
  });

  it("Should return all orders", async () => {
    const order = await createOrder();
    const response = await request(app).get("/orders");
    expect(response.body.length).toEqual(1);
    expect(response.body[0]._id).toEqual(order?._id.toString());
  });

  it("Should return one order", async () => {
    const order = await createOrder();
    const response = await request(app).get(`/orders/${order?._id}`);
    expect(response.body._id).toEqual(order?._id.toString());
  });

  it("Should update  order", async () => {
    const order = await createOrder();
    const response = await request(app).patch(`/orders/${order?._id}`).send({
      totalAmount: 123,
      userId: order?.userId,
    });
    expect(response.body.totalAmount).toEqual(123);
  });
});
