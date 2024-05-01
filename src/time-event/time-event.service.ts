import { Prisma, TimeEventChannelType } from '@prisma/client';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { ChannelType, Guild, GuildChannelCreateOptions } from 'discord.js';

import { Injectable } from '@nestjs/common';

import {
  COURT_DUELIST_ROLE_ID,
  TIME_EVENTS_PUBLIC_CATEGORY_ID,
  TIME_EVENT_DURATION_FORMAT,
} from '../commands/time-event/constants';
import 'dayjs/locale/ru';
import { PrismaService } from '../prisma/prisma.service';

dayjs.extend(duration);

@Injectable()
export class TimeEventService {
  constructor(private readonly prisma: PrismaService) {}

  getEventTimeLeftInMinutes(date: dayjs.Dayjs): string {
    return dayjs.duration(dayjs(date).diff(dayjs(), 'minutes'), 'minutes').format(TIME_EVENT_DURATION_FORMAT);
  }

  getTimerChannelTitle(date: dayjs.Dayjs): string {
    return `⏳ ${this.getEventTimeLeftInMinutes(date)}`;
  }

  getTimeEventVoiceChannelOptions(guild: Guild): Partial<GuildChannelCreateOptions> {
    return {
      type: ChannelType.GuildVoice,
      parent: TIME_EVENTS_PUBLIC_CATEGORY_ID,
      permissionOverwrites: [
        {
          id: guild.roles.everyone,
          deny: ['Connect'],
        },
        {
          id: COURT_DUELIST_ROLE_ID,
          allow: ['Connect', 'ManageChannels', 'ViewChannel'],
        },
      ],
    };
  }

  async isEventCategoryAlreadyHasActiveTimer(category: string): Promise<boolean> {
    const count = await this.prisma.timeEvent.count({
      where: {
        deletedAt: null,
        date: {
          gte: new Date(),
        },
        category: {
          name: category,
        },
      },
    });

    return count > 0;
  }

  getChannelsToCreateInput(channelIds?: [string, string]): Pick<Prisma.TimeEventCreateInput, 'timeEventChannel'> {
    if (channelIds) {
      const [titleChannelId, timerChannelId] = channelIds;

      return {
        timeEventChannel: {
          createMany: {
            data: [
              {
                type: TimeEventChannelType.title,
                channelId: titleChannelId,
              },
              {
                type: TimeEventChannelType.timer,
                channelId: timerChannelId,
              },
            ],
          },
        },
      };
    }

    return {};
  }
}
