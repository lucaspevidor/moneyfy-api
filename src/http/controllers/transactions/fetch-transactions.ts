import { TransactionFilterType } from "@/repositories/transaction-repository";
import { InvalidDateError } from "@/use-cases/errors/invalid-date-error";
import { ResourceNotFoundError } from "@/use-cases/errors/resource-not-found-error";
import { MakeFetchTransactionsByCategoryUseCase } from "@/use-cases/factories/make-fetch-transactions-by-category-use-case";
import { MakeFetchTransactionsByDateUseCase } from "@/use-cases/factories/make-fetch-transactions-by-date-use-case";
import { MakeFetchTransactionsUseCase } from "@/use-cases/factories/make-fetch-transactions-use-case";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export async function FetchTransactions(
  req: FastifyRequest,
  reply: FastifyReply
) {
  const fetchTransactionsQuerySchema = z.object({
    page: z.coerce.number().default(1),
    type: z.enum(["INCOME", "EXPENSE"]).optional(),
    categoryId: z.coerce.number().min(0).optional(),
    dateFrom: z.coerce.date().optional(),
    dateTo: z.coerce.date().optional(),
  });

  const { page, categoryId, dateFrom, dateTo, type } =
    fetchTransactionsQuerySchema.parse(req.query);

  let transactionType = TransactionFilterType.INCOMES_AND_EXPENSES;
  if (type === "EXPENSE") transactionType = TransactionFilterType.EXPENSES;
  if (type === "INCOME") transactionType = TransactionFilterType.INCOMES;

  console.log({ type });

  try {
    if (categoryId !== undefined) {
      const fetchTransactionsByCategoryUseCase =
        MakeFetchTransactionsByCategoryUseCase();
      const { transactions } = await fetchTransactionsByCategoryUseCase.execute(
        {
          categoryId,
          page,
          transactionType,
          userId: req.user.sub,
        }
      );

      return reply.status(200).send(transactions);
    }

    if (dateFrom !== undefined || dateTo !== undefined) {
      if (dateFrom === undefined || dateTo === undefined)
        return reply
          .status(400)
          .send({ message: "Missing one of the date filters" });

      const fetchTransactionsByDateUseCase =
        MakeFetchTransactionsByDateUseCase();
      const { transactions } = await fetchTransactionsByDateUseCase.execute({
        dateFrom,
        dateTo,
        page,
        transactionType,
        userId: req.user.sub,
      });

      return reply.status(200).send(transactions);
    }

    const fetchTransactionsUseCase = MakeFetchTransactionsUseCase();
    const { transactions } = await fetchTransactionsUseCase.execute({
      page,
      userId: req.user.sub,
    });

    return reply.status(200).send(transactions);
  } catch (err) {
    if (err instanceof ResourceNotFoundError)
      return reply.status(404).send({ message: err.message });
    if (err instanceof InvalidDateError)
      return reply.status(400).send({ message: err.message });

    throw err;
  }
}
