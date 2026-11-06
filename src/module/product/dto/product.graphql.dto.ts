import { Field, ID, InputType, Int, ObjectType, PartialType } from '@nestjs/graphql';

@InputType()
export class CreateProductGraphqlDto {
  @Field()
  name: string;

  @Field({ nullable: true })
  description?: string;

  @Field()
  price: number;

  @Field(() => Int, { nullable: true, defaultValue: 0 })
  stock?: number;

  @Field(() => ID, { nullable: true })
  brand?: string;
}

@InputType()
export class UpdateProductGraphqlDto extends PartialType(CreateProductGraphqlDto) {}

@ObjectType()
export class ProductGraphqlDto {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field({ nullable: true })
  description?: string;

  @Field()
  price: number;

  @Field(() => Int)
  stock: number;

  @Field(() => ID, { nullable: true })
  brand?: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}