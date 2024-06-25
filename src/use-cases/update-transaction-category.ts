import { ResourceNotFoundError } from "./errors/resource-not-found-error";
import { NotAuthorizedError } from "./errors/not-authorized-error";
import { Prisma, TransactionCategory } from "@prisma/client";
import { TransactionCategoryRepository } from "@/repositories/transaction-category-repository";

interface UpdateTransactionCategoryUseCaseRequest {
  userId: string;
  transactionCategoryId: number;
  updatedData: Partial<
    Pick<Prisma.TransactionCategoryUncheckedCreateInput, "name">
  >;
}

interface UpdateTransactionCategoryUseCaseResponse {
  updatedTransactionCategory: TransactionCategory;
}

export class UpdateTransactionCategoryUseCase {
  constructor(
    private transactionCategoryRepository: TransactionCategoryRepository
  ) {}

  async execute({
    transactionCategoryId,
    updatedData,
    userId,
  }: UpdateTransactionCategoryUseCaseRequest): Promise<UpdateTransactionCategoryUseCaseResponse> {
    const foundTransactionCategory =
      await this.transactionCategoryRepository.getById(transactionCategoryId);

    if (foundTransactionCategory === null) throw new ResourceNotFoundError();
    if (foundTransactionCategory.userId !== userId)
      throw new NotAuthorizedError();

    const updatedTransactionCategory =
      await this.transactionCategoryRepository.update({
        categoryId: transactionCategoryId,
        updatedData,
      });

    return { updatedTransactionCategory };
  }
}
