import { BankAccountRepository } from "@/repositories/bank-account-repository";
import { BankAccount, Prisma } from "@prisma/client";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";
import { NotAuthorizedError } from "./errors/not-authorized-error";

interface UpdateBankAccountUseCaseRequest {
  userId: string;
  bankAccountId: string;
  updatedData: Partial<
    Pick<
      Prisma.BankAccountUncheckedCreateInput,
      "balance" | "currency" | "name"
    >
  >;
}

interface UpdateBankAccountUseCaseResponse {
  updatedBankAccount: BankAccount;
}

export class UpdateBankAccountUseCase {
  constructor(private bankAccountRepository: BankAccountRepository) {}

  async execute({
    bankAccountId,
    updatedData,
    userId,
  }: UpdateBankAccountUseCaseRequest): Promise<UpdateBankAccountUseCaseResponse> {
    const foundBankAccount = await this.bankAccountRepository.getById(
      bankAccountId
    );

    if (foundBankAccount === null) throw new ResourceNotFoundError();
    if (foundBankAccount.userId !== userId) throw new NotAuthorizedError();

    const updatedBankAccount = await this.bankAccountRepository.update({
      accountId: bankAccountId,
      data: updatedData,
    });

    return { updatedBankAccount };
  }
}
