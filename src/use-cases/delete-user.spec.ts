import { UsersRepository } from "@/repositories/user-repository";
import { describe, expect, it, beforeEach } from "vitest";
import { DeleteUserUseCase } from "./delete-user";
import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";

let usersRepository: UsersRepository;
let sut: DeleteUserUseCase;

describe("Delete users use-case", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    sut = new DeleteUserUseCase(usersRepository);
  });

  it("Should be able to delete a created user", async () => {
    const user = await usersRepository.create({
      email: "lucas@email.com",
      name: "Lucas",
      pwdHash: "123123",
    });

    const deletedUserId = await sut.execute({
      userId: user.id,
    });

    const foundUser = await usersRepository.findById(user.id);

    expect(deletedUserId).toEqual(
      expect.objectContaining({
        userId: user.id,
      })
    );
    expect(foundUser).toBeNull();
  });

  it("Should throw when deleting an inexistent user", async () => {
    await expect(() => sut.execute({ userId: "any" })).rejects.toBeInstanceOf(
      ResourceNotFoundError
    );
  });
});
