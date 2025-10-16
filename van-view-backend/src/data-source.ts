import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import { DataSource } from 'typeorm';

config();

const configService = new ConfigService();

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: configService.get('DB_URL') || undefined,
  port: +configService.get('DB_PORT') || 5432,
  username: configService.get('DB_USERNAME') || 'postgres',
  password: configService.get('DB_PASSWORD') || 'postgres',
  database: configService.get('DB_NAME') || 'postgres',
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/migrations/*{.ts,.js}'],
  synchronize: false,
  logging: true,
  ssl: configService.get('DB_URL')?.includes('supabase.com')
    ? { rejectUnauthorized: false }
    : false,
});
