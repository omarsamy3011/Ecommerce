import { NestFactory } from '@nestjs/core';
import { AppModule, ObserveInstrument } from './app.module';
import { ConfigService } from '@nestjs/config';
import { RedisService } from './common/service/Redis/redis.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    instrument: ObserveInstrument,
  });
  await app.get(RedisService).connectRedis();
  const port = app.get(ConfigService).getOrThrow<string>('port');
  await app.listen(port);
}
bootstrap();
