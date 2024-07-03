import { TransactionCategoryRepository } from "@/repositories/transaction-category-repository";
import { DeleteTransactionCategoryUseCase } from "../delete-transaction-category";
import { PrismaTransactionCategoryRepository } from "@/repositories/prisma/prisma-transaction-category-repository";

export function MakeDeleteTransactionCategoryUseCase(): DeleteTransactionCategoryUseCase {
  const transactionCategoryRepository: TransactionCategoryRepository =
    new PrismaTransactionCategoryRepository();

  return new DeleteTransactionCategoryUseCase(transactionCategoryRepository);
}
