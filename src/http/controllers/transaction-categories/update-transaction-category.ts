import { NotAuthorizedError } from "@/use-cases/errors/not-authorized-error";
import { ResourceNotFoundError } from "@/use-cases/errors/resource-not-found-error";
import { MakeUpdateTransactionCategoryUseCase } from "@/use-cases/factories/make-update-transaction-category-use-case";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export async function UpdateTransactionCategory(
  req: FastifyRequest,
  reply: FastifyReply
) {
  const UpdateCategoryBodySchema = z.object({
    transactionCategoryId: z.number().min(0),
    newName: z.string().min(3),
  });

  const { transactionCategoryId, newName } = UpdateCategoryBodySchema.parse(
    req.body
  );

  try {
    const updateTransactionCategoryUseCase =
      MakeUpdateTransactionCategoryUseCase();
    const { updatedTransactionCategory } =
      await updateTransactionCategoryUseCase.execute({
        userId: req.user.sub,
        transactionCategoryId,
        updatedData: {
          name: newName,
        },
      });

    return reply.status(200).send(updatedTransactionCategory);
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
