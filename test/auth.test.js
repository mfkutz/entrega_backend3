import { expect } from "chai";
import { requester } from "./testUtils.js";
import { userToCreate } from "./data/index.js";

let tokenUserCreated;
let idUserCreated;

describe("Test Auth API's With JWT", () => {
  it("Should register a user", async () => {
    const response = await requester.post("/auth/register").send(userToCreate);
    const { _body, statusCode } = response;
    expect(statusCode).to.be.equals(201);
    expect(_body).to.have.property("message", "Registered successfully");
    expect(statusCode).not.to.equal(404);
    expect(_body).not.to.have.property("error", "Unauthorized");
    expect(_body).not.to.have.property("details", "User already exists");
  });
  it("Should log in a user successfully - JWT", async () => {
    let data = { email: "user@test.com", password: "Aa#2345678" };
    const response = await requester.post("/auth/login").send(data);
    const { headers } = response;
    tokenUserCreated = headers["set-cookie"][0];
    tokenUserCreated = {
      name: tokenUserCreated.split("=")[0],
      value: tokenUserCreated.split("=")[1].split(";")[0],
    };
    expect(tokenUserCreated.name).to.be.equals("token");
    expect(tokenUserCreated.value).to.be.ok;
    let current = await requester.get("/auth/current").set("Authorization", `Bearer ${tokenUserCreated.value}`);
    const { user } = current._body;
    idUserCreated = user._id;
  });

  it("Should return the current user when authorized", async () => {
    const res = await requester.get(`/auth/current`).set("Authorization", `Bearer ${tokenUserCreated.value}`);
    expect(res.status).to.equal(200);
    expect(res.body).to.have.property("message", "Current user");
    expect(res.body.user).to.include.all.keys("_id", "email", "role", "cart");
    expect(res.status).not.to.equal(404);
  });

  it("Should delete the user 'user test' successfully' ", async () => {
    const res = await requester
      .delete(`/user/${idUserCreated}`)
      .set("Authorization", `Bearer ${tokenUserCreated.value}`);
    expect(res.status).to.equal(200);
    expect(res.body).to.have.property("message", "User deleted successfully");
    expect(res.status).not.to.equal(404);
    expect(res.body).not.to.have.property("message", "User not found");
    const resCheck = await requester
      .get(`/user/${idUserCreated}`)
      .set("Authorization", `Bearer ${tokenUserCreated.value}`);
    expect(resCheck.status).to.equal(404);
    expect(resCheck.body).to.have.property("message", "User not found");
  });
});
