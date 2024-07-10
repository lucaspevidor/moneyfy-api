import { app } from "@/app";
import { CreateAndAuthenticateUser } from "@/utils/test/create-and-authenticate-user";
import request from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

describe("Fetch bank-account (e2e)", () => {
  beforeAll(async () => await app.ready());
  afterAll(async () => await app.close());

  it("Should fetch existing bank accounts", async () => {
    const { token } = await CreateAndAuthenticateUser(app);

    for (let i = 0; i < 5; i++) {
      await request(app.server)
        .post("/bank-accounts")
        .set("Authorization", `Bearer ${token}`)
        .send({
          accountName: `Account ${i}`,
          accountCurrency: `CURR${i}`,
          initialBalance: 10000,
        });
    }

    const response = await request(app.server)
      .get(`/bank-accounts/`)
      .set("Authorization", `Bearer ${token}`)
      .send();

    expect(response.statusCode).toEqual(200);
    expect(response.body).toHaveLength(5);

    response.body.forEach((account) =>
      expect(account).toEqual({
        id: expect.any(String),
        balance: 10000,
        currency: expect.any(String),
        name: expect.stringContaining("Account"),
        userId: expect.any(String),
      })
    );
  });
});
