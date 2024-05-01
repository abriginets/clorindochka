import { DiscordModule } from '@discord-nestjs/core';

import { Module } from '@nestjs/common';

import { ScheduleService } from './schedule.service';
import { PrismaModule } from '../prisma/prisma.module';
import { TimeEventModule } from '../time-event/time-event.module';

@Module({
  imports: [DiscordModule.forFeature(), PrismaModule, TimeEventModule],
  providers: [ScheduleService],
})
export class ScheduleModule {}
