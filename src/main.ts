import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import { PrismaService } from './prisma/prisma.service';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  const prismaService = app.get(PrismaService);

  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));

  await prismaService.enableShutdownHooks(app);
  await app.listen(3030);
}

bootstrap();
