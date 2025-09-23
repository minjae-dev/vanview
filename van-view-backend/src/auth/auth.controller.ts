import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiCookieAuth } from '@nestjs/swagger';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UsersService,
  ) {}

  @Post('register')
  async register(
    @Body() createUserDto: CreateUserDto,
  ): Promise<{ token: string }> {
    const token = await this.authService.register(createUserDto);
    return { token };
  }

  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: any,
  ): Promise<{ message: string }> {
    const token = await this.authService.login(loginDto);
    res.cookie('jwt', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 1 * 24 * 60 * 60 * 1000, // 1 day ',
      path: '/',
    });

    return { message: 'Login successful' };
  }

  @Post('logout')
  async logout(
    @Res({ passthrough: true }) res: any,
  ): Promise<{ message: string }> {
    res.clearCookie('jwt', { path: '/' });
    return { message: 'Logout successful' };
  }

  @Get('profile')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('access-token')
  @ApiCookieAuth('jwt')
  async getProfile(@Req() req): Promise<{ email: string }> {
    const user = await this.userService.findByEmail(req.user.email);
    if (!user) {
      throw new Error('User not found');
    }
    return { email: user.email };
  }

  @Get('github')
  @UseGuards(AuthGuard('github'))
  async githubAuth(@Req() req) {}

  @Get('github/callback')
  @UseGuards(AuthGuard('github'))
  async githubAuthCallback(
    @Req() req: any,
    @Res() res: any,
  ): Promise<{ message: string }> {
    const user = req.user;
    if (!user) {
      throw new Error('GitHub OAuth failed: No user data received');
    }
    const token = await this.authService.socialLogin(user);
    res.cookie('jwt', token, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 1 * 24 * 60 * 60 * 1000, // 1 day
      path: '/',
      domain: 'localhost',
    });
    return res.redirect('http://localhost:3000/dashboard'); // Redirect to your frontend URL
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req) {}

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthCallback(
    @Req() req: any,
    @Res() res: any,
  ): Promise<{ message: string }> {
    const user = req.user;
    if (!user) {
      throw new Error('Google OAuth failed: No user data received');
    }

    try {
      const token = await this.authService.socialLogin(user);
      res.cookie('jwt', token, {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        maxAge: 1 * 24 * 60 * 60 * 1000, // 1 day
        path: '/',
        domain: 'localhost',
      });
      return res.redirect('http://localhost:3000/dashboard'); // Redirect to your frontend URL
    } catch (error) {
      console.error('OAuth callback error:', error);
    }
  }
}
