import { app } from "@/app";
import { CreateAndAuthenticateUser } from "@/utils/test/create-and-authenticate-user";
import request from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

describe("Delete transaction-category (e2e)", () => {
  beforeAll(async () => await app.ready());
  afterAll(async () => app.close());

  it("Should delete an existent transaction-category", async () => {
    const { token } = await CreateAndAuthenticateUser(app);

    const createdTransactionRes = await request(app.server)
      .post("/transaction-categories")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Category 1",
      });

    const transactionId = createdTransactionRes.body.id;

    const deletedTransactionRes = await request(app.server)
      .delete("/transaction-categories")
      .set("Authorization", `Bearer ${token}`)
      .send({
        transactionCategoryId: transactionId,
      });

    expect(deletedTransactionRes.statusCode).toEqual(200);
    expect(deletedTransactionRes.body.deletedTransactionCategoryId).toEqual(
      transactionId
    );
  });
});
