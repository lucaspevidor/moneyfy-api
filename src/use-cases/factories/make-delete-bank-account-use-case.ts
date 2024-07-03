import { BankAccountRepository } from "@/repositories/bank-account-repository";
import { DeleteBankAccountUseCase } from "../delete-bank-account";
import { PrismaBankAccountRepository } from "@/repositories/prisma/prisma-bank-account-repository";

export function MakeDeleteBankAccountUseCase(): DeleteBankAccountUseCase {
  const bankAccountRepository: BankAccountRepository =
    new PrismaBankAccountRepository();

  return new DeleteBankAccountUseCase(bankAccountRepository);
}
