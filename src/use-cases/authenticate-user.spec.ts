import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { describe, expect, it, beforeEach } from "vitest";
import { AuthenticateUserUseCase } from "./authenticate-user";
import { hash } from "bcryptjs";
import { InvalidCredentialError } from "./errors/invalid-credentials-error";

let usersRepository: InMemoryUsersRepository;
let sut: AuthenticateUserUseCase;

describe("Authenticate users use-case", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    sut = new AuthenticateUserUseCase(usersRepository);
  });

  it("Should authenticate an user", async () => {
    usersRepository.create({
      email: "lucas@email.com",
      name: "Lucas",
      pwdHash: await hash("123123", 6),
    });

    const { user } = await sut.execute({
      email: "lucas@email.com",
      password: "123123",
    });

    expect(user).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        email: "lucas@email.com",
        name: "Lucas",
        pwdHash: expect.any(String),
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      })
    );
  });

  it("Should throw when user doesnt exist", async () => {
    await expect(() =>
      sut.execute({
        email: "invalid@email.com",
        password: "123123",
      })
    ).rejects.toBeInstanceOf(InvalidCredentialError);
  });

  it("Should throw when an invalid password is provided", async () => {
    usersRepository.create({
      email: "lucas@email.com",
      name: "Lucas",
      pwdHash: await hash("123123", 6),
    });

    await sut.execute({
      email: "lucas@email.com",
      password: "123123",
    });

    await expect(() =>
      sut.execute({
        email: "invalid@email.com",
        password: "321321",
      })
    ).rejects.toBeInstanceOf(InvalidCredentialError);
  });
});
