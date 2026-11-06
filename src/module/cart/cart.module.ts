import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TokenModule } from '../../common/service/Token/token.module';
import { AuthGuard } from '../../common/guard/auth.guard';
import { Cart, CartSchema } from '../../dataBase/model/cart.model';
import { CartController } from './cart.controller';
import { CartResolver } from './cart.resolver';
import { CartService } from './cart.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Cart.name, schema: CartSchema }]),
    TokenModule,
  ],
  controllers: [CartController],
  providers: [CartService, CartResolver, AuthGuard],
  exports: [CartService],
})
export class CartModule {}
