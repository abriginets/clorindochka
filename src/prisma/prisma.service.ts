import { Prisma, PrismaClient } from '@prisma/client';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

import { INestApplication, Inject, Injectable, OnModuleInit } from '@nestjs/common';

@Injectable()
export class PrismaService
  extends PrismaClient<Prisma.PrismaClientOptions, 'query' | 'beforeExit'>
  implements OnModuleInit
{
  constructor(@Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger) {
    super({
      log: [
        {
          emit: 'event',
          level: 'query',
        },
      ],
    });
  }

  async onModuleInit(): Promise<void> {
    await this.$connect();

    this.$on('query', (e: Prisma.QueryEvent) => {
      this.logger.debug('Database Query', e);
    });
  }

  async enableShutdownHooks(app: INestApplication): Promise<void> {
    process.on('beforeExit', async () => {
      await app.close();
    });
  }
}
