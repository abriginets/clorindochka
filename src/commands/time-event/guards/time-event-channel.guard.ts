import { ChatInputCommandInteraction } from 'discord.js';

import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

import { TIME_EVENTS_CHANNEL_ID } from '../constants';

@Injectable()
export class TimeEventChannelGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> {
    const metadata = context.getArgByIndex(0) as ChatInputCommandInteraction;

    return metadata.channelId === TIME_EVENTS_CHANNEL_ID;
  }
}
