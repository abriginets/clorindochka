import { Param, ParamType } from '@discord-nestjs/core';
import { MaxLength, MinLength, Validate } from 'class-validator';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

import { TimeEventCreateBasicParams } from '../interfaces/time-event-create-basic-params.interface';
import { TimeEventDateFormatValidator } from '../validators/time-event-date-format.validator';
import { TimeEventDatePositionValidator } from '../validators/time-event-date-position.validator';

dayjs.extend(customParseFormat);

export class TimeEventDTO implements TimeEventCreateBasicParams {
  @Param({
    description: 'Категория',
    required: true,
    type: ParamType.STRING,
  })
  @MinLength(2, { message: 'Название категории должно состоять как минимум из 2 символов' })
  @MaxLength(100, { message: 'Название категории должно состоять не более чем из 100 символов' })
  category: string;

  @Param({
    description: 'Название',
    required: true,
    type: ParamType.STRING,
  })
  @MinLength(2, { message: 'Название ивента должно состоять как минимум из 2 символов' })
  @MaxLength(100, { message: 'Название ивента должно состоять не более чем из 100 символов' })
  name: string;

  @Param({
    description: 'Дата',
    required: true,
    type: ParamType.STRING,
  })
  @Validate(TimeEventDateFormatValidator, {
    message: 'Неправильный формат даты, должен быть "YYYY-MM-DD HH:mm". Например, 2024-02-28 19:30',
  })
  @Validate(TimeEventDatePositionValidator, {
    message: 'Нельзя создавать ивенты на уже прошедшие даты, бака!',
  })
  date: string;
}
