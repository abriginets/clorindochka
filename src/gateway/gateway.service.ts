import { InjectDiscordClient, Once } from '@discord-nestjs/core';
import { Client } from 'discord.js';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class GatewayService {
  constructor(
    @InjectDiscordClient()
    private readonly client: Client,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  @Once('ready')
  onReady(): void {
    this.logger.info('Clorinde is live! 😎');
  }
}
