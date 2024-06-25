import { UsersRepository } from "@/repositories/user-repository";
import { describe, expect, it, beforeEach } from "vitest";
import { UpdateUserUseCase } from "./update-user";
import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { compare, hash } from "bcryptjs";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";

let usersRepository: UsersRepository;
let sut: UpdateUserUseCase;

describe("Update user use-case", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    sut = new UpdateUserUseCase(usersRepository);
  });

  it("Should update user info in DB", async () => {
    const user = {
      email: "lucas@email.com",
      pwdHash: await hash("123123", 6),
      name: "Lucas",
    };

    const createdUser = await usersRepository.create(user);

    await sut.execute({
      id: createdUser.id,
      email: "mateus@email.com",
      password: "123",
      name: "Mateus",
    });

    const updatedUser = await usersRepository.findByEmail("mateus@email.com");

    expect(updatedUser).toEqual(
      expect.objectContaining({
        id: createdUser.id,
        email: "mateus@email.com",
        name: "Mateus",
        pwdHash: expect.any(String),
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      })
    );
  });

  it("Should hash the new password", async () => {
    const user = {
      email: "lucas@email.com",
      pwdHash: await hash("123123", 6),
      name: "Lucas",
    };

    const createdUser = await usersRepository.create(user);

    const { user: updatedUser } = await sut.execute({
      id: createdUser.id,
      email: "mateus@email.com",
      password: "123",
      name: "Mateus",
    });

    const passwordIsCorrectlyHashed = await compare("123", updatedUser.pwdHash);

    expect(passwordIsCorrectlyHashed).toBeTruthy;
  });

  it("Should throw when updating non existent user", async () => {
    expect(() =>
      sut.execute({
        id: "invalid",
        name: "any",
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it("Should allow partially updating user", async () => {
    const user = {
      email: "lucas@email.com",
      pwdHash: await hash("123123", 6),
      name: "Lucas",
    };

    const createdUser = await usersRepository.create(user);

    const { user: updatedUser } = await sut.execute({
      id: createdUser.id,
      email: "mateus@email.com",
    });

    expect(updatedUser).toEqual(
      expect.objectContaining({
        id: createdUser.id,
        name: createdUser.name,
        email: "mateus@email.com",
        pwdHash: user.pwdHash,
      })
    );
  });
});
