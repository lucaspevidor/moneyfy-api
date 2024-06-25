import { InMemoryTransactionCategoryRepository } from "@/repositories/in-memory/in-memory-transaction-category-repository";
import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { describe, it, beforeEach, expect } from "vitest";
import { FetchTransactionCategoriesUseCase } from "./fetch-transaction-categories";

let usersRepository: InMemoryUsersRepository;
let transactionCategoryRepository: InMemoryTransactionCategoryRepository;
let sut: FetchTransactionCategoriesUseCase;

describe("Fetch transaction categories use-case", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    transactionCategoryRepository = new InMemoryTransactionCategoryRepository();
    sut = new FetchTransactionCategoriesUseCase(transactionCategoryRepository);
  });

  it("Should be able to fetch all user's transaction categories", async () => {
    const { id: userId } = await usersRepository.create({
      name: "Lucas",
      email: "lucas@email.com",
      pwdHash: "asd",
    });

    for (let i = 0; i < 5; i++) {
      await transactionCategoryRepository.create({
        name: `Category ${i}`,
        userId,
      });
    }

    const { transactionCategories } = await sut.execute({
      userId,
    });

    expect(transactionCategories.length).toEqual(5);
    expect(transactionCategories).toContainEqual(
      expect.objectContaining({
        name: `Category 4`,
        userId,
      })
    );
  });

  it("Should not fetch other user transaction categories", async () => {
    const { id: userId } = await usersRepository.create({
      name: "Lucas",
      email: "lucas@email.com",
      pwdHash: "asd",
    });

    await transactionCategoryRepository.create({
      name: `Category 1`,
      userId,
    });

    await transactionCategoryRepository.create({
      name: `Category 123`,
      userId: "Another user id",
    });

    const { transactionCategories } = await sut.execute({
      userId,
    });

    expect(transactionCategories.length).toEqual(1);
    expect(transactionCategories).not.toContainEqual(
      expect.objectContaining({
        userId: "Another user id",
      })
    );
  });

  it("Should return empty array when no transaction categories are found", async () => {
    const { transactionCategories } = await sut.execute({
      userId: "any id",
    });

    expect(transactionCategories).toHaveLength(0);
  });
});
