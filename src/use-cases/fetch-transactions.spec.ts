import { InMemoryBankAccountRepository } from "@/repositories/in-memory/in-memory-bank-account-repository";
import { InMemoryTransactionCategoryRepository } from "@/repositories/in-memory/in-memory-transaction-category-repository";
import { InMemoryTransactionRepository } from "@/repositories/in-memory/in-memory-transaction-repository";
import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { TransactionFilterType } from "@/repositories/transaction-repository";
import { beforeEach, describe, expect, it } from "vitest";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";
import { FetchTransactionsUseCase } from "./fetch-transactions";

let usersRepository: InMemoryUsersRepository;
let bankAccountRepository: InMemoryBankAccountRepository;
let transactionRepository: InMemoryTransactionRepository;
let transactionCategoryRepository: InMemoryTransactionCategoryRepository;
let sut: FetchTransactionsUseCase;

describe("Fetch Transactions use-case", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    bankAccountRepository = new InMemoryBankAccountRepository();
    transactionRepository = new InMemoryTransactionRepository();
    transactionCategoryRepository = new InMemoryTransactionCategoryRepository();
    sut = new FetchTransactionsUseCase(usersRepository, transactionRepository);
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

    return {
      user1,
      bankAccount1,
      category1,
    };
  }

  it("Should fetch all paginated user's transactions", async () => {
    const {
      user1: user,
      bankAccount1: bankAccount,
      category1: category,
    } = await createBaseObjects();

    for (let i = 0; i < 25; i++) {
      await transactionRepository.create({
        amount: 10,
        bankAccountId: bankAccount.id,
        categoryId: category.id,
        currency: bankAccount.currency,
        date: new Date(),
        description: `Transaction ${i}`,
        type: "EXPENSE",
        userId: user.id,
      });
    }

    const { transactions: transactionList1 } = await sut.execute({
      page: 1,
      userId: user.id,
      transactionType: TransactionFilterType.INCOMES_AND_EXPENSES,
    });
    const { transactions: transactionList2 } = await sut.execute({
      page: 2,
      userId: user.id,
      transactionType: TransactionFilterType.INCOMES_AND_EXPENSES,
    });
    const { transactions: transactionList3 } = await sut.execute({
      page: 3,
      userId: user.id,
      transactionType: TransactionFilterType.INCOMES_AND_EXPENSES,
    });

    expect(transactionList1).toHaveLength(20);
    expect(transactionList2).toHaveLength(5);
    expect(transactionList3).toHaveLength(0);

    for (let i = 0; i < 20; i++) {
      expect(transactionList1[i]).toEqual(
        expect.objectContaining({
          description: `Transaction ${i}`,
        })
      );
    }
  });

  it("Should fetch all user's income and expense filtered transactions", async () => {
    const {
      user1: user,
      bankAccount1: bankAccount,
      category1: category,
    } = await createBaseObjects();

    for (let i = 0; i < 24; i++) {
      await transactionRepository.create({
        amount: 10,
        bankAccountId: bankAccount.id,
        categoryId: category.id,
        currency: bankAccount.currency,
        date: new Date(),
        description: `Transaction ${i}`,
        type: i % 2 == 0 ? "EXPENSE" : "INCOME",
        userId: user.id,
      });
    }

    const { transactions: incomes } = await sut.execute({
      page: 1,
      userId: user.id,
      transactionType: TransactionFilterType.INCOMES,
    });
    const { transactions: expenses } = await sut.execute({
      page: 1,
      userId: user.id,
      transactionType: TransactionFilterType.EXPENSES,
    });

    expect(incomes).toHaveLength(12);
    expect(expenses).toHaveLength(12);

    for (let i = 0; i < 12; i++) {
      expect(incomes[i]).toEqual(
        expect.objectContaining({
          type: `INCOME`,
        })
      );

      expect(expenses[i]).toEqual(
        expect.objectContaining({
          type: "EXPENSE",
        })
      );
    }
  });

  it("Should throw when fetching transactions from an invalid user", async () => {
    await expect(() =>
      sut.execute({
        page: 1,
        userId: "Invalid user",
        transactionType: TransactionFilterType.INCOMES_AND_EXPENSES,
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});
