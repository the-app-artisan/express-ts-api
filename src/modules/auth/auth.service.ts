import bcrypt from 'bcrypt';
import { Prisma, prisma } from '../../lib/prisma';
import {
  BadRequestError,
  UnauthorizedError,
} from '../../shared/errors/custom-errors';
import type { LoginInput, RegisterInput } from './auth.schemas';
import { generateToken } from '../../shared/utils/jwt';

class AuthService {
  async findUserByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
    });
  }

  async getUser(
    id: number,
    select: Prisma.UserSelect = { id: true, name: true, email: true },
  ) {
    return prisma.user.findUnique({
      where: { id },
      select,
    });
  }

  async register(data: RegisterInput) {
    const { name, email, password } = data;

    const existing = await this.findUserByEmail(email);
    if (existing) {
      throw new BadRequestError('A user with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword },
      select: { id: true, name: true, email: true },
    });

    const token = generateToken(user.id);

    return { user, token };
  }

  async login(data: LoginInput) {
    const { email, password } = data;

    const user = await this.findUserByEmail(email);
    if (!user) {
      throw new UnauthorizedError('Invalid email or password');
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      throw new UnauthorizedError('Invalid email or password');
    }

    const token = generateToken(user.id);

    return {
      user: { id: user.id, name: user.name, email: user.email },
      token,
    };
  }

  async logout(id: number) {
    return prisma.user.update({
      where: { id },
      data: { lastLogoutAt: new Date() },
    });
  }

  async deleteUser(id: number) {
    return prisma.user.delete({
      where: { id },
    });
  }
}

export default new AuthService();
