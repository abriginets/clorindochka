import dayjs from 'dayjs';

export interface TimeEventCreateBasicParams {
  category: string;
  name: string;
  date: string | dayjs.Dayjs;
}
