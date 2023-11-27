import request from "supertest";

import CategoryRepo from "../../models/CategoryModel";
import connect, { MongoHelper } from "../db-helper";
import app from "../../app";
import { authenticateUser } from "../utils/authenticateUser";

describe("Categories Controller", () => {
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

  it("Should create a new category", async () => {
    const response = await request(app)
      .post("/categories")
      .send(category)
      .set("Authorization", `Bearer ${accessToken}`);
    expect(response.body.newCategory).toHaveProperty("name");
    expect(response.body).toMatchObject({ newCategory: category });
    expect(response.body.message).toBe("Category successfully created");
  });

  it("Should return a list of categories", async () => {
    const newCategory = new CategoryRepo(category);
    await newCategory.save();
    const response = await request(app).get("/categories");
    expect(response.body.length).toBe(1);
    expect(response.body[0]).toMatchObject(category);
  });

  it("Should return one category by id", async () => {
    const newCategory = new CategoryRepo(category);
    await newCategory.save();
    const response = await request(app).get(`/categories/${newCategory._id}`);
    expect(response.body).toMatchObject(category);
  });

  it("Should update a category", async () => {
    const newCategory = new CategoryRepo(category);
    await newCategory.save();
    const response = await request(app)
      .put(`/categories/${newCategory._id}`)
      .send({ name: "updated", images: ["up1", "up2"] })
      .set("Authorization", `Bearer ${accessToken}`);
    expect(response.body.name).toEqual("updated");
    expect(response.body.images).toEqual(["up1", "up2"]);
  });

  it("Should delete a category", async () => {
    const newCategory = new CategoryRepo(category);
    await newCategory.save();
    const response = await request(app)
      .delete(`/categories/${newCategory._id}`)
      .set("Authorization", `Bearer ${accessToken}`);
    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe("Category successfully deleted");
  });
});
