import { TransactionCategoryRepository } from "@/repositories/transaction-category-repository";
import { FetchTransactionCategoriesUseCase } from "../fetch-transaction-categories";
import { PrismaTransactionCategoryRepository } from "@/repositories/prisma/prisma-transaction-category-repository";

export function MakeFetchTransactionCategoriesUseCase(): FetchTransactionCategoriesUseCase {
  const transactionCategoriesRepository: TransactionCategoryRepository =
    new PrismaTransactionCategoryRepository();
  return new FetchTransactionCategoriesUseCase(transactionCategoriesRepository);
}
