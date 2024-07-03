import { BankAccountRepository } from "@/repositories/bank-account-repository";
import { UsersRepository } from "@/repositories/user-repository";
import { BankAccount } from "@prisma/client";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";

interface GetBankAccountUseCaseRequest {
  userId: string;
  bankAccountId: string;
}

interface GetBankAccountUseCaseResponse {
  bankAccount: BankAccount;
}

export class GetBankAccountUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private bankAccountRepository: BankAccountRepository
  ) {}

  async execute({
    bankAccountId,
    userId,
  }: GetBankAccountUseCaseRequest): Promise<GetBankAccountUseCaseResponse> {
    const bankAccount = await this.bankAccountRepository.getById(bankAccountId);
    if (!bankAccount || bankAccount.userId !== userId)
      throw new ResourceNotFoundError();

    return { bankAccount };
  }
}
