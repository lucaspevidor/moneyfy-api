import { PrismaUsersRepository } from "@/repositories/prisma/prisma-users-repository";
import { UsersRepository } from "@/repositories/user-repository";
import { GetUserUseCase } from "../get-user";

export function MakeGetUserUseCase(): GetUserUseCase {
  const usersRepository: UsersRepository = new PrismaUsersRepository();

  return new GetUserUseCase(usersRepository);
}
