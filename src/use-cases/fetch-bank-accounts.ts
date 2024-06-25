import { BankAccountRepository } from "@/repositories/bank-account-repository";
import { BankAccount } from "@prisma/client";

interface FetchBankAccountsUseCaseRequest {
  userId: string;
}

interface FetchBankAccountsUseCaseResponse {
  bankAccounts: BankAccount[];
}

export class FetchBankAccountsUseCase {
  constructor(private bankAccountRepository: BankAccountRepository) {}

  async execute({
    userId,
  }: FetchBankAccountsUseCaseRequest): Promise<FetchBankAccountsUseCaseResponse> {
    const bankAccounts = await this.bankAccountRepository.fetchByUserId(userId);

    return { bankAccounts: bankAccounts };
  }
}
