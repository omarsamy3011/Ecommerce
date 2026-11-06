export class CreateProductDto {
  name: string;
  description?: string;
  price: number;
  stock?: number;
  brand?: string;
}