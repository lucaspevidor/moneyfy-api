import { InvalidCurrencyError } from "@/use-cases/errors/invalid-currency-error";
import { InvalidTransactionAmountError } from "@/use-cases/errors/invalid-transaction-amount-error";
import { ResourceNotFoundError } from "@/use-cases/errors/resource-not-found-error";
import { MakeRegisterTransactionUseCase } from "@/use-cases/factories/make-register-transaction-use-case";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export async function RegisterTransaction(
  req: FastifyRequest,
  reply: FastifyReply
) {
  const registerTransactionSchema = z.object({
    amount: z.number().gt(0),
    bankAccountId: z.string().uuid(),
    categoryId: z.number(),
    currency: z.string().min(3),
    date: z.coerce.date(),
    description: z.string(),
    type: z.enum(["INCOME", "EXPENSE"]),
  });

  const {
    amount,
    bankAccountId,
    categoryId,
    currency,
    date,
    description,
    type,
  } = registerTransactionSchema.parse(req.body);
  try {
    const registerTransactionUseCase = MakeRegisterTransactionUseCase();
    const { createdTransaction } = await registerTransactionUseCase.execute({
      transaction: {
        amount,
        bankAccountId,
        categoryId,
        currency,
        date,
        description,
        type,
        userId: req.user.sub,
      },
    });

    return reply.status(201).send(createdTransaction);
  } catch (err) {
    if (err instanceof ResourceNotFoundError)
      return reply.status(404).send({ message: err.message });
    if (
      err instanceof InvalidCurrencyError ||
      err instanceof InvalidTransactionAmountError
    )
      return reply.status(400).send({ message: err.message });

    throw err;
  }
}
