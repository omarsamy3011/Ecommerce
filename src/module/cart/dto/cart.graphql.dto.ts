import { Field, ID, InputType, Int, ObjectType } from '@nestjs/graphql';

@InputType()
export class AddCartItemGraphqlDto {
  @Field(() => ID)
  product: string;

  @Field(() => Int)
  quantity: number;
}

@ObjectType()
export class CartItemGraphqlDto {
  @Field(() => ID)
  product: string;

  @Field(() => Int)
  quantity: number;
}

@ObjectType()
export class CartGraphqlDto {
  @Field(() => ID)
  id: string;

  @Field(() => ID)
  user: string;

  @Field(() => [CartItemGraphqlDto])
  items: CartItemGraphqlDto[];

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
