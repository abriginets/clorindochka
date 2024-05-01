import { LoggingInterceptor } from '@algoan/nestjs-logging-interceptor';
import { DiscordModule } from '@discord-nestjs/core';
import { GatewayIntentBits } from 'discord.js';
import { WinstonModule } from 'nest-winston';

import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule as NativeConfigModule } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ScheduleModule as NestScheduleModule } from '@nestjs/schedule';

import { TimeEventCommandModule } from './commands/time-event/time-event-command.module';
import { ConfigModule } from './config/config.module';
import { ConfigService } from './config/config.service';
import { GatewayService } from './gateway/gateway.service';
import { PrismaModule } from './prisma/prisma.module';
import { ScheduleModule } from './schedule/schedule.module';
import { TimeEventModule } from './time-event/time-event.module';
import { WinstonConfigService } from './winston-config/winston-config.service';

@Module({
  imports: [
    NestScheduleModule.forRoot(),
    NativeConfigModule.forRoot({
      cache: true,
    }),
    WinstonModule.forRootAsync({
      imports: [ConfigModule],
      useClass: WinstonConfigService,
      inject: [ConfigService],
    }),
    CacheModule.register(),
    DiscordModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        token: configService.DISCORD_TOKEN,
        discordClientOptions: {
          intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent],
        },
        autoLogin: true,
        failOnLogin: true,
      }),
      inject: [ConfigService],
    }),
    TimeEventCommandModule,
    PrismaModule,
    ScheduleModule,
    TimeEventModule,
  ],
  providers: [
    GatewayService,
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ],
})
export class AppModule {}
