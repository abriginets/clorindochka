import { WinstonModuleOptionsFactory, utilities as nestWinstonModuleUtilities } from 'nest-winston';
import winston, { LoggerOptions } from 'winston';

import { Injectable } from '@nestjs/common';

import { ConfigService } from '../config/config.service';

@Injectable()
export class WinstonConfigService implements WinstonModuleOptionsFactory {
  constructor(private readonly configService: ConfigService) {}

  #getDevelopmentTransport(): winston.transport[] {
    if (this.configService.NODE_ENV !== 'production') {
      return [
        new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
        new winston.transports.File({ filename: 'logs/combined.log' }),
      ];
    }

    return [];
  }

  #getConsoleFormat(): winston.Logform.Format {
    if (this.configService.NODE_ENV !== 'production') {
      return winston.format.combine(
        winston.format.timestamp(),
        winston.format.ms(),
        nestWinstonModuleUtilities.format.nestLike(this.configService.SERVICE_NAME, {
          colors: true,
          prettyPrint: true,
        }),
      );
    }

    return winston.format.json({});
  }

  #shouldColorPrint(): boolean {
    return this.configService.NODE_ENV !== 'production';
  }

  #shouldPrettyPrint(): boolean {
    return this.#shouldColorPrint();
  }

  #getExceptionsLogTransports(): unknown[] {
    if (this.configService.NODE_ENV !== 'production') {
      return [new winston.transports.File({ filename: 'logs/exceptions.log' })];
    }

    return [];
  }

  #getRejectionsLogTransport(): unknown[] {
    if (this.configService.NODE_ENV !== 'production') {
      return [new winston.transports.File({ filename: 'logs/rejections.log' })];
    }

    return [];
  }

  createWinstonModuleOptions(): LoggerOptions {
    return {
      level: 'debug',
      format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
      defaultMeta: { service: this.configService.SERVICE_NAME },
      transports: [
        ...this.#getDevelopmentTransport(),
        new winston.transports.Console({
          format: this.#getConsoleFormat(),
        }),
      ],
      exceptionHandlers: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.ms(),
            nestWinstonModuleUtilities.format.nestLike(this.configService.SERVICE_NAME, {
              colors: this.#shouldColorPrint(),
              prettyPrint: this.#shouldPrettyPrint(),
            }),
          ),
        }),
        ...this.#getExceptionsLogTransports(),
      ],
      rejectionHandlers: [
        new winston.transports.Console({
          format: winston.format.simple(),
        }),
        ...this.#getRejectionsLogTransport(),
      ],
    };
  }
}
