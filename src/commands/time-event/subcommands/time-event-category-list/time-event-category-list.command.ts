import { Handler, SubCommand } from '@discord-nestjs/core';
import { Colors, EmbedBuilder, InteractionReplyOptions } from 'discord.js';

import { UseFilters, UseGuards } from '@nestjs/common';

import { PrismaService } from '../../../../prisma/prisma.service';
import { CommandValidationFilter } from '../../../helpers/filters/command-validation.filter';
import { TimeEventChannelGuard } from '../../guards/time-event-channel.guard';

@SubCommand({
  name: 'список',
  description: 'Отображает список всех категорий',
})
@UseGuards(TimeEventChannelGuard)
export class TimeEventCategoryListCommand {
  constructor(private readonly prisma: PrismaService) {}

  @Handler()
  @UseFilters(CommandValidationFilter)
  async handler(): Promise<InteractionReplyOptions> {
    const embed = new EmbedBuilder().setColor(Colors.Blue).setTitle('Список категорий');

    const categories = await this.prisma.timeEventCategory.findMany({
      include: {
        TimeEvent: {
          where: {
            deletedAt: null,
          },
          orderBy: {
            date: 'asc',
          },
        },
      },
    });

    if (categories.length === 0) {
      return {
        content: 'Здесь пока нет категорий...',
      };
    }

    categories.forEach((category, index) => {
      embed.addFields([
        {
          name: `Категория #${index + 1}`,
          value: [
            `**Название:** ${category.name}`,
            `**Активных таймеров:** ${category.TimeEvent.length.toString()}`,
            `**Текущий таймер:** ${category.TimeEvent.at(0) ? `«${category.TimeEvent.at(0)?.name}»` : '-'}`,
          ].join('\n'),
        },
      ]);
    });

    return {
      embeds: [embed],
    };
  }
}
