import { Module } from '@nestjs/common';
import { createObserveModule } from '@nestjs/observe';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RedisModule } from './common/service/Redis/redis.module';
import { TokenModule } from './common/service/Token/token.module';
import { RedisService } from './common/service/Redis/redis.service';
import { AuthController } from './module/auth/auth.controller';
import { AuthService } from './module/auth/auth.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path/win32';
import { ProductModule } from './module/product/product.module';
import { CartModule } from './module/cart/cart.module';

export const { ObserveModule, ObserveInstrument } = createObserveModule();

@Module({
  imports: [
    ProductModule,
    CartModule,
    RedisModule,
    TokenModule,
    ConfigModule.forRoot({
      envFilePath:
        process.env.NODE_ENV === 'production'
          ? 'src/config/.env.prod'
          : 'src/config/.env.dev',
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.getOrThrow<string>('DataBase_URL'),
        dbName: configService.get<string>('DataBase_Name'),
      }),
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      graphiql: true,
    }),
  ],
  controllers: [AppController, AuthController],
  providers: [AppService, RedisService, AuthService],
})
export class AppModule {}
