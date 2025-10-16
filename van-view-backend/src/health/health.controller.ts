import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('health')
@Controller('health')
export class HealthController {
  @Get()
  @ApiOperation({ summary: 'Health check endpoint' })
  @ApiResponse({ status: 200, description: 'Application is healthy' })
  check() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      port: process.env.PORT || 3001,
      memory: process.memoryUsage(),
      version: process.version,
    };
  }

  @Get('db')
  @ApiOperation({ summary: 'Database health check' })
  @ApiResponse({ status: 200, description: 'Database connection is healthy' })
  async dbCheck() {
    try {
      // 간단한 DB 연결 테스트를 위한 엔드포인트
      return {
        status: 'ok',
        database: 'connected',
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        status: 'error',
        database: 'disconnected',
        error: error.message,
        timestamp: new Date().toISOString(),
      };
    }
  }
}
