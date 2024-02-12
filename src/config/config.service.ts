import { Injectable } from '@nestjs/common';
import { ConfigService as NativeConfigService } from '@nestjs/config';

@Injectable()
export class ConfigService {
  constructor(private readonly nativeConfigService: NativeConfigService) {}

  get NODE_ENV(): 'production' | 'development' | 'test' | undefined {
    return this.nativeConfigService.get('NODE_ENV');
  }

  get SERVICE_NAME(): string {
    return this.nativeConfigService.getOrThrow('SERVICE_NAME');
  }
}
