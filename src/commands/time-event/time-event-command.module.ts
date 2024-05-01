import { DiscordModule } from '@discord-nestjs/core';

import { Module } from '@nestjs/common';

import { TimeEventCategoryListCommand } from './subcommands/time-event-category-list/time-event-category-list.command';
import { TimeEventCreateCommand } from './subcommands/time-event-create/time-event-create.command';
import { TimeEventDeleteCommand } from './subcommands/time-event-delete/time-event-delete.command';
import { TimeEventFindCommand } from './subcommands/time-event-find/time-event-find.command';
import { TimeEventCommand } from './time-event.command';
import { PrismaModule } from '../../prisma/prisma.module';
import { TimeEventModule } from '../../time-event/time-event.module';

@Module({
  imports: [DiscordModule.forFeature(), PrismaModule, TimeEventModule],
  providers: [
    TimeEventCommand,
    TimeEventCreateCommand,
    TimeEventCategoryListCommand,
    TimeEventFindCommand,
    TimeEventDeleteCommand,
  ],
})
export class TimeEventCommandModule {}
