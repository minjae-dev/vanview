import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
export class CreateUserDto {
  @ApiProperty({
    example: 'user@example.com',
    description: '사용자 이메일',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: 'securePassword123',
    description: '사용자 비밀번호',
  })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({
    example: 'Minjae',
    description: '사용자 이름',
  })
  @IsString()
  firstName: string;

  @ApiProperty({
    example: 'Kim',
    description: '사용자 성',
  })
  @IsString()
  lastName: string;
}
