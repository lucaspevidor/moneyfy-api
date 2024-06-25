import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { describe, it, beforeEach, expect } from "vitest";
import { RegisterUserUseCase } from "./register-user";
import { compare } from "bcryptjs";
import { UserAlreadyExistsError } from "./errors/user-already-exists-error";

let usersRepository: InMemoryUsersRepository;
let sut: RegisterUserUseCase;

describe("Register user use-case", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    sut = new RegisterUserUseCase(usersRepository);
  });

  it("Should be able to register a new user", async () => {
    const userToRegister = {
      name: "Lucas",
      email: "lucas@email.com",
      password: "123123123",
    };
    const { user: registeredUser } = await sut.execute(userToRegister);

    expect(registeredUser).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        name: userToRegister.name,
        email: userToRegister.email,
        pwdHash: expect.any(String),
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      })
    );
  });

  it("Should hash the user password on registration", async () => {
    const userToRegister = {
      name: "Lucas",
      email: "lucas@email.com",
      password: "123123123",
    };
    const { user: registeredUser } = await sut.execute(userToRegister);

    const hashMatches = await compare(
      userToRegister.password,
      registeredUser.pwdHash
    );

    expect(hashMatches).toBeTruthy();
  });

  it("Shouldn't allow two users to register with the same e-mail", async () => {
    const userToRegister = {
      name: "Lucas",
      email: "lucas@email.com",
      password: "123123123",
    };
    await sut.execute(userToRegister);

    await expect(() => {
      return sut.execute(userToRegister);
    }).rejects.toBeInstanceOf(UserAlreadyExistsError);
  });
});
