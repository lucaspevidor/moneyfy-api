import { InMemoryTransactionRepository } from "@/repositories/in-memory/in-memory-transaction-repository";
import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { TransactionRepository } from "@/repositories/transaction-repository";
import { UsersRepository } from "@/repositories/user-repository";
import { beforeEach, describe, expect, it } from "vitest";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";
import { GetTransactionUseCase } from "./get-transaction";

let usersRepository: UsersRepository;
let transactionRepository: TransactionRepository;
let sut: GetTransactionUseCase;

describe("Get transaction use-case", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    transactionRepository = new InMemoryTransactionRepository();
    sut = new GetTransactionUseCase(usersRepository, transactionRepository);
  });

  it("Should be able to get a transaction from a valid user", async () => {
    const userId = "Some user id";

    const transactionData = {
      amount: 50,
      bankAccountId: "bank id",
      categoryId: 1,
      currency: "BRL",
      date: new Date(),
      description: "Transaction 1",
      type: "EXPENSE",
      userId: userId,
    };

    const transaction = await transactionRepository.create({
      ...transactionData,
      type: "EXPENSE",
    });

    const { transaction: retrievedTransaction } = await sut.execute({
      transactionId: transaction.id,
      userId,
    });

    expect(retrievedTransaction).toEqual({
      id: transaction.id,
      ...transactionData,
    });
  });

  it("Should throw when getting an invalid transaction", async () => {
    await expect(() =>
      sut.execute({
        transactionId: "Invalid id",
        userId: "any user id",
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it("Should throw when getting a transaction from another user", async () => {
    const userId = "Some user id";

    const transactionData = {
      amount: 50,
      bankAccountId: "bank id",
      categoryId: 1,
      currency: "BRL",
      date: new Date(),
      description: "Transaction 1",
      type: "EXPENSE",
      userId: userId,
    };

    const transaction = await transactionRepository.create({
      ...transactionData,
      type: "EXPENSE",
    });

    await expect(() =>
      sut.execute({
        transactionId: transaction.id,
        userId: "Another user Id",
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});
