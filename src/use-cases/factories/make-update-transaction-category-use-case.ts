import { PrismaTransactionCategoryRepository } from "@/repositories/prisma/prisma-transaction-category-repository";
import { TransactionCategoryRepository } from "@/repositories/transaction-category-repository";
import { UpdateTransactionCategoryUseCase } from "../update-transaction-category";

export function MakeUpdateTransactionCategoryUseCase(): UpdateTransactionCategoryUseCase {
  const transactionCategoryRepository: TransactionCategoryRepository =
    new PrismaTransactionCategoryRepository();
  return new UpdateTransactionCategoryUseCase(transactionCategoryRepository);
}
