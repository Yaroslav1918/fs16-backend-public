import request from "supertest";

import ProductRepo from "../../models/ProductModel";
import CategoryRepo from "../../models/CategoryModel";

import connect, { MongoHelper } from "../db-helper";
import app from "../../app";
import { CreateProductInput, ProductDocument } from "../../types/Product";
import { Category } from "../../types/Category";
import { authenticateUser } from "../utils/authenticateUser";

describe("Product controller", () => {
  let mongoHelper: MongoHelper;
  let category: Category;
  let productOne: ProductDocument;
  let accessToken: string;

  beforeEach(async () => {
    accessToken = await authenticateUser();
    const categoryInstance = new CategoryRepo({
      name: "mobile",
      images: ["fdfgdf"],
    });
    category = await categoryInstance.save();
    const nokiaProduct = new ProductRepo({
      name: "nokia",
      description: "nokia description",
      price: 300,
      categoryId: category._id.toString(),
      images: ["fdfgdf"],
      stock: 12,
    });
    productOne = await nokiaProduct.save();
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

  it("Should create a product", async () => {
    const product: CreateProductInput = {
      name: "nokia",
      description: "nokia description",
      price: 300,
      categoryId: category._id.toString(),
      images: ["fdfgdf"],
      stock: 12,
    };
    const response = await request(app)
      .post("/products")
      .send(product)
      .set("Authorization", `Bearer ${accessToken}`);
    expect(response.body.product).toHaveProperty("name");
    expect(response.body.message).toEqual("Product successfully created");
  });

  it("should return all products ", async () => {
    const response = await request(app).get("/products");
    expect(response.body.length).toEqual(1);
    expect(response.body[0].name).toEqual("nokia");
  });

  it("should return one product ", async () => {
    const response = await request(app).get(`/products/${productOne?._id}`);
    expect(response.statusCode).toEqual(200);
    expect(response.body.name).toEqual("nokia");
  });

  it("should delete one product ", async () => {
    const response = await request(app)
      .delete(`/products/${productOne?._id}`)
      .set("Authorization", `Bearer ${accessToken}`);
    expect(response.statusCode).toEqual(200);
    expect(response.body.message).toEqual("Product deleted successfully");
  });

  it("should update one product ", async () => {
    const response = await request(app)
      .put(`/products/${productOne?._id}`)
      .send({
        name: "sony",
        price: 300,
      })
      .set("Authorization", `Bearer ${accessToken}`);
    expect(response.statusCode).toEqual(200);
    expect(response.body.name).toEqual("sony");
    expect(response.body.price).toEqual(300);
  });
});
