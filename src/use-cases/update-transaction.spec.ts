import { InMemoryBankAccountRepository } from "@/repositories/in-memory/in-memory-bank-account-repository";
import { InMemoryTransactionCategoryRepository } from "@/repositories/in-memory/in-memory-transaction-category-repository";
import { InMemoryTransactionRepository } from "@/repositories/in-memory/in-memory-transaction-repository";
import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { describe, it, expect, beforeEach } from "vitest";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";
import { InvalidTransactionAmountError } from "./errors/invalid-transaction-amount-error";
import { UpdateTransactionUseCase } from "./update-transaction";

let usersRepository: InMemoryUsersRepository;
let bankAccountRepository: InMemoryBankAccountRepository;
let transactionRepository: InMemoryTransactionRepository;
let transactionCategoryRepository: InMemoryTransactionCategoryRepository;
let sut: UpdateTransactionUseCase;

describe("Update Transaction use-case", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    bankAccountRepository = new InMemoryBankAccountRepository();
    transactionRepository = new InMemoryTransactionRepository();
    transactionCategoryRepository = new InMemoryTransactionCategoryRepository();
    sut = new UpdateTransactionUseCase(
      usersRepository,
      bankAccountRepository,
      transactionRepository,
      transactionCategoryRepository
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
    const category2 = await transactionCategoryRepository.create({
      name: "Casa",
      userId: user1.id,
    });

    const user2 = await usersRepository.create({
      name: "Mateus",
      email: "mateus@email.com",
      pwdHash: "123",
    });
    const bankAccount2 = await bankAccountRepository.create({
      balance: 15000,
      currency: "BRL",
      name: "Account 2",
      userId: user2.id,
    });
    const category3 = await transactionCategoryRepository.create({
      name: "Pet",
      userId: user2.id,
    });

    return {
      user1,
      bankAccount1,
      category1,
      user2,
      bankAccount2,
      category2,
      category3,
    };
  }

  it("Should update a valid transaction", async () => {
    const {
      user1: user,
      bankAccount1: bankAccount,
      category1,
      category2,
    } = await createBaseObjects();

    const transaction = await transactionRepository.create({
      amount: 10,
      bankAccountId: bankAccount.id,
      categoryId: category1.id,
      currency: bankAccount.currency,
      date: new Date("2020-05-05"),
      description: "Transaction 1",
      type: "EXPENSE",
      userId: user.id,
    });

    const updatedTransaction = await sut.execute({
      transactionId: transaction.id,
      userId: user.id,
      updatedData: {
        amount: 20,
        categoryId: category2.id,
        date: new Date("2020-05-07"),
        description: "Transaction 2",
        type: "INCOME",
      },
    });

    expect(updatedTransaction).toEqual(
      expect.objectContaining({
        updatedTransaction: {
          amount: 20,
          bankAccountId: bankAccount.id,
          categoryId: category2.id,
          currency: bankAccount.currency,
          date: new Date("2020-05-07"),
          description: "Transaction 2",
          id: transaction.id,
          type: "INCOME",
          userId: user.id,
        },
      })
    );
  });

  it("Should update bank account balance after updating an expense value", async () => {
    const {
      user1: user,
      bankAccount1: bankAccount,
      category1,
    } = await createBaseObjects();

    const transaction = await transactionRepository.create({
      amount: 10,
      bankAccountId: bankAccount.id,
      categoryId: category1.id,
      currency: bankAccount.currency,
      date: new Date("2020-05-05"),
      description: "Transaction 1",
      type: "EXPENSE",
      userId: user.id,
    });

    await sut.execute({
      transactionId: transaction.id,
      userId: user.id,
      updatedData: {
        amount: 30,
      },
    });

    const updatedBankAccount = await bankAccountRepository.getById(
      bankAccount.id
    );

    expect(updatedBankAccount?.balance).toEqual(9980);
  });

  it("Should update bank account balance after updating an income value", async () => {
    const {
      user1: user,
      bankAccount1: bankAccount,
      category1,
    } = await createBaseObjects();

    const transaction = await transactionRepository.create({
      amount: 10,
      bankAccountId: bankAccount.id,
      categoryId: category1.id,
      currency: bankAccount.currency,
      date: new Date("2020-05-05"),
      description: "Transaction 1",
      type: "INCOME",
      userId: user.id,
    });

    await sut.execute({
      transactionId: transaction.id,
      userId: user.id,
      updatedData: {
        amount: 30,
      },
    });

    const updatedBankAccount = await bankAccountRepository.getById(
      bankAccount.id
    );

    expect(updatedBankAccount?.balance).toEqual(10020);
  });

  it("Should update bank account balance after updating an expense value and type", async () => {
    const {
      user1: user,
      bankAccount1: bankAccount,
      category1,
    } = await createBaseObjects();

    const transaction = await transactionRepository.create({
      amount: 20,
      bankAccountId: bankAccount.id,
      categoryId: category1.id,
      currency: bankAccount.currency,
      date: new Date("2020-05-05"),
      description: "Transaction 1",
      type: "EXPENSE",
      userId: user.id,
    });

    await sut.execute({
      transactionId: transaction.id,
      userId: user.id,
      updatedData: {
        amount: 30,
        type: "INCOME",
      },
    });

    const updatedBankAccount = await bankAccountRepository.getById(
      bankAccount.id
    );

    expect(updatedBankAccount?.balance).toEqual(10050);
  });

  it("Should update bank account balance after updating an income value and type", async () => {
    const {
      user1: user,
      bankAccount1: bankAccount,
      category1,
    } = await createBaseObjects();

    const transaction = await transactionRepository.create({
      amount: 20,
      bankAccountId: bankAccount.id,
      categoryId: category1.id,
      currency: bankAccount.currency,
      date: new Date("2020-05-05"),
      description: "Transaction 1",
      type: "INCOME",
      userId: user.id,
    });

    await sut.execute({
      transactionId: transaction.id,
      userId: user.id,
      updatedData: {
        amount: 30,
        type: "EXPENSE",
      },
    });

    const updatedBankAccount = await bankAccountRepository.getById(
      bankAccount.id
    );

    expect(updatedBankAccount?.balance).toEqual(9950);
  });

  it("Should throw when updating a transaction with another or invalid user id", async () => {
    const {
      user1,
      user2,
      bankAccount1: bankAccount,
      category1,
    } = await createBaseObjects();

    const transaction = await transactionRepository.create({
      amount: 20,
      bankAccountId: bankAccount.id,
      categoryId: category1.id,
      currency: bankAccount.currency,
      date: new Date("2020-05-05"),
      description: "Transaction 1",
      type: "INCOME",
      userId: user1.id,
    });

    await expect(() =>
      sut.execute({
        transactionId: transaction.id,
        updatedData: {
          amount: 10,
        },
        userId: "Invalid user",
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError);

    await expect(() =>
      sut.execute({
        transactionId: transaction.id,
        updatedData: {
          amount: 10,
        },
        userId: user2.id,
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it("Should throw when updating a transaction with another or invalid category id", async () => {
    const { user1, bankAccount1, category1, category3 } =
      await createBaseObjects();

    const transaction = await transactionRepository.create({
      amount: 20,
      bankAccountId: bankAccount1.id,
      categoryId: category1.id,
      currency: bankAccount1.currency,
      date: new Date("2020-05-05"),
      description: "Transaction 1",
      type: "INCOME",
      userId: user1.id,
    });

    await expect(() =>
      sut.execute({
        transactionId: transaction.id,
        updatedData: {
          categoryId: 10,
        },
        userId: user1.id,
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError);

    await expect(() =>
      sut.execute({
        transactionId: transaction.id,
        updatedData: {
          categoryId: category3.id,
        },
        userId: user1.id,
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it("Should throw when updating a transaction with an amount <= 0", async () => {
    const { user1, bankAccount1, category1 } = await createBaseObjects();

    const transaction = await transactionRepository.create({
      amount: 20,
      bankAccountId: bankAccount1.id,
      categoryId: category1.id,
      currency: bankAccount1.currency,
      date: new Date("2020-05-05"),
      description: "Transaction 1",
      type: "INCOME",
      userId: user1.id,
    });

    await expect(() =>
      sut.execute({
        transactionId: transaction.id,
        updatedData: {
          amount: 0,
        },
        userId: user1.id,
      })
    ).rejects.toBeInstanceOf(InvalidTransactionAmountError);

    await expect(() =>
      sut.execute({
        transactionId: transaction.id,
        updatedData: {
          amount: -10,
        },
        userId: user1.id,
      })
    ).rejects.toBeInstanceOf(InvalidTransactionAmountError);
  });
});
