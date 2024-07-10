import { app } from "@/app";
import { prisma } from "@/lib/prisma";
import { CreateBankAccountAndCategory } from "@/utils/test/create-bank-account-and-category";
import dayjs from "dayjs";
import request from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

let bankAccount: any, transactionCategory: any, user: any;

describe("Fetch transaction (e2e)", async () => {
  beforeAll(async () => {
    await app.ready();
    const createdData = await CreateBankAccountAndCategory(app);
    bankAccount = createdData.bankAccount;
    transactionCategory = createdData.transactionCategory;
    user = createdData.user;

    for (let i = 0; i < 30; i++) {
      await request(app.server)
        .post("/transactions")
        .set("Authorization", `Bearer ${user.token}`)
        .send({
          amount: 10 + i * 10,
          bankAccountId: bankAccount.id,
          categoryId: transactionCategory.id,
          currency: bankAccount.currency,
          date: dayjs("2024-05-01").add(i, "day"),
          description: `Transaction ${i}`,
          type: i % 2 == 0 ? "EXPENSE" : "INCOME",
        });
    }
  });

  afterAll(async () => await app.close());

  it("Should fetch existing transactions", async () => {
    const fetchResponse1 = await request(app.server)
      .get(`/transactions`)
      .set("Authorization", `Bearer ${user.token}`)
      .send();
    const fetchResponse2 = await request(app.server)
      .get(`/transactions?page=2`)
      .set("Authorization", `Bearer ${user.token}`)
      .send();

    expect(fetchResponse1.statusCode).toEqual(200);
    expect(fetchResponse1.body).toHaveLength(20);
    expect(fetchResponse1.body[0]).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        amount: expect.any(Number),
        bankAccountId: expect.any(String),
        categoryId: expect.any(Number),
        currency: expect.any(String),
        date: expect.any(String),
        description: expect.stringContaining("Transaction"),
        type: expect.any(String),
        userId: expect.any(String),
      })
    );

    expect(fetchResponse2.statusCode).toEqual(200);
    expect(fetchResponse2.body).toHaveLength(10);
    expect(fetchResponse2.body[0]).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        amount: expect.any(Number),
        bankAccountId: expect.any(String),
        categoryId: expect.any(Number),
        currency: expect.any(String),
        date: expect.any(String),
        description: expect.stringContaining("Transaction"),
        type: expect.any(String),
        userId: expect.any(String),
      })
    );
  });

  it("Should filter transactions by category id", async () => {
    const catResponse = await request(app.server)
      .post("/transaction-categories")
      .set("Authorization", `Bearer ${user.token}`)
      .send({
        name: "Category 2",
      });

    for (let i = 0; i < 15; i++) {
      await request(app.server)
        .post("/transactions")
        .set("Authorization", `Bearer ${user.token}`)
        .send({
          amount: 10 + i * 10,
          bankAccountId: bankAccount.id,
          categoryId: catResponse.body.id,
          currency: bankAccount.currency,
          date: dayjs("2024-05-05"),
          description: `Transaction ${i}`,
          type: i % 2 == 0 ? "EXPENSE" : "INCOME",
        });
    }

    const fetchResponse = await request(app.server)
      .get(`/transactions?categoryId=${catResponse.body.id}`)
      .set("Authorization", `Bearer ${user.token}`)
      .send();

    expect(fetchResponse.statusCode).toEqual(200);
    expect(fetchResponse.body).toHaveLength(15);
    fetchResponse.body.forEach((t) => {
      expect(t).toEqual({
        id: expect.any(String),
        amount: expect.any(Number),
        bankAccountId: expect.any(String),
        categoryId: expect.any(Number),
        currency: expect.any(String),
        date: dayjs("2024-05-05").toISOString(),
        description: expect.stringContaining("Transaction"),
        type: expect.any(String),
        userId: expect.any(String),
      });
    });

    await prisma.transaction.deleteMany({
      where: {
        categoryId: catResponse.body.id,
      },
    });
  });

  it("Should filter transactions by dates", async () => {
    const fetchResponse = await request(app.server)
      .get(`/transactions?dateFrom="2024-05-01"&dateTo="2024-05-15"`)
      .set("Authorization", `Bearer ${user.token}`)
      .send();

    expect(fetchResponse.statusCode).toEqual(200);
    expect(fetchResponse.body).toHaveLength(14);
    fetchResponse.body.forEach((t) => {
      const date = dayjs(t.date);
      expect(date.isAfter("2024-05-01")).toBeTruthy();
      expect(date.isBefore("2024-05-16")).toBeTruthy();
    });
  });

  it.only("Should filter transactions by transaction type", async () => {
    const fetchResponse = await request(app.server)
      .get(`/transactions?type=EXPENSE`)
      .set("Authorization", `Bearer ${user.token}`)
      .send();

    console.log(fetchResponse.body);

    expect(fetchResponse.statusCode).toEqual(200);
    expect(fetchResponse.body).toHaveLength(20);
    fetchResponse.body.forEach((t) => {
      expect(t.type).toEqual("EXPENSE");
    });
  });
});
