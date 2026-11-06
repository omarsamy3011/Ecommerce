import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtPayload } from 'jsonwebtoken';
import { AuthGuard } from '../../common/guard/auth.guard';
import { AddCartItemDto, UpdateCartItemDto } from './dto/cart.dto';
import { CartService } from './cart.service';

type AuthenticatedRequest = Request & { user: JwtPayload };

@Controller('cart')
@UseGuards(AuthGuard)
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  find(@Req() request: AuthenticatedRequest) {
    return this.cartService.findByUser(String(request.user.id));
  }

  @Post('items')
  addItem(@Req() request: AuthenticatedRequest, @Body() input: AddCartItemDto) {
    return this.cartService.addItem(String(request.user.id), input);
  }

  @Patch('items/:productId')
  updateItem(
    @Req() request: AuthenticatedRequest,
    @Param('productId') productId: string,
    @Body() input: UpdateCartItemDto,
  ) {
    return this.cartService.updateItem(
      String(request.user.id),
      productId,
      input,
    );
  }

  @Delete('items/:productId')
  removeItem(
    @Req() request: AuthenticatedRequest,
    @Param('productId') productId: string,
  ) {
    return this.cartService.removeItem(String(request.user.id), productId);
  }

  @Delete()
  clear(@Req() request: AuthenticatedRequest) {
    return this.cartService.clear(String(request.user.id));
  }
}
