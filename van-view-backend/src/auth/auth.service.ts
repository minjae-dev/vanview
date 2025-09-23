import { ConflictException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
import { LoginDto } from './dto/login.dto';
@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
  ) {}
  async register(createUserDto: CreateUserDto): Promise<string> {
    const { email } = createUserDto;
    const existingUser = await this.userService.findByEmail({
      where: { email },
    });
    if (existingUser) {
      throw new ConflictException('Email already exists'); // 409 Conflict 에러 반환
    }

    const hashPassword = await bcrypt.hash(createUserDto.password, 10);
    createUserDto.password = hashPassword;
    const user = await this.userService.createUser(createUserDto);

    return this.jwtService.sign({ id: user.id, email: user.email });
  }

  async login(loginDto: LoginDto) {
    const user = await this.userService.findByEmail(loginDto.email);
    if (!user || !(await bcrypt.compare(loginDto.password, user.password))) {
      throw new Error('User not found');
    }
    return this.jwtService.sign({ id: user.id, email: user.email });
  }

  async socialLogin(userData: {
    email: string;
    name: string;
    provider: string;
  }): Promise<string> {
    let user = await this.userService.findByEmail(userData.email);
    if (!user) {
      user = await this.userService.createUser({
        email: userData.email,
        firstName: userData.name,
        password: '',
        provider: userData.provider,
      });
    }
    return this.jwtService.sign({ id: user.id, email: user.email });
  }
}
