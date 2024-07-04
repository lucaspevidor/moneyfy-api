import { NotAuthorizedError } from "@/use-cases/errors/not-authorized-error";
import { ResourceNotFoundError } from "@/use-cases/errors/resource-not-found-error";
import { MakeDeleteTransactionCategoryUseCase } from "@/use-cases/factories/make-delete-transaction-category-use-case";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export async function DeleteTransactionCategory(
  req: FastifyRequest,
  reply: FastifyReply
) {
  const DeleteCategoryBodySchema = z.object({
    transactionCategoryId: z.number().min(0),
  });

  const { transactionCategoryId } = DeleteCategoryBodySchema.parse(req.body);

  try {
    const deleteTransactionCategoryUseCase =
      MakeDeleteTransactionCategoryUseCase();
    const { deletedTransactionCategoryId } =
      await deleteTransactionCategoryUseCase.execute({
        userId: req.user.sub,
        transactionCategoryId,
      });

    return reply.status(200).send({ deletedTransactionCategoryId });
  } catch (error) {
    if (error instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: error.message });
    }
    if (error instanceof NotAuthorizedError) {
      return reply.status(401).send({ message: error.message });
    }

    throw error;
  }
}
