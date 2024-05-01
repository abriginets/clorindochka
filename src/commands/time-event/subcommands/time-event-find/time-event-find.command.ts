import { SlashCommandPipe } from '@discord-nestjs/common';
import { Handler, IA, SubCommand } from '@discord-nestjs/core';
import { Colors, EmbedBuilder, InteractionReplyOptions } from 'discord.js';

import { UseFilters, UseGuards, ValidationPipe } from '@nestjs/common';

import { TimeEventFindDTO } from './dto/time-event-find-params.dto';
import { PrismaService } from '../../../../prisma/prisma.service';
import { CommandValidationFilter } from '../../../helpers/filters/command-validation.filter';
import { TimeEventChannelGuard } from '../../guards/time-event-channel.guard';

@SubCommand({
  name: 'найти',
  description: 'Ищет ивенты по названию',
})
@UseGuards(TimeEventChannelGuard)
export class TimeEventFindCommand {
  constructor(private readonly prisma: PrismaService) {}

  @Handler()
  @UseFilters(CommandValidationFilter)
  async handler(@IA(SlashCommandPipe, ValidationPipe) options: TimeEventFindDTO): Promise<InteractionReplyOptions> {
    const timeEvents = await this.prisma.timeEvent.findMany({
      where: {
        name: {
          contains: options.name,
        },
      },
      include: {
        category: true,
        timeEventChannel: true,
      },
    });

    if (timeEvents.length === 0) {
      return {
        content: `Простите, я не смогла найти ни одного ивента с названием, похожим на «${options.name}»`,
      };
    }

    const embed = new EmbedBuilder().setColor(Colors.Blue).setTitle('Найденные тайм ивенты');

    timeEvents.forEach((timeEvent, index) => {
      embed.addFields([
        {
          name: `Совпадение #${index + 1}`,
          value: [
            `**Название:** ${timeEvent.name}`,
            `**Категория:** ${timeEvent.category.name}`,
            `**Статус:** ${this.getTimeEventStatus(timeEvent.timeEventChannel, timeEvent.deletedAt)}`,
            `**ID:** ${timeEvent.id}`,
          ].join('\n'),
        },
      ]);
    });

    return {
      embeds: [embed],
    };
  }

  getTimeEventStatus(channels: unknown[], deletedAt: Date | null): string {
    if (deletedAt) {
      return 'Закончился';
    }

    if (channels.length === 0) {
      return 'Запланирован';
    }

    return 'Активен';
  }
}
