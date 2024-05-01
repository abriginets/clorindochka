import { Param } from '@discord-nestjs/core';

import { TimeEventFindParams } from '../interfaces/time-event-find-params.interface';

export class TimeEventFindDTO implements TimeEventFindParams {
  @Param({
    description: 'Название',
    required: true,
  })
  name: string;
}
