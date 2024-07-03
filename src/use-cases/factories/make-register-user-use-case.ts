import { UsersRepository } from "@/repositories/user-repository";
import { RegisterUserUseCase } from "../register-user";
import { PrismaUsersRepository } from "@/repositories/prisma/prisma-users-repository";

export function MakeRegisterUserUseCase(): RegisterUserUseCase {
  const usersRepository: UsersRepository = new PrismaUsersRepository();

  return new RegisterUserUseCase(usersRepository);
}
