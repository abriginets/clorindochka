import dayjs from 'dayjs';

export function parseTimeEventDatetime(dateStr: string): dayjs.Dayjs {
  return dayjs(dateStr, 'YYYY-MM-DD HH:mm', true);
}
