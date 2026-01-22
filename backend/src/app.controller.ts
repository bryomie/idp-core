import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  getHello(): string {
    return 'IDP Backend API v1.0 (Stealth Mode)';
  }

  @Get('health')
  getHealth(): { status: string } {
    return { status: 'ok' };
  }
}