import { app } from "@/app";
import { CreateBankAccountAndCategory } from "@/utils/test/create-bank-account-and-category";
import request from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

describe("Update transaction (e2e)", () => {
  beforeAll(async () => await app.ready());
  afterAll(async () => await app.close());

  it("Should update an existing transaction", async () => {
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

    const updateResponse = await request(app.server)
      .patch(`/transactions/${registerResponse.body.id}`)
      .set("Authorization", `Bearer ${user.token}`)
      .send({
        amount: 50,
        bankAccountId: bankAccount.id,
        categoryId: transactionCategory.id,
        currency: bankAccount.currency,
        date: new Date("2024-05-04"),
        description: "Transaction new description",
        type: "INCOME",
      });

    expect(updateResponse.statusCode).toEqual(200);
    expect(updateResponse.body).toEqual({
      id: registerResponse.body.id,
      amount: 50,
      bankAccountId: bankAccount.id,
      categoryId: transactionCategory.id,
      currency: bankAccount.currency,
      date: new Date("2024-05-04").toISOString(),
      description: "Transaction new description",
      type: "INCOME",
      userId: expect.any(String),
    });
  });
});
