import { LoggingInterceptor } from '@algoan/nestjs-logging-interceptor';
import { WinstonModule } from 'nest-winston';

import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule as NativeConfigModule } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';

import { ConfigModule } from './config/config.module';
import { ConfigService } from './config/config.service';
import { WinstonConfigService } from './winston-config/winston-config.service';

@Module({
  imports: [
    NativeConfigModule.forRoot({
      cache: true,
    }),
    WinstonModule.forRootAsync({
      imports: [ConfigModule],
      useClass: WinstonConfigService,
      inject: [ConfigService],
    }),
    CacheModule.register(),
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ],
})
export class AppModule {}
