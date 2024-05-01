import { ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';

import { parseTimeEventDatetime } from '../../../shared/parse-time-event-datetime';

@ValidatorConstraint()
export class TimeEventDatePositionValidator implements ValidatorConstraintInterface {
  validate(dateStr: string): boolean {
    return parseTimeEventDatetime(dateStr).isAfter(new Date());
  }
}
