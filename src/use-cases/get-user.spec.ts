import { UsersRepository } from "@/repositories/user-repository";
import { describe, expect, it, beforeAll } from "vitest";
import { GetUserUseCase } from "./get-user";
import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";

let usersRepository: UsersRepository;
let sut: GetUserUseCase;

describe("Get user use-case", () => {
  beforeAll(() => {
    usersRepository = new InMemoryUsersRepository();
    sut = new GetUserUseCase(usersRepository);
  });

  it("Should be able to get a user by id", async () => {
    const createdUser = await usersRepository.create({
      name: "Lucas",
      email: "lucas@email.com",
      pwdHash: "123",
    });

    const foundUser = await sut.execute({
      userId: createdUser.id,
    });

    console.log(foundUser);

    expect(foundUser.user).toEqual(
      expect.objectContaining({
        id: createdUser.id,
        name: "Lucas",
      })
    );
  });

  it("Should throw when getting an invalid user", async () => {
    await expect(() => sut.execute({ userId: "123" })).rejects.toBeInstanceOf(
      ResourceNotFoundError
    );
  });
});
