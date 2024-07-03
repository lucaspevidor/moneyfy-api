import { PrismaTransactionCategoryRepository } from "@/repositories/prisma/prisma-transaction-category-repository";
import { PrismaUsersRepository } from "@/repositories/prisma/prisma-users-repository";
import { TransactionCategoryRepository } from "@/repositories/transaction-category-repository";
import { UsersRepository } from "@/repositories/user-repository";
import { RegisterTransactionCategoryUseCase } from "../register-transaction-category";

export function MakeRegisterTransactionCategoryUseCase(): RegisterTransactionCategoryUseCase {
  const transactionCategoryRepository: TransactionCategoryRepository =
    new PrismaTransactionCategoryRepository();
  const usersRepository: UsersRepository = new PrismaUsersRepository();

  return new RegisterTransactionCategoryUseCase(
    transactionCategoryRepository,
    usersRepository
  );
}
