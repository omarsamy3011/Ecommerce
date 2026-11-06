import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Cart, CartDocument } from '../../dataBase/model/cart.model';
import { AddCartItemDto, UpdateCartItemDto } from './dto/cart.dto';

@Injectable()
export class CartService {
  constructor(
    @InjectModel(Cart.name)
    private readonly cartModel: Model<CartDocument>,
  ) {}

  findByUser(userId: string): Promise<CartDocument> {
    const user = this.toObjectId(userId);
    return this.cartModel
      .findOneAndUpdate(
        { user },
        { $setOnInsert: { user, items: [] } },
        { new: true, upsert: true },
      )
      .populate('items.product')
      .exec();
  }

  async addItem(userId: string, input: AddCartItemDto): Promise<CartDocument> {
    const user = this.toObjectId(userId);
    const product = this.toObjectId(input.product);
    const cart = await this.findByUser(userId);
    const item = cart.items.find((entry) => entry.product.equals(product));

    if (item) {
      item.quantity += input.quantity;
    } else {
      cart.items.push({ product, quantity: input.quantity });
    }

    await cart.save();
    return this.populateCart(cart._id);
  }

  async updateItem(
    userId: string,
    productId: string,
    input: UpdateCartItemDto,
  ): Promise<CartDocument> {
    const product = this.toObjectId(productId);
    const cart = await this.findByUser(userId);
    const item = cart.items.find((entry) => entry.product.equals(product));

    if (!item) {
      throw new NotFoundException('Cart item was not found');
    }

    item.quantity = input.quantity;
    await cart.save();
    return this.populateCart(cart._id);
  }

  async removeItem(userId: string, productId: string): Promise<CartDocument> {
    const product = this.toObjectId(productId);
    const cart = await this.findByUser(userId);
    const itemIndex = cart.items.findIndex((entry) =>
      entry.product.equals(product),
    );

    if (itemIndex === -1) {
      throw new NotFoundException('Cart item was not found');
    }

    cart.items.splice(itemIndex, 1);
    await cart.save();
    return this.populateCart(cart._id);
  }

  async clear(userId: string): Promise<CartDocument> {
    const cart = await this.findByUser(userId);
    cart.items = [];
    await cart.save();
    return this.populateCart(cart._id);
  }

  private populateCart(id: Types.ObjectId): Promise<CartDocument> {
    return this.cartModel
      .findById(id)
      .populate('items.product')
      .exec() as Promise<CartDocument>;
  }

  private toObjectId(value: string): Types.ObjectId {
    if (!Types.ObjectId.isValid(value)) {
      throw new BadRequestException(`Invalid id: ${value}`);
    }

    return new Types.ObjectId(value);
  }
}
