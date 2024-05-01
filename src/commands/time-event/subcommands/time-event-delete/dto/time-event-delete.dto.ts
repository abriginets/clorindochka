import { Param } from '@discord-nestjs/core';

import { TimeEventDeleteParams } from '../interfaces/time-event-delete-params.interface';

export class TimeEventDeleteDTO implements TimeEventDeleteParams {
  @Param({
    description: 'Идентификатор',
    required: true,
  })
  id: string;
}
