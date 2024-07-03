import { PrismaUsersRepository } from "@/repositories/prisma/prisma-users-repository";
import { UsersRepository } from "@/repositories/user-repository";
import { AuthenticateUserUseCase } from "../authenticate-user";

export function MakeAuthenticateUserUseCase(): AuthenticateUserUseCase {
  const usersRepository: UsersRepository = new PrismaUsersRepository();

  return new AuthenticateUserUseCase(usersRepository);
}
