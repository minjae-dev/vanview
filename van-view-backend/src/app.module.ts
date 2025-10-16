import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { BusinessesModule } from './businesses/businesses.module';
import { DropListItemsModule } from './drop-list-items/drop-list-items.module';
import { HealthModule } from './health/health.module';
import { ReviewsModule } from './reviews/reviews.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => {
        console.log('🔗 Configuring database connection...');
        console.log(`DB_HOST: ${config.get<string>('DB_HOST')}`);
        console.log(`DB_PORT: ${config.get<number>('DB_PORT')}`);
        console.log(`DB_NAME: ${config.get<string>('DB_NAME')}`);
        console.log(`DB_URL exists: ${!!config.get<string>('DB_URL')}`);

        return {
          type: 'postgres',
          url: config.get<string>('DB_URL') || undefined,
          host: config.get<string>('DB_HOST') || 'localhost',
          port: +config.get<number>('DB_PORT') || 5432,
          username: config.get<string>('DB_USERNAME') || 'postgres',
          password: config.get<string>('DB_PASSWORD') || 'postgres',
          database: config.get<string>('DB_NAME') || 'postgres',
          autoLoadEntities: true,
          entities: [__dirname + '/**/*.entity{.ts,.js}'],
          synchronize: false,
          logging: process.env.NODE_ENV !== 'production',
          ssl:
            process.env.NODE_ENV === 'production'
              ? { rejectUnauthorized: false }
              : false,
          // 연결 타임아웃 설정 추가
          connectTimeoutMS: 60000, // 60초
          extra: {
            connectionTimeoutMillis: 60000,
            idleTimeoutMillis: 30000,
            max: 10, // 최대 연결 수
          },
        };
      },
      inject: [ConfigService],
    }),
    UsersModule,
    AuthModule,
    BusinessesModule,
    DropListItemsModule,
    ReviewsModule,
    HealthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
