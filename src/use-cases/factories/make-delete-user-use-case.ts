import { UsersRepository } from "@/repositories/user-repository";
import { DeleteUserUseCase } from "../delete-user";
import { PrismaUsersRepository } from "@/repositories/prisma/prisma-users-repository";

export function MakeDeleteUserUseCase(): DeleteUserUseCase {
  const usersRepository: UsersRepository = new PrismaUsersRepository();

  return new DeleteUserUseCase(usersRepository);
}
