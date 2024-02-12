import { Module } from '@nestjs/common';
import { ConfigModule as NativeConfigModule } from '@nestjs/config';

import { ConfigService } from './config.service';

@Module({
  imports: [NativeConfigModule],
  providers: [ConfigService],
  exports: [ConfigService],
})
export class ConfigModule {}
