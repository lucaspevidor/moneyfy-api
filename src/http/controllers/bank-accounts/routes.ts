import { jwtVerify } from "@/http/middlewares/jwt-verify";
import { FastifyInstance } from "fastify";
import { DeleteBankAccount } from "./delete-bank-account";
import { FetchBankAccounts } from "./fetch-bank-accounts";
import { GetBankAccount } from "./get-bank-account";
import { RegisterBankAccount } from "./register-bank-account";
import { UpdateBankAccount } from "./update-bank-account";

export async function bankAccountRoutes(app: FastifyInstance) {
  app.addHook("onRequest", jwtVerify);

  app.get("/bank-accounts/:accountId", GetBankAccount);
  app.get("/bank-accounts/", FetchBankAccounts);
  app.post("/bank-accounts", RegisterBankAccount);
  app.patch("/bank-accounts/:accountId", UpdateBankAccount);
  app.delete("/bank-accounts/:accountId", DeleteBankAccount);
}
