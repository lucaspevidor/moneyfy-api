import { InvalidTransactionAmountError } from "@/use-cases/errors/invalid-transaction-amount-error";
import { ResourceNotFoundError } from "@/use-cases/errors/resource-not-found-error";
import { MakeUpdateTransactionUseCase } from "@/use-cases/factories/make-update-transaction-use-case";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export async function UpdateTransaction(
  req: FastifyRequest,
  reply: FastifyReply
) {
  const updateTransactionParamsSchema = z.object({
    transactionId: z.string().uuid(),
  });

  const updateTransactionBodySchema = z.object({
    type: z.enum(["INCOME", "EXPENSE"]).optional(),
    date: z.coerce.date().optional(),
    amount: z.number().gt(0).optional(),
    description: z.string().optional(),
    categoryId: z.number().optional(),
  });

  const { transactionId } = updateTransactionParamsSchema.parse(req.params);
  const { amount, categoryId, date, description, type } =
    updateTransactionBodySchema.parse(req.body);

  try {
    const updateTransactionUseCase = MakeUpdateTransactionUseCase();
    const { updatedTransaction } = await updateTransactionUseCase.execute({
      transactionId,
      userId: req.user.sub,
      updatedData: {
        amount,
        categoryId,
        date,
        description,
        type,
      },
    });

    return reply.status(200).send(updatedTransaction);
  } catch (err) {
    if (err instanceof ResourceNotFoundError)
      return reply.status(404).send({ message: err.message });
    if (err instanceof InvalidTransactionAmountError)
      return reply.status(400).send({ message: err.message });

    throw err;
  }
}
