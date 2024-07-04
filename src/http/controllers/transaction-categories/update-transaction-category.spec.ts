import { app } from "@/app";
import { CreateAndAuthenticateUser } from "@/utils/test/create-and-authenticate-user";
import request from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

describe("Update transaction-category (e2e)", () => {
  beforeAll(async () => await app.ready());
  afterAll(async () => app.close());

  it("Should update an existent transaction-category", async () => {
    const { token } = await CreateAndAuthenticateUser(app);

    const createdTransactionRes = await request(app.server)
      .post("/transaction-categories")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Category 1",
      });

    const transactionId = createdTransactionRes.body.id;

    const updatedTransactionRes = await request(app.server)
      .patch("/transaction-categories")
      .set("Authorization", `Bearer ${token}`)
      .send({
        transactionCategoryId: transactionId,
        newName: "Category 2",
      });

    expect(updatedTransactionRes.statusCode).toEqual(200);
    expect(updatedTransactionRes.body).toEqual({
      id: transactionId,
      name: "Category 2",
      userId: expect.any(String),
    });
  });
});
