import { TransactionCategoryRepository } from "@/repositories/transaction-category-repository";
import { UsersRepository } from "@/repositories/user-repository";
import { TransactionCategory } from "@prisma/client";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";

interface RegisterTransactionCategoryUseCaseRequest {
  userId: string;
  name: string;
}

interface RegisterTransactionCategoryUseCaseResponse {
  transactionCategory: TransactionCategory;
}

export class RegisterTransactionCategoryUseCase {
  constructor(
    private transactionCategoryRepository: TransactionCategoryRepository,
    private userRepository: UsersRepository
  ) {}

  async execute(
    data: RegisterTransactionCategoryUseCaseRequest
  ): Promise<RegisterTransactionCategoryUseCaseResponse> {
    const userFound = await this.userRepository.findById(data.userId);

    if (!userFound) throw new ResourceNotFoundError();

    const createdTransactionCategory =
      await this.transactionCategoryRepository.create({
        name: data.name,
        userId: data.userId,
      });

    return { transactionCategory: createdTransactionCategory };
  }
}
