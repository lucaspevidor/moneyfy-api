import { UsersRepository } from "@/repositories/user-repository";
import { User } from "@prisma/client";
import { InvalidCredentialError } from "./errors/invalid-credentials-error";
import { compare } from "bcryptjs";

interface AuthenticateUserUseCaseRequest {
  email: string;
  password: string;
}

interface AuthenticateUserUseCaseResponse {
  user: User;
}

export class AuthenticateUserUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    email,
    password,
  }: AuthenticateUserUseCaseRequest): Promise<AuthenticateUserUseCaseResponse> {
    const user = await this.usersRepository.findByEmail(email);
    if (!user) throw new InvalidCredentialError();

    const passwordMatches = await compare(password, user.pwdHash);
    if (!passwordMatches) throw new InvalidCredentialError();

    return { user };
  }
}
