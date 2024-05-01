import { InjectDiscordClient } from '@discord-nestjs/core';
import { TimeEventChannelType } from '@prisma/client';
import dayjs from 'dayjs';
import { ChannelType, Client, Colors, EmbedBuilder } from 'discord.js';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

import { Inject, Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

import { TIME_EVENTS_CHANNEL_ID } from '../commands/time-event/constants';
import { PrismaService } from '../prisma/prisma.service';
import { TimeEventService } from '../time-event/time-event.service';

@Injectable()
export class ScheduleService {
  constructor(
    @InjectDiscordClient()
    private readonly client: Client,
    @Inject(WINSTON_MODULE_PROVIDER)
    private readonly logger: Logger,
    private readonly prisma: PrismaService,
    private readonly timeEventService: TimeEventService,
  ) {}

  @Cron(CronExpression.EVERY_10_MINUTES)
  async updateTimeEvent(): Promise<void> {
    const categoriesWithEventsRequiringUpdates = await this.prisma.timeEventCategory.findMany({
      where: {
        TimeEvent: {
          some: {
            deletedAt: null,
          },
        },
      },
      include: {
        TimeEvent: {
          where: {
            deletedAt: null,
          },
          orderBy: {
            date: 'asc',
          },
          take: 1,
          include: {
            timeEventChannel: true,
          },
        },
      },
    });

    await Promise.all(
      categoriesWithEventsRequiringUpdates.map(async (category) => {
        const timeEvent = category.TimeEvent.at(0);

        if (timeEvent) {
          const guild = await this.client.guilds.fetch(timeEvent.guildId);
          const timeEventEnded = dayjs(timeEvent.date).isBefore(new Date());

          if (timeEventEnded || timeEvent.timeEventChannel.length === 0) {
            const logChannel = await guild.channels.fetch(TIME_EVENTS_CHANNEL_ID);

            if (timeEventEnded) {
              await this.prisma.timeEvent.update({
                where: {
                  id: timeEvent.id,
                },
                data: {
                  deletedAt: new Date(),
                },
              });

              await Promise.all(
                timeEvent.timeEventChannel.map(async (timeEventChannel) => {
                  const channel = await guild.channels.fetch(timeEventChannel.channelId);

                  if (channel) {
                    await channel.delete('Время таймера исчерпано');
                  }
                }),
              );

              if (logChannel && logChannel.type === ChannelType.GuildText) {
                logChannel.send({
                  embeds: [
                    new EmbedBuilder()
                      .setColor(Colors.Red)
                      .setTitle('Тайм ивент удалён')
                      .setFields([
                        {
                          name: 'Название',
                          value: timeEvent.name,
                          inline: true,
                        },
                        {
                          name: 'Категория',
                          value: category.name,
                          inline: true,
                        },
                        {
                          name: 'Причина',
                          value: 'Время истекло',
                          inline: true,
                        },
                      ]),
                  ],
                });
              }
            }

            const substituteEvent = await this.prisma.timeEvent.findFirst({
              where: {
                deletedAt: null,
                timeEventChannel: {
                  none: {},
                },
              },
              orderBy: {
                date: 'asc',
              },
            });

            if (substituteEvent) {
              try {
                const titleChannel = await guild.channels.create({
                  ...this.timeEventService.getTimeEventVoiceChannelOptions(guild),
                  name: substituteEvent.name,
                });

                const timerChannel = await guild.channels.create({
                  ...this.timeEventService.getTimeEventVoiceChannelOptions(guild),
                  name: this.timeEventService.getTimerChannelTitle(dayjs(substituteEvent.date)),
                });

                const newEvent = await this.prisma.timeEvent.update({
                  where: {
                    id: substituteEvent.id,
                  },
                  data: {
                    timeEventChannel: {
                      createMany: {
                        data: [
                          {
                            type: TimeEventChannelType.title,
                            channelId: titleChannel.id,
                          },
                          {
                            type: TimeEventChannelType.timer,
                            channelId: timerChannel.id,
                          },
                        ],
                      },
                    },
                  },
                  include: {
                    category: true,
                    timeEventChannel: true,
                  },
                });

                if (logChannel && logChannel.type === ChannelType.GuildText) {
                  await logChannel.send({
                    embeds: [
                      new EmbedBuilder()
                        .setColor(Colors.Green)
                        .setTitle('Новый таймер создан!')
                        .setFields([
                          {
                            name: 'Идентификатор',
                            value: newEvent.id,
                          },
                          {
                            name: 'Категория',
                            value: newEvent.category.name,
                          },
                          {
                            name: 'Дата',
                            value: dayjs(newEvent.date).locale('ru').format('H:mm, D MMM YYYY'),
                          },
                          { name: '\u200B', value: '\u200B' },
                          {
                            name: 'Название',
                            value: newEvent.name,
                            inline: true,
                          },
                          {
                            name: 'Таймер',
                            value: this.timeEventService.getTimerChannelTitle(dayjs(newEvent.date)),
                            inline: true,
                          },
                        ]),
                    ],
                  });
                }
              } catch (error) {
                this.logger.error('Unable to create substitute time event channel', error);
              }
            }
          } else {
            const timerChannel = timeEvent.timeEventChannel.find(({ type }) => type === TimeEventChannelType.timer);

            if (timerChannel) {
              try {
                const channel = await guild.channels.fetch(timerChannel.channelId);

                if (channel) {
                  await channel.setName(this.timeEventService.getTimerChannelTitle(dayjs(timeEvent.date)));
                }
              } catch (error) {
                if (error.status === 404) {
                  this.logger.warn('Channel no longer exists in Discord, thus will be deleted locally', {
                    category: category.name,
                    event: timeEvent.name,
                  });

                  await this.prisma.timeEventChannel.deleteMany({
                    where: {
                      timeEventId: timeEvent.id,
                    },
                  });

                  await this.prisma.timeEvent.update({
                    where: {
                      id: timeEvent.id,
                    },
                    data: {
                      deletedAt: new Date(),
                    },
                  });
                } else {
                  this.logger.error(error);
                }
              }
            }
          }
        }
      }),
    );
  }
}
