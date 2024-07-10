import { NotAuthorizedError } from "@/use-cases/errors/not-authorized-error";
import { ResourceNotFoundError } from "@/use-cases/errors/resource-not-found-error";
import { MakeDeleteBankAccountUseCase } from "@/use-cases/factories/make-delete-bank-account-use-case";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export async function DeleteBankAccount(
  req: FastifyRequest,
  reply: FastifyReply
) {
  const deleteBankAccountSchema = z.object({
    accountId: z.string().uuid(),
  });

  const { accountId: bankAccountId } = deleteBankAccountSchema.parse(
    req.params
  );

  try {
    const deleteBankAccountUseCase = MakeDeleteBankAccountUseCase();

    const { deletedBankAccountId } = await deleteBankAccountUseCase.execute({
      bankAccountId,
      userId: req.user.sub,
    });

    return reply.status(200).send({ deletedBankAccountId });
  } catch (err) {
    if (err instanceof ResourceNotFoundError)
      return reply.status(404).send({ message: err.message });
    if (err instanceof NotAuthorizedError)
      return reply.status(401).send({ message: err.message });

    throw err;
  }
}
