import { BankAccountRepository } from "@/repositories/bank-account-repository";
import { FetchBankAccountsUseCase } from "../fetch-bank-accounts";
import { PrismaBankAccountRepository } from "@/repositories/prisma/prisma-bank-account-repository";

export function MakeFetchBankAccountUseCase(): FetchBankAccountsUseCase {
  const bankAccountRepository: BankAccountRepository =
    new PrismaBankAccountRepository();

  return new FetchBankAccountsUseCase(bankAccountRepository);
}
