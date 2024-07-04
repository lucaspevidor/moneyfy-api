import { ResourceNotFoundError } from "@/use-cases/errors/resource-not-found-error";
import { MakeRegisterTransactionCategoryUseCase } from "@/use-cases/factories/make-register-transaction-category-use-case";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export async function RegisterTransactionCategory(
  req: FastifyRequest,
  reply: FastifyReply
) {
  const registerCategoryBodySchema = z.object({
    name: z.string().min(3),
  });

  const { name } = registerCategoryBodySchema.parse(req.body);

  try {
    const registerCategoryUseCase = MakeRegisterTransactionCategoryUseCase();

    const { transactionCategory } = await registerCategoryUseCase.execute({
      name,
      userId: req.user.sub,
    });

    return reply.status(200).send(transactionCategory);
  } catch (error) {
    if (error instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: error.message });
    }

    throw error;
  }
}
