import { BankAccountRepository } from "@/repositories/bank-account-repository";
import { UsersRepository } from "@/repositories/user-repository";
import { BankAccount } from "@prisma/client";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";

interface RegisterBankAccountUseCaseRequest {
  userId: string;
  balance: number;
  name: string;
  currency: string;
}

interface RegisterBankAccountUseCaseResponse {
  bankAccount: BankAccount;
}

export class RegisterBankAccountUseCase {
  constructor(
    private bankAccountRepository: BankAccountRepository,
    private userRepository: UsersRepository
  ) {}

  async execute(
    data: RegisterBankAccountUseCaseRequest
  ): Promise<RegisterBankAccountUseCaseResponse> {
    const userFound = await this.userRepository.findById(data.userId);

    if (!userFound) throw new ResourceNotFoundError();

    const createdBankAccount = await this.bankAccountRepository.create({
      balance: data.balance,
      currency: data.currency,
      name: data.name,
      userId: data.userId,
    });

    return { bankAccount: createdBankAccount };
  }
}
