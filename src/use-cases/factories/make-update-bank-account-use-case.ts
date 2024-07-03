import { BankAccountRepository } from "@/repositories/bank-account-repository";
import { PrismaBankAccountRepository } from "@/repositories/prisma/prisma-bank-account-repository";
import { UpdateBankAccountUseCase } from "../update-bank-account";

export function MakeUpdateBankAccountUseCase(): UpdateBankAccountUseCase {
  const bankAccountRepository: BankAccountRepository =
    new PrismaBankAccountRepository();
  return new UpdateBankAccountUseCase(bankAccountRepository);
}
