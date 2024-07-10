import { ResourceNotFoundError } from "@/use-cases/errors/resource-not-found-error";
import { MakeDeleteTransactionUseCase } from "@/use-cases/factories/make-delete-transaction-use-case";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export async function DeleteTransaction(
  req: FastifyRequest,
  reply: FastifyReply
) {
  const deleteTransactionSchema = z.object({
    transactionId: z.string().uuid(),
  });

  const { transactionId } = deleteTransactionSchema.parse(req.params);

  try {
    const deleteTransactionUseCase = MakeDeleteTransactionUseCase();
    const { deletedTransactionId } = await deleteTransactionUseCase.execute({
      transactionId,
      userId: req.user.sub,
    });

    return reply.status(200).send({ deletedTransactionId });
  } catch (err) {
    if (err instanceof ResourceNotFoundError)
      return reply.status(404).send({ message: err.message });

    throw err;
  }
}
