import { BankAccountRepository } from "@/repositories/bank-account-repository";
import { PrismaBankAccountRepository } from "@/repositories/prisma/prisma-bank-account-repository";
import { PrismaUsersRepository } from "@/repositories/prisma/prisma-users-repository";
import { UsersRepository } from "@/repositories/user-repository";
import { GetBankAccountUseCase } from "../get-bank-account";

export function MakeGetBankAccountUseCase() {
  const usersRepository: UsersRepository = new PrismaUsersRepository();
  const bankAccountRepository: BankAccountRepository =
    new PrismaBankAccountRepository();

  return new GetBankAccountUseCase(usersRepository, bankAccountRepository);
}
