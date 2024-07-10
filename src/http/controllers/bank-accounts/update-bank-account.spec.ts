import { app } from "@/app";
import { CreateAndAuthenticateUser } from "@/utils/test/create-and-authenticate-user";
import request from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

describe("Update bank-account (e2e)", () => {
  beforeAll(async () => await app.ready());
  afterAll(async () => await app.close());

  it("Should update an existing bank account", async () => {
    const { token } = await CreateAndAuthenticateUser(app);

    const accountData = {
      accountName: "Account 1",
      accountCurrency: "BRL",
      initialBalance: 10000,
    };

    const createdResponse = await request(app.server)
      .post("/bank-accounts")
      .set("Authorization", `Bearer ${token}`)
      .send(accountData);

    const { id: accountId } = createdResponse.body;

    const response = await request(app.server)
      .patch(`/bank-accounts/${accountId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        balance: 20000,
        name: "Account 2",
        currency: "USD",
      });

    expect(response.statusCode).toEqual(200);
    expect(response.body).toEqual({
      id: accountId,
      balance: 20000,
      currency: "USD",
      name: "Account 2",
      userId: expect.any(String),
    });

    const updatedResponse = await request(app.server)
      .get(`/bank-accounts/${accountId}`)
      .set("Authorization", `Bearer ${token}`)
      .send();

    expect(updatedResponse.body).toEqual({
      id: accountId,
      balance: 20000,
      currency: "USD",
      name: "Account 2",
      userId: expect.any(String),
    });
  });
});
