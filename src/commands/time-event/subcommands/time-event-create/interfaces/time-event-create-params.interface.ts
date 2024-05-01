import dayjs from 'dayjs';

import { TimeEventCreateBasicParams } from './time-event-create-basic-params.interface';

export interface TimeEventCreateParams extends TimeEventCreateBasicParams {
  date: dayjs.Dayjs;
}
