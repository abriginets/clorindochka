import { Command, UseGroup } from '@discord-nestjs/core';

import 'dayjs/locale/ru';

import { UseGuards } from '@nestjs/common';

import { TimeEventChannelGuard } from './guards/time-event-channel.guard';
import { TimeEventCategoryListCommand } from './subcommands/time-event-category-list/time-event-category-list.command';
import { TimeEventCreateCommand } from './subcommands/time-event-create/time-event-create.command';
import { TimeEventDeleteCommand } from './subcommands/time-event-delete/time-event-delete.command';
import { TimeEventFindCommand } from './subcommands/time-event-find/time-event-find.command';

@Command({
  name: 'таймивент',
  description: 'Управление ивентами',
  include: [
    TimeEventCreateCommand,
    TimeEventFindCommand,
    TimeEventDeleteCommand,
    UseGroup(
      {
        name: 'категории',
        description: 'Управление категориями таймивентов',
      },
      TimeEventCategoryListCommand,
    ),
  ],
})
@UseGuards(TimeEventChannelGuard)
export class TimeEventCommand {}
