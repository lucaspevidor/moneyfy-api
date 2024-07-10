import { NotAuthorizedError } from "@/use-cases/errors/not-authorized-error";
import { ResourceNotFoundError } from "@/use-cases/errors/resource-not-found-error";
import { MakeUpdateBankAccountUseCase } from "@/use-cases/factories/make-update-bank-account-use-case";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export async function UpdateBankAccount(
  req: FastifyRequest,
  reply: FastifyReply
) {
  const updateBankAccountBodySchema = z.object({
    balance: z.number().optional(),
    currency: z.string().optional(),
    name: z.string().min(3).optional(),
  });

  const updateBankAccountParamsSchema = z.object({
    accountId: z.string().uuid(),
  });

  const { balance, currency, name } = updateBankAccountBodySchema.parse(
    req.body
  );
  const { accountId } = updateBankAccountParamsSchema.parse(req.params);

  try {
    const updateBankAccountUseCase = MakeUpdateBankAccountUseCase();
    const { updatedBankAccount } = await updateBankAccountUseCase.execute({
      updatedData: {
        balance,
        currency,
        name,
      },
      bankAccountId: accountId,
      userId: req.user.sub,
    });

    return reply.status(200).send(updatedBankAccount);
  } catch (err) {
    if (err instanceof ResourceNotFoundError)
      return reply.status(404).send({ message: err.message });
    if (err instanceof NotAuthorizedError)
      return reply.status(401).send({ message: err.message });

    throw err;
  }
}
