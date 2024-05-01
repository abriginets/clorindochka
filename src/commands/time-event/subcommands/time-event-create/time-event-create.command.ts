import { SlashCommandPipe } from '@discord-nestjs/common';
import { Handler, IA, InteractionEvent, SubCommand } from '@discord-nestjs/core';
import dayjs from 'dayjs';
import 'dayjs/locale/ru';
import { Colors, CommandInteraction, EmbedBuilder } from 'discord.js';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';

import { Inject, Logger, UseFilters, UseGuards, ValidationPipe } from '@nestjs/common';

import { TimeEventDTO } from './dto/time-event-params.dto';
import { TimeEventCreateParams } from './interfaces/time-event-create-params.interface';
import { PrismaService } from '../../../../prisma/prisma.service';
import { TimeEventService } from '../../../../time-event/time-event.service';
import { CommandValidationFilter } from '../../../helpers/filters/command-validation.filter';
import { TimeEventChannelGuard } from '../../guards/time-event-channel.guard';
import { parseTimeEventDatetime } from '../../shared/parse-time-event-datetime';

@SubCommand({
  name: 'создать',
  description: 'Создаёт таймер до события',
})
@UseGuards(TimeEventChannelGuard)
export class TimeEventCreateCommand {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER)
    private readonly logger: Logger,
    private readonly prisma: PrismaService,
    private readonly timeEventService: TimeEventService,
  ) {}

  @Handler()
  @UseFilters(CommandValidationFilter)
  async handler(
    @IA(SlashCommandPipe, ValidationPipe) options: TimeEventDTO,
    @InteractionEvent() interaction: CommandInteraction,
  ): Promise<void> {
    return this.createTimeEvent(interaction, {
      ...options,
      date: parseTimeEventDatetime(options.date),
    });
  }

  async createDiscordChannels(
    interaction: CommandInteraction,
    data: TimeEventCreateParams,
    shouldCreateDiscordChannels: boolean,
  ): Promise<[string, string] | undefined> {
    if (shouldCreateDiscordChannels) {
      if (interaction.guild) {
        try {
          const titleChannel = await interaction.guild.channels.create({
            ...this.timeEventService.getTimeEventVoiceChannelOptions(interaction.guild),
            name: data.name,
          });

          try {
            const timerChannel = await interaction.guild.channels.create({
              ...this.timeEventService.getTimeEventVoiceChannelOptions(interaction.guild),
              name: this.timeEventService.getTimerChannelTitle(data.date),
            });

            return [titleChannel.id, timerChannel.id];
          } catch (error) {
            this.logger.error('Unable to create time event channel', error);

            await interaction.reply('У меня не получилось создать канал. М-может, у меня нет прав на это действие?');
          }
        } catch (error) {
          this.logger.error('Unable to create time event channel', error);

          await interaction.reply('У меня не получилось создать канал. М-может, у меня нет прав на это действие?');
        }
      }

      if (interaction.isRepliable()) {
        await interaction.reply(
          'Простите, я почему-то не могу получить доступ к управлению этим сервером (interaction.guild)',
        );
      }
    }
  }

  async createTimeEvent(interaction: CommandInteraction, data: TimeEventCreateParams): Promise<void> {
    const eventCategoryHasActiveTimer = await this.timeEventService.isEventCategoryAlreadyHasActiveTimer(data.category);
    const channelIds = await this.createDiscordChannels(interaction, data, !eventCategoryHasActiveTimer);
    const event = await this.prisma.timeEvent.create({
      data: {
        name: data.name,
        date: data.date.toDate(),
        guildId: interaction.guildId as string,
        category: {
          connectOrCreate: {
            where: {
              name: data.category,
            },
            create: {
              name: data.category,
            },
          },
        },
        ...this.timeEventService.getChannelsToCreateInput(channelIds),
      },
      include: {
        category: true,
        timeEventChannel: true,
      },
    });

    if (interaction.isRepliable() && !eventCategoryHasActiveTimer) {
      await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(Colors.Green)
            .setTitle('Новый таймер создан!')
            .setFields([
              {
                name: 'Идентификатор',
                value: event.id,
              },
              {
                name: 'Категория',
                value: event.category.name,
              },
              {
                name: 'Дата',
                value: dayjs(event.date).locale('ru').format('H:mm, D MMM YYYY'),
              },
              { name: '\u200B', value: '\u200B' },
              {
                name: 'Название',
                value: data.name,
                inline: true,
              },
              {
                name: 'Таймер',
                value: this.timeEventService.getTimerChannelTitle(data.date),
                inline: true,
              },
            ]),
        ],
      });
    } else {
      await interaction.reply(
        `Я зарегистрировала Ваш тайм ивент. Он обязательно появится когда подойдёт его очередь в категории «${data.category}»`,
      );
    }
  }
}
