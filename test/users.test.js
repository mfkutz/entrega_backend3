import { expect } from "chai";
import { requester, registerAndLoginUser, validJWT, userId } from "./testUtils.js";

describe("Test Users API's With JWT", () => {
  before(async () => {
    await registerAndLoginUser();
  });

  describe("Testing Endpoints of Users", () => {
    it("Should retrieve all users successfully", async () => {
      const res = await requester.get(`/user/`);
      expect(res.status).to.equal(200);
      expect(res.status).not.to.equal(404);
    });

    it("Should retrieve user details by ID successfully", async () => {
      const res = await requester.get(`/user/${userId}`);
      expect(res.status).to.equal(200);
      expect(res.body).to.include.all.keys(
        "_id",
        "first_name",
        "last_name",
        "email",
        "age",
        "password",
        "role",
        "cart",
        "createdAt",
        "updatedAt"
      );

      expect(res.status).not.to.equal(404);
      expect(res.body).not.to.have.property("message", "User not found");
    });

    it("Should update user details by ID successfully", async () => {
      const res = await requester.put(`/user/${userId}`).send({
        first_name: "user updated",
        last_name: "test",
        age: "20",
      });
      expect(res.status).to.equal(200);
      expect(res.status).not.to.equal(404);
    });

    it("Should delete user with Id", async () => {
      const res = await requester.delete(`/user/${userId}`).set("Authorization", `Bearer ${validJWT.value}`);
      expect(res.status).to.equal(200);
      expect(res.status).not.to.equal(404);
    });
  });
});
