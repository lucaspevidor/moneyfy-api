import { InMemoryBankAccountRepository } from "@/repositories/in-memory/in-memory-bank-account-repository";
import { InMemoryTransactionCategoryRepository } from "@/repositories/in-memory/in-memory-transaction-category-repository";
import { InMemoryTransactionRepository } from "@/repositories/in-memory/in-memory-transaction-repository";
import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { describe, it, expect, beforeEach } from "vitest";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";
import { DeleteTransactionUseCase } from "./delete-transaction";

let usersRepository: InMemoryUsersRepository;
let bankAccountRepository: InMemoryBankAccountRepository;
let transactionRepository: InMemoryTransactionRepository;
let transactionCategoryRepository: InMemoryTransactionCategoryRepository;
let sut: DeleteTransactionUseCase;

describe("Delete Transaction use-case", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    bankAccountRepository = new InMemoryBankAccountRepository();
    transactionRepository = new InMemoryTransactionRepository();
    transactionCategoryRepository = new InMemoryTransactionCategoryRepository();
    sut = new DeleteTransactionUseCase(
      usersRepository,
      bankAccountRepository,
      transactionRepository
    );
  });

  async function createBaseObjects() {
    const user1 = await usersRepository.create({
      name: "Lucas",
      email: "lucas@email.com",
      pwdHash: "123",
    });
    const bankAccount1 = await bankAccountRepository.create({
      balance: 10000,
      currency: "BRL",
      name: "Account 1",
      userId: user1.id,
    });
    const category1 = await transactionCategoryRepository.create({
      name: "Saúde",
      userId: user1.id,
    });

    const user2 = await usersRepository.create({
      name: "Mateus",
      email: "mateus@email.com",
      pwdHash: "123",
    });

    return {
      user1,
      bankAccount1,
      category1,
      user2,
    };
  }

  it("Should delete a transaction", async () => {
    const {
      user1: user,
      bankAccount1: bankAccount,
      category1: category,
    } = await createBaseObjects();

    const transaction = await transactionRepository.create({
      amount: 10,
      bankAccountId: bankAccount.id,
      categoryId: category.id,
      currency: bankAccount.currency,
      date: new Date(),
      description: "Transaction",
      type: "EXPENSE",
      userId: user.id,
    });

    const { deletedTransactionId } = await sut.execute({
      transactionId: transaction.id,
      userId: user.id,
    });

    expect(deletedTransactionId).toEqual(transaction.id);
  });

  it("Should update bank account balance after deleting an expense", async () => {
    const {
      user1: user,
      bankAccount1: bankAccount,
      category1: category,
    } = await createBaseObjects();

    const transaction = await transactionRepository.create({
      amount: 10,
      bankAccountId: bankAccount.id,
      categoryId: category.id,
      currency: bankAccount.currency,
      date: new Date(),
      description: "Transaction",
      type: "EXPENSE",
      userId: user.id,
    });

    await sut.execute({
      transactionId: transaction.id,
      userId: user.id,
    });

    const updatedBankAccount = await bankAccountRepository.getById(
      bankAccount.id
    );

    expect(updatedBankAccount?.balance).toEqual(10010);
  });

  it("Should update bank account balance after deleting an income", async () => {
    const {
      user1: user,
      bankAccount1: bankAccount,
      category1: category,
    } = await createBaseObjects();

    const transaction = await transactionRepository.create({
      amount: 10,
      bankAccountId: bankAccount.id,
      categoryId: category.id,
      currency: bankAccount.currency,
      date: new Date(),
      description: "Transaction",
      type: "INCOME",
      userId: user.id,
    });

    await sut.execute({
      transactionId: transaction.id,
      userId: user.id,
    });

    const updatedBankAccount = await bankAccountRepository.getById(
      bankAccount.id
    );

    expect(updatedBankAccount?.balance).toEqual(9990);
  });

  it("Should throw when deleting a non-existent transaction", async () => {
    const { user1: user } = await createBaseObjects();

    await expect(() =>
      sut.execute({
        transactionId: "Non-existent transaction id",
        userId: user.id,
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it("Should throw when deleting a transaction of another or invalid user", async () => {
    const {
      user1,
      user2,
      bankAccount1: bankAccount,
      category1: category,
    } = await createBaseObjects();

    const transaction = await transactionRepository.create({
      amount: 10,
      bankAccountId: bankAccount.id,
      categoryId: category.id,
      currency: bankAccount.currency,
      date: new Date(),
      description: "Transaction",
      type: "INCOME",
      userId: user1.id,
    });

    await expect(() =>
      sut.execute({
        transactionId: transaction.id,
        userId: user2.id,
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError);

    await expect(() =>
      sut.execute({
        transactionId: transaction.id,
        userId: "Non-existent id",
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});
