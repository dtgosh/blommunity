import { DbService } from '@app/db';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { JwtPayload } from './auth.interfaces';
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
      where: { username: signInDto.username },
    });

    if (!user) {
      throw new UnauthorizedException();
    }

    const isMatch = await bcrypt.compare(signInDto.password, user.password);

    if (!isMatch) {
      throw new UnauthorizedException();
    }

    return this.jwtService.signAsync<JwtPayload>({
      sub: user.id.toString(),
      username: user.username,
      role: user.role,
    });
  }

  public async signUp(signUpDto: SignUpDto): Promise<string> {
    const salt = await bcrypt.genSalt();

    const hash = await bcrypt.hash(signUpDto.password, salt);

    const user = await this.dbService.account.create({
      data: {
        username: signUpDto.username,
        password: hash,
        email: signUpDto.email,
      },
    });

    return this.jwtService.signAsync<JwtPayload>({
      sub: user.id.toString(),
      username: user.username,
      role: user.role,
    });
  }
}
