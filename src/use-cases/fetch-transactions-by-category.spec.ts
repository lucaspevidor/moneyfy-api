import { InMemoryBankAccountRepository } from "@/repositories/in-memory/in-memory-bank-account-repository";
import { InMemoryTransactionCategoryRepository } from "@/repositories/in-memory/in-memory-transaction-category-repository";
import { InMemoryTransactionRepository } from "@/repositories/in-memory/in-memory-transaction-repository";
import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { describe, it, expect, beforeEach } from "vitest";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";
import { FetchTransactionsByCategoryUseCase } from "./fetch-transactions-by-category";
import { TransactionFilterType } from "@/repositories/transaction-repository";

let usersRepository: InMemoryUsersRepository;
let bankAccountRepository: InMemoryBankAccountRepository;
let transactionRepository: InMemoryTransactionRepository;
let transactionCategoryRepository: InMemoryTransactionCategoryRepository;
let sut: FetchTransactionsByCategoryUseCase;

describe("Fetch Transactions by category use-case", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    bankAccountRepository = new InMemoryBankAccountRepository();
    transactionRepository = new InMemoryTransactionRepository();
    transactionCategoryRepository = new InMemoryTransactionCategoryRepository();
    sut = new FetchTransactionsByCategoryUseCase(
      usersRepository,
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
    const bankAccount2 = await bankAccountRepository.create({
      balance: 10000,
      currency: "BRL",
      name: "Account 2",
      userId: user1.id,
    });
    const category2 = await transactionCategoryRepository.create({
      name: "Pet",
      userId: user1.id,
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

  it("Should fetch all paginated user's transactions separated by categories", async () => {
    const {
      user1: user,
      bankAccount1: bankAccount,
      category1,
      category2,
    } = await createBaseObjects();

    for (let i = 0; i < 60; i++) {
      await transactionRepository.create({
        amount: 10 * i,
        bankAccountId: bankAccount.id,
        categoryId: i % 2 === 0 ? category1.id : category2.id,
        currency: bankAccount.currency,
        date: new Date(),
        description: `Transaction ${i}`,
        type: i % 2 === 0 ? "EXPENSE" : "INCOME",
        userId: user.id,
      });
    }

    const { transactions: transactionList1 } = await sut.execute({
      categoryId: category1.id,
      page: 1,
      transactionType: TransactionFilterType.INCOMES_AND_EXPENSES,
      userId: user.id,
    });
    const { transactions: transactionList2 } = await sut.execute({
      categoryId: category1.id,
      page: 2,
      transactionType: TransactionFilterType.INCOMES_AND_EXPENSES,
      userId: user.id,
    });

    const { transactions: transactionList3 } = await sut.execute({
      categoryId: category2.id,
      page: 1,
      transactionType: TransactionFilterType.INCOMES_AND_EXPENSES,
      userId: user.id,
    });
    const { transactions: transactionList4 } = await sut.execute({
      categoryId: category2.id,
      page: 2,
      transactionType: TransactionFilterType.INCOMES_AND_EXPENSES,
      userId: user.id,
    });

    expect(transactionList1).toHaveLength(20);
    expect(transactionList2).toHaveLength(10);

    expect(transactionList3).toHaveLength(20);
    expect(transactionList4).toHaveLength(10);

    for (let i = 0; i < 20; i++) {
      expect(transactionList1[i]).toEqual(
        expect.objectContaining({
          categoryId: category1.id,
        })
      );
    }

    for (let i = 0; i < 20; i++) {
      expect(transactionList3[i]).toEqual(
        expect.objectContaining({
          categoryId: category2.id,
        })
      );
    }
  });

  it("Should only fetch expenses when specified", async () => {
    const { user1, bankAccount1, category1 } = await createBaseObjects();

    for (let i = 0; i < 16; i++) {
      await transactionRepository.create({
        amount: 10,
        bankAccountId: bankAccount1.id,
        categoryId: category1.id,
        currency: bankAccount1.currency,
        date: new Date(),
        description: `Transaction ${i}`,
        type: i % 2 === 0 ? "EXPENSE" : "INCOME",
        userId: user1.id,
      });
    }

    const { transactions } = await sut.execute({
      categoryId: category1.id,
      page: 1,
      transactionType: TransactionFilterType.EXPENSES,
      userId: user1.id,
    });

    expect(transactions).toHaveLength(8);
    transactions.forEach((t) =>
      expect(t).toEqual(
        expect.objectContaining({
          type: "EXPENSE",
        })
      )
    );
  });

  it("Should only fetch incomes when specified", async () => {
    const { user1, bankAccount1, category1 } = await createBaseObjects();

    for (let i = 0; i < 16; i++) {
      await transactionRepository.create({
        amount: 10,
        bankAccountId: bankAccount1.id,
        categoryId: category1.id,
        currency: bankAccount1.currency,
        date: new Date(),
        description: `Transaction ${i}`,
        type: i % 2 === 0 ? "EXPENSE" : "INCOME",
        userId: user1.id,
      });
    }

    const { transactions } = await sut.execute({
      categoryId: category1.id,
      page: 1,
      transactionType: TransactionFilterType.INCOMES,
      userId: user1.id,
    });

    expect(transactions).toHaveLength(8);
    transactions.forEach((t) =>
      expect(t).toEqual(
        expect.objectContaining({
          type: "INCOME",
        })
      )
    );
  });

  it("Should not fetch other user's transactions", async () => {
    const { bankAccount1, category1, user1, bankAccount2, category2, user2 } =
      await createBaseObjects();

    await transactionRepository.create({
      amount: 10,
      bankAccountId: bankAccount1.id,
      categoryId: category1.id,
      currency: bankAccount1.currency,
      date: new Date(),
      description: "T1",
      type: "EXPENSE",
      userId: user1.id,
    });
    await transactionRepository.create({
      amount: 10,
      bankAccountId: bankAccount2.id,
      categoryId: category2.id,
      currency: bankAccount2.currency,
      date: new Date(),
      description: "T1",
      type: "EXPENSE",
      userId: user2.id,
    });

    const { transactions } = await sut.execute({
      categoryId: category1.id,
      page: 1,
      transactionType: TransactionFilterType.INCOMES_AND_EXPENSES,
      userId: user1.id,
    });

    expect(transactions).toHaveLength(1);
    expect(transactions[0]).toEqual(
      expect.objectContaining({
        userId: user1.id,
      })
    );
  });

  it("Should throw when fetching transactions from an invalid user", async () => {
    const { bankAccount1, category1, user1 } = await createBaseObjects();

    await transactionRepository.create({
      amount: 10,
      bankAccountId: bankAccount1.id,
      categoryId: category1.id,
      currency: bankAccount1.currency,
      date: new Date(),
      description: `Transaction 1`,
      type: "EXPENSE",
      userId: user1.id,
    });

    await expect(() =>
      sut.execute({
        categoryId: category1.id,
        page: 1,
        transactionType: TransactionFilterType.INCOMES_AND_EXPENSES,
        userId: "Non existent id",
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});
