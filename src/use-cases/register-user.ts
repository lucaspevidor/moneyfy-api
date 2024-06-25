import { User } from "@prisma/client";
import { hash } from "bcryptjs";
import { UsersRepository } from "@/repositories/user-repository";
import { UserAlreadyExistsError } from "@/use-cases/errors/user-already-exists-error";

interface RegisterUserUseCaseRequest {
  name: string;
  email: string;
  password: string;
}

interface RegisterUserUseCaseResponse {
  user: User;
}

export class RegisterUserUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    name,
    email,
    password,
  }: RegisterUserUseCaseRequest): Promise<RegisterUserUseCaseResponse> {
    const emailAlreadyUsed = await this.usersRepository.findByEmail(email);

    if (emailAlreadyUsed) {
      throw new UserAlreadyExistsError();
    }

    const pwdHash = await hash(password, 6);

    const user = await this.usersRepository.create({
      name,
      email,
      pwdHash,
    });

    return { user };
  }
}
