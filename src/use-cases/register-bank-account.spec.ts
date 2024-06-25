import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { describe, it, beforeEach, expect } from "vitest";
import { InMemoryBankAccountRepository } from "@/repositories/in-memory/in-memory-bank-account-repository";
import { RegisterBankAccountUseCase } from "./register-bank-account";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";

let usersRepository: InMemoryUsersRepository;
let bankAccountRepository: InMemoryBankAccountRepository;
let sut: RegisterBankAccountUseCase;

describe("Register bank account use-case", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    bankAccountRepository = new InMemoryBankAccountRepository();
    sut = new RegisterBankAccountUseCase(
      bankAccountRepository,
      usersRepository
    );
  });

  it("Should be able to register a new bank account", async () => {
    const { id: userId } = await usersRepository.create({
      name: "Lucas",
      email: "lucas@email.com",
      pwdHash: "asd",
    });

    const { bankAccount: registeredBankAccount } = await sut.execute({
      balance: 0,
      currency: "BRL",
      name: "Account 1",
      userId,
    });

    expect(registeredBankAccount).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        name: "Account 1",
        balance: 0,
        currency: "BRL",
        userId,
      })
    );
  });

  it("Should throw when creating account with invalid user", async () => {
    await expect(() =>
      sut.execute({
        balance: 0,
        currency: "BRL",
        name: "Account 1",
        userId: "invalid id",
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});
