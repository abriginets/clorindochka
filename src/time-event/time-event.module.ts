import { Module } from '@nestjs/common';

import { TimeEventService } from './time-event.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [TimeEventService],
  exports: [TimeEventService],
})
export class TimeEventModule {}
