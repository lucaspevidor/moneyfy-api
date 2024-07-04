import { app } from "@/app";
import { CreateAndAuthenticateUser } from "@/utils/test/create-and-authenticate-user";
import request from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

describe("Fetch transaction-categories (e2e)", () => {
  beforeAll(async () => await app.ready());
  afterAll(async () => app.close());

  it("Should fetch existent transaction-categories from an user", async () => {
    const { token } = await CreateAndAuthenticateUser(app);

    await request(app.server)
      .post("/transaction-categories")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Category 1",
      });

    await request(app.server)
      .post("/transaction-categories")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Category 2",
      });

    await request(app.server)
      .post("/transaction-categories")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Category 3",
      });

    const categoriesRes = await request(app.server)
      .get("/transaction-categories")
      .set("Authorization", `Bearer ${token}`)
      .send();

    expect(categoriesRes.statusCode).toEqual(200);
    expect(categoriesRes.body).toHaveLength(3);

    for (let i = 0; i < 2; i++) {
      expect(categoriesRes.body[i]).toEqual({
        id: expect.any(Number),
        name: expect.any(String),
        userId: expect.any(String),
      });
    }
  });
});
