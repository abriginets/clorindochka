import { ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

import { parseTimeEventDatetime } from '../../../shared/parse-time-event-datetime';

dayjs.extend(customParseFormat);

@ValidatorConstraint()
export class TimeEventDateFormatValidator implements ValidatorConstraintInterface {
  validate(dateStr: string): boolean {
    return parseTimeEventDatetime(dateStr).isValid();
  }
}
