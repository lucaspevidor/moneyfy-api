import { app } from "@/app";
import { CreateBankAccountAndCategory } from "@/utils/test/create-bank-account-and-category";
import request from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

describe("Register transaction (e2e)", () => {
  beforeAll(async () => await app.ready());
  afterAll(async () => await app.close());

  it("Should register a new transaction", async () => {
    const { user, bankAccount, transactionCategory } =
      await CreateBankAccountAndCategory(app);

    const response = await request(app.server)
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

    expect(response.statusCode).toEqual(201);
    expect(response.body).toEqual({
      amount: 20,
      bankAccountId: bankAccount.id,
      categoryId: transactionCategory.id,
      currency: bankAccount.currency,
      date: new Date("2024-05-03").toISOString(),
      description: "Transaction description",
      type: "EXPENSE",
      id: expect.any(String),
      userId: expect.any(String),
    });
  });
});
