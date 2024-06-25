import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { describe, it, beforeEach, expect } from "vitest";
import { InMemoryBankAccountRepository } from "@/repositories/in-memory/in-memory-bank-account-repository";
import { FetchBankAccountsUseCase } from "./fetch-bank-accounts";

let usersRepository: InMemoryUsersRepository;
let bankAccountRepository: InMemoryBankAccountRepository;
let sut: FetchBankAccountsUseCase;

describe("Fetch bank accounts use-case", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    bankAccountRepository = new InMemoryBankAccountRepository();
    sut = new FetchBankAccountsUseCase(bankAccountRepository);
  });

  it("Should be able to fetch all user accounts", async () => {
    const { id: userId } = await usersRepository.create({
      name: "Lucas",
      email: "lucas@email.com",
      pwdHash: "asd",
    });

    for (let i = 0; i < 5; i++) {
      await bankAccountRepository.create({
        balance: 0,
        currency: "BRL",
        name: `Account ${i}`,
        userId,
      });
    }

    const { bankAccounts } = await sut.execute({
      userId,
    });

    expect(bankAccounts.length).toEqual(5);
    expect(bankAccounts).toContainEqual(
      expect.objectContaining({
        balance: 0,
        currency: "BRL",
        name: `Account 4`,
        userId,
      })
    );
  });

  it("Should not fetch other user accounts", async () => {
    const { id: userId } = await usersRepository.create({
      name: "Lucas",
      email: "lucas@email.com",
      pwdHash: "asd",
    });

    await bankAccountRepository.create({
      balance: 0,
      currency: "BRL",
      name: `Account 1`,
      userId,
    });

    await bankAccountRepository.create({
      balance: 15000,
      currency: "BRL",
      name: `Account 123`,
      userId: "Another user id",
    });

    const { bankAccounts } = await sut.execute({
      userId,
    });

    expect(bankAccounts.length).toEqual(1);
    expect(bankAccounts).not.toContainEqual(
      expect.objectContaining({
        userId: "Another user id",
      })
    );
  });

  it("Should return empty array when no accounts are found", async () => {
    const { bankAccounts } = await sut.execute({
      userId: "any id",
    });

    expect(bankAccounts).toHaveLength(0);
  });
});
