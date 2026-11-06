import { Args, Context, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { JwtPayload } from 'jsonwebtoken';
import { AuthGuard } from '../../common/guard/auth.guard';
import { UseGuards } from '@nestjs/common';
import { CartService } from './cart.service';
import { AddCartItemGraphqlDto, CartGraphqlDto } from './dto/cart.graphql.dto';
import { AddCartItemDto } from './dto/cart.dto';

type GraphqlContext = { req: { user: JwtPayload } };

@Resolver(() => CartGraphqlDto)
@UseGuards(AuthGuard)
export class CartResolver {
  constructor(private readonly cartService: CartService) {}

  @Query(() => CartGraphqlDto)
  cart(@Context() context: GraphqlContext) {
    return this.cartService.findByUser(String(context.req.user.id));
  }

  @Mutation(() => CartGraphqlDto)
  addToCart(
    @Context() context: GraphqlContext,
    @Args('input') input: AddCartItemGraphqlDto,
  ) {
    return this.cartService.addItem(
      String(context.req.user.id),
      input as AddCartItemDto,
    );
  }

  @Mutation(() => CartGraphqlDto)
  removeFromCart(
    @Context() context: GraphqlContext,
    @Args('productId', { type: () => ID }) productId: string,
  ) {
    return this.cartService.removeItem(String(context.req.user.id), productId);
  }

  @Mutation(() => CartGraphqlDto)
  clearCart(@Context() context: GraphqlContext) {
    return this.cartService.clear(String(context.req.user.id));
  }
}
