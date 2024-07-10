import { app } from "@/app";
import { CreateBankAccountAndCategory } from "@/utils/test/create-bank-account-and-category";
import request from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

describe("Delete transaction (e2e)", () => {
  beforeAll(async () => await app.ready());
  afterAll(async () => await app.close());

  it("Should delete an existing transaction", async () => {
    const { bankAccount, transactionCategory, user } =
      await CreateBankAccountAndCategory(app);

    const registerResponse = await request(app.server)
      .post("/transactions")
      .set("Authorization", `Bearer ${user.token}`)
      .send({
        amount: 20,
        bankAccountId: bankAccount.id,
        categoryId: transactionCategory.id,
        currency: bankAccount.currency,
        date: new Date("2024-05-03"),
        description: "Transaction description",
        type: "EXPENSE",
      });

    const deleteResponse = await request(app.server)
      .delete(`/transactions/${registerResponse.body.id}`)
      .set("Authorization", `Bearer ${user.token}`)
      .send();

    expect(deleteResponse.statusCode).toEqual(200);
    expect(deleteResponse.body).toEqual({
      deletedTransactionId: registerResponse.body.id,
    });
  });
});
