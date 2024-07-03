import { BankAccountRepository } from "@/repositories/bank-account-repository";
import { PrismaBankAccountRepository } from "@/repositories/prisma/prisma-bank-account-repository";
import { PrismaUsersRepository } from "@/repositories/prisma/prisma-users-repository";
import { UsersRepository } from "@/repositories/user-repository";
import { RegisterBankAccountUseCase } from "../register-bank-account";

export function MakeRegisterBankAccountUseCase(): RegisterBankAccountUseCase {
  const bankAccountRepository: BankAccountRepository =
    new PrismaBankAccountRepository();
  const usersRepository: UsersRepository = new PrismaUsersRepository();

  return new RegisterBankAccountUseCase(bankAccountRepository, usersRepository);
}
