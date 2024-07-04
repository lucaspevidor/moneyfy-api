import { jwtVerify } from "@/http/middlewares/jwt-verify";
import { FastifyInstance } from "fastify";
import { RegisterTransactionCategory } from "./register-transaction-category";

export async function transactionCategoryRoutes(app: FastifyInstance) {
  app.addHook("onRequest", jwtVerify);

  app.post("/transaction-categories", RegisterTransactionCategory);
}
