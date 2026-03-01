import { DbService } from '@app/db';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AuthenticatedUser, TokenPayload } from './auth.interfaces';
import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';

@Injectable()
export class AuthService {
  constructor(
    private dbService: DbService,
    private jwtService: JwtService,
  ) {}

  public async signIn(signInDto: SignInDto): Promise<string> {
    const user = await this.dbService.account.findUnique({
      select: { id: true, username: true, password: true, role: true },
      where: { username: signInDto.username },
    });

    if (!user) {
      throw new UnauthorizedException();
    }

    const isMatch = await bcrypt.compare(signInDto.password, user.password);

    if (!isMatch) {
      throw new UnauthorizedException();
    }

    return this.getToken(user);
  }

  public async signUp(signUpDto: SignUpDto): Promise<string> {
    const salt = await bcrypt.genSalt();

    const hash = await bcrypt.hash(signUpDto.password, salt);

    const user = await this.dbService.account.create({
      select: { id: true, username: true, role: true },
      data: {
        username: signUpDto.username,
        password: hash,
        email: signUpDto.email,
      },
    });

    return this.getToken(user);
  }

  private getToken(user: AuthenticatedUser): Promise<string> {
    return this.jwtService.signAsync<TokenPayload>({
      sub: user.id.toString(),
      username: user.username,
      role: user.role,
    });
  }
}
