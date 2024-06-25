import { ResourceNotFoundError } from "./errors/resource-not-found-error";
import { NotAuthorizedError } from "./errors/not-authorized-error";
import { TransactionCategoryRepository } from "@/repositories/transaction-category-repository";

interface DeleteTransactionCategoryUseCaseRequest {
  userId: string;
  transactionCategoryId: number;
}

interface DeleteTransactionCategoryUseCaseResponse {
  deletedTransactionCategoryId: number;
}

export class DeleteTransactionCategoryUseCase {
  constructor(
    private transactionCategoryRepository: TransactionCategoryRepository
  ) {}

  async execute({
    userId,
    transactionCategoryId,
  }: DeleteTransactionCategoryUseCaseRequest): Promise<DeleteTransactionCategoryUseCaseResponse> {
    const categoryToDelete = await this.transactionCategoryRepository.getById(
      transactionCategoryId
    );

    if (categoryToDelete === null) throw new ResourceNotFoundError();
    if (categoryToDelete.userId !== userId) throw new NotAuthorizedError();

    await this.transactionCategoryRepository.delete(transactionCategoryId);

    return { deletedTransactionCategoryId: transactionCategoryId };
  }
}
