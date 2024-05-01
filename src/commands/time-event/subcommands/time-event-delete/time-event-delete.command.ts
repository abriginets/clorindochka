import { SlashCommandPipe } from '@discord-nestjs/common';
import { Handler, IA, InteractionEvent, SubCommand } from '@discord-nestjs/core';
import { Colors, CommandInteraction, EmbedBuilder, InteractionReplyOptions } from 'discord.js';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

import { Inject, UseFilters, UseGuards, ValidationPipe } from '@nestjs/common';

import { TimeEventDeleteDTO } from './dto/time-event-delete.dto';
import { PrismaService } from '../../../../prisma/prisma.service';
import { CommandValidationFilter } from '../../../helpers/filters/command-validation.filter';
import { TimeEventChannelGuard } from '../../guards/time-event-channel.guard';

@SubCommand({
  name: 'удалить',
  description: 'Удаляет тайм ивент по ID ивента или ID одного из каналов',
})
@UseGuards(TimeEventChannelGuard)
export class TimeEventDeleteCommand {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER)
    private readonly logger: Logger,
    private readonly prisma: PrismaService,
  ) {}

  @Handler()
  @UseFilters(CommandValidationFilter)
  async handler(
    @IA(SlashCommandPipe, ValidationPipe) options: TimeEventDeleteDTO,
    @InteractionEvent() interaction: CommandInteraction,
  ): Promise<InteractionReplyOptions> {
    const timeEvent = await this.prisma.timeEvent.findFirst({
      where: {
        OR: [
          {
            id: options.id,
          },
          {
            timeEventChannel: {
              some: {
                channelId: options.id,
              },
            },
          },
        ],
      },
      include: {
        category: true,
        timeEventChannel: true,
      },
    });

    if (!timeEvent) {
      return {
        content: 'В моём журнале учёта нет подобных тайм ивентов...',
      };
    }

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
        try {
          if (interaction.guild) {
            const channel = await interaction.guild.channels.fetch(timeEventChannel.channelId);

            if (channel) {
              await channel.delete('Удалён вручную');
            }
          }
        } catch (error) {
          this.logger.error(error);
        }
      }),
    );

    return {
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
              value: timeEvent.category.name,
              inline: true,
            },
            {
              name: 'Причина',
              value: 'Удалён вручную',
              inline: true,
            },
          ]),
      ],
    };
  }
}
