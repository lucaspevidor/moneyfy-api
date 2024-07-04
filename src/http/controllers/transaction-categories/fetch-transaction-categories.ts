import { MakeFetchTransactionCategoriesUseCase } from "@/use-cases/factories/make-fetch-transaction-categories-use-case";
import { FastifyReply, FastifyRequest } from "fastify";

export async function FetchTransactionCategories(
  req: FastifyRequest,
  reply: FastifyReply
) {
  const fetchTransactionCategoriesUseCase =
    MakeFetchTransactionCategoriesUseCase();
  const { transactionCategories } =
    await fetchTransactionCategoriesUseCase.execute({
      userId: req.user.sub,
    });

  return reply.status(200).send(transactionCategories);
}
