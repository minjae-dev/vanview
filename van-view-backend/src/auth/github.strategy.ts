import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-github2';
import { VerifiedCallback } from 'passport-jwt';

@Injectable()
export class GitHubStrategy extends PassportStrategy(Strategy, 'github') {
  constructor(private readonly configService: ConfigService) {
    super({
      clientID: configService.get<string>('GITHUB_CLIENT_ID'),
      clientSecret: configService.get<string>('GITHUB_CLIENT_SECRET'),
      callbackURL: configService.get<string>('GITHUB_CALLBACK_URL'),
      scope: ['user:email'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifiedCallback,
  ) {
    const { emails, username } = profile;
    const user = {
      email: emails?.[0]?.value || `${username}@github.com`,
      firstName: emails?.[0]?.value?.split(' ')[0],
      lastName: emails?.[0]?.value?.split(' ')[1] || '',
      provider: 'github',
    };
    return done(null, user);
  }
}
