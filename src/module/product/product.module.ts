import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { ProductResolver } from './product.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from '../../dataBase/model/product.model';
import { TokenModule } from '../../common/service/Token/token.module';
import { AuthGuard } from '../../common/guard/auth.guard';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
    TokenModule,
  ],
  controllers: [ProductController],
  providers: [ProductService, ProductResolver, AuthGuard],
  exports: [ProductService],
})
export class ProductModule {}
