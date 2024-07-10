import { ResourceNotFoundError } from "@/use-cases/errors/resource-not-found-error";
import { MakeGetBankAccountUseCase } from "@/use-cases/factories/make-get-bank-account-use-case";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export async function GetBankAccount(req: FastifyRequest, reply: FastifyReply) {
  const getBankAccountSchema = z.object({
    accountId: z.string().uuid(),
  });

  const { accountId } = getBankAccountSchema.parse(req.params);

  try {
    const getBankAccountUseCase = MakeGetBankAccountUseCase();
    const { bankAccount } = await getBankAccountUseCase.execute({
      bankAccountId: accountId,
      userId: req.user.sub,
    });

    return reply.status(200).send(bankAccount);
  } catch (err) {
    if (err instanceof ResourceNotFoundError)
      return reply.status(404).send({ message: err.message });

    throw err;
  }
}
