import { ResourceNotFoundError } from "@/use-cases/errors/resource-not-found-error";
import { MakeGetTransactionUseCase } from "@/use-cases/factories/make-get-transaction-use-case";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export async function GetTransaction(req: FastifyRequest, reply: FastifyReply) {
  const getTransactionSchema = z.object({
    transactionId: z.string().uuid(),
  });

  const { transactionId } = getTransactionSchema.parse(req.params);

  try {
    const getTransactionUseCase = MakeGetTransactionUseCase();
    const { transaction } = await getTransactionUseCase.execute({
      transactionId,
      userId: req.user.sub,
    });

    return reply.status(200).send(transaction);
  } catch (err) {
    if (err instanceof ResourceNotFoundError)
      return reply.status(404).send({ message: err.message });

    throw err;
  }
}
