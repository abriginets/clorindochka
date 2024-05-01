import { WrongArgsException } from '@discord-nestjs/common';
import { Colors, EmbedBuilder } from 'discord.js';

import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';

@Catch(WrongArgsException)
export class CommandValidationFilter implements ExceptionFilter {
  async catch(exceptionList: WrongArgsException, host: ArgumentsHost): Promise<void> {
    const interaction = host.getArgByIndex(0);

    const embeds = exceptionList.getError().map((exception) =>
      new EmbedBuilder().setColor(Colors.Red).addFields(
        Object.values(exception.constraints as Record<string, string>).map((value) => ({
          name: exception.value,
          value,
        })),
      ),
    );

    if (interaction.isRepliable()) await interaction.reply({ embeds });
  }
}
