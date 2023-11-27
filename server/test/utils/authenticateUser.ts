import request from "supertest";
import RoleRepo from "../../models/RoleModel";
import app from "../../app";

export async function authenticateUser() {
  const role = new RoleRepo({
    name: "ADMIN",
    permissions: ["READ", "CREATE", "DELETE", "UPDATE"],
  });

  await role.save();

  const user = {
    name: "testName",
    email: "test1234@mail.com",
    password: "123456",
    roleId: role._id.toString(),
  };

  await request(app).post("/users/signup").send(user);
  const loginResponse = await request(app)
    .post("/users/login")
    .send({ email: "test1234@mail.com", password: "123456" });

  const accessToken = loginResponse.body;
  return accessToken;
}
