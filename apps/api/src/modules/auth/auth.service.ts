import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  Inject,
} from '@nestjs/common';
import { JwtHelper } from './jwt.helper';
import {
  hashPassword,
  isScryptHash,
  legacyVerify,
  verifyPassword,
} from './password.helper';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    @Inject('PRISMA_SERVICE') private readonly prisma: PrismaService,
  ) {}

  async register(email: string, password: string, name: string) {
    const existing = await this.prisma.user.findUnique({
      where: { email },
    });
    if (existing) {
      throw new ConflictException('Email already in use');
    }

    const hashedPassword = hashPassword(password);
    const user = await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
    });

    const token = JwtHelper.sign({
      sub: user.id,
      email: user.email,
      role: user.role,
    });
    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      token,
    };
  }

  async login(email: string, password: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Legacy unsalted SHA-256 accounts: verify then upgrade to scrypt
    if (!isScryptHash(user.password)) {
      if (!legacyVerify(password, user.password)) {
        throw new UnauthorizedException('Invalid credentials');
      }
      await this.prisma.user.update({
        where: { id: user.id },
        data: { password: hashPassword(password) },
      });
    } else if (!verifyPassword(password, user.password)) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = JwtHelper.sign({
      sub: user.id,
      email: user.email,
      role: user.role,
    });
    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      token,
    };
  }
}
