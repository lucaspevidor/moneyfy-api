import { InMemoryBankAccountRepository } from "@/repositories/in-memory/in-memory-bank-account-repository";
import { InMemoryTransactionCategoryRepository } from "@/repositories/in-memory/in-memory-transaction-category-repository";
import { InMemoryTransactionRepository } from "@/repositories/in-memory/in-memory-transaction-repository";
import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { describe, it, expect, beforeEach } from "vitest";
import { RegisterTransactionUseCase } from "./register-transaction";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";
import { InvalidCurrencyError } from "./errors/invalid-currency-error";
import { InvalidTransactionAmountError } from "./errors/invalid-transaction-amount-error";

let usersRepository: InMemoryUsersRepository;
let bankAccountRepository: InMemoryBankAccountRepository;
let transactionRepository: InMemoryTransactionRepository;
let transactionCategoryRepository: InMemoryTransactionCategoryRepository;
let sut: RegisterTransactionUseCase;

describe("Register Transaction use-case", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    bankAccountRepository = new InMemoryBankAccountRepository();
    transactionRepository = new InMemoryTransactionRepository();
    transactionCategoryRepository = new InMemoryTransactionCategoryRepository();
    sut = new RegisterTransactionUseCase(
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
    const category2 = await transactionCategoryRepository.create({
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
    };
  }

  it("Should create a new valid transaction", async () => {
    const {
      user1: user,
      bankAccount1: bankAccount,
      category1,
    } = await createBaseObjects();

    const transaction = await sut.execute({
      transaction: {
        amount: 10,
        bankAccountId: bankAccount.id,
        categoryId: category1.id,
        currency: bankAccount.currency,
        date: new Date(),
        description: "Transaction 1",
        type: "EXPENSE",
        userId: user.id,
      },
    });

    expect(transaction).toEqual(
      expect.objectContaining({
        createdTransaction: {
          amount: 10,
          bankAccountId: bankAccount.id,
          categoryId: category1.id,
          currency: bankAccount.currency,
          date: expect.any(Date),
          description: "Transaction 1",
          id: expect.any(String),
          type: "EXPENSE",
          userId: user.id,
        },
      })
    );
  });

  it("Should update bank account balance after creating an expense", async () => {
    const {
      user1: user,
      bankAccount1: bankAccount,
      category1,
    } = await createBaseObjects();

    await sut.execute({
      transaction: {
        amount: 10,
        bankAccountId: bankAccount.id,
        categoryId: category1.id,
        currency: bankAccount.currency,
        date: new Date(),
        description: "Transaction 1",
        type: "EXPENSE",
        userId: user.id,
      },
    });

    const updatedBankAccount = await bankAccountRepository.getById(
      bankAccount.id
    );

    expect(updatedBankAccount?.balance).toEqual(9990);
  });

  it("Should update bank account balance after creating an income ", async () => {
    const {
      user1: user,
      bankAccount1: bankAccount,
      category1,
    } = await createBaseObjects();

    await sut.execute({
      transaction: {
        amount: 10,
        bankAccountId: bankAccount.id,
        categoryId: category1.id,
        currency: bankAccount.currency,
        date: new Date(),
        description: "Transaction 1",
        type: "INCOME",
        userId: user.id,
      },
    });

    const updatedBankAccount = await bankAccountRepository.getById(
      bankAccount.id
    );

    expect(updatedBankAccount?.balance).toEqual(10010);
  });

  it("Should throw when creating a transaction with invalid bank account", async () => {
    const { user1, bankAccount1, category1 } = await createBaseObjects();

    await expect(() =>
      sut.execute({
        transaction: {
          amount: 10,
          bankAccountId: "Invalid id",
          categoryId: category1.id,
          currency: bankAccount1.currency,
          date: new Date(),
          description: "Transaction",
          type: "EXPENSE",
          userId: user1.id,
        },
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it("Should throw when creating a transaction with invalid user account", async () => {
    const { bankAccount1, category1 } = await createBaseObjects();

    await expect(() =>
      sut.execute({
        transaction: {
          amount: 10,
          bankAccountId: bankAccount1.id,
          categoryId: category1.id,
          currency: bankAccount1.currency,
          date: new Date(),
          description: "Transaction",
          type: "EXPENSE",
          userId: "Invalid id",
        },
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it("Should throw when creating a transaction with invalid category id", async () => {
    const { user1, bankAccount1 } = await createBaseObjects();

    await expect(() =>
      sut.execute({
        transaction: {
          amount: 10,
          bankAccountId: bankAccount1.id,
          categoryId: 5,
          currency: bankAccount1.currency,
          date: new Date(),
          description: "Transaction",
          type: "EXPENSE",
          userId: user1.id,
        },
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it("Should throw when creating a transaction with another user bank account", async () => {
    const { user1, bankAccount1, bankAccount2, category1 } =
      await createBaseObjects();

    await expect(() =>
      sut.execute({
        transaction: {
          amount: 10,
          bankAccountId: bankAccount2.id,
          categoryId: category1.id,
          currency: bankAccount1.currency,
          date: new Date(),
          description: "Transaction",
          type: "EXPENSE",
          userId: user1.id,
        },
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it("Should throw when creating a transaction with another user category id", async () => {
    const { user1, bankAccount1, category2 } = await createBaseObjects();

    await expect(() =>
      sut.execute({
        transaction: {
          amount: 10,
          bankAccountId: bankAccount1.id,
          categoryId: category2.id,
          currency: bankAccount1.currency,
          date: new Date(),
          description: "Transaction",
          type: "EXPENSE",
          userId: user1.id,
        },
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it("Should throw when creating a transaction with invalid currency", async () => {
    const { user1, bankAccount1, category1 } = await createBaseObjects();

    await expect(() =>
      sut.execute({
        transaction: {
          amount: 10,
          bankAccountId: bankAccount1.id,
          categoryId: category1.id,
          currency: "",
          date: new Date(),
          description: "Transaction",
          type: "EXPENSE",
          userId: user1.id,
        },
      })
    ).rejects.toBeInstanceOf(InvalidCurrencyError);
  });

  it("Should throw when creating a transaction with currency different from the bank account", async () => {
    const { user1, bankAccount1, category1 } = await createBaseObjects();

    await expect(() =>
      sut.execute({
        transaction: {
          amount: 10,
          bankAccountId: bankAccount1.id,
          categoryId: category1.id,
          currency: "USD",
          date: new Date(),
          description: "Transaction",
          type: "EXPENSE",
          userId: user1.id,
        },
      })
    ).rejects.toBeInstanceOf(InvalidCurrencyError);
  });

  it("Should throw when creating a transaction with amount <= 0", async () => {
    const { user1, bankAccount1, category1 } = await createBaseObjects();

    await expect(() =>
      sut.execute({
        transaction: {
          amount: 0,
          bankAccountId: bankAccount1.id,
          categoryId: category1.id,
          currency: bankAccount1.currency,
          date: new Date(),
          description: "Transaction",
          type: "EXPENSE",
          userId: user1.id,
        },
      })
    ).rejects.toBeInstanceOf(InvalidTransactionAmountError);

    await expect(() =>
      sut.execute({
        transaction: {
          amount: -10,
          bankAccountId: bankAccount1.id,
          categoryId: category1.id,
          currency: bankAccount1.currency,
          date: new Date(),
          description: "Transaction",
          type: "EXPENSE",
          userId: user1.id,
        },
      })
    ).rejects.toBeInstanceOf(InvalidTransactionAmountError);
  });
});
