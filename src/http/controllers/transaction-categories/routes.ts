import { jwtVerify } from "@/http/middlewares/jwt-verify";
import { FastifyInstance } from "fastify";
import { DeleteTransactionCategory } from "./delete-transaction-category";
import { RegisterTransactionCategory } from "./register-transaction-category";

export async function transactionCategoryRoutes(app: FastifyInstance) {
  app.addHook("onRequest", jwtVerify);

  app.post("/transaction-categories", RegisterTransactionCategory);
  app.delete("/transaction-categories", DeleteTransactionCategory);
}
