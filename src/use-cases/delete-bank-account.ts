import { BankAccountRepository } from "@/repositories/bank-account-repository";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";
import { NotAuthorizedError } from "./errors/not-authorized-error";

interface DeleteBankAccountUseCaseRequest {
  userId: string;
  bankAccountId: string;
}

interface DeleteBankAccountUseCaseResponse {
  deletedBankAccountId: string;
}

export class DeleteBankAccountUseCase {
  constructor(private bankAccountRepository: BankAccountRepository) {}

  async execute({
    userId,
    bankAccountId,
  }: DeleteBankAccountUseCaseRequest): Promise<DeleteBankAccountUseCaseResponse> {
    const accountToDelete = await this.bankAccountRepository.getById(
      bankAccountId
    );

    if (accountToDelete === null) throw new ResourceNotFoundError();
    if (accountToDelete.userId !== userId) throw new NotAuthorizedError();

    await this.bankAccountRepository.delete(bankAccountId);

    return { deletedBankAccountId: bankAccountId };
  }
}
