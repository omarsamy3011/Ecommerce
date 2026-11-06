import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../../common/guard/auth.guard';
import { ProductService } from './product.service';
import {
  CreateProductGraphqlDto,
  ProductGraphqlDto,
  UpdateProductGraphqlDto,
} from './dto/product.graphql.dto';

@Resolver(() => ProductGraphqlDto)
@UseGuards(AuthGuard)
export class ProductResolver {
  constructor(private readonly productService: ProductService) {}

  @Query(() => [ProductGraphqlDto])
  getProducts() {
    return this.productService.findAll();
  }

  @Query(() => ProductGraphqlDto)
  getProduct(@Args('id', { type: () => ID }) id: string) {
    return this.productService.findOne(id);
  }

  @Mutation(() => ProductGraphqlDto)
  createProduct(@Args('input') input: CreateProductGraphqlDto) {
    return this.productService.create(input);
  }

  @Mutation(() => ProductGraphqlDto)
  updateProduct(
    @Args('id', { type: () => ID }) id: string,
    @Args('input') input: UpdateProductGraphqlDto,
  ) {
    return this.productService.update(id, input);
  }

  @Mutation(() => ProductGraphqlDto)
  deleteProduct(@Args('id', { type: () => ID }) id: string) {
    return this.productService.remove(id);
  }
}
