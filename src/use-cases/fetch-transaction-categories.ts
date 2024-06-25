import { TransactionCategoryRepository } from "@/repositories/transaction-category-repository";
import { TransactionCategory } from "@prisma/client";

interface FetchTransactionCategoriesUseCaseRequest {
  userId: string;
}

interface FetchTransactionCategoriesUseCaseResponse {
  transactionCategories: TransactionCategory[];
}

export class FetchTransactionCategoriesUseCase {
  constructor(
    private transactionCategoryRepository: TransactionCategoryRepository
  ) {}

  async execute({
    userId,
  }: FetchTransactionCategoriesUseCaseRequest): Promise<FetchTransactionCategoriesUseCaseResponse> {
    const transactionCategories =
      await this.transactionCategoryRepository.fetchByUserId(userId);

    return { transactionCategories: transactionCategories };
  }
}
