import { PrismaTransactionRepository } from "@/repositories/prisma/prisma-transaction-repository";
import { TransactionRepository } from "@/repositories/transaction-repository";
import { UpdateTransactionUseCase } from "../update-transaction";
import { UsersRepository } from "@/repositories/user-repository";
import { BankAccountRepository } from "@/repositories/bank-account-repository";
import { PrismaBankAccountRepository } from "@/repositories/prisma/prisma-bank-account-repository";
import { PrismaTransactionCategoryRepository } from "@/repositories/prisma/prisma-transaction-category-repository";
import { PrismaUsersRepository } from "@/repositories/prisma/prisma-users-repository";
import { TransactionCategoryRepository } from "@/repositories/transaction-category-repository";

export function MakeUpdateTransactionUseCase(): UpdateTransactionUseCase {
  const usersRepository: UsersRepository = new PrismaUsersRepository();
  const bankAccountRepository: BankAccountRepository =
    new PrismaBankAccountRepository();
  const transactionRepository: TransactionRepository =
    new PrismaTransactionRepository();
  const transactionCategoryRepository: TransactionCategoryRepository =
    new PrismaTransactionCategoryRepository();
  return new UpdateTransactionUseCase(
    usersRepository,
    bankAccountRepository,
    transactionRepository,
    transactionCategoryRepository
  );
}
