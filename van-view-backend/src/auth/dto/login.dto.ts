import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class LoginDto {
  @IsEmail()
  @ApiProperty({
    example: 'user@example.com',
    description: '사용자 이메일',
  })
  email: string;

  @ApiProperty({
    example: 'securePassword123',
    description: '사용자 비밀번호',
  })
  @IsString()
  password: string;
}
